"use client";

import { Bell, Check, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { RippleButton } from "./ui/ripple-button";

const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small projects getting started",
      features: ["Up to 100 users tracked", "Basic analytics dashboard", "7-day data history", "Community support", "Weekly reports"],
      cta: "Join Waitlist",
      highlighted: false,
      launchDate: "Q2 2026",
      waitlistCount: "1,247",
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      earlyBirdPrice: "$249",
      description: "For growing projects that need deeper insights",
      features: ["Up to 1,000 users tracked", "Advanced analytics & AI insights", "90-day data history", "Priority support", "Daily reports", "Cross-protocol analysis", "Custom segments", "API access"],
      cta: "Get Early Access",
      highlighted: true,
      launchDate: "Q1 2026",
      waitlistCount: "3,892",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large projects with custom needs",
      features: ["Unlimited users tracked", "Full platform access", "Unlimited data history", "Dedicated support", "Real-time updates", "White-label options", "Custom integrations", "SLA guarantee"],
      cta: "Request Priority Access",
      highlighted: false,
      launchDate: "Q2 2026",
      waitlistCount: "856",
    },
];

type Plan = typeof plans[0];

function PricingCard({ plan, onCTAClick }: { plan: Plan; onCTAClick: () => void; }) {
  return (
    <Card 
      className={`p-6 sm:p-8 bg-card relative transition-all duration-300 ${plan.highlighted ? 'border-accent shadow-lg shadow-accent/20 md:scale-105' : 'border-border'}`}
    >
      {plan.highlighted && (<Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs animate-pulse">Coming {plan.launchDate}</Badge>)}
      <div className="space-y-5 sm:space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg sm:text-xl">{plan.name}</h3>
            {!plan.highlighted && (<Badge variant="outline" className="text-xs">{plan.launchDate}</Badge>)}
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl">{plan.earlyBirdPrice || plan.price}</span>
            <span className="text-muted-foreground text-xs sm:text-sm">/ {plan.period}</span>
          </div>
          {plan.earlyBirdPrice && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground line-through">{plan.price}/mo</span>
              <Badge className="text-xs bg-accent/10 text-accent border-accent/20">Early Bird Price</Badge>
            </div>
          )}
          <p className="text-muted-foreground text-xs sm:text-sm">{plan.description}</p>
        </div>
        <ul className="space-y-2.5 sm:space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <DialogTrigger asChild>
          <RippleButton
            onClick={onCTAClick}
            className={`w-full h-10 sm:h-11 rounded-md text-sm sm:text-base border ${plan.highlighted ? 'bg-accent text-accent-foreground border-accent' : 'bg-transparent text-foreground border-accent/30 hover:bg-accent/10'}`}
            rippleColor={plan.highlighted ? "rgba(255, 255, 255, 0.4)" : "rgba(249, 115, 22, 0.3)"}
          >
            < div className="flex items-center justify-center gap-1">
            <Bell className="w-4 h-4 mr-2" />
            <span className="ml-2">{plan.cta}</span>
            </div>
          </RippleButton>
        </DialogTrigger>
      </div>
    </Card>
  );
}

export function PricingSection() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCTAClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan || !email) return;
        setIsLoading(true);

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, planTier: selectedPlan.name, typeUser: "Prospect" }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "An error occurred.");
            
            toast.success("You're on the waitlist!", { description: "We'll notify you when we launch." });
            setIsDialogOpen(false);
            setEmail('');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-2 bg-accent/10 text-accent border-accent/20">
            <Clock className="w-3 h-3 mr-1.5" />
            Launching Soon
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
            Choose Your <span className="text-accent">Plan</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Be the first to know when we launch. All plans include core analytics features.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} onCTAClick={() => handleCTAClick(plan)} />
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm text-muted-foreground">
            Rolling launch starting Q1 2026. Early subscribers get exclusive benefits.
          </p>
        </div>
      </div>
      <DialogContent className="sm:max-w-[425px] bg-card border-accent/30">
        <DialogHeader>
          <DialogTitle>Join the {selectedPlan?.name} Waitlist</DialogTitle>
          <DialogDescription>
            You&apos;ll be one of the first to know when we launch the <span className="font-bold">{selectedPlan?.name}</span> plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-background"
            />
          </div>
          <RippleButton type="submit" className="w-full bg-accent text-accent-foreground border-accent" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Notify Me"}
          </RippleButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}