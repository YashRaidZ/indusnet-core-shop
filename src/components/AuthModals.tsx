import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModals = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to IndusNetwork",
    });
    
    setIsLoading(false);
    onClose();
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Account created!",
      description: "Welcome to IndusNetwork! Please check your email to verify your account.",
    });
    
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-futuristic text-2xl text-foreground">
            Join IndusNetwork
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="login" className="font-gaming text-xs">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="font-gaming text-xs">
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <Button
                type="submit"
                variant="gaming"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-foreground">
                  <User className="w-4 h-4 inline mr-2" />
                  Minecraft Username
                </Label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="Steve123"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-foreground">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <Button
                type="submit"
                variant="gaming"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};