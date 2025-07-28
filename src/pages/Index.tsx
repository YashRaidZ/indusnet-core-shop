import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <StatsSection />
        <ShopSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
