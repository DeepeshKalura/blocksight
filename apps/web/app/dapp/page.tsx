'use client';

import Image from 'next/image';
import { DaoCard } from './_components/DaoCard';
import { mockDapps } from './mock-dapp-data';

export default function DaoSelectionPage() {
  const daos = mockDapps; // Use our static mock data directly

  return (
    <main className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="flex items-center justify-between py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Image src="/project-logo-nobg.png" alt="BlockSight Logo" width={40} height={40} />
            <div>
              <h1 className="text-2xl font-bold text-white">dApp Demo Selection</h1>
              <p className="text-sm text-gray-400">Choose a sample dApp to analyze.</p>
            </div>
          </div>
        </header>

        <div className="mt-8 text-center border border-dashed border-gray-700 p-8 rounded-lg">
          <p className="text-gray-400 max-w-2xl mx-auto mb-4">
            This demo showcases our ability to parse raw blockchain data. The following contracts have been analyzed over a
            <span className="text-accent font-semibold mx-1">3-day time window</span>
            to identify key behavioral patterns, whale movements, and gas usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {daos.map((dao) => (
            <DaoCard key={dao.id} dao={dao} />
          ))}
        </div>
      </div>
    </main>
  );
}