'use client';

import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { config } from '../aux/config';
import { AddDaoDrawer } from './_components/AddDaoDrawer';
import { DaoCard, type Dao } from './_components/DaoCard';

const pucksTips = [
  "A healthy DAO thrives on participation. Who are your top 10 most active voters?",
  "Understanding where your members delegate their votes can reveal trust networks.",
  "High voter apathy? Maybe it's time to analyze the complexity of recent proposals.",
  "The quietest members might be your biggest untapped resource. What's their on-chain story?",
  "Track the journey of a proposal from creation to execution. Where are the bottlenecks?",
];

const PuckMessage = () => {
  const [tip, setTip] = useState('');
  useEffect(() => {
    setTip(pucksTips[Math.floor(Math.random() * pucksTips.length)]);
  }, []);

  return (
     <div className="mt-8 bg-linear-to-r from-orange-500/30 to-amber-500/10 border border-orange rounded-lg p-6">
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-1">💡</span>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Puck&apos;s Tip</h3>
          <p className="text-gray-300 leading-relaxed italic">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default function DaoHomePage() {
  const [daos, setDaos] = useState<Dao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDaos() {
      setIsLoading(true);
      try {
        const response = await fetch(config.API_ENDPOINTS.DAOS);
        if (!response.ok) {
          throw new Error('Failed to fetch DAOs');
        }
        const data = await response.json();
        setDaos(data.data);
      } catch (error) {
        console.error("Error fetching DAOs:", error);
        setDaos([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDaos();
  }, []);

  const handleDaoAdded = (newDao: Dao) => {
    setDaos(prevDaos => [...prevDaos, newDao]);
  };

  return (
    <main className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="flex items-center justify-between py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Image src="/puck-logo.png" alt="Puck Mascot" width={40} height={40} className="rounded-full" />
            <div>
                <h1 className="text-2xl font-bold text-white">DAO Command Center</h1>
                <p className="text-sm text-gray-400">Your AI-powered community intelligence hub.</p>
            </div>
          </div>
          {daos.length > 0 && (
             <AddDaoDrawer onDaoAdded={handleDaoAdded}>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add DAO
                </Button>
            </AddDaoDrawer>
          )}
        </header>

        {isLoading ? (
          <div className="text-center text-gray-400 mt-20 animate-pulse">Loading your DAOs...</div>
        ) : daos.length === 0 ? (
          <div className="mt-20">
            <Empty className="border border-dashed border-gray-700 bg-transparent rounded-lg py-12">
              <EmptyHeader>
                <EmptyMedia>
                  <Image src="/puck-logo.png" alt="Puck Mascot" width={80} height={80} className="rounded-full opacity-70" />
                </EmptyMedia>
                <EmptyTitle>Welcome to Your Command Center</EmptyTitle>
                <EmptyDescription>
                  You haven't added any DAOs to analyze yet. Get started by adding your first one.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <AddDaoDrawer onDaoAdded={handleDaoAdded}>
                  <Button size="lg">Add Your First DAO</Button>
                </AddDaoDrawer>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <PuckMessage />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {daos.map((dao) => (
                <DaoCard key={dao.id} dao={dao} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}