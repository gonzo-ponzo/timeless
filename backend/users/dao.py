import datetime
from typing import Union, Optional
from sqlalchemy import and_, select, update
from sqlalchemy.ext.asyncio import AsyncSession


from db.models import Client, User
from auth.hashing import Hasher
from .schemas import (
    GetUserSchema,
    GetClientSchema,
    UpdateClientSchema,
    UpdateUserSchema,
    NewClientSchema,
)
from config import IP_SERVER, DOMAIN
from utils.abstract.dao import DAO


class UserDAO(DAO):
    """Data Access Object for operating user info"""

    async def get_all_users(self) -> list[GetUserSchema]:
        users_query = select(User)
        result = []
        async with self.db.begin():
            users = await self.db.scalars(users_query)
            for user in users:
                users_rating_value = 0
                users_rating_count = 0
                for record in user.records:
                    for comment in record.comments:
                        if comment.rating:
                            users_rating_value += comment.rating
                            users_rating_count += 1
                if users_rating_count == 0:
                    rating = 0.0
                else:
                    rating = round(users_rating_value / users_rating_count, 1)
                result.append(
                    GetUserSchema(
                        id=user.id,
                        phone=user.phone,
                        name=user.name,
                        birthdate=user.birthday,
                        registered_at=user.registered_at,
                        experience=user.experience,
                        position=user.position,
                        image=user.image,
                        rating=rating,
                        isAdmin=user.is_admin,
                        isStaff=user.is_staff,
                        services=[i.id for i in user.services],
                    )
                )
            return result

    async def get_user_by_phone(self, user_phone) -> Union[User, None]:
        query = select(User).where(User.phone == user_phone)
        async with self.db.begin():
            user = await self.db.scalar(query)
            return user

    async def get_user_by_id(self, user_id) -> GetUserSchema:
        query = select(User).where(User.id == user_id)
        async with self.db.begin():
            user = await self.db.scalar(query)
            if not user:
                return None
            users_rating_value = 0
            users_rating_count = 0
            for record in user.records:
                for comment in record.comments:
                    if comment.rating:
                        users_rating_value += comment.rating
                        users_rating_count += 1
            if users_rating_count == 0:
                rating = 0.0
            else:
                rating = round(users_rating_value / users_rating_count, 1)
            result = GetUserSchema(
                id=user.id,
                phone=user.phone,
                name=user.name,
                birthdate=user.birthday,
                registered_at=user.registered_at,
                experience=user.experience,
                rating=rating,
                position=user.position,
                image=user.image,
                isAdmin=user.is_admin,
                isStaff=user.is_staff,
                services=[i.id for i in user.services],
            )
            return result

    async def upload_user_image(self, user_id: int, image: str):
        async with self.db.begin():
            image_path = f"https://{DOMAIN}:8000/static{image[6:]}"
            query = update(User).where(User.id == user_id).values(image=image_path)
            await self.db.execute(query)
            await self.db.commit()

    async def update_user_by_id(self, user_id: int, body: UpdateUserSchema) -> None:
        async with self.db.begin():
            if len(body.password) > 0:
                query_update = (
                    update(User)
                    .where(User.id == user_id)
                    .values(
                        name=body.name,
                        experience=body.experience,
                        position=body.position,
                        birthday=body.birthday,
                        hashed_password=Hasher.get_password_hash(body.password),
                    )
                )
            else:
                query_update = (
                    update(User)
                    .where(User.id == user_id)
                    .values(
                        name=body.name,
                        experience=body.experience,
                        position=body.position,
                        birthday=body.birthday,
                    )
                )
            await self.db.execute(query_update)
            await self.db.commit()

    async def register_new_user(self, user_phone: str, user_password: str) -> User:
        user = User(
            phone=user_phone, hashed_password=Hasher.get_password_hash(user_password)
        )
        async with self.db.begin():
            self.db.add(user)
            await self.db.flush()
            return user

    async def recover_password(self, user_phone: str, hashed_password: str):
        async with self.db.begin():
            query = (
                update(User)
                .where(User.phone == user_phone)
                .values(hashed_password=hashed_password)
            )
            await self.db.execute(query)
            await self.db.commit()


