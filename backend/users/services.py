from typing import Union

from db.models import Client, User
from .dao import ClientDAO, UserDAO
from .schemas import (
    GetClientSchema,
    GetUserSchema,
    UpdateClientSchema,
    UpdateUserSchema,
    NewClientSchema,
)
from utils.abstract.service import Service


class ClientService(Service):
    async def get_all_clients(self) -> list[GetClientSchema]:
        client_dao = ClientDAO(db_session=self.db)
        clients = await client_dao.get_all_clients()
        return clients

    async def get_client_by_id(self, client_id: int) -> GetClientSchema:
        client_dao = ClientDAO(db_session=self.db)
        client: Union[Client, None] = await client_dao.get_client_by_id(
            client_id=client_id
        )
        return client

    async def get_client_auth(self, client_phone: int) -> GetClientSchema:
        client_dao = ClientDAO(db_session=self.db)
        client: Union[Client, None] = await client_dao.get_client_auth(
            client_phone=client_phone
        )
        return client

    async def get_client_by_phone(self, client_phone: int) -> GetClientSchema:
        client_dao = ClientDAO(db_session=self.db)
        client: Union[Client, None] = await client_dao.get_client_by_phone(
            client_phone=client_phone
        )
        return client

    async def get_client_by_instagram(self, client_instagram: int) -> GetClientSchema:
        client_dao = ClientDAO(db_session=self.db)
        client: Union[Client, None] = await client_dao.get_client_by_instagram(
            client_instagram=client_instagram
        )
        return client

    async def update_client_by_id(
        self, client_id: int, body: UpdateClientSchema
    ) -> None:
        client_dao = ClientDAO(db_session=self.db)
        await client_dao.update_client_by_id(client_id=client_id, body=body)

    async def set_client_auth_code(self, client_id: int, auth_code: int) -> None:
        client_dao = ClientDAO(db_session=self.db)
        await client_dao.set_client_auth_code(client_id=client_id, auth_code=auth_code)

    async def register_new_client(self, client_phone: str) -> Client:
        client_dao = ClientDAO(db_session=self.db)
        client = await client_dao.register_new_client(client_phone=client_phone)
        return client

    async def create_new_client(self, body: NewClientSchema) -> None:
        client_dao = ClientDAO(db_session=self.db)
        await client_dao.create_new_client(body=body)

    async def upload_client_image(self, client_id: int, image: str):
        client_dao = ClientDAO(db_session=self.db)
        avatar = await client_dao.upload_client_image(client_id, image)
        return avatar


class UserService(Service):
    async def get_all_users(self) -> list[GetUserSchema]:
        user_dao = UserDAO(db_session=self.db)
        users = await user_dao.get_all_users()
        return users

    async def get_user_by_phone(self, user_phone: int) -> GetUserSchema:
        user_dao = UserDAO(db_session=self.db)
        user: Union[User, None] = await user_dao.get_user_by_phone(
            user_phone=user_phone
        )
        return user

    async def update_user_by_id(self, user_id: int, body: UpdateUserSchema) -> None:
        user_dao = UserDAO(db_session=self.db)
        await user_dao.update_user_by_id(user_id=user_id, body=body)

    async def upload_user_image(self, user_id: int, image: str):
        user_dao = UserDAO(db_session=self.db)
        avatar = await user_dao.upload_user_image(user_id, image)
        return avatar

    async def get_user_by_id(self, user_id: int) -> GetUserSchema:
        user_dao = UserDAO(db_session=self.db)
        user: Union[User, None] = await user_dao.get_user_by_id(user_id=user_id)
        return user

    async def register_new_user(
        self, user_phone: str, user_password: str
    ) -> GetUserSchema:
        user_dao = UserDAO(db_session=self.db)
        user = await user_dao.register_new_user(
            user_phone=user_phone, user_password=user_password
        )
        return user

    async def recover_password(self, user_phone: str, hashed_password: str) -> None:
        user_dao = UserDAO(db_session=self.db)
        await user_dao.recover_password(
            user_phone=user_phone, hashed_password=hashed_password
        )
