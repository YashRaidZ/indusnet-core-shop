import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Webhook, Key, MessageSquare, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const IntegrationSettings = () => {
  const { toast } = useToast();
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const testDiscordWebhook = async () => {
    if (!discordWebhook) {
      toast({
        title: "Error",
        description: "Please enter a Discord webhook URL",
        variant: "destructive",
      });
      return;
    }

    setTestingWebhook(true);
    try {
      const response = await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "🎮 Integration Test",
            description: "Your Discord webhook is working correctly!",
            color: 5814783,
            timestamp: new Date().toISOString(),
          }]
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Discord webhook test successful!",
        });
      } else {
        throw new Error('Webhook test failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test message to Discord",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="discord" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discord">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discord
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="mr-2 h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discord" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discord Integration</CardTitle>
              <CardDescription>
                Connect your Discord server to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Discord Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send server events to Discord
                  </p>
                </div>
                <Switch
                  checked={discordEnabled}
                  onCheckedChange={setDiscordEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-webhook">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="discord-webhook"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    disabled={!discordEnabled}
                  />
                  <Button
                    onClick={testDiscordWebhook}
                    disabled={!discordEnabled || testingWebhook}
                  >
                    Test
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create a webhook in your Discord server settings
                </p>
              </div>

              <div className="space-y-2">
                <Label>Notification Events</Label>
                <div className="space-y-2">
                  {['New Orders', 'Player Reports', 'Server Status', 'New Tickets'].map((event) => (
                    <div key={event} className="flex items-center justify-between">
                      <span className="text-sm">{event}</span>
                      <Switch disabled={!discordEnabled} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Webhooks</CardTitle>
              <CardDescription>
                Send events to external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-webhook">Order Webhook</Label>
                <Input
                  id="order-webhook"
                  type="url"
                  placeholder="https://your-service.com/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  Called when orders are completed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-webhook">Payment Webhook</Label>
                <Input
                  id="payment-webhook"
                  type="url"
                  placeholder="https://your-service.com/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  Called when payments are processed
                </p>
              </div>

              <Button>Save Webhooks</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>
                Generate keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-muted-foreground">Created 2 days ago</p>
                  </div>
                  <Button variant="destructive" size="sm">Revoke</Button>
                </div>
                <code className="text-xs bg-muted p-2 rounded block">
                  sk_live_••••••••••••••••••••1234
                </code>
              </div>

              <Button>
                <Key className="mr-2 h-4 w-4" />
                Generate New Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
