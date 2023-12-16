import json
import aiohttp
import requests
import datetime

from config import MESSAGGIO_API_KEY, MESSAGGION_FROM, MESSAGGION_LOGIN, IP_SERVER


class SmsService:
    def __init__(self) -> None:
        self.headers = {"Messaggio-Login": MESSAGGION_LOGIN}
        self.url = f"https://msg.messaggio.com/api/v1/send?API Key={MESSAGGIO_API_KEY}"

    async def send_auth_code_with_sms(self, auth_code: str, client_phone: str) -> None:
        content = f"Dobar dan,\nVaš autorizacioni kod {auth_code}.\nVaš Timeless"
        data = self.get_data(client_phone=client_phone, content=content)
        async with aiohttp.ClientSession() as session:
            await session.post(url=self.url, data=data, headers=self.headers)

    async def send_new_password(self, user_phone: str, password: str):
        content = f"Dobar dan,\nVaš новый пароль {password}.\nVaš Timeless"
        data = self.get_data(client_phone=user_phone, content=content)
        async with aiohttp.ClientSession() as session:
            await session.post(url=self.url, data=data, headers=self.headers)

    def send_notify_with_record_start(
        self, text: str, client_phone: str, record_id: int
    ) -> str:
        content = f"Dobar dan,\nČekamo Vas danas u {text[:-3]}.\nVaš Timeless"
        data = self.get_data(client_phone=client_phone, content=content)
        record_datetime = requests.get(
            f"http://{IP_SERVER}:8000/api/records/record-time/{record_id}"
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

    def get_data(client_phone: str, content: str) -> dict:
        data = {
            "recipients": [{"phone": client_phone[1:]}],
            "channels": ["sms"],
            "sms": {
                "from": MESSAGGION_FROM,
                "content": [
                    {
                        "type": "text",
                        "text": content,
                    }
                ],
            },
        }
        data = json.dumps(data)
        return data
