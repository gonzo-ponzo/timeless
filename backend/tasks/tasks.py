from celery import Celery
import requests
from dotenv import load_dotenv
import os
import datetime
import json
import aiohttp

app = Celery(
    __name__, broker="redis://localhost:6379/0", backend="redis://localhost:6379/0"
)
app.conf.timezone = "Europe/Moscow"

load_dotenv()
MESSAGGION_LOGIN = os.environ.get("MESSAGGION_LOGIN")
MESSAGGIO_API_KEY = os.environ.get("MESSAGGIO_API_KEY")
MESSAGGION_FROM = os.environ.get("MESSAGGION_FROM")
IP_SERVER = os.environ.get("IP_SERVER")


@app.task(name="send_sms")
def send_sms(text: str, client_phone: str, record_id: int) -> None:
    headers = {"Messaggio-Login": MESSAGGION_LOGIN}
    url = f"https://msg.messaggio.com/api/v1/send?API Key={MESSAGGIO_API_KEY}"
    data = {
        "recipients": [{"phone": client_phone[1:]}],
        "channels": ["sms"],
        "sms": {
            "from": MESSAGGION_FROM,
            "content": [
                {
                    "type": "text",
                    "text": f"Dobar dan,\nČekamo Vas danas u {text[:-3]}.\nVaš Timeless",
                }
            ],
        },
    }
    data = json.dumps(data)

    record_datetime = requests.get(
        f"http://{IP_SERVER}:8000/api/records/record-time/{record_id}"
    ).text[1:-1]
    if record_datetime == "null":
        return False
    planned_date, now = datetime_convert(record_datetime=record_datetime)

    if not (
        now - datetime.timedelta(minutes=10)
        <= planned_date
        <= now + datetime.timedelta(minutes=10)
    ):
        return "Booking canceled or changed"
    
    response = requests.post(url=url, headers=headers, data=data)
    return response.text


def datetime_convert(record_datetime: str):
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
