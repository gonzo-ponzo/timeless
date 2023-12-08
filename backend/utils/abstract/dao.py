from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession


class DAO(ABC):
    """Data Access Object for operating model info"""

    def __init__(self, db_session: Optional[AsyncSession] = None) -> None:
        self.db: AsyncSession = db_session
