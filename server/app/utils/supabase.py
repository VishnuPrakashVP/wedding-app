from supabase import create_client
from app.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def upload_file(file, file_name: str):
    res = supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
        file_name, file, {"content-type": "auto"}
    )
    return f"{settings.SUPABASE_URL}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/{file_name}"