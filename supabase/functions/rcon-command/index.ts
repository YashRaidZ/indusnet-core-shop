import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RconCommand {
  command: string;
  server?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Check authentication and admin role
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      throw new Error("Admin access required");
    }

    const { command, server = 'main' }: RconCommand = await req.json();

    if (!command) {
      throw new Error("Command is required");
    }

    // Get RCON server configuration from database
    const { data: serverConfig, error: serverError } = await supabaseClient
      .from('rcon_servers')
      .select('*')
      .eq('name', server)
      .eq('is_active', true)
      .single();

    if (serverError || !serverConfig) {
      throw new Error(`RCON server '${server}' not found or inactive`);
    }

    // Connect to Minecraft server via RCON
    const result = await executeRconCommand(serverConfig.host, serverConfig.port, serverConfig.password, command);

    // Log the command execution to audit log
    await supabaseClient
      .from('rcon_audit_log')
      .insert({
        user_id: user.id,
        server_name: server,
        command,
        result,
        success: true
      });

    // Log the command execution
    console.log(`Admin ${user.email} executed RCON command: ${command}`);

    return new Response(JSON.stringify({ 
      success: true, 
      result,
      command,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("RCON command error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

// RCON Protocol Implementation
async function executeRconCommand(host: string, port: number, password: string, command: string): Promise<string> {
  let socket: Deno.Conn | null = null;
  
  try {
    // Connect to RCON server
    socket = await Deno.connect({ hostname: host, port });
    
    // Authenticate
    await sendRconPacket(socket, 1, 3, password); // SERVERDATA_AUTH
    const authResponse = await receiveRconPacket(socket);
    
    if (authResponse.id === -1) {
      throw new Error("RCON authentication failed");
    }

    // Send command
    await sendRconPacket(socket, 2, 2, command); // SERVERDATA_EXECCOMMAND
    const commandResponse = await receiveRconPacket(socket);
    
    return commandResponse.body;
    
  } finally {
    if (socket) {
      socket.close();
    }
  }
}

async function sendRconPacket(socket: Deno.Conn, id: number, type: number, body: string) {
  const bodyBytes = new TextEncoder().encode(body + '\0\0');
  const packet = new ArrayBuffer(4 + 4 + 4 + bodyBytes.length);
  const view = new DataView(packet);
  
  view.setInt32(0, 4 + 4 + bodyBytes.length, true); // Length
  view.setInt32(4, id, true); // Request ID
  view.setInt32(8, type, true); // Type
  
  const packetBytes = new Uint8Array(packet);
  packetBytes.set(bodyBytes, 12);
  
  await socket.write(packetBytes);
}

async function receiveRconPacket(socket: Deno.Conn) {
  // Read length
  const lengthBuffer = new Uint8Array(4);
  await socket.read(lengthBuffer);
  const length = new DataView(lengthBuffer.buffer).getInt32(0, true);
  
  // Read the rest of the packet
  const packetBuffer = new Uint8Array(length);
  await socket.read(packetBuffer);
  
  const view = new DataView(packetBuffer.buffer);
  const id = view.getInt32(0, true);
  const type = view.getInt32(4, true);
  const body = new TextDecoder().decode(packetBuffer.slice(8, -2));
  
  return { id, type, body };
}

serve(handler);