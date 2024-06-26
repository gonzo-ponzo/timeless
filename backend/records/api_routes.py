from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import datetime
from typing import Optional

from db.session import get_async_session
from .schemas import (
    GetRecordSchema,
    UpdateRecordSchema,
    AvailableCrmRecordSchema,
    AvailableRecordSchema,
    NewRecordSchema,
    NewRecordWithRegisterSchema,
    NewComplexWithRegisterSchema,
    NewComplexSchema,
    GetRecordByTelegramSchema,
    SmsSchema,
)
from .services import RecordService

records_api_router = APIRouter(prefix="/records")


"""RECORD API SECTION"""


@records_api_router.post("/")
async def create_new_record(
    body: NewRecordSchema,
    db: AsyncSession = Depends(get_async_session),
) -> Optional[str]:
    """Create new record"""
    record_service = RecordService(db=db)
    return await record_service.create_new_record(body=body)


@records_api_router.post("/register-and-record")
async def register_and_record(
    body: NewRecordWithRegisterSchema,
    db: AsyncSession = Depends(get_async_session),
) -> Optional[str]:
    """Register new user and create record for him"""
    record_service = RecordService(db=db)
    return await record_service.create_new_record_with_register(body=body)


@records_api_router.post("/complex")
async def create_new_complex(
    body: NewComplexSchema,
    db: AsyncSession = Depends(get_async_session),
) -> Optional[str]:
    """Create new complex"""
    record_service = RecordService(db=db)
    return await record_service.create_new_complex(body=body)


@records_api_router.post("/complex-with-register")
async def create_new_complex_with_register(
    body: NewComplexWithRegisterSchema,
    db: AsyncSession = Depends(get_async_session),
) -> Optional[str]:
    """Register new user and create complex for him"""
    record_service = RecordService(db=db)
    return await record_service.create_new_complex_with_register(body=body)


@records_api_router.get("/get-available/{service_id}/{user_id}/{date}/")
async def get_available_records_by_data(
    user_id: int,
    date: datetime.date,
    db: AsyncSession = Depends(get_async_session),
) -> list[AvailableRecordSchema]:
    """Get available records for client side by date/service/user data"""
    record_service = RecordService(db=db)
    records = await record_service.get_available_records(user_id=user_id, date=date)
    return records


@records_api_router.get("/get-available-crm/{user_id}/{master_id}/{date}/")
async def get_available_crm_records_by_data(
    user_id: int,
    master_id: int,
    date: datetime.date,
    db: AsyncSession = Depends(get_async_session),
) -> list[AvailableCrmRecordSchema]:
    """Get available records for crm side by date/service/user data"""
    record_service = RecordService(db=db)
    records = await record_service.get_available_crm_records(
        user_id=user_id, master_id=master_id, date=date
    )
    return records


@records_api_router.get("/")
async def get_records(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetRecordSchema]:
    """Get all records"""
    record_service = RecordService(db=db)
    records = await record_service.get_client_records()
    return records


@records_api_router.get("/by-date/{date}")
async def get_records(
    date: datetime.date,
    db: AsyncSession = Depends(get_async_session),
) -> list[GetRecordSchema]:
    """Get all records by date"""
    record_service = RecordService(db=db)
    records = await record_service.get_client_records_by_date(date=date)
    return records


@records_api_router.get("/delete-break/{record_id}")
async def delete_break(
    record_id: int,
    db: AsyncSession = Depends(get_async_session),
) -> list[GetRecordSchema]:
    """Delete break by id"""
    record_service = RecordService(db=db)
    await record_service.delete_break(record_id=record_id)


@records_api_router.patch("/record/{recordId}/")
async def update_record_by_id(
    recordId: int,
    body: UpdateRecordSchema,
    db: AsyncSession = Depends(get_async_session),
) -> Optional[str]:
    """Update record by id"""
    record_service = RecordService(db=db)
    return await record_service.update_record_by_id(record_id=recordId, body=body)


@records_api_router.patch("/image/{recordId}/")
async def update_record_image(
    recordId: int,
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Upload image to record by id"""
    file_path = f"public/record-{recordId}.jpeg"
    avatar = await image.read()
    with open(file_path, "wb") as f:
        f.write(avatar)
    record_service = RecordService(db=db)
    await record_service.upload_record_image(record_id=recordId, image=file_path)


@records_api_router.get("/record-time/{recordId}/")
async def get_record_time(
    recordId,
    db: AsyncSession = Depends(get_async_session),
) -> str:
    record_service = RecordService(db=db)
    record_datetime = await record_service.get_record_datetime(record_id=recordId)
    return record_datetime


@records_api_router.get("/telegram/{user_telegram}/")
async def get_user_by_telegram(
    user_telegram: str, db: AsyncSession = Depends(get_async_session)
) -> list[GetRecordByTelegramSchema]:
    """Get user by telegram"""
    record_service = RecordService(db=db)
    user_records_by_telegram = await record_service.get_records_by_telegram(
        user_telegram=user_telegram
    )
    return user_records_by_telegram


@records_api_router.get("/next/")
async def get_next_records(
    db: AsyncSession = Depends(get_async_session),
) -> list[SmsSchema]:
    record_service = RecordService(db=db)
    records = await record_service.get_next_records()
    return records
