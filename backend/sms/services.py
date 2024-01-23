import json
import aiohttp
import requests
import datetime
import pytz
from sqlalchemy.ext.asyncio import AsyncSession

from config import SMS_API_KEY, IP_SERVER, DOMAIN
from .schemas import SmsSchema
from .dao import SmsDAO


tz = pytz.timezone("Europe/Belgrade")


class SmsService:
    def __init__(self) -> None:
        self.headers = {
            "Authorization": f"Bearer {SMS_API_KEY}",
            "Content-Type": "application/json",
        }
        self.url = f"https://api.sms.to/sms/send"
        self.server = f"https://{IP_SERVER}:8000/api/sms"

    async def update_client_history(self, body: SmsSchema, db: AsyncSession):
        sms_dao = SmsDAO(db_session=db)
        await sms_dao.update_client_history(body=body)

    async def send_auth_code_with_sms(
        self, auth_code: str, client_phone: str, client_id: int
    ) -> None:
        content = f"Dobar dan,\nVaš autorizacioni kod {auth_code}.\nVaš Timeless"
        body = SmsSchema(text=content, client_id=client_id)
        data = self.get_data(client_phone=client_phone, content=content)
        async with aiohttp.ClientSession() as session:
            await session.post(url=self.url, data=data, headers=self.headers)
            await session.post(
                self.server, data={"text": body.text, "client_id": body.client_id}
            )

    async def send_new_password(self, user_phone: str, password: str):
        content = f"Dobar dan,\nVaš nova lozinka {password}.\nVaš Timeless"
        data = self.get_data(client_phone=user_phone, content=content)
        async with aiohttp.ClientSession() as session:
            await session.post(url=self.url, data=data, headers=self.headers)

    def send_notify_with_record_start(
        self, text: str, client_phone: str, record_id: int, client_id: int
    ) -> str:
        client = requests.get(
            f"https://{DOMAIN}:8000/api/clients/client/{client_id}"
        ).json()
        client_history = client["history"]
        now = datetime.datetime.now(tz)
        formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
        for key in client_history.keys():
            if key.startswith(f"{formatted_date.split(' ')[0]}") and client_history[
                key
            ].startswith("SMS"):
                return

        client = requests.get(
            f"https://{DOMAIN}:8000/api/clients/client/{client_id}"
        ).json()

        content = f"Dobar dan,\nČekamo Vas danas u {text[:-3]}.\nVaš Timeless"
        body = SmsSchema(text=content, client_id=client_id)
        data = self.get_data(client_phone=client_phone, content=content)
        record_datetime = requests.get(
            f"https://{DOMAIN}:8000/api/records/record-time/{record_id}"
        ).text[1:-1]
        if record_datetime == "null":
            return "Error with datetime"
        planned_date, now = self.datetime_convert(record_datetime=record_datetime)

        if not (
            now - datetime.timedelta(minutes=10)
            <= planned_date
            <= now + datetime.timedelta(minutes=10)
        ):
            return "Booking canceled or changed"
        requests.post(self.server, data=body)
        response = requests.post(url=self.url, headers=self.headers, data=data)
        return response.text

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
            "message": content,
            "to": client_phone,
            "bypass_optout": True,
            "sender_id": "Salonium",
        }
        data = json.dumps(data)
        return data
