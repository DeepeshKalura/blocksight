"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";

type Request = {
    id: string;
    contractAddress: string;
    chain: string;
    status: "PENDING" | "INDEXING" | "COMPLETED" | "FAILED";
    createdAt: string;
    completedAt?: string;
    errorMessage?: string;
};

export function IndexingStatus() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchRequests();
            // Poll every 10 seconds
            const interval = setInterval(fetchRequests, 10000);
            return () => clearInterval(interval);
        }
    }, [session]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/indexing/request");
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    if (!session) return null;

    if (requests.length === 0) {
        return null;
    }

    return (
        <Card className="w-full mt-8">
            <CardHeader>
                <CardTitle>Your Indexing Requests</CardTitle>
                <CardDescription>Real-time status of your dApp indexing jobs</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex flex-col gap-1">
                                <div className="font-mono text-sm">{req.contractAddress}</div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {req.status === "PENDING" && <Badge variant="outline">Pending</Badge>}
                                {req.status === "INDEXING" && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Indexing
                                    </Badge>
                                )}
                                {req.status === "COMPLETED" && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="default" className="bg-green-600 gap-1 hover:bg-green-700">
                                            <CheckCircle className="h-3 w-3" /> Completed
                                        </Badge>
                                        <Link href={`/dapp/${req.contractAddress}`} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                                            View <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </div>
                                )}
                                {req.status === "FAILED" && (
                                    <Badge variant="destructive" className="gap-1">
                                        <AlertCircle className="h-3 w-3" /> Failed
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
