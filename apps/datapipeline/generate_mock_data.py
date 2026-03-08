"""
Mock Data Generator for Web3 Analytics Dashboard

Generates realistic mock blockchain data from Ethereum blocks.
Filters to only include projects that have logo images available.

Usage:
    uv run python generate_mock_data.py

Output:
    mock_dapp_data_final.json
"""

import json
import ijson
import os
import random
import hashlib
from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
import statistics

# --- CONFIGURATION ---
INPUT_FILE = "../../data/three_days_ethereum_data.json"
OUTPUT_FILE = "mock_dapp_data_final.json"

# Separate TOKENS from ROUTERS - they need different logic
TOKEN_CONTRACTS = {
    "0xdac17f958d2ee523a2206206994597c13d831ec7": {
        "name": "Tether (USDT)",
        "symbol": "USDT",
        "decimals": 6,
        "total_supply": 83_000_000_000,  # 83 billion
        "type": "stablecoin",
    },
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
        "name": "USD Coin (USDC)",
        "symbol": "USDC",
        "decimals": 6,
        "total_supply": 42_000_000_000,  # 42 billion
        "type": "stablecoin",
    },
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
        "name": "Wrapped Ether (WETH)",
        "symbol": "WETH",
        "decimals": 18,
        "total_supply": 12_000_000,  # 12 million ETH
        "type": "wrapped_asset",
    },
}

ROUTER_CONTRACTS = {
    "0x66a9893cc07d91d95644aedd05d03f95e1dba8af": {
        "name": "Uniswap Universal Router",
        "type": "router",
    },
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": {
        "name": "Uniswap V2 Router",
        "type": "router",
    },
    "0x881d40237659c251811cec9c364ef91dc08d300c": {
        "name": "MetaMask Swap Router",
        "type": "router",
    },
    "0x1111111254eeb25477b68fb85ed929f73a960582": {
        "name": "1inch Aggregation Router V5",
        "type": "router",
    },
    "0x111111125421ca6dc452d289314280a0f8842a65": {
        "name": "1inch Aggregation Router V6",
        "type": "router",
    },
    "0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5": {
        "name": "Across Protocol",
        "type": "bridge",
    },
    "0x0000000000001ff3684f28c67538d4d072c22734": {
        "name": "0x Protocol",
        "type": "router",
    },
}

ALL_CONTRACTS = {**TOKEN_CONTRACTS, **ROUTER_CONTRACTS}
TARGET_ADDRS = {k.lower(): v for k, v in ALL_CONTRACTS.items()}

# --- PYDANTIC MODELS ---


class WalletWithActivity(BaseModel):
    address: str
    activityIndex: float
    transactionCount: int
    totalVolume: float  # In token units or ETH equivalent
    incomingVolume: float
    outgoingVolume: float
    incomingCount: int
    outgoingCount: int
    balance: float  # Only meaningful for tokens
    lastActivityDate: str  # ISO string, NOT new Date()


class TimelineDataPoint(BaseModel):
    date: str
    volume: float
    count: int
    displayDate: str


class ActiveWallet(BaseModel):
    address: str
    transactionCount: int
    totalVolume: float
    incomingCount: int
    outgoingCount: int
    incomingVolume: float
    outgoingVolume: float
    averageTransactionSize: float
    activityIndex: float


class GasTransaction(BaseModel):
    hash: str
    gasSpent: float
    from_address: str
    to: str


class GasAnalysis(BaseModel):
    totalGasSpent: float
    averageGasPerTransaction: float
    estimatedCostUSD: float
    highestGasTransaction: Optional[GasTransaction]


class TransactionPatterns(BaseModel):
    totalIncoming: int
    totalOutgoing: int
    incomingVolume: float
    outgoingVolume: float
    averageIncomingSize: float
    averageOutgoingSize: float
    internalTransactions: int
    externalTransactions: int
    internalVolume: float
    externalVolume: float


class TransactionInsights(BaseModel):
    timeline: List[TimelineDataPoint]
    mostActiveWallets: List[ActiveWallet]
    patterns: TransactionPatterns
    gasAnalysis: GasAnalysis


class BalanceDistribution(BaseModel):
    range: str
    minBalance: float
    maxBalance: float
    count: int
    percentage: float
    totalBalance: float


class WhaleWallet(BaseModel):
    address: str
    balance: float
    percentageOfTotal: float
    rank: int
    activityIndex: float
    transactionCount: int


