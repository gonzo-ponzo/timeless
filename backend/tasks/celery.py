from celery import Celery
from dotenv import load_dotenv

app = Celery(
    __name__, broker="redis://localhost:6379/0", backend="redis://localhost:6379/0"
)
app.conf.timezone = "Europe/Moscow"
app.autodiscover_tasks(["tasks"])

if __name__ == "__main__":
    app.start()
