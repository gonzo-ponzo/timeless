from typing import Union, Optional
from sqlalchemy import select, update
import datetime
import pytz
import json


from db.models import Client, User, ClientsHistory
from auth.hashing import Hasher
from .schemas import (
    GetUserSchema,
    GetClientSchema,
    UpdateClientSchema,
    UpdateUserSchema,
    NewClientSchema,
    GetClientsHistorySchema,
)
from config import IP_SERVER, DOMAIN
from utils.abstract.dao import DAO


tz = pytz.timezone("Europe/Belgrade")


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
                        telegram=user.telegram,
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

    async def get_user_by_phone(self, user_phone: str) -> Union[User, None]:
        query = select(User).where(User.phone == user_phone)
        async with self.db.begin():
            user = await self.db.scalar(query)
            return user
    
    async def check_user_by_telegram(self, telegram: str) -> bool:
        query = select(User).where(User.telegram == telegram)
        async with self.db.begin():
            user = await self.db.scalar(query)
            if user:
                return True
            return False

    async def get_user_by_id(self, user_id: int) -> GetUserSchema:
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
                telegram=user.telegram,
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
            if body.password and len(body.password) > 0:
                query_update = (
                    update(User)
                    .where(User.id == user_id)
                    .values(
                        name=body.name,
                        experience=body.experience,
                        position=body.position,
                        birthday=body.birthday,
                        telegram=body.telegram,
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
                        telegram=body.telegram,
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
                        history=json.dumps(client.history),
                    )
                )
            return result

    async def register_new_client(self, client_phone: str) -> Client:
        now = datetime.datetime.now(tz)
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
        client = Client(
            phone=client_phone,
            auth_code="00000",
            history={formatted_time: "Client registered"},
        )
        async with self.db.begin():
            self.db.add(client)
            await self.db.flush()

            clients_history = ClientsHistory(
                name=f"{now.month}.{now.year}",
                client_id=client.id,
                history={formatted_time: "Client registered"},
            )
            self.db.add(clients_history)
            await self.db.flush()

            return client

    async def create_new_client(self, body: NewClientSchema) -> None:
        now = datetime.datetime.now(tz)
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
        client = Client(
            phone=body.phone,
            auth_code="00000",
            user_id=body.userId,
            history={formatted_time: "Client registered"},
        )
        async with self.db.begin():
            self.db.add(client)
            await self.db.flush()

            clients_history = ClientsHistory(
                name=f"{now.month}.{now.year}",
                client_id=client.id,
                history={formatted_time: "Client registered"},
            )
            self.db.add(clients_history)
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
                    history=json.dumps(client.history),
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
                    history=json.dumps(client.history),
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
                    history=json.dumps(client.history),
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
                    history=json.dumps(client.history),
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
                history=json.dumps(client.history),
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
        now = datetime.datetime.now(tz)
        formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
        new_history_year, new_history_month, new_history_day = formatted_date.split(
            " "
        )[0].split("-")
        client_history = {}
        history = []
        async with self.db.begin():
            client_query = select(Client).where(Client.id == client_id)
            client = await self.db.scalar(client_query)
            for key, value in client.history.items():
                if key:
                    year, month, day = key.split(" ")[0].split("-")
                    if (
                        new_history_month == month
                        or abs(int(new_history_month) - int(month)) in [1, 11]
                        and int(new_history_day) > int(day)
                    ):
                        client_history[key] = value

            if client.name != body.name:
                history.append(f"Name changed: {client.name} > {body.name}")
            if client.email != body.email:
                history.append(f"Email changed: {client.email} > {body.email}")
            if client.telegram != body.telegram:
                history.append(f"Telegram changed: {client.telegram} > {body.telegram}")
            if client.instagram != body.instagram:
                history.append(
                    f"Instagram changed: {client.instagram} > {body.instagram}"
                )
            if client.birthday != body.birthday:
                history.append(f"Birthday changed: {client.birthday} > {body.birthday}")
            history = {formatted_date: ", ".join(history)}
            query_update = (
                update(Client)
                .where(Client.id == client_id)
                .values(
                    name=body.name,
                    email=body.email,
                    telegram=body.telegram,
                    instagram=body.instagram,
                    birthday=body.birthday,
                    history={**client_history, **history},
                )
            )
            await self.db.execute(query_update)

            clients_history_query = (
                select(ClientsHistory)
                .where(ClientsHistory.client_id == client_id)
                .where(ClientsHistory.name == f"{now.month}.{now.year}")
            )
            clients_history = await self.db.scalar(clients_history_query)
            if not clients_history:
                clients_history = ClientsHistory(
                    name=f"{now.month}.{now.year}",
                    client_id=client.id,
                    history=history,
                )
                self.db.add(clients_history)
                await self.db.flush()
            else:
                update_clients_history_query = (
                    update(ClientsHistory)
                    .where(ClientsHistory.client_id == client_id)
                    .where(ClientsHistory.name == f"{now.month}.{now.year}")
                    .values(history={**clients_history.history, **history})
                )
                await self.db.execute(update_clients_history_query)
            await self.db.commit()

    async def set_client_auth_code(self, client_id: int, auth_code: str) -> None:
        now = datetime.datetime.now(tz)
        formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
        query = update(Client).where(Client.id == client_id).values(auth_code=auth_code)
        async with self.db.begin():
            await self.db.execute(query)
            client_query = select(Client).where(Client.id == client_id)
            client = await self.db.scalar(client_query)
            client_history = {}
            new_history_year, new_history_month, new_history_day = formatted_date.split(
                " "
            )[0].split("-")
            for key, value in client.history.items():
                if key:
                    year, month, day = key.split(" ")[0].split("-")
                    if (
                        new_history_month == month
                        or abs(int(new_history_month) - int(month)) in [1, 11]
                        and int(new_history_day) > int(day)
                    ):
                        client_history[key] = value
            update_client_query = (
                update(Client)
                .where(Client.id == client.id)
                .values(
                    history={
                        **client_history,
                        **{formatted_date: f"SMS code requested"},
                    }
                )
            )
            await self.db.execute(update_client_query)

    async def get_full_history(self, client_id: int) -> list[GetClientsHistorySchema]:
        async with self.db.begin():
            full_history_query = (
                select(ClientsHistory)
                .where(ClientsHistory.client_id == client_id)
                .order_by(ClientsHistory.id.desc())
            )
            data = await self.db.scalars(full_history_query)
            full_history_list = data.all()
            result = [
                GetClientsHistorySchema(
                    id=history.id,
                    name=history.name,
                    client_id=history.client_id,
                    history=json.dumps(history.history),
                )
                for history in full_history_list
            ]
            return result
