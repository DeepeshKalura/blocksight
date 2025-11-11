'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiChatInterface } from './_components/AiChatInterface';
import AiSummaryCard from './_components/AiSummaryCard';
import KpiCard from './_components/KpiCard';
import PowerUsersTable from './_components/PowerUsersTable';

// Import our manual mock data for the frontend build
import daoData from './mock-dao-data.json';

export default function DaoDashboardPage() {
  
  const handleVoterClick = (address: string) => {
    // This is the hook for our next feature: the AI agent deep-dive.
    console.log(`Requesting deep-dive profile for voter: ${address}`);
    alert(`In the future, this will trigger Puck to analyze the wallet: ${address}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text">
            {daoData.dao_name} - Community Intelligence
          </h1>
          <p className="text-gray-400">
            Last updated: {new Date(daoData.last_updated).toLocaleString()}
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gray-800">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="ai_chat">🤖 Ask Puck (AI)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6 space-y-8">
            {/* AI Summary */}
            <AiSummaryCard summary={daoData.ai_summary} />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard title="Total Unique Voters" value={daoData.kpis.total_voters} icon="👥" />
              <KpiCard title="Total Proposals" value={daoData.kpis.total_proposals} icon="📄" />
              <KpiCard title="Avg. Voter Turnout" value={`${daoData.kpis.voter_turnout_percentage}%`} icon="📈" />
            </div>
            
            {/* Power Users Leaderboard */}
            <PowerUsersTable voters={daoData.top_voters} onVoterClick={handleVoterClick} />
          </TabsContent>

          <TabsContent value="ai_chat" className="mt-6">
            <AiChatInterface />
          </TabsContent>
        </Tabs>
        
      </main>
    </div>
  );
}