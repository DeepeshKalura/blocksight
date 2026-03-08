import {
    OverviewStats,
    WalletWithActivity,
    TransactionInsights,
    TokenDistributionAnalysis,
} from "./result";
import { NFTAnalytics } from "./nft";

export type SocialLinks = {
    website: string;
    twitter: string;
};

export type { NFTAnalytics };

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
