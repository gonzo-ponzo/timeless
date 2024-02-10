from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import datetime
from typing import Optional

from db.session import get_async_session
from .services import SmsService
from .schemas import SmsSchema
from records.schemas import SmsSchema as NotifySchema


sms_api_router = APIRouter(prefix="/sms")


@sms_api_router.post("/")
async def update_client_history(
    body: SmsSchema,
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Add new item to client's history"""
    sms_service = SmsService(db=db)
    await sms_service.update_client_history(body=body, db=db)


@sms_api_router.post("/send")
async def update_client_history(
    body: NotifySchema,
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Add new item to client's history"""
    sms_service = SmsService(db=db)
    await sms_service.send_notify_with_record_start(
        text=body.time,
        client_id=body.client_id,
        client_phone=body.phone,
        record_id=body.record_id,
    )
