import { FAQSectionInvestor } from "@/components/FAQSectionInvestor";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FoundersSection } from "@/components/FounderSection";
import { HeroInvestor } from "@/components/HeroInvestor";
import { HowItWorks } from "@/components/HowItWorks";
import { ProblemSection } from "@/components/ProblemSection";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <HeroInvestor />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <FoundersSection />
      <FAQSectionInvestor />
    </div>
  );
}
