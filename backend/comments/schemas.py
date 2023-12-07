from pydantic import BaseModel
from typing import Optional
import datetime


class GetCommentSchema(BaseModel):
    id: int
    content: str
    userId: Optional[int]
    clientId: Optional[int]
    recordId: int
    createdAt: datetime.datetime
    image: Optional[str]


class GetClientCommentSchema(BaseModel):
    id: int
    content: str
    authorId: int
    authorName: Optional[str]
    authorType: str
    authorImage: Optional[str]
    rating: int
    image: Optional[str]
    recordId: int
    createdAt: datetime.date


class GetUserCommentSchema(BaseModel):
    id: int
    content: str
    authorId: int
    authorName: Optional[str]
    authorType: str
    authorImage: Optional[str]
    rating: int
    image: Optional[str]
    recordId: int
    createdAt: datetime.date


class CreateCommentSchema(BaseModel):
    content: str
    userId: Optional[int]
    clientId: Optional[int]
    recordId: Optional[int]
    rating: int


class CreateFeedbackSchema(BaseModel):
    content: str
    email: str
    name: str
