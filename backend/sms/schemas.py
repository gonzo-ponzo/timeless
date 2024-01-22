from pydantic import BaseModel


class SmsSchema(BaseModel):
    text: str
    client_id: int
