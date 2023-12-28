from sqlalchemy import select

from db.models import Service, Complex
from .schemas import GetServiceSchema, GetComplexSchema
from utils.abstract.dao import DAO


class ServiceDAO(DAO):
    """Data Access Object for operating service info"""

    async def get_services(self) -> list[GetServiceSchema]:
        query = select(Service)
        async with self.db.begin():
            data = await self.db.scalars(query)
            records = [
                GetServiceSchema(
                    id=object.id,
                    ru=object.name,
                    en=object.en_name,
                    sr=object.sr_name,
                    price=object.price,
                    duration=object.duration,
                )
                for object in data
            ]
            return records

    async def get_complexes(self) -> list[GetComplexSchema]:
        query = select(Complex)
        async with self.db.begin():
            data = await self.db.scalars(query)
            complexes = [
                GetComplexSchema(
                    id=object.id,
                    ru=object.name,
                    en=object.en_name,
                    sr=object.sr_name,
                    services=[
                        GetServiceSchema(
                            id=service.id,
                            ru=service.name,
                            en=service.en_name,
                            sr=service.sr_name,
                            price=service.price,
                            duration=service.duration,
                        )
                        for service in object.services
                    ],
                )
                for object in data
            ]
            return complexes
