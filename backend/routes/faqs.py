from fastapi import APIRouter, HTTPException, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models.faq import FAQ, FAQResponse
from datetime import datetime
import re

router = APIRouter(prefix="/faqs", tags=["faqs"])

def get_db():
    from server import db
    return db

@router.get("", response_model=dict)
async def get_faqs(
    category: Optional[str] = Query(None, description="Filter by category"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all FAQs with optional category filter."""
    
    # Build query
    query = {"isActive": True}
    if category and category.lower() != "all":
        query["category"] = {"$regex": category, "$options": "i"}
    
    # Find FAQs
    cursor = db.faqs.find(query).sort([("order", 1), ("createdAt", -1)])
    faqs = await cursor.to_list(length=100)
    
    # Convert to response format
    response_faqs = []
    for faq in faqs:
        faq_response = FAQResponse(
            _id=str(faq["_id"]),
            question=faq["question"],
            answer=faq["answer"],
            category=faq["category"],
            isActive=faq["isActive"],
            order=faq["order"],
            createdAt=faq["createdAt"],
            updatedAt=faq["updatedAt"]
        )
        response_faqs.append(faq_response.dict())
    
    return {
        "success": True,
        "data": response_faqs,
        "message": "FAQs retrieved successfully"
    }

@router.get("/search", response_model=dict)
async def search_faqs(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Search FAQs by question or answer content."""
    
    # Build search query
    search_regex = {"$regex": re.escape(q), "$options": "i"}
    query = {
        "isActive": True,
        "$or": [
            {"question": search_regex},
            {"answer": search_regex}
        ]
    }
    
    # Add category filter if specified
    if category and category.lower() != "all":
        query["category"] = {"$regex": category, "$options": "i"}
    
    # Find FAQs
    cursor = db.faqs.find(query).sort([("order", 1), ("createdAt", -1)])
    faqs = await cursor.to_list(length=100)
    
    # Convert to response format
    response_faqs = []
    for faq in faqs:
        faq_response = FAQResponse(
            _id=str(faq["_id"]),
            question=faq["question"],
            answer=faq["answer"],
            category=faq["category"],
            isActive=faq["isActive"],
            order=faq["order"],
            createdAt=faq["createdAt"],
            updatedAt=faq["updatedAt"]
        )
        response_faqs.append(faq_response.dict())
    
    return {
        "success": True,
        "data": response_faqs,
        "message": f"Found {len(response_faqs)} FAQs matching '{q}'"
    }

# Seed FAQs data
async def seed_faqs(db: AsyncIOMotorDatabase):
    """Seed initial FAQ data."""
    
    # Check if FAQs already exist
    count = await db.faqs.count_documents({})
    if count > 0:
        return
    
    # Sample FAQ data
    current_time = datetime.utcnow()
    faqs_data = [
        {
            "question": "Do American Citizens need a visa for the US?",
            "answer": "Yes, American Citizens need a visa to enter the United States, whether visiting for tourism, business, education, or other purposes.",
            "category": "General Information",
            "isActive": True,
            "order": 1,
            "createdAt": current_time,
            "updatedAt": current_time
        },
        {
            "question": "What are the eligibility criteria for American Citizens to get a US visa?",
            "answer": "American Citizens are eligible for getting a US visa, provided they can prove that:\n\n• The trip to the US is for a temporary visit, such as business, tourism, or family.\n• The stay in the US is planned for a limited period.\n• There is sufficient evidence of funds to cover expenses while in the US.\n• There is a residence and strong ties outside the US that ensure a return after the visit.",
            "category": "General Information",
            "isActive": True,
            "order": 2,
            "createdAt": current_time,
            "updatedAt": current_time
        },
        {
            "question": "What are the US visa requirements for USA citizens?",
            "answer": "Here is a list of documents required to apply for a US tourist visa from USA:\n\n• A complete Nonimmigrant Visa Application or Form DS-160.\n• The passport valid for at least six months beyond the intended stay in the US.\n• A passport-size photo that meets the US visa photo requirements.\n\nAdditional documents required for US visa appointments:\n• DS-160 Form Confirmation page\n• Appointment confirmation page\n• Fee payment receipt\n• Proof of the trip's purpose (e.g., cover letter, travel itinerary, etc.)\n• Proof of sufficient funds (preferably bank statements of the last 6 months)\n• Proof of your intent to return to your home country (letter of employment or the leave approval letter).",
            "category": "General Information",
            "isActive": True,
            "order": 3,
            "createdAt": current_time,
            "updatedAt": current_time
        },
        {
            "question": "How to apply for a US visa from USA?",
            "answer": "Here is how American Citizens can apply for a US visa from USA:\n\nStep 1: Carefully complete the DS-160 Form online.\nStep 2: Create an account on the USA government website to pay your US visa fees.\nStep 3: After paying the fee, schedule the VAC (for biometrics) and embassy appointments (for a personal interview).\nStep 4: Visit the VAC to submit your biometric information and take the appointment confirmation page, DS-160 Confirmation page, and passport.\nStep 5: On the interview day, submit your supporting documents and answer any questions the officer asks.\nStep 6: You will be informed about the visa decision immediately after your interview. If approved, submit your passport for visa processing.\nStep 7: Once the visa is processed, you can collect your passport from the US passport collection centres or have it delivered.",
            "category": "General Information",
            "isActive": True,
            "order": 4,
            "createdAt": current_time,
            "updatedAt": current_time
        },
        {
            "question": "How long is the US tourist visa valid for American Citizens?",
            "answer": "A US tourist or B-2 visa for American Citizens is typically valid for 10 years from the issue date and allows a stay of up to 180 days per visit.",
            "category": "General Information",
            "isActive": True,
            "order": 5,
            "createdAt": current_time,
            "updatedAt": current_time
        },
        {
            "question": "Is an interview mandatory for American Citizens to apply for a US tourist visa?",
            "answer": "Yes, the US consular interview is mandatory for all American Citizens (except children under 14 and applicants aged 80 and over).",
            "category": "General Information",
            "isActive": True,
            "order": 6,
            "createdAt": current_time,
            "updatedAt": current_time
        }
    ]
    
    # Insert FAQs
    await db.faqs.insert_many(faqs_data)
    print("FAQs seeded successfully")