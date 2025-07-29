from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Album(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    host_id: str
    title: str
    theme: Optional[str] = None
    music_url: Optional[str] = None
    cover_photo: Optional[str] = None
    is_public: bool = True
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True