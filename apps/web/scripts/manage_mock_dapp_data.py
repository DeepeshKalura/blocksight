import argparse
import json
import subprocess
from pathlib import Path


WEB_DIR = Path(__file__).resolve().parents[1]
REPO_DIR = WEB_DIR.parents[1]
DATAPIPELINE_JSON = REPO_DIR / "apps/datapipeline/mock_dapp_data_final.json"
CURRENT_TS = WEB_DIR / "app/dapp/mock-dapp-data.ts"
LOGOS_DIR = WEB_DIR / "public/logos"
CANONICAL_SOURCE_JSON = WEB_DIR / "scripts/canonical-mock-dapps.json"
NFT_ANALYTICS_JSON = WEB_DIR / "scripts/nft-analytics-output.json"

HEADER = """import type { NFTAnalytics } from "@/app/types/nft";
import type {
  OverviewStats,
  TokenDistributionAnalysis,
  TransactionInsights,
  WalletWithActivity,
} from "@/app/types/result";
import type { Dao } from "./_components/DaoCard";

export interface DemoDapp extends Dao {
  dashboardData: {
    overviewStats: OverviewStats;
    aiSummary: string;
    tokenAddress: string;
    socialLinks: { website: string; twitter: string };
    walletsWithActivity: WalletWithActivity[];
    transactionInsights: TransactionInsights;
    tokenDistribution: TokenDistributionAnalysis;
    nftAnalytics: NFTAnalytics;
    contractType: string;
  };
}

"""

CANONICAL_SLUGS_BY_LOGO = {
    "/logos/tetherusdt.png": "tetherusdt",
    "/logos/usdcoinusdc.png": "usdcoinusdc",
    "/logos/wrappedetherweth.png": "wrappedetherweth",
    "/logos/uniswap-uni-logo.png": "uniswapv2router",
    "/logos/1inch-1inch-logo.png": "1inchaggregationrouterv6",
    "/logos/MetaMask-icon-fox-with-margins.svg": "metamask",
    "/logos/aross-protocol.png": "acrossprotocol",
    "/logos/0x-zrx-logo.png": "0xprotocol",
}


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def export_current_mock_dapps() -> list[dict]:
    command = [
        "pnpm",
        "dlx",
        "tsx",
        "-e",
        "import { mockDapps } from './app/dapp/mock-dapp-data.ts'; console.log(JSON.stringify(mockDapps));",
    ]
    result = subprocess.run(
        command,
        cwd=WEB_DIR,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def build_canonical_source() -> list[dict]:
    datapipeline_dapps = load_json(DATAPIPELINE_JSON)
    current_dapps = export_current_mock_dapps()

    slug_map: dict[str, dict] = {}
    for dapp in datapipeline_dapps:
        slug_map[dapp["slug"]] = dapp
    for dapp in current_dapps:
        slug_map[dapp["slug"]] = dapp

    canonical_dapps: list[dict] = []
    for logo_name in sorted(
        path.name for path in LOGOS_DIR.iterdir() if path.is_file()
    ):
        logo_path = f"/logos/{logo_name}"
        slug = CANONICAL_SLUGS_BY_LOGO.get(logo_path)
        if not slug:
            raise SystemExit(f"No canonical slug configured for logo: {logo_path}")
        dapp = slug_map.get(slug)
        if not dapp:
            raise SystemExit(f"No dapp source found for slug: {slug}")
        canonical_dapps.append(dapp)

    return canonical_dapps


def write_canonical_source() -> list[dict]:
    canonical_dapps = build_canonical_source()
    CANONICAL_SOURCE_JSON.write_text(
        json.dumps(canonical_dapps, indent=2) + "\n",
        encoding="utf-8",
    )
    return canonical_dapps


def merge_analytics_into_source(canonical_dapps: list[dict]) -> list[dict]:
    analytics_by_slug = load_json(NFT_ANALYTICS_JSON)

    merged: list[dict] = []
    for dapp in canonical_dapps:
        slug = dapp["slug"]
        merged_dapp = json.loads(json.dumps(dapp))
        analytics = analytics_by_slug.get(slug)
        if analytics:
            merged_dapp["dashboardData"]["nftAnalytics"] = sanitize_analytics(analytics)
        merged.append(merged_dapp)

    return merged


def sanitize_analytics(analytics: dict) -> dict:
    cleaned = json.loads(json.dumps(analytics))
    for collection in cleaned.get("topCollections", []):
        if collection.get("tokenType") not in {"ERC721", "ERC1155"}:
            collection["tokenType"] = "ERC721"
    for acquisition in cleaned.get("recentAcquisitions", []):
        if acquisition.get("tokenType") not in {"ERC721", "ERC1155"}:
            acquisition["tokenType"] = "ERC721"
    return cleaned


def write_typescript(dapps: list[dict]) -> None:
    body = "export const mockDapps: DemoDapp[] = " + json.dumps(dapps, indent=2) + ";\n"
    CURRENT_TS.write_text(HEADER + body, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "command",
        choices=["build-source", "merge", "build-and-merge"],
        nargs="?",
        default="build-and-merge",
    )
    args = parser.parse_args()

    if args.command == "build-source":
        dapps = write_canonical_source()
        print(f"Wrote {len(dapps)} canonical dapps to {CANONICAL_SOURCE_JSON}")
        return

    if CANONICAL_SOURCE_JSON.exists():
        canonical_dapps = load_json(CANONICAL_SOURCE_JSON)
    else:
        canonical_dapps = write_canonical_source()

    if args.command == "merge":
        merged = merge_analytics_into_source(canonical_dapps)
        write_typescript(merged)
        print(f"Merged analytics into {CURRENT_TS}")
        return

    canonical_dapps = write_canonical_source()
    merged = merge_analytics_into_source(canonical_dapps)
    write_typescript(merged)
    print(f"Built source and merged analytics into {CURRENT_TS}")


if __name__ == "__main__":
    main()
