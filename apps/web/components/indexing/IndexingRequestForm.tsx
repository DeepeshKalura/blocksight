"use client";

import { useState } from "react";
import { useSession } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function IndexingRequestForm() {
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to request indexing");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/indexing/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress: address }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Indexing request submitted! You'll receive an email when complete.",
        );
        setAddress("");
      } else {
        toast.error(data.error || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Request Custom Indexing</CardTitle>
          <CardDescription>
            Sign in to index any dApp contract address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get detailed analytics and insights for any Ethereum smart contract.
          </p>
          <Button variant="secondary" className="w-full" disabled>
            Sign in to Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Request Custom Indexing</CardTitle>
        <CardDescription>
          Enter an Ethereum contract address to index
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                pattern="^0x[a-fA-F0-9]{40}$"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Supports Ethereum Mainnet contracts
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Start Indexing"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
