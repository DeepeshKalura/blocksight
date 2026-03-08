import { db } from "@/lib/db";
import {
  userDapps,
  indexedProjects,
  mockDapps,
  indexingRequests,
  indexingJobs,
} from "@/lib/db/schema";
import { eq, and, desc, isNotNull } from "drizzle-orm";
import { DashboardData } from "@/app/types/dapp";

export interface UserDappWithData {
  id: string;
  slug: string;
  name: string;
  tokenSymbol: string | null;
  chain: string;
  isDemo: boolean;
  contractAddress: string;
  dashboardData: DashboardData;
  lastViewedAt: Date | null;
  status: string;
  createdAt: Date;
}

/**
 * Get all dApps for a user
 */
export async function getUserDapps(
  userId: string,
): Promise<UserDappWithData[]> {
  const userDappRecords = await db
    .select({
      userDapp: userDapps,
    })
    .from(userDapps)
    .where(eq(userDapps.userId, userId))
    .leftJoin(
      indexedProjects,
      eq(userDapps.contractAddress, indexedProjects.contractAddress),
    )
    .orderBy(desc(userDapps.createdAt));

  const results: UserDappWithData[] = [];

  for (const record of userDappRecords) {
    const userDapp = record.userDapp;

    // Get the indexed project or mock data
    const project = await db
      .select()
      .from(indexedProjects)
      .where(eq(indexedProjects.contractAddress, userDapp.contractAddress))
      .limit(1);

    let dashboardData: DashboardData | null = null;
    let status = "pending";

    const firstProject = project[0];
    if (firstProject) {
      dashboardData = firstProject.dashboardData as DashboardData;
      status = "completed";
    } else {
      // Check for pending request
      const request = await db
        .select({ status: indexingRequests.status })
        .from(indexingRequests)
        .where(
          and(
            eq(indexingRequests.userId, userId),
            eq(indexingRequests.contractAddress, userDapp.contractAddress),
          ),
        )
        .orderBy(desc(indexingRequests.createdAt))
        .limit(1);

      const firstRequest = request[0];
      if (firstRequest) {
        status = firstRequest.status.toLowerCase();
      }
    }

    results.push({
      id: userDapp.contractAddress,
      slug: userDapp.slug,
      name: userDapp.tokenName || "Unknown Token",
      tokenSymbol: userDapp.tokenSymbol,
      chain: userDapp.chain,
      isDemo: userDapp.isDemo,
      contractAddress: userDapp.contractAddress,
      dashboardData: dashboardData || ({} as DashboardData),
      lastViewedAt: userDapp.lastViewedAt,
      status,
      createdAt: userDapp.createdAt,
    });
  }

  return results;
}

/**
 * Get a single dApp by slug for a user
 */
export async function getUserDappBySlug(userId: string, slug: string) {
  const userDapp = await db
    .select()
    .from(userDapps)
    .where(and(eq(userDapps.userId, userId), eq(userDapps.slug, slug)))
    .limit(1);

  const firstUserDapp = userDapp[0];
  if (!firstUserDapp) {
    return null;
  }

  const project = await db
    .select()
    .from(indexedProjects)
    .where(eq(indexedProjects.contractAddress, firstUserDapp.contractAddress))
    .limit(1);

  return {
    userDapp: firstUserDapp,
    indexedProject: project[0] ?? null,
  };
}

/**
 * Get all mock/demo dApps
 */
export async function getMockDapps() {
  return await db.select().from(mockDapps).orderBy(desc(mockDapps.createdAt));
}

/**
 * Get a single mock dApp by slug
 */
export async function getMockDappBySlug(slug: string) {
  const result = await db
    .select()
    .from(mockDapps)
    .where(eq(mockDapps.slug, slug))
    .limit(1);

  return result[0] || null;
}

/**
 * Check if a user has already indexed a contract
 */
export async function hasUserIndexedContract(
  userId: string,
  contractAddress: string,
): Promise<boolean> {
  const result = await db
    .select({ id: userDapps.id })
    .from(userDapps)
    .where(
      and(
        eq(userDapps.userId, userId),
        eq(userDapps.contractAddress, contractAddress.toLowerCase()),
      ),
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Check if a contract is already indexed (globally)
 */
export async function isContractIndexed(
  contractAddress: string,
): Promise<boolean> {
  const result = await db
    .select({ id: indexedProjects.id })
    .from(indexedProjects)
    .where(eq(indexedProjects.contractAddress, contractAddress.toLowerCase()))
    .limit(1);

  return result.length > 0;
}

/**
 * Get indexed project by contract address
 */
export async function getIndexedProject(contractAddress: string) {
  const result = await db
    .select()
    .from(indexedProjects)
    .where(eq(indexedProjects.contractAddress, contractAddress.toLowerCase()))
    .limit(1);

  return result[0] || null;
}

/**
 * Update last viewed timestamp
 */
export async function updateLastViewed(
  userId: string,
  contractAddress: string,
) {
  await db
    .update(userDapps)
    .set({ lastViewedAt: new Date() })
    .where(
      and(
        eq(userDapps.userId, userId),
        eq(userDapps.contractAddress, contractAddress.toLowerCase()),
      ),
    );
}
