from typing import Union
from sqlalchemy.ext.asyncio import AsyncSession
import json
import aiohttp

from config import MESSAGGIO_API_KEY, MESSAGGION_FROM, MESSAGGION_LOGIN
from db.models import Client, User
from .dao import ClientDAO, UserDAO
from .schemas import (
    GetClientSchema,
    GetUserSchema,
    UpdateClientSchema,
    UpdateUserSchema,
    NewClientSchema,
)


"""CLIENT SECTION"""


async def _get_all_clients(db: AsyncSession) -> list[GetClientSchema]:
    client_dao = ClientDAO(db_session=db)
    clients = await client_dao.get_all_clients()
    return clients


async def _get_client_by_id(client_id: int, db: AsyncSession) -> GetClientSchema:
    client_dao = ClientDAO(db_session=db)
    client: Union[Client, None] = await client_dao.get_client_by_id(client_id=client_id)
    return client


async def _get_client_auth(client_phone: int, db: AsyncSession) -> GetClientSchema:
    client_dao = ClientDAO(db_session=db)
    client: Union[Client, None] = await client_dao.get_client_auth(
        client_phone=client_phone
    )
    return client


async def _get_client_by_phone(client_phone: int, db: AsyncSession) -> GetClientSchema:
    client_dao = ClientDAO(db_session=db)
    client: Union[Client, None] = await client_dao.get_client_by_phone(
        client_phone=client_phone
    )
    return client


async def _get_client_by_instagram(
    client_instagram: int, db: AsyncSession
) -> GetClientSchema:
    client_dao = ClientDAO(db_session=db)
    client: Union[Client, None] = await client_dao.get_client_by_instagram(
        client_instagram=client_instagram
    )
    return client


async def _get_client_by_telegram(
    client_telegram: int, db: AsyncSession
) -> GetClientSchema:
    client_dao = ClientDAO(db_session=db)
    client: Union[Client, None] = await client_dao.get_client_by_telegram(
        client_telegram=client_telegram
    )
    return client


async def _update_client_by_id(
    client_id: int, body: UpdateClientSchema, db: AsyncSession
) -> None:
    client_dao = ClientDAO(db_session=db)
    await client_dao.update_client_by_id(client_id=client_id, body=body)


async def _set_client_auth_code(
    client_id: int, auth_code: int, db: AsyncSession
) -> None:
    client_dao = ClientDAO(db_session=db)
    await client_dao.set_client_auth_code(client_id=client_id, auth_code=auth_code)


async def _send_auth_code_with_sms(auth_code: str, client_phone: str):
    headers = {"Messaggio-Login": MESSAGGION_LOGIN}
    url = f"https://msg.messaggio.com/api/v1/send?API Key={MESSAGGIO_API_KEY}"
    data = {
        "recipients": [{"phone": client_phone}],
        "channels": ["sms"],
        "sms": {
            "from": MESSAGGION_FROM,
            "content": [
                {
                    "type": "text",
                    "text": f"Dobar dan,\nVaš autorizacioni kod {auth_code}.\nVaš Timeless",
                }
            ],
        },
    }
    data = json.dumps(data)

    async with aiohttp.ClientSession() as session:
        await session.post(url, data=data, headers=headers)


async def _register_new_client(client_phone: str, db: AsyncSession) -> Client:
    client_dao = ClientDAO(db_session=db)
    client = await client_dao.register_new_client(client_phone=client_phone)
    return client


async def _create_new_client(body: NewClientSchema, db: AsyncSession) -> None:
    client_dao = ClientDAO(db_session=db)
    await client_dao.create_new_client(body=body)


async def _upload_client_image(client_id: int, image: str, db: AsyncSession):
    client_dao = ClientDAO(db_session=db)
    avatar = await client_dao.upload_client_image(client_id, image)
    return avatar


"""USER SECTION"""


async def _get_all_users(db: AsyncSession) -> list[GetUserSchema]:
    user_dao = UserDAO(db_session=db)
    users = await user_dao.get_all_users()
    return users


async def _get_user_by_phone(user_phone: int, db: AsyncSession) -> GetUserSchema:
    user_dao = UserDAO(db_session=db)
    user: Union[User, None] = await user_dao.get_user_by_phone(user_phone=user_phone)
    return user


async def _update_user_by_id(
    user_id: int, body: UpdateUserSchema, db: AsyncSession
) -> None:
    user_dao = UserDAO(db_session=db)
    await user_dao.update_user_by_id(user_id=user_id, body=body)


async def _upload_user_image(user_id: int, image: str, db: AsyncSession):
    user_dao = UserDAO(db_session=db)
    avatar = await user_dao.upload_user_image(user_id, image)
    return avatar


async def _get_user_by_id(user_id: int, db: AsyncSession) -> GetUserSchema:
    user_dao = UserDAO(db_session=db)
    user: Union[User, None] = await user_dao.get_user_by_id(user_id=user_id)
    return user


async def _register_new_user(user_phone: str, user_password: str, db: AsyncSession):
    user_dao = UserDAO(db_session=db)
    user = await user_dao.register_new_user(
        user_phone=user_phone, user_password=user_password
    )
    return user
