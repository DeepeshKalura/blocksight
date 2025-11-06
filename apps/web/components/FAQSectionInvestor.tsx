import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "What stage is BlockSight currently in?",
    answer: "We're in the pre-seed stage, actively building our MVP. Our team is working on the core AI analytics engine and establishing partnerships with leading DAOs. We're targeting a beta launch in Q2 2025 with select DAO partners."
  },
  {
    question: "When will BlockSight be available?",
    answer: "We're planning a private beta launch in Q2 2025 for waitlist members and partner DAOs, followed by a public launch in Q3 2025. Early waitlist members will get priority access and lifetime founder pricing benefits."
  },
  {
    question: "Who is building BlockSight?",
    answer: "BlockSight is founded by a team of blockchain veterans, AI researchers, and product builders with experience from leading Web3 companies and DeFi protocols. Our team has collectively built data platforms serving millions of users and managed DAO communities with 100K+ members."
  },
  {
    question: "Why is BlockSight needed right now?",
    answer: "DAOs are sitting on goldmines of on-chain data but lack the tools to understand their communities. With over $20B in DAO treasuries and growing governance participation, there's an urgent need for intelligence that helps DAOs identify contributors, prevent governance attacks, and allocate resources effectively."
  },
  {
    question: "What makes BlockSight different from existing analytics tools?",
    answer: "Current tools focus on token metrics and transactions. BlockSight goes deeper - using AI to understand community behavior, identify engagement patterns, and predict governance outcomes. We're building the first platform that combines on-chain data, social signals, and AI to give DAOs actionable community intelligence."
  },
  {
    question: "Are you raising funding?",
    answer: "We're currently in conversations with strategic investors and angel investors who understand the DAO ecosystem. We're looking for partners who can provide not just capital, but also access to DAO networks, technical expertise, and go-to-market support."
  },
  {
    question: "How can I get involved early?",
    answer: "Join our waitlist to get early access to the platform. If you're a DAO operator, reach out for our beta partnership program. Investors can contact our team directly to learn about investment opportunities. We're also hiring blockchain engineers and data scientists."
  },
  {
    question: "What's your go-to-market strategy?",
    answer: "We're taking a partner-first approach, working closely with 5-10 leading DAOs during beta to ensure product-market fit. We'll leverage their success stories and network effects to expand. Our freemium model allows smaller DAOs to get started easily while enterprise DAOs get white-glove service."
  },
  {
    question: "What's your long-term vision?",
    answer: "We envision BlockSight becoming the operating system for DAO intelligence - the platform every DAO operator checks daily to understand their community. Beyond analytics, we're building towards predictive governance, automated contributor recognition, and AI-powered treasury management recommendations."
  },
  {
    question: "How do I stay updated on BlockSight's progress?",
    answer: "Join our waitlist to receive monthly updates on product development, beta access opportunities, and company milestones. We're committed to building in public and sharing our learnings with the DAO community. Follow us on Twitter and join our Discord for real-time updates."
  }
];

export function FAQSectionInvestor() {
  return (
    <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm mb-6">
            <span className="text-sm text-accent">Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 md:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about BlockSight&apos;s vision, timeline, and how to get involved early.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-accent/20 rounded-xl px-6 data-[state=open]:border-accent/40 transition-colors bg-card/50 backdrop-blur-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Have more questions about investing, partnerships, or joining the team?
          </p>
          <a
            href="mailto:hello@blocksight.ai"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            Get in touch with our team →
          </a>
        </div>
      </div>
    </section>
  );
}
