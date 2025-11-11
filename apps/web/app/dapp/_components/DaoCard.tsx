'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export type Dao = {
  id: string; 
  name: string | null;
  logo_url: string | null; 
  chain: string;
  contract_address: string;
  description: string | null;
  status: 'PENDING' | 'INDEXING' | 'COMPLETED' | 'FAILED';
};

interface DaoCardProps {
  dao: Dao;
}

const getStatusInfo = (status: Dao['status']): { color: string; text: string } => {
  switch (status) {
    case 'COMPLETED':
      return { color: 'bg-green-500', text: 'Indexed' };
    case 'INDEXING':
      return { color: 'bg-blue-500 animate-pulse', text: 'Indexing...' };
    case 'PENDING':
      return { color: 'bg-yellow-500', text: 'Pending' };
    case 'FAILED':
      return { color: 'bg-red-500', text: 'Failed' };
    default:
      return { color: 'bg-gray-500', text: 'Unknown' };
  }
};

export function DaoCard({ dao }: DaoCardProps) {
  const statusInfo = getStatusInfo(dao.status);

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-orange-500/50 transition-all flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image src={dao.logo_url || '/puck-logo.png'} alt={`${dao.name || 'DAO'} logo`} width={48} height={48} className="rounded-full" />
        <div className="flex-1">
          <CardTitle className="text-white">{dao.name || "Unnamed DAO"}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", statusInfo.color)} title={`Status: ${dao.status}`} />
            <CardDescription>{dao.chain}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-400 line-clamp-3">{dao.description || 'No description available.'}</p>
      </CardContent>
      <CardFooter>
        {dao.status === 'COMPLETED' ? (
          <Link href={`/dao/dashboard?address=${dao.contract_address}`} legacyBehavior>
            <a className="w-full">
              <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                Indexed
              </Button>
            </a>
          </Link>
        ) : (
          <Button className="w-full" disabled>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            {statusInfo.text}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}