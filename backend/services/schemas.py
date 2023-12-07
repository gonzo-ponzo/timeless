from pydantic import BaseModel


class GetServiceSchema(BaseModel):
    id: int
    name: str
    price: int
    duration: int
