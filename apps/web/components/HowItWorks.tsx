import { Brain, Database, LineChart, Rocket } from "lucide-react";
import Image from "next/image";
import { Timeline } from "./ui/timeline";

export function HowItWorks() {
  const data = [
    {
      title: "01",
      content: (
        <div>
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl mb-2 text-foreground">
                Connect Your Project
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Connect your project&apos;s wallet addresses or smart contracts. We&apos;ll start indexing immediately.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-shadow">
            <Image
              src="/works/wallet.png"
              alt="Connect wallet addresses and smart contracts"
              className="w-full h-auto object-cover aspect-3/2"
              width={1200}
              height={800}
              loading="lazy"
            />
          </div>
        </div>
      ),
    },
    {
      title: "02",
      content: (
        <div>
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl mb-2 text-foreground">
                AI Analyzes On-Chain Data
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Our AI scans blockchain transactions to build comprehensive profiles of every user.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-shadow">
            <Image
              src="/works/analysis.png"
              alt="AI analyzing blockchain data"
              className="w-full h-auto object-cover aspect-3/2"
              width={1200}
              height={800}
              loading="lazy"
            />
          </div>
        </div>
      ),
    },
    {
      title: "03",
      content: (
        <div>
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0">
              <LineChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl mb-2 text-foreground">
                Get Actionable Insights
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                View dashboards, reports, and AI-generated recommendations tailored to your project.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-shadow">
            <Image
              src="/works/explore.png"
              alt="Interactive analytics dashboard"
              className="w-full h-auto object-cover aspect-3/2"
              width={1200}
              height={800}
               loading="lazy"
            />
          </div>
        </div>
      ),
    },
    {
      title: "04",
      content: (
        <div>
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl mb-2 text-foreground">
                Grow Strategically
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Make data-driven decisions to engage users, prevent churn, and scale your project.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-shadow">
            <Image
              src="/works/grow.png"
              alt="Strategic growth metrics and insights"
              className="w-full h-auto object-cover aspect-3/2"
              width={1200}
              height={800}
              loading="lazy"
            />
          </div>
        </div>
      ),
    },
  ];

  return <Timeline data={data} />;
}