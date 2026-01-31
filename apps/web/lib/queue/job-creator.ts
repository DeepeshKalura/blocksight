import { db } from "@/lib/db";
import { indexingJobs, NewIndexingJob } from "@/lib/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { publishIndexingJob, IndexingJobPayload } from "./qstash-client";

export interface JobCreationResult {
  jobId: string;
  qstashMessageId: string;
  status: string;
}

/**
 * Create and queue a new indexing job
 */
export async function createIndexingJob(params: {
  userId: string;
  contractAddress: string;
  chain: string;
  type: "initial" | "update";
  priority?: number;
}): Promise<JobCreationResult> {
  const { userId, contractAddress, chain, type, priority = 5 } = params;

  // Check if job already exists for this contract
  const existingJob = await db
    .select({ id: indexingJobs.id, status: indexingJobs.status })
    .from(indexingJobs)
    .where(
      and(
        eq(indexingJobs.contractAddress, contractAddress.toLowerCase()),
        eq(indexingJobs.status, "queued"),
      ),
    )
    .limit(1);

  if (existingJob.length > 0) {
    return {
      jobId: existingJob[0].id,
      qstashMessageId: "",
      status: "already_queued",
    };
  }

  // Create job record
  const [job] = await db
    .insert(indexingJobs)
    .values({
      userId,
      contractAddress: contractAddress.toLowerCase(),
      chain,
      type,
      priority,
      status: "queued",
    })
    .returning();

  // Publish to QStash
  const qstashMessageId = await publishIndexingJob({
    jobId: job.id,
    userId,
    contractAddress: contractAddress.toLowerCase(),
    chain,
    type,
    priority,
  });

  // Update job with QStash message ID
  await db
    .update(indexingJobs)
    .set({ qstashMessageId })
    .where(eq(indexingJobs.id, job.id));

  return {
    jobId: job.id,
    qstashMessageId,
    status: "queued",
  };
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  const job = await db
    .select()
    .from(indexingJobs)
    .where(eq(indexingJobs.id, jobId))
    .limit(1);

  return job[0] || null;
}

/**
 * Get user's jobs
 */
export async function getUserJobs(userId: string, status?: string) {
  let query = db
    .select()
    .from(indexingJobs)
    .where(eq(indexingJobs.userId, userId))
    .orderBy(desc(indexingJobs.queuedAt));

  if (status) {
    query = db
      .select()
      .from(indexingJobs)
      .where(
        and(eq(indexingJobs.userId, userId), eq(indexingJobs.status, status)),
      )
      .orderBy(desc(indexingJobs.queuedAt));
  }

  return await query;
}

/**
 * Update job status
 */
export async function updateJobStatus(
  jobId: string,
  status: string,
  errorMessage?: string,
) {
  const update: Partial<NewIndexingJob> = { status };

  if (status === "processing") {
    update.startedAt = new Date();
  } else if (status === "completed" || status === "failed") {
    update.completedAt = new Date();
  }

  if (errorMessage) {
    update.errorMessage = errorMessage;
  }

  await db.update(indexingJobs).set(update).where(eq(indexingJobs.id, jobId));
}

/**
 * Retry a failed job
 */
export async function retryJob(jobId: string) {
  const job = await getJobStatus(jobId);

  if (!job || job.status !== "failed") {
    throw new Error("Job not found or not in failed status");
  }

  // Create new job
  return await createIndexingJob({
    userId: job.userId,
    contractAddress: job.contractAddress,
    chain: job.chain,
    type: job.type as "initial" | "update",
    priority: Math.max(1, job.priority - 1), // Increase priority on retry
  });
}
