from sqlalchemy.ext.asyncio import AsyncSession
import datetime
import aiohttp
import json

from config import MESSAGGIO_API_KEY, MESSAGGION_FROM, MESSAGGION_LOGIN, IP_SERVER
from .dao import RecordDAO
from .schemas import (
    GetRecordSchema,
    UpdateRecordSchema,
    AvailableRecordSchema,
    AvailableCrmRecordSchema,
    NewRecordSchema,
    NewRecordWithRegisterSchema,
)


async def _get_client_records(db: AsyncSession) -> list[GetRecordSchema]:
    record_dao = RecordDAO(db_session=db)
    records = await record_dao.get_client_records()
    return records


async def _update_record_by_id(
    record_id: int, body: UpdateRecordSchema, db: AsyncSession
) -> None:
    record_dao = RecordDAO(db_session=db)
    await record_dao.update_record_by_id(record_id=record_id, body=body)


async def _upload_record_image(record_id: int, image: str, db: AsyncSession):
    record_dao = RecordDAO(db_session=db)
    avatar = await record_dao.upload_record_image(record_id=record_id, image=image)
    return avatar


async def _cancel_record(record_id: int, db: AsyncSession):
    record_dao = RecordDAO(db_session=db)
    avatar = await record_dao.cancel_record(record_id=record_id)
    return avatar


async def _get_available_records(
    user_id: int, date: datetime.time, db: AsyncSession
) -> list[AvailableRecordSchema]:
    record_dao = RecordDAO(db_session=db)
    records = await record_dao.get_available_records(user_id=user_id, date=date)
    return records


async def _get_available_crm_records(
    user_id: int, master_id: int, date: datetime.time, db: AsyncSession
) -> list[AvailableCrmRecordSchema]:
    record_dao = RecordDAO(db_session=db)
    records = await record_dao.get_available_crm_records(
        user_id=user_id, master_id=master_id, date=date
    )
    return records


async def _create_new_record(body: NewRecordSchema, db: AsyncSession) -> None:
    record_dao = RecordDAO(db_session=db)
    await record_dao.create_new_record(body=body)


async def _create_new_record_with_register(
    body: NewRecordWithRegisterSchema, db: AsyncSession
) -> None:
    record_dao = RecordDAO(db_session=db)
    await record_dao.create_new_record_with_register(body=body)


async def get_record_datetime(record_id: int, db: AsyncSession) -> str:
    record_dao = RecordDAO(db_session=db)
    result = await record_dao.get_record_time(record_id=record_id)
    return result
