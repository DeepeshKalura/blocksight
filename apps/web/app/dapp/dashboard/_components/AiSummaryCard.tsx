'use client';

interface AiSummaryCardProps {
  summary: string;
}

export default function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-1">🤖</span>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Puck's Analysis</h3>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}