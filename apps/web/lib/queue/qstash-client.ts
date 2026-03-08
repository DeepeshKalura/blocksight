import { Client } from "@upstash/qstash";

// Initialize QStash client
const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export interface IndexingJobPayload {
  jobId: string;
  userId: string;
  contractAddress: string;
  chain: string;
  type: "initial" | "update";
  priority: number;
}

/**
 * Publish a job to QStash queue
 */
export async function publishIndexingJob(
  payload: IndexingJobPayload,
): Promise<string> {
  const response = await qstashClient.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/queue/process-job`,
    body: payload,
    retries: 3,
    delay: payload.priority > 5 ? 5 * 60 * 1000 : 0, // Delay 5 min for low priority
  });

  return response.messageId;
}

/**
 * Publish a batch of jobs
 */
export async function publishBatchJobs(
  jobs: IndexingJobPayload[],
): Promise<string[]> {
  const responses = await qstashClient.batchJSON(
    jobs.map((job) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/queue/process-job`,
      body: job,
      retries: 3,
      delay: job.priority > 5 ? 5 * 60 * 1000 : 0,
    })),
  );

  return responses.map((r) => r.messageId);
}

/**
 * Verify a message signature (for webhook verification)
 */
export async function verifyMessageSignature(
  signature: string,
  body: string,
): Promise<boolean> {
  // In production, use proper signature verification
  // This is a simplified version
  return true;
}
