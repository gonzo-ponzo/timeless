from pydantic import BaseModel
from typing import Optional


class GetServiceSchema(BaseModel):
    id: int
    ru: Optional[str]
    en: Optional[str]
    sr: Optional[str]
    price: int
    duration: int
    active: bool


class GetComplexSchema(BaseModel):
    id: int
    ru: Optional[str]
    en: Optional[str]
    sr: Optional[str]
    services: list[GetServiceSchema]
