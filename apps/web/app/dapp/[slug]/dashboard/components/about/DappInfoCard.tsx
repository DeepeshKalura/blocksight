import { DemoDapp } from "@/app/dapp/mock-dapp-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, FileText, Globe, Twitter } from "lucide-react";
import Image from "next/image";

interface DaoInfoCardProps {
    dao: DemoDapp;
}

const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
}

export function DappInfoCard({ dao }: DaoInfoCardProps) {
    return (
        <Card className="bg-card/50 border-border backdrop-blur-sm flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4">
                <Image 
                    src={dao.logo_url || '/puck-logo.png'} 
                    alt={`${dao.name || 'DAO'} logo`} 
                    width={56} 
                    height={56} 
                    className="rounded-lg"
                />
                <div>
                    <CardTitle className="text-2xl">{dao.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="grow space-y-4">
                <p className="text-sm text-muted-foreground">{dao.description}</p>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="font-mono text-xs">{dao.contract_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Coins className="h-4 w-4" />
                        <span className="font-mono text-xs">{dao.dashboardData.tokenAddress}</span>
                    </div>
                </div>
            </CardContent>
            <div className="p-6 pt-0 flex items-center gap-2">
                {dao.dashboardData.socialLinks?.website && (
                    <a href={dao.dashboardData.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon"><Globe className="h-4 w-4" /></Button>
                    </a>
                )}
                {dao.dashboardData.socialLinks?.twitter && (
                    <a href={dao.dashboardData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon"><Twitter className="h-4 w-4" /></Button>
                    </a>
                )}
            </div>
        </Card>
    )
}