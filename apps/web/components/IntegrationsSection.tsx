import { Card } from "./ui/card";

export function IntegrationsSection() {
  const integrations = [
    { name: "Ethereum", logo: "⟠" },
    { name: "Polygon", logo: "⬡" },
    { name: "Arbitrum", logo: "◆" },
    { name: "Optimism", logo: "✦" },
    { name: "Base", logo: "🔷" },
    { name: "Avalanche", logo: "🔺" },
    { name: "Gnosis Safe", logo: "🔐" },
    { name: "Snapshot", logo: "📸" },
    { name: "Discord", logo: "💬" },
    { name: "Telegram", logo: "✈️" },
    { name: "Twitter", logo: "🐦" },
    { name: "ENS", logo: "🏷️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 bg-gradient-to-b from-background/50 to-background">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
          Seamless <span className="text-accent">Integrations</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Connect with the tools and chains you already use
        </p>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {integrations.map((integration, index) => (
          <Card 
            key={index} 
            className="aspect-square p-3 sm:p-4 bg-card border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 flex flex-col items-center justify-center gap-2 sm:gap-3 group cursor-pointer"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform">
              {integration.logo}
            </div>
            <div className="text-[10px] sm:text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
              {integration.name}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}