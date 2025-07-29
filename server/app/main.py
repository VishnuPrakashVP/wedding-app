from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, media, album, payments, admin

app = FastAPI(
    title="Wedding Memories API",
    description="A comprehensive API for wedding photo sharing and management",
    version="1.0.0"
)

# Mount static files only if directory exists (for Vercel compatibility)
import os
if os.path.exists("media_storage"):
    app.mount("/media_storage", StaticFiles(directory="media_storage"), name="media")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(media.router)
app.include_router(album.router)
app.include_router(payments.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "message": "Wedding Memories API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "services": ["api", "database", "storage", "moderation", "payments"]}

@app.get("/test")
def test_endpoint():
    """Simple test endpoint to verify deployment"""
    return {"message": "API is working!", "timestamp": "2024-01-01"}