"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { type DemoDapp, mockDapps } from "../../mock-dapp-data";
import { AboutView } from "./views/AboutView";
import { ChatView } from "./views/ChatView";
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
      case "chat":
        return (
          <ChatView
            slug={dapp.slug}
            logoUrl={dapp.logo_url || undefined}
            daoName={dapp.name || undefined}
          />
        );
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
