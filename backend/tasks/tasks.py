from celery import Celery

from sms.services import SmsService

app = Celery(
    __name__, broker="redis://localhost:6379/0", backend="redis://localhost:6379/0"
)
app.conf.timezone = "Europe/Moscow"


@app.task(name="send_sms")
def send_sms(text: str, client_phone: str, record_id: int) -> str:
    sms_service = SmsService()
    response = sms_service.send_notify_with_record_start(
        text=text, client_phone=client_phone, record_id=record_id
    )
    return response
