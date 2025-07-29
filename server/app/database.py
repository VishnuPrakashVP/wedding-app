from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# MongoDB connection
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DB_NAME]