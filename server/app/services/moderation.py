import aiohttp
import base64
from app.config import settings
from typing import Dict, Any

class ModerationService:
    def __init__(self):
        self.api_url = settings.NSFW_API_URL
        self.api_key = settings.NSFW_API_KEY
    
    async def check_image(self, image_content: bytes) -> Dict[str, Any]:
        """Check if image contains NSFW content"""
        if not self.api_url or not self.api_key:
            # If no API configured, return safe by default
            return {
                "is_safe": True,
                "confidence": 0.0,
                "categories": {}
            }
        
        try:
            # Encode image to base64
            image_b64 = base64.b64encode(image_content).decode('utf-8')
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.api_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "image": image_b64
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            "is_safe": result.get("is_safe", True),
                            "confidence": result.get("confidence", 0.0),
                            "categories": result.get("categories", {})
                        }
                    else:
                        print(f"Moderation API error: {response.status}")
                        return {"is_safe": True, "confidence": 0.0, "categories": {}}
        
        except Exception as e:
            print(f"Moderation check failed: {e}")
            return {"is_safe": True, "confidence": 0.0, "categories": {}}
    
    async def is_appropriate(self, image_content: bytes) -> bool:
        """Check if image is appropriate for wedding context"""
        result = await self.check_image(image_content)
        return result["is_safe"]
    
    async def get_moderation_score(self, image_content: bytes) -> float:
        """Get moderation score (0.0 = safe, 1.0 = inappropriate)"""
        result = await self.check_image(image_content)
        return 1.0 - result["confidence"] if result["is_safe"] else result["confidence"]

moderation_service = ModerationService() 