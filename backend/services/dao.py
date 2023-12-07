from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Service
from .schemas import GetServiceSchema


class ServiceDAO:
    """Data Access Object for operating service info"""

    def __init__(self, db_session: AsyncSession):
        self.db: AsyncSession = db_session

    async def get_services(self) -> list[GetServiceSchema]:
        query = select(Service)
        async with self.db.begin():
            data = await self.db.scalars(query)
            records = [
                GetServiceSchema(
                    id=object.id,
                    name=object.name,
                    price=object.price,
                    duration=object.duration,
                )
                for object in data
            ]
            return records
