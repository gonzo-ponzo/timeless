from sqlalchemy.ext.asyncio import AsyncSession

from .dao import ServiceDAO
from .schemas import GetServiceSchema


async def _get_services(db: AsyncSession) -> list[GetServiceSchema]:
    service_dao = ServiceDAO(db_session=db)
    services = await service_dao.get_services()
    return services
