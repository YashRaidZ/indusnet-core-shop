import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT] ${step}${detailsStr}`);
};

// Execute RCON commands for fulfillment
const executeRconCommands = async (commands: string[], username?: string) => {
  if (!commands || commands.length === 0) return;
  
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  for (const command of commands) {
    try {
      const finalCommand = username ? command.replace('{username}', username) : command;
      await supabaseClient.functions.invoke('rcon-command', {
        body: { command: finalCommand }
      });
      logStep("RCON command executed", { command: finalCommand });
    } catch (error) {
      logStep("RCON command failed", { command, error: (error as Error).message });
    }
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve session details
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { sessionId, status: session.payment_status });

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Handle subscription
    if (session.mode === 'subscription') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const customer = await stripe.customers.retrieve(session.customer as string);
      
      // Update subscriber record
      await supabaseClient.from('subscribers').upsert({
        email: (customer as any).email,
        stripe_customer_id: session.customer,
        subscribed: true,
        subscription_tier: 'Premium', // You can determine this from the plan
        subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      logStep("Subscription processed");
    } else {
      // Handle one-time payment
      const orderId = session.metadata?.order_id;
      if (orderId) {
        // Update order status
        await supabaseClient
          .from('orders')
          .update({ 
            status: 'completed',
            fulfillment_status: 'processing',
            stripe_payment_intent_id: session.payment_intent 
          })
          .eq('id', orderId);

        // Get product details for fulfillment
        const { data: order } = await supabaseClient
          .from('orders')
          .select(`
            *,
            products:products(*)
          `)
          .eq('id', orderId)
          .single();

        if (order?.products) {
          // Get user's Minecraft username for RCON commands
          let minecraftUsername = null;
          if (order.user_id) {
            const { data: profile } = await supabaseClient
              .from('profiles')
              .select('minecraft_username')
              .eq('user_id', order.user_id)
              .single();
            minecraftUsername = profile?.minecraft_username;
          }

          // Execute RCON commands based on product category
          const product = order.products as any;
          if (minecraftUsername) {
            let commands: string[] = [];
            
            // Handle different product categories with specific RCON commands
            switch (product.category?.toLowerCase()) {
              case 'ranks':
                // Use tier if available, otherwise use product name
                const groupName = product.tier || product.name.toLowerCase().replace(/\s+/g, '');
                commands = [`lp user {username} parent set ${groupName}`];
                break;
                
              case 'coins':
              case 'currency':
                // Extract amount from product name or use price as fallback
                const coinAmount = product.name.match(/(\d+)/) ? product.name.match(/(\d+)/)[1] : Math.floor(product.price || 0);
                commands = [`eco give {username} ${coinAmount}`];
                break;
                
              case 'kits':
                commands = [`kit ${product.name.toLowerCase().replace(/\s+/g, '')} {username}`];
                break;
                
              case 'cosmetics':
                commands = [`give {username} ${product.name.toLowerCase().replace(/\s+/g, '_')}`];
                break;
                
              case 'perks':
                commands = [`perm add {username} ${product.name.toLowerCase().replace(/\s+/g, '.')}`];
                break;
                
              default:
                // Check if product has custom RCON commands
                if (product.features && product.features.includes('auto_fulfillment')) {
                  commands = [`give {username} ${product.name.toLowerCase().replace(/\s+/g, '_')}`];
                }
            }

            if (commands.length > 0) {
              await executeRconCommands(commands, minecraftUsername);
              
              // Mark as fulfilled
              await supabaseClient
                .from('orders')
                .update({ 
                  fulfillment_status: 'completed',
                  rcon_commands_executed: true 
                })
                .eq('id', orderId);
                
              logStep("Product delivered", { 
                category: product.category, 
                username: minecraftUsername,
                commands 
              });
            } else {
              logStep("No delivery commands for product category", { category: product.category });
            }
          } else {
            logStep("Cannot deliver - no Minecraft username found", { userId: order.user_id });
          }
        }

        logStep("One-time payment processed", { orderId });
      }
    }

    // Log transaction
    await supabaseClient.from('payment_transactions').insert({
      user_id: session.client_reference_id || null,
      stripe_session_id: sessionId,
      stripe_payment_intent_id: session.payment_intent,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      status: 'completed',
      customer_email: session.customer_details?.email || 'guest@example.com',
      metadata: session.metadata,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment processed successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});