# Atlys USA Visa Application - Full-Stack Integration Contracts

## API Contracts

### Base URL
- **Development**: `REACT_APP_BACKEND_URL/api`
- All endpoints prefixed with `/api` for Kubernetes ingress routing

### Authentication
- JWT-based authentication
- Header: `Authorization: Bearer <token>`

## API Endpoints

### 1. Visa Applications
```
POST /api/visa-applications
GET /api/visa-applications
GET /api/visa-applications/:id
PUT /api/visa-applications/:id
DELETE /api/visa-applications/:id
```

### 2. Countries & Citizenship
```
GET /api/countries
GET /api/countries/:code
```

### 3. FAQ Management
```
GET /api/faqs
GET /api/faqs/search?q=query&category=category
POST /api/faqs (Admin only)
```

### 4. User Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
```

### 5. File Uploads
```
POST /api/upload/documents
GET /api/upload/documents/:id
```

## Data Models

### VisaApplication
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  applicationNumber: String, // Auto-generated
  status: String, // 'draft', 'submitted', 'processing', 'approved', 'rejected'
  
  // Step 1: Visa Type Selection
  visaType: {
    id: String,
    name: String,
    duration: String,
    validity: String,
    price: Number
  },
  
  // Step 2: Personal Information
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    citizenship: String,
    dateOfBirth: Date,
    placeOfBirth: String,
    gender: String
  },
  
  // Step 3: Travel Details
  travelDetails: {
    purpose: String,
    arrivalDate: Date,
    departureDate: Date,
    duration: Number,
    accommodation: String,
    previousVisits: Boolean
  },
  
  // Step 4: Passport Information
  passportInfo: {
    number: String,
    issueDate: Date,
    expiryDate: Date,
    issuingCountry: String
  },
  
  // Step 5: Documents
  documents: [{
    type: String, // 'passport', 'photo', 'bank_statement', etc.
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  
  // Step 6: Payment
  payment: {
    status: String, // 'pending', 'completed', 'failed'
    amount: Number,
    currency: String,
    transactionId: String,
    paidAt: Date
  },
  
  // Tracking
  currentStep: Number,
  completedSteps: [Number],
  createdAt: Date,
  updatedAt: Date,
  submittedAt: Date
}
```

### User
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String, // Hashed
  phone: String,
  citizenship: String,
  isEmailVerified: Boolean,
  role: String, // 'user', 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Country
```javascript
{
  _id: ObjectId,
  code: String, // ISO 2-letter code
  name: String,
  flag: String, // URL to flag image
  visaRequired: Boolean,
  processingTime: String,
  validityPeriod: String
}
```

### FAQ
```javascript
{
  _id: ObjectId,
  question: String,
  answer: String,
  category: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data Replacement Plan

### Current Mock Data (to be replaced):
1. **mockFAQs** → MongoDB FAQ collection
2. **mockCountries** → MongoDB Country collection
3. **mockVisaTypes** → Static data embedded in application logic
4. **mockApplicationSteps** → Static data (keep in frontend)
5. **mockUSAImages** → Static data (keep in frontend)
6. **mockReviews** → Static data (keep in frontend)

### Frontend Integration Changes:

#### Replace in Components:
1. **FAQ.jsx**
   - Remove: `import { mockFAQs } from '../data/mock'`
   - Add: API calls to `/api/faqs` and `/api/faqs/search`

2. **CitizenshipModal.jsx**
   - Remove: `import { mockCountries } from '../data/mock'`
   - Add: API call to `/api/countries`

3. **VisaApplication.jsx**
   - Remove: `import { mockVisaTypes, mockApplicationSteps } from '../data/mock'`
   - Add: API calls for CRUD operations on visa applications
   - Add: Progress saving functionality
   - Add: File upload integration

4. **Header.jsx**
   - Add: User authentication state
   - Add: Profile dropdown
   - Add: Login/logout functionality

#### New Components to Create:
1. **AuthModal.jsx** - Login/Register modal
2. **UserProfile.jsx** - User profile management
3. **DocumentUpload.jsx** - File upload component
4. **ApplicationStatus.jsx** - Track application progress
5. **PaymentForm.jsx** - Payment processing

## Backend Implementation Plan

### Phase 1: Core Setup
- MongoDB connection and models
- Authentication middleware
- Basic CRUD endpoints
- Error handling

### Phase 2: Business Logic
- Application workflow management
- Document upload handling
- Email notifications
- Payment integration (mock)

### Phase 3: Advanced Features
- Application status tracking
- Admin dashboard endpoints
- Search and filtering
- Export functionality

## Error Handling

### Standard Error Response
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable message",
    details: {} // Additional error details
  }
}
```

### Success Response
```javascript
{
  success: true,
  data: {}, // Response data
  message: "Optional success message"
}
```

## Security Considerations
- JWT token expiration (24 hours)
- Password hashing with bcrypt
- File upload validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization

## File Upload Strategy
- Store files in `/app/uploads` directory
- Generate unique filenames
- File type validation
- Size limits per document type
- Serve files through protected endpoints

This contract ensures seamless integration between frontend and backend components while maintaining data consistency and user experience.