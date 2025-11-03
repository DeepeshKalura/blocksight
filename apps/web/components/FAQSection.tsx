import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "How does BlockSight access on-chain data?",
      answer: "BlockSight analyzes publicly available on-chain data from blockchain networks. We don't require access to private information or wallets. Simply provide your project's contract addresses or user wallet list, and we'll start indexing transactions and activity.",
    },
    {
      question: "What blockchains do you support?",
      answer: "We currently support Ethereum, Polygon, Arbitrum, Optimism, Base, and Avalanche. We're constantly adding new chains based on customer demand. Enterprise customers can request custom chain integrations.",
    },
    {
      question: "How is user privacy protected?",
      answer: "All analysis is done on public blockchain data. We don't collect or store any personal information unless voluntarily provided. Wallet addresses are pseudonymous by default, and we follow best practices for data security and privacy.",
    },
    {
      question: "Can I export the data and insights?",
      answer: "Yes! Professional and Enterprise plans include CSV/JSON export functionality and full API access. You can integrate BlockSight insights into your own tools, dashboards, or workflows.",
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI models are trained on millions of on-chain transactions and continuously refined. We achieve 95%+ accuracy in user classification and engagement scoring. All AI insights include confidence scores and raw data for verification.",
    },
    {
      question: "Do you offer custom development?",
      answer: "Enterprise customers can request custom features, integrations, and white-label solutions. Our team works closely with large projects to build tailored analytics solutions that fit their specific needs.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
          Frequently Asked <span className="text-accent">Questions</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Everything you need to know about BlockSight
        </p>
      </div>
      
      <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-border rounded-lg px-4 sm:px-6 data-[state=open]:border-accent/50 transition-colors"
          >
            <AccordionTrigger className="text-left text-sm sm:text-base hover:text-accent transition-colors py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
