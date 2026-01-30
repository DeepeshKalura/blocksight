import sys
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import logging
from sqlmodel import Session, select
from app.core.db import engine
from app.models import DAO, DAOStatus


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the initial DAOs to be seeded
INITIAL_DAOS = [
    {
        "name": "Karratco DAO",
        "logo_url": "/logos/karrat.png",
        "description": "Committed to building and supporting a vibrant gaming, entertainment, and AI ecosystem for developers.",
        "contract_address": "0x9746378f28a5e61efa4fc1a3ac5fc178b96474e5",
        "token_address": "0xAcd2c239012D17BEB128B0944D49015104113650",
        "timelock_address": "0x5Fe284B1D135a901DF3D9798E70E15E4F0056c99",
        "chain": "Ethereum",
        "status": DAOStatus.COMPLETED,
        "proposal_threshold": "100000",
        "votable_supply": "720190000",
        "funding_quorum": "21610000",
        "constitutional_quorum": "36010000",
        "delegated_power": "57400000",
        "proposal_delay": "3.75 days",
        "voting_period": "2 weeks",
        "social_links": {
            "website": "https://karratcoin.com/",
            "twitter": "https://x.com/karratcoin"
        }
    },
    {
        "name": "Balancer DAO",
        "logo_url": "/logos/balancer.png",
        "description": "The ultimate platform for custom liquidity solutions. Balancer v3 perfectly balances simplicity and flexibility to reshape the future of AMMs.",
        "contract_address": "0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f",
        "token_address": "0xba100000625a3754423978a60c9317c58a424e3D",
        "timelock_address": "0xEE1c75A2480221389725f46254783103c2742616",
        "chain": "Ethereum",
        "status": DAOStatus.PENDING,
        "social_links": {
            "website": "https://balancer.fi/",
            "twitter": "https://x.com/balancer",
            "discord": "http://discord.balancer.fi"
        }
    }
]

def seed_initial_daos(session: Session) -> None:
    """
    Seeds the database with an initial set of DAOs.
    """
    logger.info("Seeding initial DAO data...")
    
    for dao_data in INITIAL_DAOS:
        statement = select(DAO).where(DAO.contract_address == dao_data["contract_address"])
        existing_dao = session.exec(statement).first()
        
        if not existing_dao:
            logger.info(f"Creating DAO: {dao_data['name']}")
            dao = DAO(**dao_data)
            session.add(dao)
        else:
            logger.info(f"DAO '{dao_data['name']}' already exists, skipping.")
            
    session.commit()
    logger.info("DAO seeding complete.")

def main() -> None:
    logger.info("Creating initial DAO data")
    with Session(engine) as session:
        seed_initial_daos(session)
    logger.info("Initial DAO data created")

if __name__ == "__main__":
    main()