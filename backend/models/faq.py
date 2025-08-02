from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FAQCreate(BaseModel):
    question: str = Field(..., min_length=10)
    answer: str = Field(..., min_length=20)
    category: str = Field(..., min_length=2)
    order: Optional[int] = 0

class FAQUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=10)
    answer: Optional[str] = Field(None, min_length=20)
    category: Optional[str] = Field(None, min_length=2)
    isActive: Optional[bool] = None
    order: Optional[int] = None

class FAQResponse(BaseModel):
    id: str = Field(alias="_id")
    question: str
    answer: str
    category: str
    isActive: bool
    order: int
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True

class FAQ(BaseModel):
    question: str
    answer: str
    category: str
    isActive: bool = True
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)