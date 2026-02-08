"use client";

interface IndexingRequest {
  id: string;
  contractAddress: string;
  chain: string;
  status: string;
  errorMessage: string | null;
  createdAt: Date | string;
  completedAt: Date | null;
}

interface DappListProps {
  dapps: IndexingRequest[];
}

export function DappList({ dapps }: DappListProps) {
  if (dapps.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-400">No dApps tracked yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Add your first dApp to start tracking analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dapps.map((dapp) => (
        <DappCard key={dapp.id} dapp={dapp} />
      ))}
    </div>
  );
}

function DappCard({ dapp }: { dapp: IndexingRequest }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-500";
      case "INDEXING":
        return "bg-blue-500/20 text-blue-500";
      case "COMPLETED":
        return "bg-green-500/20 text-green-500";
      case "FAILED":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const isCompleted = dapp.status === "COMPLETED";

  return (
    <div className="border border-gray-800 bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{dapp.chain} Contract</h3>
          <code className="text-sm text-gray-400 bg-black/50 px-2 py-1 rounded">
            {dapp.contractAddress}
          </code>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            dapp.status,
          )}`}
        >
          {dapp.status}
        </span>
      </div>

      {dapp.errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
          <p className="text-sm text-red-400">{dapp.errorMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Added {new Date(dapp.createdAt).toLocaleDateString()}
        </p>
        {isCompleted && (
          <a
            href={`/dapp/${dapp.contractAddress}`}
            className="text-sm text-accent hover:underline"
          >
            View Dashboard →
          </a>
        )}
      </div>
    </div>
  );
}
