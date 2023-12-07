from fastapi import APIRouter, Depends, File
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_async_session
from .schemas import GetServiceSchema

from .services import (
    _get_services,
)


services_api_router = APIRouter(prefix="/services")


"""RECORD API SECTION"""


@services_api_router.get("/")
async def get_services(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetServiceSchema]:
    """Get all services"""
    services = await _get_services(db=db)

    return services
