import {
  ArrowRightLeftIcon,
  ArrowUpCircleIcon,
  CoinsIcon,
  ImageIcon,
  InfoIcon,
  SearchIcon,
  SettingsIcon,
  WalletIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import type { DemoDapp } from "@/app/dapp/mock-dapp-data"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"

// Simplified nav items for our dashboard
const navMain = (address: string) => [
  {
    title: "About",
    url: `/dapp/dashboard?address=${address}&view=about`,
    icon: InfoIcon 
  },
  {
    title: "Wallets",
    url: `/dapp/dashboard?address=${address}&view=wallets`,
    icon: WalletIcon,
  },
  {
    title: "Tokens",
    url: `/dapp/dashboard?address=${address}&view=tokens`,
    icon: CoinsIcon,
  },
  {
    title: "Transactions",
    url: `/dapp/dashboard?address=${address}&view=transactions`,
    icon: ArrowRightLeftIcon,
  },
  {
    title: "NFTs",
    url: `/dapp/dashboard?address=${address}&view=nfts`,
    icon: ImageIcon,
  },

  
]

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
  {
    title: "Search",
    url: "#",
    icon: SearchIcon,
  },
]

// Mock user data as requested for the demo
const demoUser = {
  name: "Demo User",
  email: "user@blocksight.ai",
  avatar: "/puck-logo.png",
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  dao: DemoDapp | null
}

export function AppSidebar({ dao, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dapp">
                {dao ? (
                  <Image
                    src={dao.logo_url || "/puck-logo.png"}
                    alt={dao.name || "DAO Logo"}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-sm"
                  />
                ) : (
                  <ArrowUpCircleIcon className="h-5 w-5" />
                )}
                <span className="text-base font-semibold">
                  {dao ? dao.name : "Loading..."}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dao ? (
                navMain(dao.contract_address).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <>
                  <SidebarMenuSkeleton showIcon />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Secondary navigation is now at the bottom of the main content area */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={demoUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
