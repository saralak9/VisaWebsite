from pydantic import BaseModel
from typing import Optional

class CountryCreate(BaseModel):
    code: str
    name: str
    flag: str
    visaRequired: bool = True
    processingTime: Optional[str] = None
    validityPeriod: Optional[str] = None

class CountryResponse(BaseModel):
    id: str = Field(alias="_id")
    code: str
    name: str
    flag: str
    visaRequired: bool
    processingTime: Optional[str] = None
    validityPeriod: Optional[str] = None

    class Config:
        populate_by_name = True

class Country(BaseModel):
    code: str
    name: str
    flag: str
    visaRequired: bool = True
    processingTime: Optional[str] = None
    validityPeriod: Optional[str] = None