import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthModals } from "./AuthModals";
import { CartDrawer } from "./CartDrawer";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#shop", label: "Shop" },
    { href: "#news", label: "News" },
    { href: "/dashboard", label: "Dashboard", isLink: true }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center animate-pulse-glow">
            <span className="text-primary-foreground font-bold text-sm font-gaming">IN</span>
          </div>
          <span className="text-xl font-bold text-foreground font-futuristic">IndusNetwork</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            item.isLink ? (
              <Link 
                key={item.href}
                to={item.href} 
                className="text-foreground hover:text-primary transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <a 
                key={item.href}
                href={item.href} 
                className="text-foreground hover:text-primary transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            )
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </CartDrawer>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex group"
            onClick={() => setShowAuth(true)}
          >
            <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Login
          </Button>
          <Button variant="gaming" size="sm" className="hidden sm:flex">
            Join Server
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-sm border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              item.isLink ? (
                <Link 
                  key={item.href}
                  to={item.href} 
                  className="block text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="block text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setShowAuth(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button variant="gaming" size="sm" className="w-full">
                Join Server
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <AuthModals 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </nav>
  );
};

export default Navigation;