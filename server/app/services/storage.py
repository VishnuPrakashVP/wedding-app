import boto3
from supabase import create_client
from app.config import settings
from typing import Optional
import os

class StorageService:
    def __init__(self):
        self.supabase = None
        self.s3_client = None
        self.storage_type = "local"  # local, supabase, s3
        
        # Initialize Supabase if configured
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                self.supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self.storage_type = "supabase"
            except Exception as e:
                print(f"Supabase initialization failed: {e}")
        
        # Initialize AWS S3 if configured
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            try:
                self.s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_REGION
                )
                self.storage_type = "s3"
            except Exception as e:
                print(f"AWS S3 initialization failed: {e}")
    
    async def upload_file(self, file_content: bytes, filename: str, content_type: str = "auto") -> str:
        """Upload file to storage and return URL"""
        
        if self.storage_type == "supabase":
            return await self._upload_to_supabase(file_content, filename, content_type)
        elif self.storage_type == "s3":
            return await self._upload_to_s3(file_content, filename, content_type)
        else:
            return await self._upload_to_local(file_content, filename)
    
    async def _upload_to_supabase(self, file_content: bytes, filename: str, content_type: str) -> str:
        """Upload to Supabase Storage"""
        try:
            res = self.supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
                filename, file_content, {"content-type": content_type}
            )
            return f"{settings.SUPABASE_URL}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/{filename}"
        except Exception as e:
            print(f"Supabase upload failed: {e}")
            return await self._upload_to_local(file_content, filename)
    
    async def _upload_to_s3(self, file_content: bytes, filename: str, content_type: str) -> str:
        """Upload to AWS S3"""
        try:
            self.s3_client.put_object(
                Bucket=settings.AWS_S3_BUCKET,
                Key=filename,
                Body=file_content,
                ContentType=content_type
            )
            return f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
        except Exception as e:
            print(f"S3 upload failed: {e}")
            return await self._upload_to_local(file_content, filename)
    
    async def _upload_to_local(self, file_content: bytes, filename: str) -> str:
        """Upload to local storage"""
        os.makedirs("media_storage", exist_ok=True)
        file_path = os.path.join("media_storage", filename)
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return f"/media_storage/{filename}"
    
    async def delete_file(self, filename: str) -> bool:
        """Delete file from storage"""
        try:
            if self.storage_type == "supabase":
                self.supabase.storage.from_(settings.SUPABASE_BUCKET).remove([filename])
            elif self.storage_type == "s3":
                self.s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=filename)
            else:
                file_path = os.path.join("media_storage", filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
            return True
        except Exception as e:
            print(f"Delete failed: {e}")
            return False

storage_service = StorageService() 