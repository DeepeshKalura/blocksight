import { Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DAO Operator",
      org: "MetaGov DAO",
      content: "BlockSight transformed how we understand our community. We identified our top 100 contributors and saw a 40% increase in governance participation.",
      initials: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "Community Lead",
      org: "DeFi Collective",
      content: "The cross-DAO analytics revealed overlaps we never knew existed. We formed 3 strategic partnerships in the first month.",
      initials: "MR",
    },
    {
      name: "Emily Thompson",
      role: "Treasury Manager",
      org: "Protocol DAO",
      content: "Understanding token holder behavior helped us optimize our incentive programs. ROI on rewards improved by 60%.",
      initials: "ET",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
          Trusted By <span className="text-accent">Industry Leaders</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Join hundreds of DAOs making data-driven decisions with BlockSight
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <Card 
            key={index} 
            className="p-5 sm:p-6 bg-card border-border hover:border-accent/50 transition-all relative"
          >
            <Quote className="absolute top-5 right-5 sm:top-6 sm:right-6 h-6 w-6 sm:h-8 sm:w-8 text-accent/20" />
            
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground italic leading-relaxed pr-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-border/50">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 bg-accent/20 border-2 border-accent/30">
                  <AvatarFallback className="bg-accent/10 text-accent text-sm">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.org}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
