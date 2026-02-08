import json
import ijson
import os
from collections import defaultdict
from datetime import datetime, timezone

# CONFIGURATION
INPUT_FILE = '../three_days_ethereum_data.json'
OUTPUT_FILE = 'wallet_activities.json'

# Target contracts from material.ipynb
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

# Normalize addresses to lowercase
TARGET_ADDRS = {k.lower(): v for k, v in TARGET_PROJECTS.items()}

def extract_activities():
    print(f"🚀 Starting extraction from {INPUT_FILE}...")
    
    # Per project data
    project_data = defaultdict(lambda: {
        "txs": [],
        "wallets": defaultdict(lambda: {
            "tx_count": 0,
            "volume": 0.0,
            "net_flow": 0.0,
            "last_active": 0
        }),
        "total_volume": 0.0,
        "total_txs": 0
    })
    
    try:
        # Check if file exists
        path_to_open = INPUT_FILE
        if not os.path.exists(INPUT_FILE):
             INPUT_FILE_ABS = '/media/deepesh/on/work/blocksight/apps/web/public/three_days_ethereum_data.json'
             if os.path.exists(INPUT_FILE_ABS):
                 path_to_open = INPUT_FILE_ABS
             else:
                 print(f"❌ Input file not found: {INPUT_FILE}")
                 return

        with open(path_to_open, 'rb') as f:
            blocks = ijson.items(f, 'item')
            
            for i, block in enumerate(blocks):
                if i % 1000 == 0:
                    print(f"\rProcessing block {i}...", end="")
                
                ts = int(block.get('timestamp', 0))
                
                for tx in block.get('transactions', []):
                    to_addr_raw = tx.get('to')
                    from_addr_raw = tx.get('from')
                    
                    if not from_addr_raw:
                        continue
                        
                    to_addr = to_addr_raw.lower() if to_addr_raw else ""
                    from_addr = from_addr_raw.lower()
                    
                    # Track projects
                    target_project = None
                    if to_addr in TARGET_ADDRS:
                        target_project = TARGET_ADDRS[to_addr]
                    
                    if target_project:
                        # Value conversion
                        val_wei = int(tx.get('value', '0'), 16) if str(tx.get('value', '0')).startswith('0x') else int(tx.get('value', '0'))
                        val_eth = val_wei / 1e18
                        
                        p = project_data[target_project]
                        p["total_txs"] += 1
                        p["total_volume"] += val_eth
                        
                        # Wallet stats
                        w = p["wallets"][from_addr]
                        w["tx_count"] += 1
                        w["volume"] += val_eth
                        w["net_flow"] -= val_eth # Simplified: basic tx sender loses eth
                        w["last_active"] = max(w["last_active"], ts)
                        
                        # Add transaction to list (limit to recent)
                        if len(p["txs"]) < 100:
                            p["txs"].append({
                                "hash": tx.get('hash'),
                                "from": from_addr,
                                "to": to_addr,
                                "value": val_eth,
                                "timestamp": ts
                            })
                            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return

    print(f"\n\n✅ Extraction complete!")
    
    # Format into DemoDapp structure
    final_output = []
    
    for project_name, data in project_data.items():
        # Find contract address for this project
        contract_addr = next((k for k, v in TARGET_PROJECTS.items() if v == project_name), "0x")
        
        # Calculate wallet metrics
        wallets_array = []
        max_txs = max((w["tx_count"] for w in data["wallets"].values()), default=1)
        
        for addr, stats in data["wallets"].items():
            # Activity Index: normalize based on max txs in this project
            activity_index = min(stats["tx_count"] / max_txs, 1.0)
            
            # Balance estimation: Net flow + some baseline to avoid negative/zero in demo
            # In real dapp, balance is current stake/token balance.
            # We'll use a mock baseline + net flow.
            estimated_balance = max(0.1, 10.0 + stats["net_flow"]) 
            
            wallets_array.append({
                "address": addr,
                "activityIndex": round(activity_index, 2),
                "transactionCount": stats["tx_count"],
                "totalVolume": round(stats["volume"], 4),
                "balance": round(estimated_balance, 2),
                "lastActivityDate": datetime.fromtimestamp(stats["last_active"], tz=timezone.utc).isoformat()
            })
            
        # Sort wallets by activity
        wallets_array = sorted(wallets_array, key=lambda x: x["transactionCount"], reverse=True)
        
        # Overview Stats
        active_threshold = 2 # arbitrary
        active_count = sum(1 for w in wallets_array if w["transactionCount"] >= active_threshold)
        
        project_entry = {
            "name": project_name,
            "contract_address": contract_addr,
            "dashboardData": {
                "overviewStats": {
                    "totalWallets": len(data["wallets"]),
                    "totalTransactionVolume": round(data["total_volume"], 2),
                    "totalTransactions": data["total_txs"],
                    "averageWalletBalance": round(sum(w["balance"] for w in wallets_array) / max(1, len(wallets_array)), 2),
                    "activeWallets": active_count,
                    "inactiveWallets": len(wallets_array) - active_count,
                    "averageActivityIndex": round(sum(w["activityIndex"] for w in wallets_array) / max(1, len(wallets_array)), 2)
                },
                "walletsWithActivity": wallets_array[:50] # Top 50 active wallets
            }
        }
        final_output.append(project_entry)

    # Save results
    print(f"💾 Saving to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(final_output, f, indent=2)
    print("✨ Done!")

if __name__ == "__main__":
    extract_activities()
