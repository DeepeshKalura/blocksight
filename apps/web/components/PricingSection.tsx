import { Bell, Check, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { RippleButton } from "./ui/ripple-button";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small projects getting started",
      features: [
        "Up to 100 users tracked",
        "Basic analytics dashboard",
        "7-day data history",
        "Community support",
        "Weekly reports",
      ],
      cta: "Join Waitlist",
      highlighted: false,
      launchDate: "Q2 2025",
      waitlistCount: "1,247",
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      earlyBirdPrice: "$249",
      description: "For growing projects that need deeper insights",
      features: [
        "Up to 1,000 users tracked",
        "Advanced analytics & AI insights",
        "90-day data history",
        "Priority support",
        "Daily reports",
        "Cross-protocol analysis",
        "Custom segments",
        "API access",
      ],
      cta: "Get Early Access",
      highlighted: true,
      launchDate: "Q1 2025",
      waitlistCount: "3,892",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large projects with custom needs",
      features: [
        "Unlimited users tracked",
        "Full platform access",
        "Unlimited data history",
        "Dedicated support",
        "Real-time updates",
        "White-label options",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Request Priority Access",
      highlighted: false,
      launchDate: "Q2 2025",
      waitlistCount: "856",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <Badge 
          className="mb-2 bg-accent/10 text-accent border-accent/20" 
          data-testid="badge-coming-soon"
        >
          <Clock className="w-3 h-3 mr-1.5" />
          Launching Soon
        </Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4" data-testid="heading-pricing">
          Choose Your <span className="text-accent">Plan</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4" data-testid="text-pricing-description">
          Be the first to know when we launch. All plans include core analytics features.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`p-6 sm:p-8 bg-card relative transition-all duration-300 ${
              plan.highlighted 
                ? 'border-accent shadow-lg shadow-accent/20 md:scale-105' 
                : 'border-border'
            }`}
            data-testid={`card-plan-${plan.name.toLowerCase()}`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs animate-pulse" data-testid="badge-most-popular">
                Coming {plan.launchDate}
              </Badge>
            )}
            
            <div className="space-y-5 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl" data-testid={`text-plan-name-${plan.name.toLowerCase()}`}>{plan.name}</h3>
                  {!plan.highlighted && (
                    <Badge variant="outline" className="text-xs" data-testid={`badge-launch-${plan.name.toLowerCase()}`}>
                      {plan.launchDate}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl" data-testid={`text-price-${plan.name.toLowerCase()}`}>
                    {plan.earlyBirdPrice ? plan.earlyBirdPrice : plan.price}
                  </span>
                  <span className="text-muted-foreground text-xs sm:text-sm">/ {plan.period}</span>
                </div>
                {plan.earlyBirdPrice && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground line-through">{plan.price}/mo</span>
                    <Badge className="text-xs bg-accent/10 text-accent border-accent/20" data-testid="badge-early-bird">
                      Early Bird Price
                    </Badge>
                  </div>
                )}
                <p className="text-muted-foreground text-xs sm:text-sm" data-testid={`text-description-${plan.name.toLowerCase()}`}>{plan.description}</p>
              </div>
              
              <ul className="space-y-2.5 sm:space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2.5 sm:gap-3" data-testid={`list-feature-${plan.name.toLowerCase()}-${featureIndex}`}>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <RippleButton
                className={`w-full h-10 sm:h-11 rounded-md text-sm sm:text-base border ${
                  plan.highlighted
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-transparent text-foreground border-accent/30 hover:bg-accent/10'
                }`}
                rippleColor={plan.highlighted ? "rgba(255, 255, 255, 0.4)" : "rgba(249, 115, 22, 0.3)"}
                data-testid={`button-cta-${plan.name.toLowerCase()}`}
              >
                <div className="flex items-center justify-center">
                <Bell className="w-4 h-4" /> 
                <div className="ml-2">
                {plan.cta}
                </div>
                </div>

              </RippleButton>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12 sm:mt-16">
        <p className="text-sm text-muted-foreground" data-testid="text-launch-info">
          Launching in Q1 2025. Early subscribers get exclusive benefits and discounted pricing.
        </p>
      </div>
    </div>
  );
}