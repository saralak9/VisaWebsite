from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import User, UserCreate, UserLogin, UserResponse, UserUpdate
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user_id
from datetime import datetime
import re

router = APIRouter(prefix="/auth", tags=["authentication"])

def get_db():
    from server import db
    return db

def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> bool:
    """Validate password strength."""
    return len(password) >= 6

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Register a new user."""
    
    # Validate input
    if not validate_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    if not validate_password(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        fullName=user_data.fullName,
        email=user_data.email,
        password=hashed_password,
        phone=user_data.phone,
        citizenship=user_data.citizenship
    )
    
    # Insert user
    result = await db.users.insert_one(user.dict())
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(result.inserted_id)
        },
        "message": "User registered successfully"
    }

@router.post("/login", response_model=dict)
async def login(login_data: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Login user."""
    
    # Find user
    user = await db.users.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user["_id"])
        },
        "message": "Login successful"
    }

@router.get("/profile", response_model=dict)
async def get_profile(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user profile."""
    
    # Find user
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert to response model
    user_response = UserResponse(
        _id=str(user["_id"]),
        fullName=user["fullName"],
        email=user["email"],
        phone=user.get("phone"),
        citizenship=user.get("citizenship"),
        isEmailVerified=user.get("isEmailVerified", False),
        role=user.get("role", "user"),
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"]
    )
    
    return {
        "success": True,
        "data": user_response.dict(),
        "message": "Profile retrieved successfully"
    }

@router.put("/profile", response_model=dict)
async def update_profile(
    profile_data: UserUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update user profile."""
    
    # Prepare update data
    update_data = {}
    if profile_data.fullName is not None:
        update_data["fullName"] = profile_data.fullName
    if profile_data.phone is not None:
        update_data["phone"] = profile_data.phone
    if profile_data.citizenship is not None:
        update_data["citizenship"] = profile_data.citizenship
    
    update_data["updatedAt"] = datetime.utcnow()
    
    # Update user
    result = await db.users.update_one(
        {"_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "success": True,
        "message": "Profile updated successfully"
    }