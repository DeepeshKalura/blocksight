from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import crud
from app.api import deps
from app.models import DAOVoteCreate, User

router = APIRouter()


class IndexerVoteData(DAOVoteCreate):
    dao_contract_address: str


@router.post("/dao-vote")
def receive_dao_vote(
    *, session: Session = Depends(deps.get_db), vote_in: IndexerVoteData
) -> None:
    """
    Receive DAO vote data from the indexer.
    This endpoint also creates a user profile if the voter is new.
    """
    dao = crud.dao.get_by_contract_address(
        session=session, contract_address=vote_in.dao_contract_address
    )
    if not dao:
        raise HTTPException(
            status_code=404,
            detail="DAO not found.",
        )

    voter_address = vote_in.voter_address
    user = crud.get_user_by_wallet_address(session=session, wallet_address=voter_address)
    if not user:
        user = User(wallet_address=voter_address, is_active=True)
        session.add(user)
        session.commit()
        session.refresh(user)

    vote_create = DAOVoteCreate.model_validate(vote_in)
    vote_create.dao_id = dao.id
    crud.dao_vote.create_dao_vote(session=session, dao_vote_in=vote_create)