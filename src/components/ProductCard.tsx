import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  tier: "basic" | "premium" | "elite";
  popular?: boolean;
  image?: string;
}

const ProductCard = ({ 
  title, 
  price, 
  originalPrice, 
  description, 
  features, 
  tier, 
  popular = false 
}: ProductCardProps) => {
  const tierConfig = {
    basic: {
      icon: Star,
      variant: "default" as const,
      badge: "bg-secondary text-secondary-foreground"
    },
    premium: {
      icon: Crown,
      variant: "gold" as const,
      badge: "bg-gradient-gold text-accent-foreground"
    },
    elite: {
      icon: Sparkles,
      variant: "diamond" as const,
      badge: "bg-gradient-diamond text-diamond-foreground"
    }
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Card className="relative p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card border-border group">
      {popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground px-3 py-1">
          Most Popular
        </Badge>
      )}
      
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${config.badge} group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-bold text-foreground">{price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">One-time purchase</p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          variant={config.variant} 
          size="lg" 
          className="w-full group/btn"
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Purchase Now
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;