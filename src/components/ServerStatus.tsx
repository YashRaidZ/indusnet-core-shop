import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Server, Users, Zap, Clock } from 'lucide-react';

interface ServerStatusData {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  version: string;
  latency: number;
  motd?: string;
}

export const ServerStatus = () => {
  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchServerStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('server-status');
      
      if (error) {
        console.error('Error fetching server status:', error);
        toast.error('Failed to fetch server status');
        return;
      }
      
      setStatus(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Server Status</h2>
            <p className="text-muted-foreground">Real-time server information</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Server Status</h2>
          <p className="text-muted-foreground">Real-time server information</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Server Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={status?.online ? "default" : "destructive"}>
                    {status?.online ? "Online" : "Offline"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {status?.online ? "Server is running" : "Server is down"}
                </p>
              </CardContent>
            </Card>

            {/* Players Online */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Players Online</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.players ? `${status.players.online}/${status.players.max}` : "0/0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active players
                </p>
              </CardContent>
            </Card>

            {/* Server Version */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Version</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.version || "Unknown"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Server version
                </p>
              </CardContent>
            </Card>

            {/* Latency */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latency</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.latency ? `${status.latency}ms` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Response time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* MOTD */}
          {status?.motd && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Message of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{status.motd}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};