class ConcentrationMetrics(BaseModel):
    giniCoefficient: float
    top10Percentage: float
    top20Percentage: float
    herfindahlIndex: float
    concentrationLevel: Literal["Very High", "High", "Moderate", "Low", "Very Low"]


class BalanceStatistics(BaseModel):
    totalBalance: float
    averageBalance: float
    medianBalance: float
    maxBalance: float
    minBalance: float
    standardDeviation: float


class TokenDistributionAnalysis(BaseModel):
    distribution: List[BalanceDistribution]
    whales: List[WhaleWallet]
    concentration: ConcentrationMetrics
    balanceStats: BalanceStatistics


class NFTAnalytics(BaseModel):
    topCollections: List[Any] = []
    adoption: Dict[str, Any] = {}
    spamAnalysis: Dict[str, Any] = {}
    recentAcquisitions: List[Any] = []
    diversityMetrics: Dict[str, Any] = {}


class SocialLinks(BaseModel):
    website: str
    twitter: str


class OverviewStats(BaseModel):
    totalWallets: int
    totalTransactionVolume: float
    totalTransactions: int
    averageWalletBalance: float
    activeWallets: int
    inactiveWallets: int
    averageActivityIndex: float


class DashboardData(BaseModel):
    overviewStats: OverviewStats
    aiSummary: str
    tokenAddress: str
    socialLinks: SocialLinks
    walletsWithActivity: List[WalletWithActivity]
    transactionInsights: TransactionInsights
    tokenDistribution: TokenDistributionAnalysis
    nftAnalytics: NFTAnalytics
    contractType: str  # NEW: "token", "router", or "bridge"


class DemoDapp(BaseModel):
    id: str
    name: str
    logo_url: str = ""
    chain: str = "Ethereum"
    contract_address: str
    description: str = ""
    slug: str = ""
    status: str = "COMPLETED"
    dashboardData: DashboardData


# --- HELPER FUNCTIONS ---


def calculate_gini(balances):
    if not balances or sum(balances) == 0:
        return 0.0
    sorted_balances = sorted(balances)
    n = len(balances)
    total_val = sum(sorted_balances)
    index = sum((i + 1) * balance for i, balance in enumerate(sorted_balances))
    return (2 * index) / (n * total_val) - (n + 1) / n


def get_concentration_level(gini):
    if gini > 0.8:
        return "Very High"
    if gini > 0.6:
        return "High"
    if gini > 0.4:
        return "Moderate"
    if gini > 0.2:
        return "Low"
    return "Very Low"


def generate_realistic_balance(address: str, contract_info: dict, rank: int) -> float:
    """
    Generate realistic balance based on contract type and wallet rank.

    For stablecoins (USDT, USDC):
    - Top 1-10: $10M - $5B (whales, exchanges, treasuries)
    - Top 11-100: $100K - $10M
    - Others: $1 - $100K

    For WETH:
    - Top 1-10: 1,000 - 100,000 ETH
    - Top 11-100: 10 - 1,000 ETH
    - Others: 0.01 - 10 ETH
    """
    contract_type = contract_info.get("type", "token")
    total_supply = contract_info.get("total_supply", 1_000_000_000)

    # Use address hash for deterministic randomness
    hash_val = int(hashlib.md5(address.encode()).hexdigest(), 16)

    if contract_type == "stablecoin":
        if rank <= 10:
            # Top 10 hold 0.1% - 5% of supply each
            pct = 0.001 + (hash_val % 1000) / 10000 * 0.049
            return total_supply * pct
        elif rank <= 100:
            # Next 90 hold 0.001% - 0.1% of supply
            pct = 0.00001 + (hash_val % 1000) / 10000 * 0.00099
            return total_supply * pct
        else:
            # Regular wallets: $1 - $100K
            return 1 + (hash_val % 100000)

    elif contract_type == "wrapped_asset":  # WETH
        if rank <= 10:
            # Top 10: 1,000 - 100,000 ETH
            return 1000 + (hash_val % 99000)
        elif rank <= 100:
            # Next 90: 10 - 1,000 ETH
            return 10 + (hash_val % 990)
        else:
            # Regular: 0.01 - 10 ETH
            return 0.01 + (hash_val % 1000) / 100

    return 10 + (hash_val % 1000) / 10  # Default fallback


def estimate_gas_used(gas_limit_hex):
    """Estimate actual gas used from gas limit."""
    gas_limit = (
        int(gas_limit_hex, 16)
        if str(gas_limit_hex).startswith("0x")
        else int(gas_limit_hex)
    )
    if gas_limit > 1_000_000:
        gas_limit = 200_000
    estimated_used = int(gas_limit * 0.9)
    return max(estimated_used, 21_000)


