import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Gift, Mail, Share2, TrendingUp, Copy, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const MarketingTools = () => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState('');

  const generatePromoCode = () => {
    const code = 'PROMO' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setPromoCode(code);
  };

  const copyShareLink = (platform: string) => {
    const url = window.location.origin;
    const text = 'Check out this amazing Minecraft server!';
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    toast({
      title: "Share link opened",
      description: `Opening ${platform} share dialog`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="promos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="promos">
            <Gift className="mr-2 h-4 w-4" />
            Promos
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Mail className="mr-2 h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <TrendingUp className="mr-2 h-4 w-4" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="mr-2 h-4 w-4" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Codes</CardTitle>
              <CardDescription>
                Create discount codes for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo-code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="SUMMER2024"
                    />
                    <Button onClick={generatePromoCode} variant="outline">
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Select value={discount} onValueChange={setDiscount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10% off</SelectItem>
                      <SelectItem value="20">20% off</SelectItem>
                      <SelectItem value="30">30% off</SelectItem>
                      <SelectItem value="50">50% off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-uses">Maximum Uses</Label>
                <Input id="max-uses" type="number" placeholder="100" />
              </div>

              <Button>
                <Tag className="mr-2 h-4 w-4" />
                Create Promo Code
              </Button>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Active Promo Codes</h4>
                <div className="space-y-2">
                  {['WELCOME10', 'SUMMER20', 'VIP30'].map((code) => (
                    <div key={code} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{code}</p>
                        <p className="text-sm text-muted-foreground">Used 45 times</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                Send newsletters to subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input id="subject" placeholder="New Update Available!" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your email content..."
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Send to All Subscribers
                </Button>
                <Button variant="outline">Preview</Button>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Subscriber Stats</p>
                <p className="text-2xl font-bold mt-1">1,234</p>
                <p className="text-sm text-muted-foreground">Total subscribers</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>
                Track and reward player referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referrer-reward">Referrer Reward</Label>
                <Input id="referrer-reward" type="number" placeholder="100 coins" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referee-reward">New Player Reward</Label>
                <Input id="referee-reward" type="number" placeholder="50 coins" />
              </div>

              <Button>Update Rewards</Button>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Top Referrers</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Steve123', referrals: 24 },
                    { name: 'AlexMiner', referrals: 18 },
                    { name: 'CraftMaster', referrals: 15 },
                  ].map((user, idx) => (
                    <div key={user.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">#{idx + 1}</span>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.referrals} referrals
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Tools</CardTitle>
              <CardDescription>
                Share your server on social platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quick Share Buttons</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => copyShareLink('twitter')} variant="outline">
                    Share on Twitter
                  </Button>
                  <Button onClick={() => copyShareLink('facebook')} variant="outline">
                    Share on Facebook
                  </Button>
                  <Button onClick={() => copyShareLink('reddit')} variant="outline">
                    Share on Reddit
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="server-ip">Server IP for Sharing</Label>
                <div className="flex gap-2">
                  <Input id="server-ip" value="play.myserver.com" readOnly />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText('play.myserver.com');
                      toast({ title: "Copied!", description: "Server IP copied to clipboard" });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium">Social Media Analytics</h4>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Twitter Shares</p>
                    <p className="text-2xl font-bold">342</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Facebook Shares</p>
                    <p className="text-2xl font-bold">189</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reddit Posts</p>
                    <p className="text-2xl font-bold">67</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
