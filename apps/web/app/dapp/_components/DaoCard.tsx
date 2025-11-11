'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';

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
      return { color: 'bg-accent', text: 'Indexed' };
    case 'INDEXING':
      return { color: 'bg-accent/60 animate-pulse', text: 'Indexing...' };
    case 'PENDING':
      return { color: 'bg-accent/40', text: 'Pending' };
    case 'FAILED':
      return { color: 'bg-destructive', text: 'Failed' };
    default:
      return { color: 'bg-muted', text: 'Unknown' };
  }
};

export function DaoCard({ dao }: DaoCardProps) {
  const statusInfo = getStatusInfo(dao.status);

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm hover:border-accent/50 transition-all flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image 
          src={dao.logo_url || '/puck-logo.png'} 
          alt={`${dao.name || 'DAO'} logo`} 
          width={48} 
          height={48} 
          className="rounded-full" 
        />
        <div className="flex-1">
          <CardTitle className="text-foreground">{dao.name || "Unnamed DAO"}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", statusInfo.color)} title={`Status: ${dao.status}`} />
            <CardDescription>{dao.chain}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{dao.description || 'No description available.'}</p>
      </CardContent>
      <CardFooter>
        {dao.status === 'COMPLETED' ? (
          <a href={`/dapp/dashboard?address=${dao.contract_address}`} className="w-full">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              View Dashboard
            </Button>
          </a>
        ) : (
          <Button className="w-full" disabled variant="secondary">
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            {statusInfo.text}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}