def generate_mock_token_transfer(contract_info: dict) -> float:
    """
    Generate realistic token transfer amount.
    For stablecoins: $100 - $1M typical
    For WETH: 0.1 - 100 ETH typical
    """
    contract_type = contract_info.get("type", "token")

    if contract_type == "stablecoin":
        # Log-normal distribution: mostly $100-$10K, some up to $1M
        base = random.lognormvariate(8, 1.5)  # Mean ~$3K
        return min(base, 10_000_000)  # Cap at $10M

    elif contract_type == "wrapped_asset":
        # WETH: 0.1 - 100 ETH
        base = random.lognormvariate(1, 1)  # Mean ~2.7 ETH
        return min(base, 1000)  # Cap at 1000 ETH

    return random.uniform(0.1, 1000)


# --- MAIN PROCESSING ---


def process_data():
    print(f"🚀 Starting V3 extraction from {INPUT_FILE}...")

    if not os.path.exists(INPUT_FILE):
        print(f"❌ Input file not found: {INPUT_FILE}")
        return

    # Data structures
    projects = {}
    for addr, info in TARGET_ADDRS.items():
        projects[info["name"]] = {
            "address": addr,
            "info": info,
            "wallets": defaultdict(
                lambda: {
                    "tx_count": 0,
                    "incoming_count": 0,
                    "outgoing_count": 0,
                    "incoming_volume": 0.0,
                    "outgoing_volume": 0.0,
                    "total_volume": 0.0,
                    "last_active": 0,
                    "gas_spent": 0.0,
                }
            ),
            "timeline": defaultdict(lambda: {"volume": 0.0, "count": 0}),
            "total_gas": 0.0,
            "highest_gas_tx": None,
        }

    try:
        with open(INPUT_FILE, "rb") as f:
            blocks = ijson.items(f, "item")

            for i, block in enumerate(blocks):
                if i % 1000 == 0:
                    print(f"\rProcessing block {i}...", end="")

                ts = int(block.get("timestamp", 0))
                date_obj = datetime.fromtimestamp(ts, tz=timezone.utc)
                date_key = date_obj.strftime("%Y-%m-%d")
                display_date = date_obj.strftime("%b %d")

                for tx in block.get("transactions", []):
                    from_addr = tx.get("from", "").lower()
                    to_addr = tx.get("to", "").lower() if tx.get("to") else ""

                    if not from_addr:
                        continue

                    # Identify project
                    project_name = None
                    is_outgoing = False
                    is_incoming = False

                    if to_addr in TARGET_ADDRS:
                        project_name = TARGET_ADDRS[to_addr]["name"]
                        is_outgoing = True
                    elif from_addr in TARGET_ADDRS:
                        project_name = TARGET_ADDRS[from_addr]["name"]
                        is_incoming = True

                    if project_name:
                        p = projects[project_name]
                        contract_info = p["info"]

                        # Generate realistic token transfer amount
                        # (In real data, we'd decode the Transfer event from logs)
                        token_amount = generate_mock_token_transfer(contract_info)

                        # Gas calculation
                        gas_limit = tx.get("gas", "0")
                        gas_price_hex = tx.get("gasPrice", "0")
                        gas_price = (
                            int(gas_price_hex, 16)
                            if str(gas_price_hex).startswith("0x")
                            else int(gas_price_hex)
                        )
                        gas_used = estimate_gas_used(gas_limit)
                        gas_spent_eth = (gas_used * gas_price) / 1e18

                        # Update wallet
                        wallet_addr = from_addr if is_outgoing else to_addr
                        if not wallet_addr:
                            continue

                        w = p["wallets"][wallet_addr]
                        w["tx_count"] += 1
                        w["total_volume"] += token_amount
                        w["last_active"] = max(w["last_active"], ts)
                        w["gas_spent"] += gas_spent_eth

                        if is_outgoing:
                            w["outgoing_count"] += 1
                            w["outgoing_volume"] += token_amount
                        else:
                            w["incoming_count"] += 1
                            w["incoming_volume"] += token_amount

                        # Update timeline
                        p["timeline"][date_key]["volume"] += token_amount
                        p["timeline"][date_key]["count"] += 1
                        p["timeline"][date_key]["displayDate"] = display_date

                        # Update gas
                        p["total_gas"] += gas_spent_eth
                        if (
                            not p["highest_gas_tx"]
                            or gas_spent_eth > p["highest_gas_tx"]["gasSpent"]
                        ):
                            p["highest_gas_tx"] = {
                                "hash": tx.get("hash"),
                                "gasSpent": gas_spent_eth,
                                "from_address": from_addr,
                                "to": to_addr,
                            }

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()
        return

    print(f"\n\n✅ Extraction complete! Formatting results...")

    final_output = []

    for project_name, data in projects.items():
        if not data["wallets"]:
            continue

        contract_info = data["info"]
        contract_type = contract_info.get("type", "token")
        is_token = contract_type in ["stablecoin", "wrapped_asset"]

        # 1. Build wallet array
        wallets_list = list(data["wallets"].items())

        # Sort by transaction count for activity ranking
        wallets_list.sort(key=lambda x: x[1]["tx_count"], reverse=True)

        # Assign ranks
        wallet_ranks = {addr: i + 1 for i, (addr, _) in enumerate(wallets_list)}

        wallets_array = []
        max_txs = max((w["tx_count"] for w in data["wallets"].values()), default=1)

        for addr, stats in wallets_list:
            activity_index = round(min(stats["tx_count"] / max_txs, 1.0), 2)
            rank = wallet_ranks[addr]

            # Generate realistic balance for tokens only
            if is_token:
                balance = generate_realistic_balance(addr, contract_info, rank)
            else:
                # Routers don't have balances
                balance = 0.0

            wallets_array.append(
                WalletWithActivity(
                    address=addr,
                    activityIndex=activity_index,
                    transactionCount=stats["tx_count"],
                    totalVolume=round(stats["total_volume"], 2),
                    incomingVolume=round(stats["incoming_volume"], 2),
                    outgoingVolume=round(stats["outgoing_volume"], 2),
                    incomingCount=stats["incoming_count"],
                    outgoingCount=stats["outgoing_count"],
                    balance=round(balance, 2),
                    lastActivityDate=datetime.fromtimestamp(
                        stats["last_active"], tz=timezone.utc
                    ).isoformat(),
                )
            )

        # 2. Overview Stats
        total_vol = sum(w.totalVolume for w in wallets_array)
        total_txs = sum(w.transactionCount for w in wallets_array)

        # For tokens, use actual balances; for routers, use 0
        if is_token:
            total_balance = sum(w.balance for w in wallets_array)
            avg_balance = total_balance / len(wallets_array) if wallets_array else 0
        else:
            total_balance = 0
            avg_balance = 0

        active_threshold = 2
        active_count = sum(
            1 for w in wallets_array if w.transactionCount >= active_threshold
        )

        overview = OverviewStats(
            totalWallets=len(wallets_array),
            totalTransactionVolume=round(total_vol, 2),
            totalTransactions=total_txs,
            averageWalletBalance=round(avg_balance, 2),
            activeWallets=active_count,
            inactiveWallets=len(wallets_array) - active_count,
            averageActivityIndex=round(
                sum(w.activityIndex for w in wallets_array) / len(wallets_array), 2
            )
            if wallets_array
            else 0,
        )

        # 3. Transaction Insights
        timeline = [
            TimelineDataPoint(
                date=d,
                volume=round(t_data["volume"], 2),
                count=t_data["count"],
                displayDate=t_data["displayDate"],
            )
            for d, t_data in sorted(data["timeline"].items())
        ]

        most_active_wallets = [
            ActiveWallet(
                address=w.address,
                transactionCount=w.transactionCount,
                totalVolume=w.totalVolume,
                incomingCount=w.incomingCount,
                outgoingCount=w.outgoingCount,
                incomingVolume=w.incomingVolume,
                outgoingVolume=w.outgoingVolume,
                averageTransactionSize=round(w.totalVolume / w.transactionCount, 2)
                if w.transactionCount > 0
                else 0,
                activityIndex=w.activityIndex,
            )
            for w in wallets_array[:10]
        ]

        incoming_sum = sum(w.incomingVolume for w in wallets_array)
        outgoing_sum = sum(w.outgoingVolume for w in wallets_array)

        patterns = TransactionPatterns(
            totalIncoming=total_txs,
            totalOutgoing=total_txs,
            incomingVolume=round(incoming_sum, 2),
            outgoingVolume=round(outgoing_sum, 2),
            averageIncomingSize=round(incoming_sum / total_txs, 2)
            if total_txs > 0
            else 0,
            averageOutgoingSize=round(outgoing_sum / total_txs, 2)
            if total_txs > 0
            else 0,
            internalTransactions=0,
            externalTransactions=total_txs,
            internalVolume=0,
            externalVolume=round(total_vol, 2),
        )

        gas_analysis = GasAnalysis(
            totalGasSpent=round(data["total_gas"], 6),
            averageGasPerTransaction=round(data["total_gas"] / total_txs, 8)
            if total_txs > 0
            else 0,
            estimatedCostUSD=round(data["total_gas"] * 2500, 2),
            highestGasTransaction=GasTransaction(**data["highest_gas_tx"])
            if data["highest_gas_tx"]
            else None,
        )

        insights = TransactionInsights(
            timeline=timeline,
            mostActiveWallets=most_active_wallets,
            patterns=patterns,
            gasAnalysis=gas_analysis,
        )

        # 4. Token Distribution (only for tokens)
        if is_token:
            wallets_by_balance = sorted(
                wallets_array, key=lambda x: x.balance, reverse=True
            )
            balances = [w.balance for w in wallets_array]
            balances.sort(reverse=True)

            # Whales
            whales = []
            for i, w_obj in enumerate(wallets_by_balance[:10]):
                whales.append(
                    WhaleWallet(
                        address=w_obj.address,
                        balance=w_obj.balance,
                        percentageOfTotal=round(
                            (w_obj.balance / total_balance) * 100, 2
                        )
                        if total_balance > 0
                        else 0,
                        rank=i + 1,
                        activityIndex=w_obj.activityIndex,
                        transactionCount=w_obj.transactionCount,
                    )
                )

            # Distribution buckets - adjusted for realistic ranges
            if contract_type == "stablecoin":
                ranges = [
                    ("0 - 100", 0, 100),
                    ("100 - 1K", 100, 1000),
                    ("1K - 10K", 1000, 10000),
                    ("10K - 100K", 10000, 100000),
                    ("100K - 1M", 100000, 1000000),
                    ("1M - 10M", 1000000, 10000000),
                    ("10M+", 10000000, float("inf")),
                ]
            else:  # WETH
                ranges = [
                    ("0 - 0.1", 0, 0.1),
                    ("0.1 - 1", 0.1, 1),
                    ("1 - 10", 1, 10),
                    ("10 - 100", 10, 100),
                    ("100 - 1000", 100, 1000),
                    ("1000+", 1000, float("inf")),
                ]

            distribution = []
            for r_name, r_min, r_max in ranges:
                bucket_wallets = [b for b in balances if r_min <= b < r_max]
                if bucket_wallets:  # Only add non-empty buckets
                    distribution.append(
                        BalanceDistribution(
                            range=r_name,
                            minBalance=r_min,
                            maxBalance=r_max
                            if r_max != float("inf")
                            else max(balances),
                            count=len(bucket_wallets),
                            percentage=round(
                                (len(bucket_wallets) / len(balances)) * 100, 2
                            )
                            if balances
                            else 0,
                            totalBalance=round(sum(bucket_wallets), 2),
                        )
                    )

            # Concentration
            gini = calculate_gini(balances)
            top_10_count = max(1, int(len(balances) * 0.1))
            top_20_count = max(1, int(len(balances) * 0.2))
            top_10_balance = sum(balances[:top_10_count])
            top_20_balance = sum(balances[:top_20_count])
            hhi = (
                sum((b / total_balance) ** 2 for b in balances)
                if total_balance > 0
                else 0
            )

            concentration = ConcentrationMetrics(
                giniCoefficient=round(gini, 4),
                top10Percentage=round((top_10_balance / total_balance) * 100, 2)
                if total_balance > 0
                else 0,
                top20Percentage=round((top_20_balance / total_balance) * 100, 2)
                if total_balance > 0
                else 0,
                herfindahlIndex=round(hhi, 6),
                concentrationLevel=get_concentration_level(gini),
            )

            balance_stats = BalanceStatistics(
                totalBalance=round(total_balance, 2),
                averageBalance=round(avg_balance, 2),
                medianBalance=round(statistics.median(balances), 2) if balances else 0,
                maxBalance=round(max(balances), 2) if balances else 0,
                minBalance=round(min(balances), 2) if balances else 0,
                standardDeviation=round(statistics.stdev(balances), 2)
                if len(balances) > 1
                else 0,
            )
        else:
            # Empty distribution for routers
            whales = []
            distribution = []
            concentration = ConcentrationMetrics(
                giniCoefficient=0,
                top10Percentage=0,
                top20Percentage=0,
                herfindahlIndex=0,
                concentrationLevel="Very Low",  # Routers don't have concentration
            )
            balance_stats = BalanceStatistics(
                totalBalance=0,
                averageBalance=0,
                medianBalance=0,
                maxBalance=0,
                minBalance=0,
                standardDeviation=0,
            )

        token_dist = TokenDistributionAnalysis(
            distribution=distribution,
            whales=whales,
            concentration=concentration,
            balanceStats=balance_stats,
        )

        # 5. NFT Analytics
        nft_analytics = NFTAnalytics(
            topCollections=[],
            adoption={
                "walletsWithNFTs": 0,
                "walletsWithoutNFTs": len(wallets_array),
                "adoptionRate": 0.0,
                "totalNFTs": 0,
            },
            spamAnalysis={"totalSpam": 0, "totalLegitimate": 0, "spamPercentage": 0},
            recentAcquisitions=[],
            diversityMetrics={"uniqueCollections": 0, "averageCollectionsPerWallet": 0},
        )

        # 6. Generate AI summary with actual numbers
        if is_token:
            ai_summary = f"{project_name} analysis reveals {len(wallets_array):,} unique wallets with {total_txs:,} transactions totaling {total_vol:,.2f} tokens transferred. The average transaction size is {patterns.averageIncomingSize:,.2f} tokens. The top whale holds {whales[0].balance:,.2f} tokens ({whales[0].percentageOfTotal}% of tracked supply). Wealth concentration is {concentration.concentrationLevel.lower()} with a Gini coefficient of {concentration.giniCoefficient}."
        else:
            ai_summary = f"{project_name} is a {contract_type} contract with {len(wallets_array):,} unique interacting wallets and {total_txs:,} total transactions. Total volume routed: {total_vol:,.2f} tokens. Average gas cost per transaction: {gas_analysis.averageGasPerTransaction:.6f} ETH (${gas_analysis.averageGasPerTransaction * 2500:.2f})."

        # 7. Social links
        clean_name = "".join(c for c in project_name if c.isalnum()).lower()
        if "usdt" in clean_name.lower():
            social = SocialLinks(
                website="https://tether.to", twitter="https://x.com/tether"
            )
        elif "usdc" in clean_name.lower():
            social = SocialLinks(
                website="https://circle.com/usdc", twitter="https://x.com/circle"
            )
        elif "weth" in clean_name.lower():
            social = SocialLinks(
                website="https://weth.io", twitter="https://x.com/ethereum"
            )
        elif "uniswap" in clean_name.lower():
            social = SocialLinks(
                website="https://uniswap.org", twitter="https://x.com/uniswap"
            )
        else:
            social = SocialLinks(
                website=f"https://{clean_name}.io",
                twitter=f"https://x.com/{clean_name}",
            )

        dashboard = DashboardData(
            overviewStats=overview,
            aiSummary=ai_summary,
            tokenAddress=data["address"],
            socialLinks=social,
            walletsWithActivity=wallets_array[:50],
            transactionInsights=insights,
            tokenDistribution=token_dist,
            nftAnalytics=nft_analytics,
            contractType=contract_type,
        )

        dapp = DemoDapp(
            id=data["address"],
            name=project_name,
            logo_url=f"/logos/{clean_name}.png",
            chain="Ethereum",
            contract_address=data["address"],
            description=f"A {contract_type} contract on Ethereum."
            if not is_token
            else f"A {contract_type} on Ethereum.",
            slug=clean_name,
            status="COMPLETED",
            dashboardData=dashboard,
        )
        final_output.append(dapp.model_dump())

    # Save results
    print(f"💾 Saving to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w") as f:
        json.dump(final_output, f, indent=2, default=str)

    print("✨ Done!")
    print(f"\n📊 Summary:")
    for dapp in final_output:
        name = dapp["name"]
        wallets = dapp["dashboardData"]["overviewStats"]["totalWallets"]
        txs = dapp["dashboardData"]["overviewStats"]["totalTransactions"]
        vol = dapp["dashboardData"]["overviewStats"]["totalTransactionVolume"]
        cType = dapp["dashboardData"]["contractType"]
        print(
            f"  {name} ({cType}): {wallets:,} wallets, {txs:,} txs, {vol:,.2f} volume"
        )


if __name__ == "__main__":
    random.seed(42)  # For reproducibility
    process_data()
