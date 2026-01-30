"use client";

import { TransactionInsights } from "@/app/types/result";
import { useState } from "react";
import GasAnalysisCard from "../components/transactions/GasAnalysis";
import TransactionPatternsCard from "../components/transactions/TransactionPatternsCard";
import TransactionTimeline from "../components/transactions/TransactionTimeline";

interface TransactionsViewProps {
    transactionInsights: TransactionInsights | null;
}

export function TransactionsView({ transactionInsights }: TransactionsViewProps) {
    const [timelineGroupBy, setTimelineGroupBy] = useState<'day' | 'week' | 'month'>('day');

    if (!transactionInsights) {
        return <div className="text-muted-foreground">No transaction data available.</div>;
    }
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Transaction Analytics</h1>
            
            <section>
                <TransactionTimeline 
                    data={transactionInsights.timeline} 
                    groupBy={timelineGroupBy} 
                    onGroupByChange={setTimelineGroupBy} 
                />
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionPatternsCard data={transactionInsights.patterns} />
                <GasAnalysisCard data={transactionInsights.gasAnalysis} />
            </section>
        </div>
    );
}