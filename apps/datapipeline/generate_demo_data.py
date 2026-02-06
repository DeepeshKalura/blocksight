import json
import ijson
import os
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any, Union, Literal
from pydantic import BaseModel, Field
import statistics

# --- CONFIGURATION ---
INPUT_FILE = '../three_days_ethereum_data.json'
OUTPUT_FILE = 'wallet_activities.json'

TARGET_PROJECTS = {
    "0xdac17f958d2ee523a2206206994597c13d831ec7": "Tether (USDT)",
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USD Coin (USDC)",
    "0x66a9893cc07d91d95644aedd05d03f95e1dba8af": "Uniswap Universal Router",
    "0x0000000000001ff3684f28c67538d4d072c22734": "0x Protocol",
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2 Router",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "Wrapped Ether (WETH)",
    "0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5": "Across Protocol",
    "0x881d40237659c251811cec9c364ef91dc08d300c": "MetaMask Swap Router",
    "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch Aggregation Router V5",
    "0x111111125421ca6dc452d289314280a0f8842a65": "1inch Aggregation Router V6"
}

TARGET_ADDRS = {k.lower(): v for k, v in TARGET_PROJECTS.items()}

# --- PYDANTIC MODELS ---

class TransferRawContract(BaseModel):
    value: str
    address: Optional[str]
    decimal: str

class TransferMetadata(BaseModel):
    blockTimestamp: str

class Transfer(BaseModel):
    blockNum: str
    uniqueId: str
    hash: str
    from_addr: str = Field(alias="from")
    to: str
    value: float
    erc721TokenId: Optional[str] = None
    erc1155Metadata: Optional[Any] = None
    tokenId: Optional[str] = None
    asset: str
    category: str
    rawContract: TransferRawContract
    metadata: TransferMetadata

class OwnedNFT(BaseModel):
    # Place holder as real data isn't available
    tokenId: str
    name: str
    description: str

class NFT(BaseModel):
    ownedNfts: List[OwnedNFT] = []
    totalCount: int = 0

class Token(BaseModel):
    address: str
    network: str
    tokenAddress: Optional[str]
    tokenBalance: str

class TokenBalanceData(BaseModel):
    tokens: List[Token]
    pageKey: Optional[Any] = None

class TokenBalance(BaseModel):
    data: TokenBalanceData

class Result(BaseModel):
    address: str
    data: Dict[str, Any] # nfts, transfers, tokenBalances

class OverviewStats(BaseModel):
    totalWallets: int
    totalTransactionVolume: float
    totalTransactions: int
    averageWalletBalance: float
    activeWallets: int
    inactiveWallets: int
    averageActivityIndex: float

class WalletWithActivity(BaseModel):
    address: str
    activityIndex: float
    transactionCount: int
    totalVolume: float
    balance: float
    lastActivityDate: Optional[str]

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
    averageTransactionSize: float
    activityIndex: float

class GasTransaction(BaseModel):
    hash: str
    gasSpent: float
    from_addr: str = Field(alias="from")
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
    # Simplified for now as matching data isn't available
    totalNFTs: int = 0
    collections: List[Any] = []

class SocialLinks(BaseModel):
    website: str
    twitter: str

class DashboardData(BaseModel):
    overviewStats: OverviewStats
    aiSummary: str
    tokenAddress: str
    socialLinks: SocialLinks
    walletsWithActivity: List[WalletWithActivity]
    transactionInsights: TransactionInsights
    tokenDistribution: TokenDistributionAnalysis
    nftAnalytics: NFTAnalytics

class DemoDapp(BaseModel):
    name: str
    contract_address: str
    dashboardData: DashboardData

# --- ANALYSIS LOGIC ---

def calculate_gini(balances):
    if not balances or sum(balances) == 0:
        return 0.0
    sorted_balances = sorted(balances)
    n = len(balances)
    total_val = sum(sorted_balances)
    index = sum((i + 1) * balance for i, balance in enumerate(sorted_balances))
    return (2 * index) / (n * total_val) - (n + 1) / n

def get_concentration_level(gini):
    if gini > 0.8: return "Very High"
    if gini > 0.6: return "High"
    if gini > 0.4: return "Moderate"
    if gini > 0.2: return "Low"
    return "Very Low"

