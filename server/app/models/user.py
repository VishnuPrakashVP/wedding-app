from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: Optional[str]
    role: Optional[str] = "guest"
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True