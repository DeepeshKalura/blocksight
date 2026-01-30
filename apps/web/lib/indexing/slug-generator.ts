import { getTokenMetadata } from "./alchemy-client";

/**
 * Generate a unique slug from token name or contract address
 */
export async function generateSlug(contractAddress: string): Promise<{
  slug: string;
  tokenName: string | null;
  tokenSymbol: string | null;
}> {
  try {
    const metadata = await getTokenMetadata(contractAddress);

    if (metadata.name) {
      // Use token name to generate slug
      const baseSlug = metadata.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const uniqueSuffix = contractAddress.slice(0, 8);
      const slug = `${baseSlug}-${uniqueSuffix}`;

      return {
        slug,
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
      };
    }
  } catch (error) {
    console.error("Failed to fetch token metadata, using address-based slug");
  }

  // Fallback to contract address
  return {
    slug: `contract-${contractAddress.slice(0, 10)}`,
    tokenName: null,
    tokenSymbol: null,
  };
}

/**
 * Ensure slug is unique for a user
 */
export function makeUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  let slug = baseSlug;
  let counter = 2;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
