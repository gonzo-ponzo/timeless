from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt
import random
from auth.hashing import Hasher
from typing import Optional


from db.session import get_async_session
from .schemas import (
    PhoneSchema,
    VerifyPhoneSchema,
    UserLoginSchema,
    GetUserSchema,
    GetClientSchema,
    UpdateClientSchema,
    GetUserSchema,
    UpdateUserSchema,
    NewClientSchema,
)

from .services import ClientService, UserService
from sms.services import SmsService
from config import ALGORITHM, SECRET, ACCESS_TOKEN_LIFETIME


users_api_router = APIRouter(prefix="/users")
clients_api_router = APIRouter(prefix="/clients")


"""CLIENTS SECTION"""


@clients_api_router.post("/register/")
async def create_new_client(
    body: NewClientSchema, db: AsyncSession = Depends(get_async_session)
) -> None:
    """Create new client"""
    client_service = ClientService(db=db)
    await client_service.create_new_client(body=body)


@clients_api_router.post("/auth-code")
async def auth_code(
    data: PhoneSchema, db: AsyncSession = Depends(get_async_session)
) -> PhoneSchema:
    """Send auth code to client, register if not exist"""
    client_service = ClientService(db=db)
    sms_service = SmsService()
    phone = data.phone
    client = await client_service.get_client_by_phone(client_phone=phone)
    if not client:
        client = await client_service.register_new_client(client_phone=phone)
    auth_code = str(random.randint(10000, 99999))
    await client_service.set_client_auth_code(client_id=client.id, auth_code=auth_code)
    await sms_service.send_auth_code_with_sms(auth_code=auth_code, client_phone=phone)

    return PhoneSchema(phone=phone)


@clients_api_router.post("/login")
async def login_client(
    data: VerifyPhoneSchema, db: AsyncSession = Depends(get_async_session)
) -> Optional[dict]:
    """Get tokens for login"""
    client_service = ClientService(db=db)
    phone = data.phone
    client = await client_service.get_client_auth(client_phone=phone)
    if client.auth_code == data.code:
        data = {"sub": phone}
        jwt_token: str = jwt.encode(data, SECRET, algorithm=ALGORITHM)
        return {
            "clientId": client.id,
            "clientPhone": phone,
            "clientToken": f"Bearer {jwt_token}",
            "clientExpiresIn": ACCESS_TOKEN_LIFETIME,
        }


@clients_api_router.get("/client/phone/{client_phone}/")
async def get_client_by_phone(
    client_phone: str, db: AsyncSession = Depends(get_async_session)
) -> GetClientSchema:
    """Get client by phone"""
    client_service = ClientService(db=db)
    client = await client_service.get_client_by_phone(client_phone=client_phone)
    return client


@clients_api_router.get("/client/instagram/{client_instagram}/")
async def get_client_by_instagram(
    client_instagram: str, db: AsyncSession = Depends(get_async_session)
) -> GetClientSchema:
    """Get client by instagram"""
    client_service = ClientService(db=db)
    client = await client_service.get_client_by_instagram(
        client_instagram=client_instagram
    )
    return client


@clients_api_router.get("/client/telegram/{client_telegram}/")
async def get_client_by_telegram(
    client_telegram: str, db: AsyncSession = Depends(get_async_session)
) -> GetClientSchema:
    """Get client by telegram"""
    client_service = ClientService(db=db)
    client = await client_service.get_client_by_telegram(
        client_telegram=client_telegram
    )
    return client


@clients_api_router.get("/")
async def get_all_clients(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetClientSchema]:
    """Get all clients"""
    client_service = ClientService(db=db)
    clients = await client_service.get_all_clients()
    return clients


@clients_api_router.get("/client/{client_id}/")
async def get_client_by_id(
    client_id: int, db: AsyncSession = Depends(get_async_session)
) -> GetClientSchema:
    """Get client by id"""
    client_service = ClientService(db=db)
    client = await client_service.get_client_by_id(client_id=client_id)
    return client


@clients_api_router.patch("/client/{clientId}/")
async def update_client_by_id(
    clientId: int,
    body: UpdateClientSchema,
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Update client by id"""
    client_service = ClientService(db=db)
    await client_service.update_client_by_id(client_id=clientId, body=body)


@clients_api_router.patch("/image/{clientId}/")
async def update_client_image(
    clientId: int,
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Upload image to client by id"""
    client_service = ClientService(db=db)
    file_path = f"public/client-{clientId}.jpeg"
    avatar = await image.read()
    with open(file_path, "wb") as f:
        f.write(avatar)

    await client_service.upload_client_image(client_id=clientId, image=file_path)


"""USER SECTION"""


@users_api_router.post("/login")
async def login_user(
    data: UserLoginSchema, db: AsyncSession = Depends(get_async_session)
) -> Optional[dict]:
    """Send tokens for login, register if not exist"""
    user_service = UserService(db=db)
    phone = data.phone
    password = data.password
    user = await user_service.get_user_by_phone(user_phone=phone)
    if user:
        if Hasher.verify_password(password, user.hashed_password):
            data = {"sub": phone}
            jwt_token: str = jwt.encode(data, SECRET, algorithm=ALGORITHM)
            return {
                "userId": user.id,
                "userPhone": phone,
                "userToken": f"Bearer {jwt_token}",
                "userExpiresIn": ACCESS_TOKEN_LIFETIME,
                "isAdmin": user.is_admin,
            }
        return None
    user = await user_service.register_new_user(
        user_phone=phone, user_password=password
    )
    data = {"sub": phone}
    jwt_token: str = jwt.encode(data, SECRET, algorithm=ALGORITHM)
    return {
        "userId": user.id,
        "userPhone": phone,
        "userToken": f"Bearer {jwt_token}",
        "userExpiresIn": ACCESS_TOKEN_LIFETIME,
        "isAdmin": user.is_admin,
    }


@users_api_router.get("/")
async def get_all_users(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetUserSchema]:
    """Get all users"""
    user_service = UserService(db=db)
    users = await user_service.get_all_users()
    return users


@users_api_router.get("/user/{user_id}/")
async def get_user_by_id(
    user_id: int, db: AsyncSession = Depends(get_async_session)
) -> GetUserSchema:
    """Get user by id"""
    user_service = UserService(db=db)
    user = await user_service.get_user_by_id(user_id=user_id)
    return user


@users_api_router.patch("/image/{userId}/")
async def update_user_image(
    userId: int,
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Upload image to user by id"""
    user_service = UserService(db=db)
    file_path = f"public/user-{userId}.jpeg"
    avatar = await image.read()
    with open(file_path, "wb") as f:
        f.write(avatar)

    await user_service.upload_user_image(user_id=userId, image=file_path)


@users_api_router.patch("/user/{userId}/")
async def update_user_by_id(
    userId: int,
    body: UpdateUserSchema,
    db: AsyncSession = Depends(get_async_session),
) -> None:
    """Update user biy id"""
    user_service = UserService(db=db)
    await user_service.update_user_by_id(user_id=userId, body=body)


""""""
