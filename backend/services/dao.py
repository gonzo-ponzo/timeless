from sqlalchemy import select

from db.models import Service
from .schemas import GetServiceSchema
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
