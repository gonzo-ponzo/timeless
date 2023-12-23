from typing import Optional
import datetime
from pydantic import BaseModel, validator


class PhoneSchema(BaseModel):
    phone: str


class VerifyPhoneSchema(BaseModel):
    phone: str
    code: str


class NewClientSchema(BaseModel):
    phone: str
    userId: int


class GetClientSchema(BaseModel):
    id: int
    phone: str
    name: Optional[str]
    birthday: Optional[datetime.date]
    email: Optional[str]
    instagram: Optional[str]
    telegram: Optional[str]
    registered_at: datetime.datetime
    registered_by: Optional[int]
    image: Optional[str]
    rating: Optional[float]
    auth_code: Optional[str]
    cameFrom: Optional[str]
    communication: bool


class UpdateClientSchema(BaseModel):
    name: Optional[str]
    birthday: Optional[datetime.date]
    email: Optional[str]
    instagram: Optional[str]
    telegram: Optional[str]


class UpdateUserSchema(BaseModel):
    name: Optional[str]
    birthday: Optional[datetime.date]
    experience: Optional[int]
    position: Optional[str]
    password: Optional[str]


class UserLoginSchema(BaseModel):
    phone: str
    password: str


class GetUserSchema(BaseModel):
    id: int
    phone: str
    name: Optional[str]
    birthdate: Optional[datetime.date]
    registered_at: datetime.datetime
    experience: Optional[int]
    rating: float
    position: Optional[str]
    image: Optional[str]
    services: Optional[list[int]]
    isAdmin: bool
    isStaff: bool
