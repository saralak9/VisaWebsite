from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    citizenship: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    fullName: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    citizenship: Optional[str] = None

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    fullName: str
    email: str
    phone: Optional[str] = None
    citizenship: Optional[str] = None
    isEmailVerified: bool = False
    role: UserRole = UserRole.USER
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True

class User(BaseModel):
    fullName: str
    email: str
    password: str  # This will be hashed
    phone: Optional[str] = None
    citizenship: Optional[str] = None
    isEmailVerified: bool = False
    role: UserRole = UserRole.USER
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)