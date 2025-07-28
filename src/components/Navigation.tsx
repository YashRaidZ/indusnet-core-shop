import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">IN</span>
          </div>
          <span className="text-xl font-bold text-foreground">IndusNetwork</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#shop" className="text-foreground hover:text-primary transition-colors">Shop</a>
          <a href="#ranks" className="text-foreground hover:text-primary transition-colors">Ranks</a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <User className="h-4 w-4 mr-2" />
            Login
          </Button>
          <Button variant="gaming" size="sm" className="hidden sm:flex">
            Join Server
          </Button>
          
          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;