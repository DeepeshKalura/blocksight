"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { type DemoDapp, mockDapps } from "../mock-dapp-data"
import { AboutView } from "./views/AboutView"
import { NFTsView } from "./views/NFTsView"
import { TokensView } from "./views/TokensView"
import { TransactionsView } from "./views/TransactionsView"
import { WalletsView } from "./views/WalletsView"

function NewDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dapp, setDapp] = useState<DemoDapp | null>(null)
  const view = searchParams.get("view") || "about"

  useEffect(() => {
    const address = searchParams.get("address")
    if (!address) {
      router.push("/dapp")
      return
    }
    const foundDapp = mockDapps.find(
      (d) => d.contract_address.toLowerCase() === address.toLowerCase()
    )
    if (foundDapp) {
      setDapp(foundDapp)
    } else {
      console.error("DAO not found for address:", address)
      router.push("/dapp")
    }
  }, [searchParams, router])

  if (!dapp) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        Loading DAO data...
      </div>
    )
  }

  const renderView = () => {
    switch (view) {
      case "wallets":
        return <WalletsView walletsWithActivity={dapp.dashboardData.walletsWithActivity} />
      case "about":
        return <AboutView dapp={dapp} />
      case "tokens":
        return <TokensView tokenDistribution={dapp.dashboardData.tokenDistribution} />
      case "transactions":
        return <TransactionsView transactionInsights={dapp.dashboardData.transactionInsights} />
      case "nfts":
        return <NFTsView nftAnalytics={dapp.dashboardData.nftAnalytics} />
      default:
        return <AboutView dapp={dapp} />
    }
  }

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
        <SiteHeader dappName={view || "Dashboard"} dappId={dapp.id} />
        <div className="flex flex-1 flex-col p-4 md:p-6 overflow-y-auto">
          {renderView()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function Page() {
  return (
    // Suspense is required by Next.js when using useSearchParams
    <Suspense fallback={<div>Loading...</div>}>
      <NewDashboardPage />
    </Suspense>
  )
}