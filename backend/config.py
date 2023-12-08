import os

from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.environ.get("DB_HOST")
DB_PORT = int(os.environ.get("DB_PORT"))
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_URL = os.environ.get("DB_URL")

APP_PORT = os.environ.get("APP_PORT")


SECRET = os.environ.get("SECRET")
ALGORITHM = os.environ.get("ALGORITHM")
ACCESS_TOKEN_LIFETIME = int(os.environ.get("ACCESS_TOKEN_LIFETIME"))
ADMIN_AUTH = os.environ.get("ADMIN_AUTH")

MESSAGGION_LOGIN = os.environ.get("MESSAGGION_LOGIN")
MESSAGGIO_API_KEY = os.environ.get("MESSAGGIO_API_KEY")
MESSAGGION_FROM = os.environ.get("MESSAGGION_FROM")

EMAIL_LOGIN = os.environ.get("EMAIL_LOGIN")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

IP_SERVER = os.environ.get("IP_SERVER")
