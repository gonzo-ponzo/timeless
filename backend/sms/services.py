import json
import aiohttp
import requests
import datetime
import pytz
from sqlalchemy.ext.asyncio import AsyncSession

from config import SMS_API_KEY, IP_SERVER, DOMAIN, SMS_ID
from .schemas import SmsSchema
from .dao import SmsDAO


tz = pytz.timezone("Europe/Belgrade")


class SmsService:
    def __init__(self, db) -> None:
        self.headers = {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        }
        self.url = f"https://portal.bulkgate.com/api/1.0/simple/transactional"
        self.server = f"https://{DOMAIN}:8000/api/sms"
        self.db = db

    async def update_client_history(self, body: SmsSchema, db: AsyncSession):
        sms_dao = SmsDAO(db_session=db)
        await sms_dao.update_client_history(body=body)

    async def send_auth_code_with_sms(
        self, auth_code: str, client_phone: str, client_id: int
    ) -> None:
        content = f"Dobar dan,\nVaš autorizacioni kod {auth_code}.\nVaš Timeless"
        body = SmsSchema(text="Auth code requested", client_id=client_id)
        data = self.get_data(client_phone=client_phone, content=content)
        async with aiohttp.ClientSession() as session:
            await session.post(url=self.url, data=data, headers=self.headers)
            await self.update_client_history(body=body, db=self.db)

    async def send_new_password(self, user_phone: str, password: str):
        content = f"Dobar dan,\nVaš nova lozinka {password}.\nVaš Timeless"
        data = self.get_data(client_phone=user_phone, content=content)
        async with aiohttp.ClientSession() as session:
            await session.post(url=self.url, data=data, headers=self.headers)

    async def send_notify_with_record_start(
        self, text: str, client_phone: str, record_id: int, client_id: int
    ) -> str:
        content = f"Dobar dan,\nČekamo Vas danas u {str(text)[:-3]}.\nVaš Timeless"
        data = self.get_data(client_phone=client_phone, content=content)
        body = SmsSchema(text=f"SMS:{content}", client_id=client_id)
        async with aiohttp.ClientSession() as session:
            await self.update_client_history(body=body, db=self.db)
            await session.post(url=self.url, data=data, headers=self.headers)

    def datetime_convert(self, record_datetime: str):
        date = record_datetime.split(" ")[0]
        time = record_datetime.split(" ")[1]

        year = int(date.split("-")[0])
        month = int(date.split("-")[1])
        day = int(date.split("-")[2])
        hour = int(time.split(":")[0])
        minute = int(time.split(":")[1])

        now = datetime.datetime.now() + datetime.timedelta(hours=1)
        planned_date = datetime.datetime(
            year=year, month=month, day=day, hour=hour, minute=minute
        ) - datetime.timedelta(hours=1)

        return planned_date, now

    def get_data(self, client_phone: str, content: str) -> dict:
        data = {
            "application_id": SMS_ID,
            "application_token": SMS_API_KEY,
            "number": client_phone[1:],
            "text": content,
            "unicode": True,
            "sender_id": "gText",
            "sender_id_value": "BulkGate",
        }
        data = json.dumps(data)
        return data