def clean_name_for_url(name):
    import re
    return re.sub(r'[^a-zA-Z0-9]', '', name).lower()

def process_data():
    print(f"🚀 Starting advanced extraction from {INPUT_FILE}...")
    
    # Check if file exists
    path_to_open = INPUT_FILE
    if not os.path.exists(INPUT_FILE):
        INPUT_FILE_ABS = '/media/deepesh/on/work/blocksight/apps/web/public/three_days_ethereum_data.json'
        if os.path.exists(INPUT_FILE_ABS):
            path_to_open = INPUT_FILE_ABS
        else:
            print(f"❌ Input file not found: {INPUT_FILE}")
            return

    # Data structures to hold projects
    projects = {}
    for addr, name in TARGET_ADDRS.items():
        projects[name] = {
            "address": addr,
            "txs": [],
            "wallets": defaultdict(lambda: {
                "tx_count": 0,
                "incoming_count": 0,
                "outgoing_count": 0,
                "incoming_volume": 0.0,
                "outgoing_volume": 0.0,
                "total_volume": 0.0,
                "last_active": 0,
                "gas_spent": 0.0
            }),
            "timeline": defaultdict(lambda: {"volume": 0.0, "count": 0}),
            "total_gas": 0.0,
            "highest_gas_tx": None
        }

    try:
        with open(path_to_open, 'rb') as f:
            blocks = ijson.items(f, 'item')
            
            for i, block in enumerate(blocks):
                if i % 1000 == 0:
                    print(f"\rProcessing block {i}...", end="")
                
                ts = int(block.get('timestamp', 0))
                date_obj = datetime.fromtimestamp(ts, tz=timezone.utc)
                date_key = date_obj.strftime('%Y-%m-%d')
                display_date = date_obj.strftime('%b %d')
                
                block_num = block.get('number', '0')
                
                for tx in block.get('transactions', []):
                    from_addr = tx.get('from', '').lower()
                    to_addr = tx.get('to', '').lower() if tx.get('to') else ""
                    
                    if not from_addr:
                        continue
                        
                    # Target identification
                    project_name = None
                    is_outgoing = False # From user to contract
                    is_incoming = False # From contract to user
                    
                    if to_addr in TARGET_ADDRS:
                        project_name = TARGET_ADDRS[to_addr]
                        is_outgoing = True
                    elif from_addr in TARGET_ADDRS:
                        project_name = TARGET_ADDRS[from_addr]
                        is_incoming = True
                    
                    if project_name:
                        p = projects[project_name]
                        
                        # Value conversion
                        val_hex = tx.get('value', '0')
                        val_wei = int(val_hex, 16) if str(val_hex).startswith('0x') else int(val_hex)
                        val_eth = val_wei / 1e18
                        
                        # Gas calculation
                        gas_limit = int(tx.get('gas', '0'), 16) if str(tx.get('gas', '0')).startswith('0x') else int(tx.get('gas', '0'))
                        gas_price = int(tx.get('gasPrice', '0'), 16) if str(tx.get('gasPrice', '0')).startswith('0x') else int(tx.get('gasPrice', '0'))
                        gas_spent_eth = (gas_limit * gas_price) / 1e18
                        
                        # Update wallet stats
                        wallet_addr = from_addr if is_outgoing else to_addr
                        if not wallet_addr: continue
                        
                        w = p["wallets"][wallet_addr]
                        w["tx_count"] += 1
                        w["total_volume"] += val_eth
                        w["last_active"] = max(w["last_active"], ts)
                        w["gas_spent"] += gas_spent_eth
                        
                        if is_outgoing:
                            w["outgoing_count"] += 1
                            w["outgoing_volume"] += val_eth
                        else:
                            w["incoming_count"] += 1
                            w["incoming_volume"] += val_eth
                        
                        # Update timeline
                        p["timeline"][date_key]["volume"] += val_eth
                        p["timeline"][date_key]["count"] += 1
                        p["timeline"][date_key]["displayDate"] = display_date
                        
                        # Update project gas
                        p["total_gas"] += gas_spent_eth
                        if not p["highest_gas_tx"] or gas_spent_eth > p["highest_gas_tx"]["gasSpent"]:
                            p["highest_gas_tx"] = {
                                "hash": tx.get('hash'),
                                "gasSpent": gas_spent_eth,
                                "from": from_addr,
                                "to": to_addr
                            }

    except Exception as e:
        print(f"\n❌ Error: {e}")
        return

    print(f"\n\n✅ Extraction complete! Formatting results...")
    
    final_output = []
    
    for project_name, data in projects.items():
        if not data["wallets"]: continue
        
        # 1. Wallets calculation
        wallets_array = []
        max_txs = max((w["tx_count"] for w in data["wallets"].values()), default=1)
        
        for addr, stats in data["wallets"].items():
            activity_index = round(min(stats["tx_count"] / max_txs, 1.0), 2)
            # Improved mock balance: baseline (10) + net flow (incoming - outgoing) 
            # We'll use a slightly more varied baseline for better demo
            baseline = 10.0 + (hash(addr) % 100) / 10.0 
            balance = round(max(0.1, baseline + stats["incoming_volume"] - stats["outgoing_volume"]), 2)
            
            wallets_array.append(WalletWithActivity(
                address=addr,
                activityIndex=activity_index,
                transactionCount=stats["tx_count"],
                totalVolume=round(stats["total_volume"], 4),
                balance=balance,
                lastActivityDate=datetime.fromtimestamp(stats["last_active"], tz=timezone.utc).isoformat()
            ))
            
        wallets_array = sorted(wallets_array, key=lambda x: x.transactionCount, reverse=True)
        top_wallets = wallets_array[:50]
        
        # 2. Overview Stats
        total_vol = sum(w.totalVolume for w in wallets_array)
        total_txs = sum(w.transactionCount for w in wallets_array)
        avg_balance = sum(w.balance for w in wallets_array) / len(wallets_array)
        active_threshold = 2
        active_count = sum(1 for w in wallets_array if w.transactionCount >= active_threshold)
        
        overview = OverviewStats(
            totalWallets=len(wallets_array),
            totalTransactionVolume=round(total_vol, 2),
            totalTransactions=total_txs,
            averageWalletBalance=round(avg_balance, 2),
            activeWallets=active_count,
            inactiveWallets=len(wallets_array) - active_count,
            averageActivityIndex=round(sum(w.activityIndex for w in wallets_array) / len(wallets_array), 2)
        )
        
        # 3. Transaction Insights
        timeline = []
        for d, t_data in sorted(data["timeline"].items()):
            timeline.append(TimelineDataPoint(
                date=d,
                volume=round(t_data["volume"], 4),
                count=t_data["count"],
                displayDate=t_data["displayDate"]
            ))
            
        most_active_wallets = []
        for w_obj in wallets_array[:10]:
            stats = data["wallets"][w_obj.address]
            most_active_wallets.append(ActiveWallet(
                address=w_obj.address,
                transactionCount=w_obj.transactionCount,
                totalVolume=w_obj.totalVolume,
                incomingCount=stats["incoming_count"],
                outgoingCount=stats["outgoing_count"],
                averageTransactionSize=round(stats["total_volume"] / stats["tx_count"], 4) if stats["tx_count"] > 0 else 0,
                activityIndex=w_obj.activityIndex
            ))
            
        patterns = TransactionPatterns(
            totalIncoming=sum(w["incoming_count"] for w in data["wallets"].values()),
            totalOutgoing=sum(w["outgoing_count"] for w in data["wallets"].values()),
            incomingVolume=round(sum(w["incoming_volume"] for w in data["wallets"].values()), 4),
            outgoingVolume=round(sum(w["outgoing_volume"] for w in data["wallets"].values()), 4),
            averageIncomingSize=0, 
            averageOutgoingSize=0,
            internalTransactions=0,
            externalTransactions=sum(w["tx_count"] for w in data["wallets"].values()),
            internalVolume=0,
            externalVolume=round(total_vol, 4)
        )
        if patterns.totalIncoming > 0:
            patterns.averageIncomingSize = round(patterns.incomingVolume / patterns.totalIncoming, 4)
        if patterns.totalOutgoing > 0:
            patterns.averageOutgoingSize = round(patterns.outgoingVolume / patterns.totalOutgoing, 4)
            
        gas_analysis = GasAnalysis(
            totalGasSpent=round(data["total_gas"], 6),
            averageGasPerTransaction=round(data["total_gas"] / total_txs, 8) if total_txs > 0 else 0,
            estimatedCostUSD=round(data["total_gas"] * 2500, 2), 
            highestGasTransaction=GasTransaction(**data["highest_gas_tx"]) if data["highest_gas_tx"] else None
        )
        
        insights = TransactionInsights(
            timeline=timeline,
            mostActiveWallets=most_active_wallets,
            patterns=patterns,
            gasAnalysis=gas_analysis
        )
        
        # 4. Token Distribution
        balances = [w.balance for w in wallets_array]
        balances.sort(reverse=True)
        total_balance = sum(balances)
        
        whales = []
        for i, w_obj in enumerate(wallets_array[:10]):
            whales.append(WhaleWallet(
                address=w_obj.address,
                balance=w_obj.balance,
                percentageOfTotal=round((w_obj.balance / total_balance) * 100, 2) if total_balance > 0 else 0,
                rank=i + 1,
                activityIndex=w_obj.activityIndex,
                transactionCount=w_obj.transactionCount
            ))
            
        # Distribution buckets
        ranges = [
            ("0-1", 0, 1),
            ("1-10", 1, 10),
            ("10-100", 10, 100),
            ("100-1000", 100, 1000),
            ("1000+", 1000, float('inf'))
        ]
        distribution = []
        for r_name, r_min, r_max in ranges:
            bucket_wallets = [b for b in balances if r_min <= b < r_max]
            distribution.append(BalanceDistribution(
                range=r_name,
                minBalance=r_min,
                maxBalance=r_max if r_max != float('inf') else max(balances, default=0),
                count=len(bucket_wallets),
                percentage=round((len(bucket_wallets) / len(balances)) * 100, 2) if balances else 0,
                totalBalance=round(sum(bucket_wallets), 2)
            ))
            
        gini = calculate_gini(balances)
        concentration = ConcentrationMetrics(
            giniCoefficient=round(gini, 4),
            top10Percentage=round((sum(balances[:int(len(balances)*0.1)+1]) / total_balance) * 100, 2) if total_balance > 0 else 0,
            top20Percentage=round((sum(balances[:int(len(balances)*0.2)+1]) / total_balance) * 100, 2) if total_balance > 0 else 0,
            herfindahlIndex=round(sum((b/total_balance)**2 for b in balances), 6) if total_balance > 0 else 0,
            concentrationLevel=get_concentration_level(gini)
        )
        
        balance_stats = BalanceStatistics(
            totalBalance=round(total_balance, 2),
            averageBalance=round(avg_balance, 2),
            medianBalance=round(statistics.median(balances), 2) if balances else 0,
            maxBalance=round(max(balances), 2) if balances else 0,
            minBalance=round(min(balances), 2) if balances else 0,
            standardDeviation=round(statistics.stdev(balances), 2) if len(balances) > 1 else 0
        )
        
        token_dist = TokenDistributionAnalysis(
            distribution=distribution,
            whales=whales,
            concentration=concentration,
            balanceStats=balance_stats
        )
        
        # 5. Final Assembly
        clean_name = clean_name_for_url(project_name)
        dashboard = DashboardData(
            overviewStats=overview,
            aiSummary=f"{project_name} analysis reveals {len(wallets_array)} unique wallets with {total_txs} transactions. The ecosystem shows a {concentration.concentrationLevel.lower()} concentration level with a Gini coefficient of {concentration.giniCoefficient}. Recent activity highlights healthy engagement with an average activity index of {overview.averageActivityIndex}.",
            tokenAddress=data["address"],
            socialLinks=SocialLinks(website=f"https://{clean_name}.io", twitter=f"https://twitter.com/{clean_name}"),
            walletsWithActivity=top_wallets,
            transactionInsights=insights,
            tokenDistribution=token_dist,
            nftAnalytics=NFTAnalytics()
        )
        
        dapp = DemoDapp(
            name=project_name,
            contract_address=data["address"],
            dashboardData=dashboard
        )
        final_output.append(dapp.model_dump())

    # Save results
    print(f"💾 Saving to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(final_output, f, indent=2)
    print("✨ Done!")

if __name__ == "__main__":
    process_data()
