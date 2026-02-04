import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bot } from "lucide-react"
import Link from "next/link"

export function SiteHeader({ dappName, dappId }: { dappName: string; dappId?: string }) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center justify-between border-b transition-[width,height] ease-linear px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{dappName}</h1>
      </div>
      {dappId && (
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={`/dapp/chat?id=${dappId}`}>
            <Bot className="h-4 w-4" />
            Chat with AI
          </Link>
        </Button>
      )}
    </header>
  )
}