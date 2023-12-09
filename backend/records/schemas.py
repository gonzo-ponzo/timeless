from typing import Optional
import datetime
from pydantic import BaseModel


class GetRecordSchema(BaseModel):
    id: int
    name: str
    date: datetime.date
    time: datetime.time
    clientId: int
    status: str
    price: Optional[int]
    comment: Optional[str]
    image: Optional[str]
    services: list[int]
    users: list[int]
    author: Optional[str]


class RecordIdSchema(BaseModel):
    recordId: int


class RecordsByDateScheme(BaseModel):
    client_id: int
    date: datetime.date


class UpdateRecordSchema(BaseModel):
    status: str
    price: Optional[int]
    comment: Optional[str]
    date: Optional[datetime.date]
    time: Optional[datetime.time]
    userId: Optional[int]
    masterId: Optional[int]


class AvailableRecordsDataScheme(BaseModel):
    date: datetime.date
    serviceId: int
    userId: int


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
    name: str
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
