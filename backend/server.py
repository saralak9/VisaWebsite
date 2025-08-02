from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import logging
from pathlib import Path

# Import routes
from routes import auth, visa_applications, countries, faqs

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Atlys USA Visa API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Atlys USA Visa API is running", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "message": "All systems operational"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Include routers
api_router.include_router(auth.router)
api_router.include_router(visa_applications.router)
api_router.include_router(countries.router)
api_router.include_router(faqs.router)

# Include the API router in the main app
app.include_router(api_router)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database and seed data."""
    logger.info("Starting up...")
    
    # Seed data
    try:
        from routes.countries import seed_countries
        from routes.faqs import seed_faqs
        
        await seed_countries(db)
        await seed_faqs(db)
        
        logger.info("Database seeded successfully")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection."""
    client.close()
    logger.info("Database connection closed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)