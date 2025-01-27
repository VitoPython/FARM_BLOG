from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime



class Post(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    slug: str
    title: str
    desc: str
    content: str
    img: Optional[str] = None
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "slug": "my-first-post",
                "title": "My First Post",
                "desc": "This is my first post",
                "content": "This is the content of my first post",
                "img": "https://example.com/image.jpg"
            }
        }
        
class PostUpdate(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    slug: str = None
    title: str = None
    desc: str = None
    content: str = None
    img: Optional[str] = None