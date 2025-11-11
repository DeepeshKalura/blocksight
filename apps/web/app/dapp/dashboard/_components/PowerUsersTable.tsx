'use client';

type Voter = {
  rank: number;
  address: string;
  vote_count: number;
  first_vote_date: string;
};

interface PowerUsersTableProps {
  voters: Voter[];
  onVoterClick: (address: string) => void;
}

export default function PowerUsersTable({ voters, onVoterClick }: PowerUsersTableProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Power Users Leaderboard</h2>
        <p className="text-sm text-gray-400 mt-1">Your most engaged community members, ranked by vote count.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-700/50">
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">Rank</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">Voter Address</th>
              <th className="text-right py-3 px-6 text-xs font-medium text-gray-400 uppercase">Vote Count</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase">First Vote</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter) => (
              <tr key={voter.rank} className="hover:bg-gray-750 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-bold text-lg text-gray-300">#{voter.rank}</span>
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => onVoterClick(voter.address)}
                    className="font-mono text-sm text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {`${voter.address.slice(0, 8)}...${voter.address.slice(-6)}`}
                  </button>
                </td>
                <td className="text-right py-4 px-6">
                  <span className="text-white font-medium text-lg">{voter.vote_count}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-400 text-sm">
                    {new Date(voter.first_vote_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}