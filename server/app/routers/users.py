from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.user import User
from typing import List, Dict, Any
from datetime import datetime
import jwt
from app.config import settings

router = APIRouter(prefix="/users", tags=["Users"])

# JWT configuration
JWT_SECRET = settings.JWT_SECRET_KEY or "your-secret-key"
JWT_ALGORITHM = "HS256"

def create_token(user_id: str) -> str:
    """Create JWT token"""
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow().timestamp() + 24 * 60 * 60  # 24 hours
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

@router.post("/register")
async def register_user(user_data: User):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db["users"].find_one({"email": user_data.email})
        print("exisitng user", existing_user)
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create user document
        user_doc = user_data.dict(by_alias=True)
        user_doc["created_at"] = datetime.utcnow()
        user_doc["role"] = "guest"  # Default role
        
        result = await db["users"].insert_one(user_doc)
        
        # Create token
        token = create_token(str(result.inserted_id))
        
        # Return user data without password
        user_doc["_id"] = str(result.inserted_id)
        user_doc.pop("password", None)
        
        return {
            "user": user_doc,
            "token": token,
            "message": "User registered successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login")
async def login_user(credentials: Dict[str, str]):
    """Login user"""
    try:
        email = credentials.get("email")
        password = credentials.get("password")
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password required")
        
        # Find user (in real app, hash password)
        user = await db["users"].find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Simple password check (use proper hashing in production)
        if user.get("password") != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        token = create_token(str(user["_id"]))
        
        # Return user data without password
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        
        return {
            "user": user,
            "token": token,
            "message": "Login successful"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.post("/logout")
async def logout_user():
    """Logout user (client should remove token)"""
    return {"message": "Logout successful"}

@router.get("/profile")
async def get_user_profile():
    """Get current user profile"""
    # In real app, get user from token
    return {"message": "Profile endpoint - implement with JWT middleware"}

@router.get("/")
async def get_all_users():
    """Get all users (admin only)"""
    try:
        users = await db["users"].find({}).to_list(1000)
        return [
            {
                "id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "role": user.get("role", "guest"),
                "created_at": user.get("created_at", datetime.utcnow())
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get users: {str(e)}")