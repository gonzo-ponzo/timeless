from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_async_session
from .schemas import GetServiceSchema, GetComplexSchema

from .services import ServiceService


services_api_router = APIRouter(prefix="/services")


"""RECORD API SECTION"""


@services_api_router.get("/")
async def get_services(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetServiceSchema]:
    """Get all services"""
    service_service = ServiceService(db=db)
    services = await service_service.get_services()
    return services


@services_api_router.get("/complexes")
async def get_complexes(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetComplexSchema]:
    """Get all complexes"""
    service_service = ServiceService(db=db)
    services = await service_service.get_complexes()
    return services
