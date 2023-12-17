from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME


Base = declarative_base()
DB_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_async_engine(
    DB_URL,
    future=True,
    execution_options={"isolation_level": "AUTOCOMMIT"},
)

async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    try:
        session: AsyncSession = async_session_maker()
        yield session
    finally:
        await session.close()
