from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.album import Album
from typing import List, Dict, Any
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/albums", tags=["Albums"])

@router.get("/")
async def get_all_albums():
    """Get all albums"""
    try:
        albums = await db["albums"].find({"is_public": True}).to_list(100)
        return [
            {
                **album,
                "_id": str(album["_id"])
            }
            for album in albums
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get albums: {str(e)}")

@router.get("/{album_id}")
async def get_album(album_id: str):
    """Get specific album by ID"""
    try:
        album = await db["albums"].find_one({"_id": ObjectId(album_id)})
        if not album:
            raise HTTPException(status_code=404, detail="Album not found")
        
        album["_id"] = str(album["_id"])
        return album
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get album: {str(e)}")

@router.post("/")
async def create_album(album_data: Album):
    """Create a new album"""
    try:
        album_doc = album_data.dict(by_alias=True, exclude_unset=True)
        # Remove the _id field if it's None to let MongoDB generate it
        if album_doc.get("_id") is None:
            album_doc.pop("_id", None)
        
        album_doc["created_at"] = datetime.utcnow()
        
        result = await db["albums"].insert_one(album_doc)
        
        album_doc["_id"] = str(result.inserted_id)
        return album_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create album: {str(e)}")

@router.put("/{album_id}")
async def update_album(album_id: str, album_data: Album):
    """Update an album"""
    try:
        result = await db["albums"].update_one(
            {"_id": ObjectId(album_id)},
            {"$set": album_data.dict(by_alias=True, exclude_unset=True)}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Album not found")
        
        return {"message": "Album updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update album: {str(e)}")

@router.delete("/{album_id}")
async def delete_album(album_id: str):
    """Delete an album"""
    try:
        result = await db["albums"].delete_one({"_id": ObjectId(album_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Album not found")
        
        return {"message": "Album deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete album: {str(e)}")