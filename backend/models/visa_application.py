from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PROCESSING = "processing"
    APPROVED = "approved"
    REJECTED = "rejected"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class DocumentType(str, Enum):
    PASSPORT = "passport"
    PHOTO = "photo"
    BANK_STATEMENT = "bank_statement"
    EMPLOYMENT_LETTER = "employment_letter"
    TRAVEL_ITINERARY = "travel_itinerary"
    HOTEL_BOOKING = "hotel_booking"

class VisaType(BaseModel):
    id: str
    name: str
    duration: str
    validity: str
    price: float

class PersonalInfo(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    citizenship: Optional[str] = None
    dateOfBirth: Optional[date] = None
    placeOfBirth: Optional[str] = None
    gender: Optional[str] = None

class TravelDetails(BaseModel):
    purpose: Optional[str] = None
    arrivalDate: Optional[date] = None
    departureDate: Optional[date] = None
    duration: Optional[int] = None
    accommodation: Optional[str] = None
    previousVisits: Optional[bool] = False

class PassportInfo(BaseModel):
    number: Optional[str] = None
    issueDate: Optional[date] = None
    expiryDate: Optional[date] = None
    issuingCountry: Optional[str] = None

class Document(BaseModel):
    type: DocumentType
    fileName: str
    fileUrl: str
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)

class Payment(BaseModel):
    status: PaymentStatus = PaymentStatus.PENDING
    amount: Optional[float] = None
    currency: str = "USD"
    transactionId: Optional[str] = None
    paidAt: Optional[datetime] = None

class VisaApplicationCreate(BaseModel):
    visaType: Optional[VisaType] = None
    personalInfo: Optional[PersonalInfo] = Field(default_factory=PersonalInfo)
    travelDetails: Optional[TravelDetails] = Field(default_factory=TravelDetails)
    passportInfo: Optional[PassportInfo] = Field(default_factory=PassportInfo)

class VisaApplicationUpdate(BaseModel):
    visaType: Optional[VisaType] = None
    personalInfo: Optional[PersonalInfo] = None
    travelDetails: Optional[TravelDetails] = None
    passportInfo: Optional[PassportInfo] = None
    currentStep: Optional[int] = None
    completedSteps: Optional[List[int]] = None

class VisaApplicationResponse(BaseModel):
    id: str = Field(alias="_id")
    userId: str
    applicationNumber: str
    status: ApplicationStatus
    visaType: Optional[VisaType] = None
    personalInfo: PersonalInfo
    travelDetails: TravelDetails
    passportInfo: PassportInfo
    documents: List[Document] = []
    payment: Payment
    currentStep: int = 1
    completedSteps: List[int] = []
    createdAt: datetime
    updatedAt: datetime
    submittedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True

class VisaApplication(BaseModel):
    userId: str
    applicationNumber: str
    status: ApplicationStatus = ApplicationStatus.DRAFT
    visaType: Optional[VisaType] = None
    personalInfo: PersonalInfo = Field(default_factory=PersonalInfo)
    travelDetails: TravelDetails = Field(default_factory=TravelDetails)
    passportInfo: PassportInfo = Field(default_factory=PassportInfo)
    documents: List[Document] = []
    payment: Payment = Field(default_factory=Payment)
    currentStep: int = 1
    completedSteps: List[int] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    submittedAt: Optional[datetime] = None