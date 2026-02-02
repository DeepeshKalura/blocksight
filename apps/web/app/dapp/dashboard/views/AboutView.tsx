"use client"
import { DemoDapp } from "@/app/dapp/mock-dapp-data";
import { AiSummaryCard } from "../components/about/AiSummaryCard";
import { DappInfoCard } from "../components/about/DappInfoCard";
import { OverviewCards } from "../components/about/OverviewCards";

interface AboutViewProps {
    dapp: DemoDapp;
}

export function AboutView({ dapp }: AboutViewProps) {
    return (
        <div className="space-y-8">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <DappInfoCard dao={dapp} />
                </div>
                <div className="lg:col-span-2">
                    <AiSummaryCard summary={dapp.dashboardData.aiSummary} />
                </div>
            </section>
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">📊 Key Metrics</h2>
                <OverviewCards data={dapp.dashboardData.overviewStats} />
            </section>
        </div>
    )
}