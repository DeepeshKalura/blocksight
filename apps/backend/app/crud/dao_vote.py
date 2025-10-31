from app.crud.dao import create_dao
from sqlmodel import Session

from app.models import DAOVote, DAOVoteCreate


def create_dao_vote(*, session: Session, dao_vote_in: DAOVoteCreate) -> DAOVote:
    db_obj = DAOVote.model_validate(dao_vote_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj
