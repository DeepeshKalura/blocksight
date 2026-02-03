import {
    OverviewStats,
    WalletWithActivity,
    TransactionInsights,
    TokenDistributionAnalysis,
} from "./result";

export type SocialLinks = {
    website: string;
    twitter: string;
};

export type NFTAnalytics = {
    totalNFTs: number;
    collections: any[];
};

export type DashboardData = {
    overviewStats: OverviewStats;
    aiSummary: string;
    tokenAddress: string;
    socialLinks: SocialLinks;
    walletsWithActivity: WalletWithActivity[];
    transactionInsights: TransactionInsights;
    tokenDistribution: TokenDistributionAnalysis;
    nftAnalytics: NFTAnalytics;
};

export type DemoDapp = {
    name: string;
    contract_address: string;
    dashboardData: DashboardData;
};
