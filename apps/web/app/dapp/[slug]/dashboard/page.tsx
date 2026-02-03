"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { type DemoDapp, mockDapps } from "../../mock-dapp-data";
import { AboutView } from "./views/AboutView";
import { NFTsView } from "./views/NFTsView";
import { TokensView } from "./views/TokensView";
import { TransactionsView } from "./views/TransactionsView";
import { WalletsView } from "./views/WalletsView";

function NewDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [dapp, setDapp] = useState<DemoDapp | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);
  const view = searchParams.get("view") || "about";

  useEffect(() => {
    const fetchDappData = async () => {
      const slug = params.slug as string;
      if (!slug) {
        router.push("/dapp");
        return;
      }

      setLoading(true);

      // First check if it's a demo dApp
      const demoDapp = mockDapps.find((d) => d.slug === slug);
      if (demoDapp) {
        setDapp(demoDapp);
        setIsDemo(true);
        setLoading(false);
        return;
      }

      // If not demo, try to fetch user's actual dApp data
      try {
        const response = await fetch(`/api/dapp/${slug}/data`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.dapp) {
            setDapp(data.dapp);
            setIsDemo(false);
          } else {
            // If no user data found, use demo as fallback
            const fallbackDemo = mockDapps.find((d) =>
              d.contract_address.toLowerCase().includes(slug),
            );
            if (fallbackDemo) {
              setDapp(fallbackDemo);
              setIsDemo(true);
            } else {
              router.push("/dapp");
            }
          }
        } else {
          // Fallback to demo if API fails
          const fallbackDemo =
            mockDapps.find((d) => d.slug === "usdt") || mockDapps[0];
          if (fallbackDemo) {
            setDapp(fallbackDemo);
            setIsDemo(true);
          }
        }
      } catch (error) {
        console.error("Error fetching dApp data:", error);
        // Fallback to demo
        const fallbackDemo =
          mockDapps.find((d) => d.slug === "usdt") || mockDapps[0];
        if (fallbackDemo) {
          setDapp(fallbackDemo);
          setIsDemo(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDappData();
  }, [params.slug, router]);

  if (loading || !dapp) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading dApp data...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "wallets":
        return (
          <WalletsView
            walletsWithActivity={dapp.dashboardData.walletsWithActivity}
          />
        );
      case "about":
        return <AboutView dapp={dapp} />;
      case "tokens":
        return (
          <TokensView
            tokenDistribution={dapp.dashboardData.tokenDistribution}
          />
        );
      case "transactions":
        return (
          <TransactionsView
            transactionInsights={dapp.dashboardData.transactionInsights}
          />
        );
      case "nfts":
        return <NFTsView nftAnalytics={dapp.dashboardData.nftAnalytics} />;
      default:
        return <AboutView dapp={dapp} />;
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" dao={dapp} />
      <SidebarInset>
        <SiteHeader dappName={view || "Dashboard"} />
        <div className="flex flex-1 flex-col p-4 md:p-6 overflow-y-auto">
          {isDemo && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <p className="text-yellow-300/80 text-sm mt-2">
                You're viewing demo data. To analyze your own dApp, add a
                contract address from the dApp page.
              </p>
            </div>
          )}
          {renderView()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Page() {
  return (
    // Suspense is required by Next.js when using useSearchParams
    <Suspense fallback={<div>Loading...</div>}>
      <NewDashboardPage />
    </Suspense>
  );
}
