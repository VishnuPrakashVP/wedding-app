from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Media(BaseModel):
    id: Optional[str] = Field(alias="_id")
    album_id: str
    uploaded_by: str
    type: str  # photo, video
    url: str
    caption: Optional[str] = None
    status: str = "active"  # active, flagged, deleted
    approved: bool = False
    flagged: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True