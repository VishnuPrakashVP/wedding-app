from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.user import User
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
async def get_dashboard_stats():
    """Get dashboard statistics for admin panel"""
    try:
        # Get total users
        total_users = await db["users"].count_documents({})
        
        # Get total albums
        total_albums = await db["albums"].count_documents({})
        
        # Get total media
        total_media = await db["media"].count_documents({})
        
        # Get flagged media count
        flagged_media = await db["media"].count_documents({"status": "flagged"})
        
        # Get recent uploads (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_uploads = await db["media"].count_documents({
            "uploaded_at": {"$gte": week_ago}
        })
        
        return {
            "total_users": total_users,
            "total_albums": total_albums,
            "total_media": total_media,
            "flagged_media": flagged_media,
            "recent_uploads": recent_uploads,
            "storage_used": "2.5 GB",  # Placeholder
            "active_users": total_users  # Placeholder
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard stats: {str(e)}")

@router.get("/users")
async def get_all_users():
    """Get all users for admin panel"""
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

@router.get("/flagged-media")
async def get_flagged_media():
    """Get all flagged media for moderation"""
    try:
        flagged_media = await db["media"].find({"status": "flagged"}).to_list(100)
        return [
            {
                "id": str(media["_id"]),
                "filename": media.get("filename", ""),
                "url": media.get("url", ""),
                "caption": media.get("caption", ""),
                "album_id": media.get("album_id", ""),
                "uploaded_at": media.get("uploaded_at", datetime.utcnow()),
                "type": media.get("type", "photo")
            }
            for media in flagged_media
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get flagged media: {str(e)}")

@router.patch("/approve-media/{media_id}")
async def approve_media(media_id: str):
    """Approve flagged media"""
    try:
        result = await db["media"].update_one(
            {"_id": media_id},
            {"$set": {"status": "active", "approved": True, "flagged": False}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Media not found")
        
        return {"message": "Media approved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to approve media: {str(e)}")

@router.delete("/reject-media/{media_id}")
async def reject_media(media_id: str):
    """Reject and delete flagged media"""
    try:
        result = await db["media"].delete_one({"_id": media_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Media not found")
        
        return {"message": "Media rejected and deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reject media: {str(e)}")

@router.get("/analytics")
async def get_analytics():
    """Get analytics data for charts"""
    try:
        # Get uploads by day (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        pipeline = [
            {"$match": {"uploaded_at": {"$gte": thirty_days_ago}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$uploaded_at"}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]
        
        daily_uploads = await db["media"].aggregate(pipeline).to_list(30)
        
        # Get media by type
        type_pipeline = [
            {"$group": {
                "_id": "$type",
                "count": {"$sum": 1}
            }}
        ]
        
        media_by_type = await db["media"].aggregate(type_pipeline).to_list(10)
        
        return {
            "daily_uploads": daily_uploads,
            "media_by_type": media_by_type,
            "total_albums": await db["albums"].count_documents({}),
            "total_users": await db["users"].count_documents({})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}") 