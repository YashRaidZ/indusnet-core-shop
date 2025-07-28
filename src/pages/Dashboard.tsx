import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Crown, Package, History, Settings, Diamond, Coins, Trophy } from 'lucide-react';

const Dashboard = () => {
  const userStats = {
    username: "Steve_Builder",
    rank: "Diamond",
    joinDate: "March 2024",
    playtime: "127 hours",
    coins: 2450,
    achievements: 23
  };

  const recentPurchases = [
    { id: "1", item: "Diamond Rank", price: 24.99, date: "2024-01-15", status: "Delivered" },
    { id: "2", item: "500 Coins", price: 4.99, date: "2024-01-10", status: "Delivered" },
    { id: "3", item: "Builder Pack", price: 9.99, date: "2024-01-05", status: "Delivered" }
  ];

  const activePerks = [
    { name: "Flight", description: "Fly anywhere in survival mode", active: true },
    { name: "Kit Diamond", description: "Daily diamond armor kit", active: true },
    { name: "Home Teleport", description: "Set multiple home locations", active: true },
    { name: "Chat Colors", description: "Use colors in chat messages", active: true }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground font-futuristic mb-2">
            Welcome back, <span className="text-primary">{userStats.username}</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your account, view purchases, and track your progress on IndusNetwork
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Crown className="h-10 w-10 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.rank}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Coins className="h-10 w-10 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">IndusCoins</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.coins.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Trophy className="h-10 w-10 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.achievements}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <User className="h-10 w-10 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Playtime</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.playtime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview" className="font-gaming text-xs">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="purchases" className="font-gaming text-xs">
              <History className="w-4 h-4 mr-2" />
              Purchase History
            </TabsTrigger>
            <TabsTrigger value="perks" className="font-gaming text-xs">
              <Diamond className="w-4 h-4 mr-2" />
              Active Perks
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-gaming text-xs">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-futuristic">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <span className="font-semibold text-foreground">{userStats.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Rank:</span>
                    <Badge variant="secondary" className="bg-gradient-diamond">
                      {userStats.rank}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span className="text-foreground">{userStats.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Playtime:</span>
                    <span className="text-foreground">{userStats.playtime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-futuristic">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Browse Shop
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Coins className="w-4 h-4 mr-2" />
                    Buy IndusCoins
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Rank
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-futuristic">Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div>
                        <h4 className="font-semibold text-foreground">{purchase.item}</h4>
                        <p className="text-sm text-muted-foreground">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">${purchase.price}</p>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perks" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-futuristic">Active Rank Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activePerks.map((perk, index) => (
                    <div key={index} className="p-4 bg-background rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{perk.name}</h4>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{perk.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-futuristic">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Update Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;