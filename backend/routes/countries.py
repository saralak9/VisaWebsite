from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.country import Country, CountryResponse

router = APIRouter(prefix="/countries", tags=["countries"])

def get_db():
    from server import db
    return db

@router.get("", response_model=dict)
async def get_countries(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all countries."""
    
    # Find all countries
    cursor = db.countries.find({}).sort("name", 1)
    countries = await cursor.to_list(length=300)
    
    # Convert to response format
    response_countries = []
    for country in countries:
        country_response = CountryResponse(
            _id=str(country["_id"]),
            code=country["code"],
            name=country["name"],
            flag=country["flag"],
            visaRequired=country["visaRequired"],
            processingTime=country.get("processingTime"),
            validityPeriod=country.get("validityPeriod")
        )
        response_countries.append(country_response.dict())
    
    return {
        "success": True,
        "data": response_countries,
        "message": "Countries retrieved successfully"
    }

@router.get("/{country_code}", response_model=dict)
async def get_country(country_code: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a specific country by code."""
    
    # Find country
    country = await db.countries.find_one({"code": country_code.upper()})
    
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Country not found"
        )
    
    # Convert to response format
    country_response = CountryResponse(
        _id=str(country["_id"]),
        code=country["code"],
        name=country["name"],
        flag=country["flag"],
        visaRequired=country["visaRequired"],
        processingTime=country.get("processingTime"),
        validityPeriod=country.get("validityPeriod")
    )
    
    return {
        "success": True,
        "data": country_response.dict(),
        "message": "Country retrieved successfully"
    }

# Seed countries data
async def seed_countries(db: AsyncIOMotorDatabase):
    """Seed initial countries data."""
    
    # Check if countries already exist
    count = await db.countries.count_documents({})
    if count > 0:
        return
    
    # Sample countries data
    countries_data = [
        {
            "code": "US",
            "name": "United States",
            "flag": "https://media.atlys.com/image/upload/country_flags/us.svg",
            "visaRequired": True,
            "processingTime": "3-5 working days",
            "validityPeriod": "10 years"
        },
        {
            "code": "IN",
            "name": "India",
            "flag": "https://media.atlys.com/image/upload/country_flags/in.svg",
            "visaRequired": True,
            "processingTime": "3-5 working days",
            "validityPeriod": "10 years"
        },
        {
            "code": "GB",
            "name": "United Kingdom",
            "flag": "https://media.atlys.com/image/upload/country_flags/gb.svg",
            "visaRequired": True,
            "processingTime": "2-3 working days",
            "validityPeriod": "6 months"
        },
        {
            "code": "CA",
            "name": "Canada",
            "flag": "https://media.atlys.com/image/upload/country_flags/ca.svg",
            "visaRequired": True,
            "processingTime": "1-2 working days",
            "validityPeriod": "5 years"
        },
        {
            "code": "AU",
            "name": "Australia",
            "flag": "https://media.atlys.com/image/upload/country_flags/au.svg",
            "visaRequired": True,
            "processingTime": "1-2 working days",
            "validityPeriod": "1 year"
        },
        {
            "code": "DE",
            "name": "Germany",
            "flag": "https://media.atlys.com/image/upload/country_flags/de.svg",
            "visaRequired": True,
            "processingTime": "5-15 working days",
            "validityPeriod": "90 days"
        },
        {
            "code": "FR",
            "name": "France",
            "flag": "https://media.atlys.com/image/upload/country_flags/fr.svg",
            "visaRequired": True,
            "processingTime": "5-15 working days",
            "validityPeriod": "90 days"
        },
        {
            "code": "JP",
            "name": "Japan",
            "flag": "https://media.atlys.com/image/upload/country_flags/jp.svg",
            "visaRequired": True,
            "processingTime": "3-5 working days",
            "validityPeriod": "90 days"
        },
        {
            "code": "CN",
            "name": "China",
            "flag": "https://media.atlys.com/image/upload/country_flags/cn.svg",
            "visaRequired": True,
            "processingTime": "4-10 working days",
            "validityPeriod": "10 years"
        },
        {
            "code": "BR",
            "name": "Brazil",
            "flag": "https://media.atlys.com/image/upload/country_flags/br.svg",
            "visaRequired": True,
            "processingTime": "5-10 working days",
            "validityPeriod": "5 years"
        }
    ]
    
    # Insert countries
    await db.countries.insert_many(countries_data)
    print("Countries seeded successfully")