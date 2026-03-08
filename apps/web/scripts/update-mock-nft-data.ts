import * as fs from "fs";
import * as path from "path";

// Read the generated NFT analytics
const analyticsPath = path.join(process.cwd(), "scripts", "nft-analytics-output.json");
const analytics = JSON.parse(fs.readFileSync(analyticsPath, "utf-8"));

// Read the mock-dapp-data.ts file
const mockDataPath = path.join(process.cwd(), "app", "dapp", "mock-dapp-data.ts");
let mockData = fs.readFileSync(mockDataPath, "utf-8");

// The empty nftAnalytics block that exists in the original file
const emptyNftAnalytics = `nftAnalytics: {
        topCollections: [],
        adoption: {
          walletsWithNFTs: 0,
          walletsWithoutNFTs: 55,
          adoptionRate: 0.0,
          totalNFTs: 0,
          totalLegitimateNFTs: 0,
          averageNFTsPerWallet: 0.0,
          averageLegitimateNFTsPerWallet: 0.0,
        },
        spamAnalysis: {
          totalSpam: 0,
          totalLegitimate: 0,
          spamPercentage: 0,
          walletsAffectedBySpam: 0,
          topSpamCollections: [],
        },
        recentAcquisitions: [],
        diversityMetrics: {
          uniqueCollections: 0,
          averageCollectionsPerWallet: 2.5,
          mostDiverseWallet: null,
          collectionConcentration: 0.1,
        },
      },`;

function formatTopCollection(col: any): string {
  return `{
            contractAddress: "${col.contractAddress}",
            name: "${col.name.replace(/"/g, '\\"')}",
            symbol: "${col.symbol.replace(/"/g, '\\"')}",
            tokenType: "${col.tokenType}",
            totalOwned: ${col.totalOwned},
            uniqueHolders: ${col.uniqueHolders},
            holderPercentage: ${col.holderPercentage},
            floorPrice: ${col.floorPrice},
            imageUrl: "${col.imageUrl}",
            collectionSlug: "${col.collectionSlug}",
            isSpam: ${col.isSpam},
          }`;
}

function formatSpamCollection(col: any): string {
  return `{
              name: "${col.name.replace(/"/g, '\\"')}",
              count: ${col.count},
              affectedWallets: ${col.affectedWallets},
            }`;
}

function formatNFTAnalytics(data: any): string {
  const topCollections = data.topCollections.slice(0, 5);
  const topCollectionsStr = topCollections.length > 0 
    ? topCollections.map(formatTopCollection).join(",\n          ")
    : "";

  const topSpamCollections = data.spamAnalysis.topSpamCollections.slice(0, 5);
  const topSpamStr = topSpamCollections.length > 0
    ? topSpamCollections.map(formatSpamCollection).join(",\n            ")
    : "";

  const mostDiverseWallet = data.diversityMetrics.mostDiverseWallet 
    ? `{
            address: "${data.diversityMetrics.mostDiverseWallet.address}",
            collectionCount: ${data.diversityMetrics.mostDiverseWallet.collectionCount},
          }` 
    : "null";

  return `nftAnalytics: {
        totalNFTs: ${data.adoption.totalNFTs},
        collections: [],
        topCollections: [${topCollectionsStr ? `\n          ${topCollectionsStr},\n        ` : ""}],
        adoption: {
          walletsWithNFTs: ${data.adoption.walletsWithNFTs},
          walletsWithoutNFTs: ${data.adoption.walletsWithoutNFTs},
          adoptionRate: ${data.adoption.adoptionRate},
          totalNFTs: ${data.adoption.totalNFTs},
          totalLegitimateNFTs: ${data.adoption.totalLegitimateNFTs},
          averageNFTsPerWallet: ${data.adoption.averageNFTsPerWallet},
          averageLegitimateNFTsPerWallet: ${data.adoption.averageLegitimateNFTsPerWallet},
        },
        spamAnalysis: {
          totalSpam: ${data.spamAnalysis.totalSpam},
          totalLegitimate: ${data.spamAnalysis.totalLegitimate},
          spamPercentage: ${data.spamAnalysis.spamPercentage.toFixed(2)},
          walletsAffectedBySpam: ${data.spamAnalysis.walletsAffectedBySpam},
          topSpamCollections: [${topSpamStr ? `\n            ${topSpamStr},\n          ` : ""}],
        },
        recentAcquisitions: [],
        diversityMetrics: {
          uniqueCollections: ${data.diversityMetrics.uniqueCollections},
          averageCollectionsPerWallet: ${data.diversityMetrics.averageCollectionsPerWallet},
          mostDiverseWallet: ${mostDiverseWallet},
          collectionConcentration: ${data.diversityMetrics.collectionConcentration},
        },
      },`;
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📝 UPDATING MOCK DATA WITH NFT ANALYTICS");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Slugs in order they appear in the file
const slugOrder = ["usdt", "usdc", "weth", "uniswap", "0x", "across", "metamask", "1inch"];

let replacementCount = 0;

for (const slug of slugOrder) {
  const data = (analytics as Record<string, any>)[slug];
  if (!data) {
    console.log(`⚠️  No analytics data for ${slug}`);
    continue;
  }

  console.log(`📊 Processing ${slug}...`);
  
  const formattedAnalytics = formatNFTAnalytics(data);
  
  // Find and replace the empty nftAnalytics block after this slug
  // We need to find the nftAnalytics that comes after slug: "<slug>"
  const slugMarker = `slug: "${slug}"`;
  const slugIndex = mockData.indexOf(slugMarker);
  
  if (slugIndex === -1) {
    console.log(`  ⚠️  Could not find slug marker for ${slug}`);
    continue;
  }
  
  // Find the nftAnalytics block after this slug
  const searchStart = slugIndex;
  const nftAnalyticsIndex = mockData.indexOf("nftAnalytics: {", searchStart);
  
  if (nftAnalyticsIndex === -1) {
    console.log(`  ⚠️  Could not find nftAnalytics for ${slug}`);
    continue;
  }
  
  // Find the end of this nftAnalytics block (ends with },\n    },\n  },)
  // We need to find the closing pattern
  let braceCount = 0;
  let endIndex = nftAnalyticsIndex + "nftAnalytics: ".length;
  let foundStart = false;
  
  for (let i = endIndex; i < mockData.length; i++) {
    if (mockData[i] === '{') {
      braceCount++;
      foundStart = true;
    } else if (mockData[i] === '}') {
      braceCount--;
      if (foundStart && braceCount === 0) {
        // Found the end of nftAnalytics object, include the trailing comma
        endIndex = i + 1;
        if (mockData[endIndex] === ',') endIndex++;
        break;
      }
    }
  }
  
  // Extract the old nftAnalytics block
  const oldBlock = mockData.substring(nftAnalyticsIndex, endIndex);
  
  // Replace it with the new one
  mockData = mockData.substring(0, nftAnalyticsIndex) + formattedAnalytics + mockData.substring(endIndex);
  
  console.log(`  ✓ Updated ${slug} nftAnalytics`);
  replacementCount++;
}

// Write the updated mock data
fs.writeFileSync(mockDataPath, mockData);

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Updated ${replacementCount} dApps successfully!`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
