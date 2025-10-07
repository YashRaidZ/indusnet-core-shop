import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: `${title.toLowerCase().replace(/\s+/g, '-')}`,
      name: title,
      price: parseFloat(price.replace('$', '')),
      category: tier
    });
  };
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

  // Fallback to basic if tier is not found
  const config = tierConfig[tier] || tierConfig.basic;
  const Icon = config.icon;

  return (
    <Card className="relative p-4 sm:p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card border-border group h-full flex flex-col">
      {popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm">
          Most Popular
        </Badge>
      )}
      
      <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${config.badge} group-hover:scale-110 transition-transform`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">{price}</span>
            {originalPrice && (
              <span className="text-base sm:text-lg text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">One-time purchase</p>
        </div>

        {/* Features */}
        <div className="space-y-2 flex-1">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          variant={config.variant} 
          size="lg" 
          className="w-full group/btn mt-auto"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform flex-shrink-0" />
          <span className="truncate">Add to Cart</span>
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;