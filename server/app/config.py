from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB Configuration
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "wedding_app"
    
    # Supabase Configuration (for storage)
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_KEY: str = "your-supabase-anon-key"
    SUPABASE_BUCKET: str = "wedding-media"
    
    # AWS S3 Configuration (alternative to Supabase)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET: str = "wedding-media"
    
    # Razorpay Configuration (for payments)
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    
    # NSFW API Configuration (for moderation)
    NSFW_API_URL: str = ""
    NSFW_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()