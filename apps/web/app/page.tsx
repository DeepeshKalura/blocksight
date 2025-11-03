import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingSection } from "@/components/PricingSection";
import { ProblemSection } from "@/components/ProblemSection";
import { UseCases } from "@/components/UseCases";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <UseCases />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
