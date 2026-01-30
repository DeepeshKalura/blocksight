import enum
import uuid

from pydantic import EmailStr, HttpUrl
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# Dao 

class DAOStatus(str, enum.Enum):
    PENDING = "PENDING"
    INDEXING = "INDEXING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class DAOBase(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    logo_url: str | None = Field(default=None, max_length=255)
    contract_address: str = Field(unique=True, index=True, max_length=255)
    chain: str = Field(default="Ethereum", max_length=100)
    status: DAOStatus = Field(default=DAOStatus.PENDING)
    description: str | None = Field(default=None) 
    
    # Social links as a JSONB field
    social_links: dict[str, HttpUrl] | None = Field(default=None, sa_column=Column(JSONB))

    # Contract Parameters
    proposal_threshold: str | None = Field(default=None)
    votable_supply: str | None = Field(default=None)
    funding_quorum: str | None = Field(default=None)
    constitutional_quorum: str | None = Field(default=None)
    delegated_power: str | None = Field(default=None)
    proposal_delay: str | None = Field(default=None)
    voting_period: str | None = Field(default=None)

    # Other Contract Addresses
    token_address: str | None = Field(default=None, max_length=255)
    timelock_address: str | None = Field(default=None, max_length=255)

class DAOCreate(SQLModel):
    contract_address: str = Field(max_length=255)
    name: str | None = Field(default=None, max_length=255)
    logo_url: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None)

class DAOVoteBase(SQLModel):
    voter_address: str = Field(max_length=42)
    proposal_id: str = Field(max_length=255)
    support: int  # 0: against, 1: for, 2: abstain
    weight: int
    reason: str | None = Field(default=None)
    dao_id: uuid.UUID = Field(foreign_key="dao.id")


class DAOVoteCreate(DAOVoteBase):
    pass


class DAOVote(DAOVoteBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    dao: "DAO" = Relationship(back_populates="votes")


class DAOVotePublic(DAOVoteBase):
    id: uuid.UUID


class DAO(DAOBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    votes: list["DAOVote"] = Relationship(back_populates="dao", cascade_delete=True)


class DAOPublic(DAOBase):
    id: uuid.UUID
    votes: list[DAOVotePublic] = []

class DAOsPublic(SQLModel):
    data: list[DAOPublic]
    count: int