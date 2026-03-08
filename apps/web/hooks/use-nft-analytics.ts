"use client";

import { useState, useEffect, useCallback } from "react";
import { NFTAnalytics } from "@/app/types/nft";

interface UseNFTAnalyticsOptions {
  slug: string;
  enabled?: boolean;
  useMock?: boolean;
  refreshOnMount?: boolean;
}

interface UseNFTAnalyticsResult {
  data: NFTAnalytics | null;
  isLoading: boolean;
  error: Error | null;
  source: "cache" | "mock" | "alchemy" | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

const clientCache = new Map<string, { data: NFTAnalytics; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useNFTAnalytics({
  slug,
  enabled = true,
  useMock = true,
  refreshOnMount = false,
}: UseNFTAnalyticsOptions): UseNFTAnalyticsResult {
  const [data, setData] = useState<NFTAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [source, setSource] = useState<"cache" | "mock" | "alchemy" | null>(null);

  const fetchData = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!slug || !enabled) return;

      if (!forceRefresh) {
        const cached = clientCache.get(slug);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setData(cached.data);
          setSource("cache");
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (forceRefresh) params.set("refresh", "true");
        if (!useMock) params.set("mock", "false");

        const response = await fetch(
          `/api/dapp/${slug}/nft-analytics?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
          setSource(result.source);
          clientCache.set(slug, {
            data: result.data,
            timestamp: Date.now(),
          });
        } else {
          throw new Error(result.error || "Failed to fetch NFT analytics");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [slug, enabled, useMock]
  );

  useEffect(() => {
    if (enabled) {
      fetchData(refreshOnMount);
    }
  }, [enabled, fetchData, refreshOnMount]);

  return {
    data,
    isLoading,
    error,
    source,
    refetch: fetchData,
  };
}

export function invalidateNFTAnalyticsCache(slug?: string): void {
  if (slug) {
    clientCache.delete(slug);
  } else {
    clientCache.clear();
  }
}
