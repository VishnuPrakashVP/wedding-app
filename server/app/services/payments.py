import razorpay
from app.config import settings
from typing import Dict, Any
import uuid

class PaymentService:
    def __init__(self):
        self.client = None
        if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            try:
                self.client = razorpay.Client(
                    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
                )
            except Exception as e:
                print(f"Razorpay initialization failed: {e}")
    
    def create_order(self, amount: int, currency: str = "INR", notes: Dict[str, str] = None) -> Dict[str, Any]:
        """Create a Razorpay order"""
        if not self.client:
            return {"error": "Payment service not configured"}
        
        try:
            order_data = {
                "amount": amount,  # Amount in paise
                "currency": currency,
                "receipt": f"order_{uuid.uuid4().hex[:8]}",
                "notes": notes or {}
            }
            
            order = self.client.order.create(data=order_data)
            return {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "receipt": order["receipt"]
            }
        except Exception as e:
            print(f"Order creation failed: {e}")
            return {"error": "Failed to create order"}
    
    def verify_payment(self, payment_id: str, order_id: str, signature: str) -> bool:
        """Verify payment signature"""
        if not self.client:
            return False
        
        try:
            self.client.utility.verify_payment_signature({
                "razorpay_payment_id": payment_id,
                "razorpay_order_id": order_id,
                "razorpay_signature": signature
            })
            return True
        except Exception as e:
            print(f"Payment verification failed: {e}")
            return False
    
    def get_payment_details(self, payment_id: str) -> Dict[str, Any]:
        """Get payment details"""
        if not self.client:
            return {"error": "Payment service not configured"}
        
        try:
            payment = self.client.payment.fetch(payment_id)
            return {
                "payment_id": payment["id"],
                "amount": payment["amount"],
                "currency": payment["currency"],
                "status": payment["status"],
                "method": payment["method"]
            }
        except Exception as e:
            print(f"Failed to fetch payment details: {e}")
            return {"error": "Failed to fetch payment details"}

payment_service = PaymentService() 