from fastapi import APIRouter

from app.api.routes import daos, indexer
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(daos.router)
api_router.include_router(indexer.router, prefix="/indexer", tags=["indexer"])


if settings.ENVIRONMENT == "local":
    # api_router.include_router(private.router)
    pass