class ClientDAO(DAO):
    """Data Access Object for operating client info"""

    async def get_all_clients(self) -> list[GetClientSchema]:
        clients_query = select(Client).where(Client.id != 1)
        result = []
        async with self.db.begin():
            clients = await self.db.scalars(clients_query)
            for client in clients:
                clients_rating_value = 0
                clients_rating_count = 0
                for record in client.records:
                    for comment in record.comments:
                        if comment.rating:
                            clients_rating_value += comment.rating
                            clients_rating_count += 1
                if clients_rating_count == 0:
                    rating = 0.0
                else:
                    rating = round(clients_rating_value / clients_rating_count, 1)
                result.append(
                    GetClientSchema(
                        id=client.id,
                        phone=client.phone,
                        name=client.name,
                        birthdate=client.birthday,
                        email=client.email,
                        instagram=client.instagram,
                        telegram=client.telegram,
                        registered_at=client.registered_at,
                        image=client.image,
                        rating=rating,
                        cameFrom=client.came_from,
                        communication=client.communication,
                    )
                )
            return result

    async def register_new_client(self, client_phone: str) -> Client:
        client = Client(phone=client_phone, auth_code="00000")
        async with self.db.begin():
            self.db.add(client)
            await self.db.flush()
            return client

    async def create_new_client(self, body: NewClientSchema) -> None:
        client = Client(phone=body.phone, auth_code="00000", user_id=body.userId)
        async with self.db.begin():
            self.db.add(client)
            await self.db.flush()

    async def get_client_auth(self, client_phone: str) -> Optional[GetClientSchema]:
        query = select(Client).where(Client.phone == client_phone)
        async with self.db.begin():
            client = await self.db.scalar(query)
            if client:
                data = GetClientSchema(
                    id=client.id,
                    phone=client.phone,
                    auth_code=client.auth_code,
                    name=client.name,
                    birthday=client.birthday,
                    email=client.email,
                    instagram=client.instagram,
                    telegram=client.telegram,
                    registered_at=client.registered_at,
                    registered_by=client.user_id,
                    image=client.image,
                    cameFrom=client.came_from,
                    communication=client.communication,
                )
                return data
            else:
                return None

    async def get_client_by_phone(self, client_phone: str) -> Optional[GetClientSchema]:
        query = select(Client).where(Client.phone == client_phone)
        async with self.db.begin():
            client = await self.db.scalar(query)
            if client:
                data = GetClientSchema(
                    id=client.id,
                    phone=client.phone,
                    name=client.name,
                    birthday=client.birthday,
                    email=client.email,
                    instagram=client.instagram,
                    telegram=client.telegram,
                    registered_at=client.registered_at,
                    registered_by=client.user_id,
                    image=client.image,
                    cameFrom=client.came_from,
                    communication=client.communication,
                )
                return data
            else:
                return None

    async def get_client_by_telegram(
        self, client_telegram: str
    ) -> Optional[GetClientSchema]:
        query = select(Client).where(Client.telegram == client_telegram)
        async with self.db.begin():
            client = await self.db.scalar(query)
            if client:
                data = GetClientSchema(
                    id=client.id,
                    phone=client.phone,
                    name=client.name,
                    birthday=client.birthday,
                    email=client.email,
                    instagram=client.instagram,
                    telegram=client.telegram,
                    registered_at=client.registered_at,
                    registered_by=client.user_id,
                    image=client.image,
                    cameFrom=client.came_from,
                    communication=client.communication,
                )
                return data
            else:
                return None

    async def get_client_by_instagram(
        self, client_instagram: str
    ) -> Optional[GetClientSchema]:
        query = select(Client).where(Client.instagram == client_instagram)
        async with self.db.begin():
            client = await self.db.scalar(query)
            if client:
                data = GetClientSchema(
                    id=client.id,
                    phone=client.phone,
                    name=client.name,
                    birthday=client.birthday,
                    email=client.email,
                    instagram=client.instagram,
                    telegram=client.telegram,
                    registered_at=client.registered_at,
                    registered_by=client.user_id,
                    image=client.image,
                    cameFrom=client.came_from,
                    communication=client.communication,
                )
                return data
            else:
                return None

    async def get_client_by_id(self, client_id: int) -> GetClientSchema:
        query = select(Client).where(Client.id == client_id)
        async with self.db.begin():
            client = await self.db.scalar(query)
            if not client:
                return None
            data = GetClientSchema(
                id=client.id,
                phone=client.phone,
                name=client.name,
                birthday=client.birthday,
                email=client.email,
                instagram=client.instagram,
                telegram=client.telegram,
                registered_at=client.registered_at,
                registered_by=client.user_id,
                image=client.image,
                cameFrom=client.came_from,
                communication=client.communication,
            )
            return data

    async def upload_client_image(self, client_id: int, image: str):
        async with self.db.begin():
            image_path = f"https://{DOMAIN}:8000/static{image[6:]}"
            query = (
                update(Client).where(Client.id == client_id).values(image=image_path)
            )
            await self.db.execute(query)
            await self.db.commit()

    async def update_client_by_id(
        self, client_id: int, body: UpdateClientSchema
    ) -> None:
        async with self.db.begin():
            query_update = (
                update(Client)
                .where(Client.id == client_id)
                .values(
                    name=body.name,
                    email=body.email,
                    telegram=body.telegram,
                    instagram=body.instagram,
                    birthday=body.birthday,
                    communication=body.communication,
                )
            )
            await self.db.execute(query_update)
            await self.db.commit()

    async def set_client_auth_code(self, client_id: int, auth_code: str) -> None:
        query = update(Client).where(Client.id == client_id).values(auth_code=auth_code)
        async with self.db.begin():
            await self.db.execute(query)
