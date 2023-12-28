from .dao import ServiceDAO
from .schemas import GetServiceSchema, GetComplexSchema
from utils.abstract.service import Service


class ServiceService(Service):
    async def get_services(self) -> list[GetServiceSchema]:
        service_dao = ServiceDAO(db_session=self.db)
        services = await service_dao.get_services()
        return services

    async def get_complexes(self) -> list[GetComplexSchema]:
        service_dao = ServiceDAO(db_session=self.db)
        complexes = await service_dao.get_complexes()
        return complexes
