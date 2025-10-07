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
    <Card className="relative p-5 sm:p-6 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-100 bg-card border-border group h-full flex flex-col touch-manipulation">
      {popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold">
          Most Popular
        </Badge>
      )}
      
      <div className="space-y-4 sm:space-y-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${config.badge} group-hover:scale-110 transition-transform`}>
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-2 py-2">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl sm:text-4xl font-bold text-foreground">{price}</span>
            {originalPrice && (
              <span className="text-lg sm:text-xl text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">One-time purchase</p>
        </div>

        {/* Features */}
        <div className="space-y-3 flex-1 py-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          variant={config.variant} 
          size="lg" 
          className="w-full group/btn mt-auto h-12 sm:h-14 text-base sm:text-lg font-bold"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 group-hover/btn:scale-110 transition-transform flex-shrink-0" />
          <span className="truncate">Add to Cart</span>
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;