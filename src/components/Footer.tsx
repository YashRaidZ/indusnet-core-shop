import { Button } from "@/components/ui/button";
import { Heart, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IN</span>
              </div>
              <span className="text-xl font-bold text-foreground">IndusNetwork</span>
            </div>
            <p className="text-muted-foreground">
              The ultimate Minecraft server experience with custom ranks, exclusive features, and an amazing community.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</a></li>
              <li><a href="#ranks" className="text-muted-foreground hover:text-primary transition-colors">Ranks</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Discord Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Server Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Server Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Server IP</p>
                <code className="text-primary font-mono">play.indusnetwork.com</code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <span className="text-foreground">1.20.x - 1.21.x</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-primary font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 IndusNetwork. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for the Minecraft community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;