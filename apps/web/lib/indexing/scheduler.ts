/**
 * Calculate next update time based on transaction activity
 */
export function calculateNextUpdate(totalTransactions: number): Date {
  const now = new Date();

  // Update frequency based on activity
  if (totalTransactions > 100) {
    // High activity: update every 1 hour
    now.setHours(now.getHours() + 1);
  } else if (totalTransactions > 10) {
    // Medium activity: update every 6 hours
    now.setHours(now.getHours() + 6);
  } else {
    // Low activity: update every 24 hours
    now.setDate(now.getDate() + 1);
  }

  return now;
}

/**
 * Get job priority based on type and transaction count
 */
export function getJobPriority(
  type: "initial" | "update" | "manual",
  txCount?: number,
): number {
  if (type === "manual") {
    return 1; // Highest priority for manual refreshes
  }

  if (type === "update") {
    // Higher activity = higher priority
    if (txCount && txCount > 100) return 3;
    if (txCount && txCount > 10) return 5;
  }

  // Initial indexing has lowest priority
  return 9;
}

/**
 * Estimate processing time based on transaction count
 */
export function estimateProcessingTime(txCount: number): number {
  // Rough estimate: 1000ms per 100 transactions
  const baseTime = 5000; // 5 seconds base
  const perTxTime = 10; // 10ms per transaction
  return Math.min(baseTime + txCount * perTxTime, 300000); // Max 5 minutes
}

/**
 * Format processing time for display
 */
export function formatProcessingTime(milliseconds: number): string {
  if (milliseconds < 60000) {
    return `${Math.ceil(milliseconds / 1000)}s`;
  } else if (milliseconds < 3600000) {
    return `${Math.ceil(milliseconds / 60000)}m`;
  } else {
    return `${Math.ceil(milliseconds / 3600000)}h`;
  }
}
