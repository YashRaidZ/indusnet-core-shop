import ProductCard from "./ProductCard";

const ShopSection = () => {
  const ranks = [
    {
      id: "vip-rank",
      title: "VIP Rank",
      price: "$9.99",
      originalPrice: "$14.99",
      description: "Essential perks for dedicated players",
      tier: "basic" as const,
      category: "ranks",
      features: [
        "VIP Chat prefix & color",
        "Access to VIP-only areas",
        "Priority queue access",
        "50% more rewards",
        "Custom nickname colors"
      ]
    },
    {
      id: "mvp-rank",
      title: "MVP Rank",
      price: "$19.99",
      originalPrice: "$29.99",
      description: "Advanced features for serious gamers",
      tier: "premium" as const,
      category: "ranks",
      popular: true,
      features: [
        "All VIP benefits included",
        "MVP exclusive commands",
        "Pet companions",
        "Flying in lobby areas",
        "100% bonus XP & coins",
        "Priority support access"
      ]
    },
    {
      id: "elite-rank",
      title: "Elite Rank",
      price: "$39.99",
      originalPrice: "$59.99",
      description: "Ultimate experience with all features",
      tier: "elite" as const,
      category: "ranks",
      features: [
        "All MVP benefits included",
        "Exclusive Elite island",
        "Custom particle effects",
        "Unlimited /home sets",
        "200% bonus rewards",
        "Direct staff communication",
        "Monthly exclusive rewards"
      ]
    }
  ];

  const coinPacks = [
    {
      id: "starter-pack",
      title: "Starter Pack",
      price: "$4.99",
      description: "Perfect for new players",
      tier: "basic" as const,
      category: "coins",
      features: [
        "1,000 IndusCoins",
        "Starter kit included",
        "Basic tools set",
        "7-day boost"
      ]
    },
    {
      id: "gamer-pack",
      title: "Gamer Pack",
      price: "$14.99",
      description: "Great value for active players",
      tier: "premium" as const,
      category: "coins",
      popular: true,
      features: [
        "3,500 IndusCoins",
        "25% bonus coins",
        "Premium starter kit",
        "30-day boost",
        "Exclusive cosmetics"
      ]
    },
    {
      id: "master-pack",
      title: "Master Pack",
      price: "$29.99",
      description: "Maximum value bundle",
      tier: "elite" as const,
      category: "coins",
      features: [
        "8,000 IndusCoins",
        "50% bonus coins",
        "Elite starter package",
        "90-day boost",
        "Rare cosmetic bundle",
        "Priority support"
      ]
    }
  ];

  return (
    <section id="shop" className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        {/* Ranks Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">Rank</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive features, commands, and areas with our premium ranks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {ranks.map((rank, index) => (
            <ProductCard key={index} {...rank} />
          ))}
        </div>

        {/* Coin Packs Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="bg-gradient-gold bg-clip-text text-transparent">IndusCoins</span> Packs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get more coins to purchase items, upgrades, and exclusive content in-game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {coinPacks.map((pack, index) => (
            <ProductCard key={index} {...pack} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;