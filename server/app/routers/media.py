from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.database import db
from app.models.media import Media
from app.services.storage import storage_service
from app.services.moderation import moderation_service
from bson import ObjectId
from datetime import datetime
import uuid

router = APIRouter(prefix="/media", tags=["Media"])

@router.post("/")
async def upload_media(media: Media):
    result = await db["media"].insert_one(media.dict(by_alias=True))
    return {"inserted_id": str(result.inserted_id)}

@router.get("/album/{album_id}")
async def get_album_media(album_id: str):
    try:
        media = await db["media"].find({"album_id": album_id, "status": "active"}).to_list(100)
        return [
            {key: (str(value) if key == "_id" else value) for key, value in item.items()}
            for item in media
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get album media: {str(e)}")

@router.post("/report/{media_id}")
async def report_media(media_id: str):
    result = await db["media"].update_one(
        {"_id": ObjectId(media_id)},
        {"$set": {"status": "flagged"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Media flagged for review"}

# supabase-routing

@router.post("/upload/")
async def upload_media_file(
    file: UploadFile = File(...),
    caption: str = Form(None),
    album_id: str = Form(None)
):
    # Read file content
    contents = await file.read()
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    
    # Check if image is appropriate (moderation)
    is_appropriate = True
    if file.content_type.startswith("image/"):
        is_appropriate = await moderation_service.is_appropriate(contents)
    
    # Upload to storage service
    file_url = await storage_service.upload_file(
        contents, 
        unique_filename, 
        file.content_type
    )

    metadata = {
        "filename": file.filename,
        "url": file_url,
        "caption": caption,
        "album_id": album_id,
        "uploaded_at": datetime.utcnow(),
        "status": "active" if is_appropriate else "flagged",
        "flagged": not is_appropriate,
        "approved": is_appropriate,
        "type": "photo" if file.content_type.startswith("image/") else "video"
    }

    result = await db["media"].insert_one(metadata)

    return {
        "url": file_url,
        "inserted_id": str(result.inserted_id),
        "message": "Upload successful and metadata stored.",
        "moderated": not is_appropriate
    }


# all-end-point
# all-end-point
@router.get("/all")
async def get_all_media():
    media = await db["media"].find({"approved": True, "flagged": False}).to_list(100)
    return [
        {key: (str(value) if key == "_id" else value) for key, value in item.items()}
        for item in media
    ]
# Host moderation routes

# Retrieve flagged media for review
@router.get("/flagged")
async def get_flagged_media():
    flagged_media = await db["media"].find({"status": "flagged"}).to_list(100)
    return [
        {key: (str(value) if key == "_id" else value) for key, value in item.items()}
        for item in flagged_media
    ]

# Approve a flagged media item
@router.patch("/approve/{media_id}")
async def approve_media(media_id: str):
    result = await db["media"].update_one(
        {"_id": ObjectId(media_id)},
        {"$set": {"status": "active", "approved": True, "flagged": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Media approved and made public"}

# Reject/delete a flagged media item
@router.delete("/reject/{media_id}")
async def reject_media(media_id: str):
    result = await db["media"].delete_one({"_id": ObjectId(media_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Media permanently deleted"}