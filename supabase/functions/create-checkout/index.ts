import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { productId, planId, type = "one_time" } = await req.json();
    logStep("Request parsed", { productId, planId, type });

    // Get user if authenticated (optional for one-time payments)
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      user = userData.user;
      logStep("User authenticated", { userId: user?.id, email: user?.email });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const origin = req.headers.get("origin") || "http://localhost:3000";

    let sessionData: any = {
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled`,
    };

    // Handle customer creation
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        sessionData.customer = customers.data[0].id;
      } else {
        sessionData.customer_email = user.email;
      }
    } else {
      sessionData.customer_email = "guest@example.com";
    }

    if (type === "subscription" && planId) {
      // Subscription checkout
      const { data: plan } = await supabaseClient
        .from('payment_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!plan) throw new Error("Payment plan not found");

      sessionData = {
        ...sessionData,
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: plan.currency,
              product_data: { 
                name: plan.name,
                description: plan.description 
              },
              unit_amount: Math.round(plan.amount * 100),
              recurring: { interval: plan.interval },
            },
            quantity: 1,
          },
        ],
      };
    } else if (productId) {
      // One-time product purchase
      const { data: product } = await supabaseClient
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) throw new Error("Product not found");

      sessionData = {
        ...sessionData,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: product.name,
                description: product.description 
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: 1,
          },
        ],
      };

      // Create order record
      const { data: order } = await supabaseClient
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: product.price,
          status: 'pending',
          payment_method: 'stripe'
        })
        .select()
        .single();

      sessionData.metadata = {
        order_id: order.id,
        product_id: productId,
        type: 'one_time'
      };
    } else {
      throw new Error("Either productId or planId must be provided");
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    logStep("Checkout session created", { sessionId: session.id });

    // Update order with session ID if it's a one-time payment
    if (type !== "subscription" && sessionData.metadata?.order_id) {
      await supabaseClient
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', sessionData.metadata.order_id);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});