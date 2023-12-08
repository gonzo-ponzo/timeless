from abc import ABC
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession


class Service(ABC):
    def __init__(self, db: Optional[AsyncSession] = None) -> None:
        self.db = db
