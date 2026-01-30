import { Check } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { RippleButton } from "./ui/ripple-button";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small DAOs getting started",
      features: [
        "Up to 100 members tracked",
        "Basic analytics dashboard",
        "7-day data history",
        "Community support",
        "Weekly reports",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      description: "For growing DAOs that need deeper insights",
      features: [
        "Up to 1,000 members tracked",
        "Advanced analytics & AI insights",
        "90-day data history",
        "Priority support",
        "Daily reports",
        "Cross-DAO analysis",
        "Custom segments",
        "API access",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large DAOs with custom needs",
      features: [
        "Unlimited members tracked",
        "Full platform access",
        "Unlimited data history",
        "Dedicated support",
        "Real-time updates",
        "White-label options",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
          Choose Your <span className="text-accent">Plan</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Start free, scale as you grow. All plans include core analytics features.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`p-6 sm:p-8 bg-card relative ${
              plan.highlighted 
                ? 'border-accent shadow-lg shadow-accent/20 md:scale-105' 
                : 'border-border'
            }`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs">
                Most Popular
              </Badge>
            )}
            
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl">{plan.price}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">/ {plan.period}</span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm">{plan.description}</p>
              </div>
              
              <ul className="space-y-2.5 sm:space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2.5 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <RippleButton
                className={`w-full h-10 sm:h-11 rounded-xl text-sm sm:text-base ${
                  plan.highlighted
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground border-accent'
                    : 'bg-transparent hover:bg-accent/10 text-foreground border-accent/50 hover:border-accent'
                }`}
                rippleColor="#ff6b35"
              >
                {plan.cta}
              </RippleButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}