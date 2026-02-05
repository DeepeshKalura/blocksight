import { Bot } from "lucide-react";

interface AiSummaryCardProps {
  summary: string;
}

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <div className="bg-linear-to-br from-accent/10 via-background to-background border border-accent/20 rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-start gap-4">
        <div className="bg-accent/10 p-2 rounded-full border border-accent/20">
            <Bot className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">Puck&apos;s Analysis</h3>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}