import asyncio

from .services import SmsService


async def send_sms(time: str, phone: str, record_id: int, client_id: int, delay: int):
    await asyncio.sleep(delay)
    sms_service = SmsService()
    sms_service.send_notify_with_record_start(
        text=time, client_phone=phone, record_id=record_id, client_id=client_id
    )
