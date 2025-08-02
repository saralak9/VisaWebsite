from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models.visa_application import (
    VisaApplication, VisaApplicationCreate, VisaApplicationUpdate, 
    VisaApplicationResponse, ApplicationStatus
)
from utils.auth import get_current_user_id, generate_application_number
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/visa-applications", tags=["visa-applications"])

def get_db():
    from server import db
    return db

@router.post("", response_model=dict)
async def create_application(
    application_data: VisaApplicationCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new visa application."""
    
    # Generate application number
    app_number = generate_application_number()
    
    # Create application
    application = VisaApplication(
        userId=user_id,
        applicationNumber=app_number,
        visaType=application_data.visaType,
        personalInfo=application_data.personalInfo,
        travelDetails=application_data.travelDetails,
        passportInfo=application_data.passportInfo
    )
    
    # Insert application
    result = await db.visa_applications.insert_one(application.dict())
    
    return {
        "success": True,
        "data": {
            "application_id": str(result.inserted_id),
            "application_number": app_number
        },
        "message": "Visa application created successfully"
    }

@router.get("", response_model=dict)
async def get_user_applications(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all applications for the current user."""
    
    # Find applications
    cursor = db.visa_applications.find({"userId": user_id}).sort("createdAt", -1)
    applications = await cursor.to_list(length=100)
    
    # Convert to response format
    response_applications = []
    for app in applications:
        app_response = VisaApplicationResponse(
            _id=str(app["_id"]),
            userId=app["userId"],
            applicationNumber=app["applicationNumber"],
            status=app["status"],
            visaType=app.get("visaType"),
            personalInfo=app["personalInfo"],
            travelDetails=app["travelDetails"],
            passportInfo=app["passportInfo"],
            documents=app.get("documents", []),
            payment=app["payment"],
            currentStep=app["currentStep"],
            completedSteps=app["completedSteps"],
            createdAt=app["createdAt"],
            updatedAt=app["updatedAt"],
            submittedAt=app.get("submittedAt")
        )
        response_applications.append(app_response.dict())
    
    return {
        "success": True,
        "data": response_applications,
        "message": "Applications retrieved successfully"
    }

@router.get("/{application_id}", response_model=dict)
async def get_application(
    application_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a specific application."""
    
    try:
        object_id = ObjectId(application_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format"
        )
    
    # Find application
    application = await db.visa_applications.find_one({
        "_id": object_id,
        "userId": user_id
    })
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Convert to response format
    app_response = VisaApplicationResponse(
        _id=str(application["_id"]),
        userId=application["userId"],
        applicationNumber=application["applicationNumber"],
        status=application["status"],
        visaType=application.get("visaType"),
        personalInfo=application["personalInfo"],
        travelDetails=application["travelDetails"],
        passportInfo=application["passportInfo"],
        documents=application.get("documents", []),
        payment=application["payment"],
        currentStep=application["currentStep"],
        completedSteps=application["completedSteps"],
        createdAt=application["createdAt"],
        updatedAt=application["updatedAt"],
        submittedAt=application.get("submittedAt")
    )
    
    return {
        "success": True,
        "data": app_response.dict(),
        "message": "Application retrieved successfully"
    }

@router.put("/{application_id}", response_model=dict)
async def update_application(
    application_id: str,
    application_data: VisaApplicationUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a visa application."""
    
    try:
        object_id = ObjectId(application_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format"
        )
    
    # Prepare update data
    update_data = {}
    if application_data.visaType is not None:
        update_data["visaType"] = application_data.visaType.dict()
    if application_data.personalInfo is not None:
        update_data["personalInfo"] = application_data.personalInfo.dict()
    if application_data.travelDetails is not None:
        update_data["travelDetails"] = application_data.travelDetails.dict()
    if application_data.passportInfo is not None:
        update_data["passportInfo"] = application_data.passportInfo.dict()
    if application_data.currentStep is not None:
        update_data["currentStep"] = application_data.currentStep
    if application_data.completedSteps is not None:
        update_data["completedSteps"] = application_data.completedSteps
    
    update_data["updatedAt"] = datetime.utcnow()
    
    # Update application
    result = await db.visa_applications.update_one(
        {"_id": object_id, "userId": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return {
        "success": True,
        "message": "Application updated successfully"
    }

@router.post("/{application_id}/submit", response_model=dict)
async def submit_application(
    application_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit a visa application."""
    
    try:
        object_id = ObjectId(application_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format"
        )
    
    # Update application status
    result = await db.visa_applications.update_one(
        {"_id": object_id, "userId": user_id, "status": ApplicationStatus.DRAFT},
        {
            "$set": {
                "status": ApplicationStatus.SUBMITTED,
                "submittedAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or already submitted"
        )
    
    return {
        "success": True,
        "message": "Application submitted successfully"
    }

@router.delete("/{application_id}", response_model=dict)
async def delete_application(
    application_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a visa application (only drafts)."""
    
    try:
        object_id = ObjectId(application_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format"
        )
    
    # Delete application (only if it's a draft)
    result = await db.visa_applications.delete_one({
        "_id": object_id,
        "userId": user_id,
        "status": ApplicationStatus.DRAFT
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or cannot be deleted"
        )
    
    return {
        "success": True,
        "message": "Application deleted successfully"
    }