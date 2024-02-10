from typing import Optional
import datetime
from pydantic import BaseModel

from services.schemas import GetServiceSchema
from users.schemas import GetUserSchema, GetClientSchema


class GetRecordSchema(BaseModel):
    id: int
    date: datetime.date
    time: datetime.time
    clientId: int
    status: str
    price: Optional[int]
    ru: Optional[str]
    en: Optional[str]
    sr: Optional[str]
    comment: Optional[str]
    image: Optional[str]
    serviceId: int
    service: GetServiceSchema
    history: dict
    userId: int
    user: GetUserSchema
    author: Optional[str]


class GetRecordByTelegramSchema(BaseModel):
    id: int
    date: datetime.date
    time: datetime.time
    service: GetServiceSchema
    client: GetClientSchema


class UpdateRecordSchema(BaseModel):
    status: str
    price: Optional[int]
    comment: Optional[str]
    date: Optional[datetime.date]
    time: Optional[datetime.time]
    userId: Optional[int]
    masterId: Optional[int]
    cameFrom: Optional[str]


class AvailableRecordSchema(BaseModel):
    start: int
    end: int
    duration: int
    type: str


class AvailableCrmRecordSchema(BaseModel):
    start: int
    end: int
    duration: int
    type: str
    serviceId: int
    ru: Optional[str]
    en: Optional[str]
    sr: Optional[str]
    clientId: int
    recordId: int


class NewRecordSchema(BaseModel):
    userId: int
    clientId: int
    serviceId: int
    time: int
    date: str
    author: Optional[str]


class NewRecordWithRegisterSchema(BaseModel):
    userId: int
    serviceId: int
    time: int
    date: str
    author: Optional[str]
    phone: str
    telegram: str
    instagram: str
    name: str
    authorId: int


class ComplexRecordsSchema(BaseModel):
    userId: int
    serviceId: int
    time: int
    date: str


class NewComplexSchema(BaseModel):
    clientId: int
    author: Optional[str]
    records: list[ComplexRecordsSchema]


class NewComplexWithRegisterSchema(BaseModel):
    author: Optional[str]
    records: list[ComplexRecordsSchema]
    phone: str
    telegram: str
    instagram: str
    name: str
    authorId: int


class SmsSchema(BaseModel):
    client_id: int
    record_id: int
    time: datetime.time
    phone: str
