"use client"

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useRouter } from "next/navigation"


export default function Page() {
  const router = useRouter()

  const handleAnalyzeDAO = () => {
    const karratcoDaoAddress = "0x9746378f28a5e61efa4fc1a3ac5fc178b96474e5"
    router.push(`/dao/dashboard?address=${karratcoDaoAddress}`)
  }

  const handleAnalyzeVoterList = () => {
    alert("Analyzing a custom list of voters is a planned future feature!")
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <BackgroundRippleEffect />

        <div className="z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered DAO Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            See Your DAO Like Never Before
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 text-balance leading-relaxed">
            BlockSight transforms on-chain data into actionable intelligence. Understand your community, identify power
            users, and make data-driven decisions with AI-powered insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mb-16">
             <Button
                  onClick={handleAnalyzeDAO}
                  className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold group/btn"
                >
                  Analyze Your DAO
            </Button>

            <Button
                  onClick={handleAnalyzeVoterList}
                  variant="default"
                  className="w-full h-11 bg-accent-foreground border-accent/30 text-accent font-semibold group/btn"
                >
                  Anlayze Your User
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
