from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import datetime
from typing import Optional

from db.session import get_async_session
from .services import SmsService
from .schemas import SmsSchema


sms_api_router = APIRouter(prefix="/sms")


@sms_api_router.post("/")
async def update_client_history(
    body: SmsSchema,
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Add new item to client's history"""
    sms_service = SmsService()
    await sms_service.update_client_history(body=body, db=db)
