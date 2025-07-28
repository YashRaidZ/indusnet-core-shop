import { Button } from "@/components/ui/button";
import { Play, Users, Server } from "lucide-react";
import heroImage from "@/assets/minecraft-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-gaming leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                IndusNetwork
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-futuristic">
              Experience the ultimate Minecraft adventure with custom ranks, exclusive perks, and an amazing community.
            </p>
          </div>

          {/* Server Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-foreground font-semibold">2,847 Players</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
              <Server className="h-5 w-5 text-accent" />
              <span className="text-foreground font-semibold">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
              <Play className="h-5 w-5 text-diamond" />
              <span className="text-foreground font-semibold">play.indusnetwork.com</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="xl" className="group">
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Join Server Now
            </Button>
            <Button variant="outline" size="xl" className="bg-background/20 backdrop-blur-sm">
              Explore Shop
            </Button>
          </div>

          {/* Server IP */}
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-2">Server IP</p>
            <code className="text-lg font-mono text-primary bg-muted/50 px-3 py-1 rounded">
              play.indusnetwork.com
            </code>
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;