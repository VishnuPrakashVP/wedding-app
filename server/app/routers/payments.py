from fastapi import APIRouter, HTTPException, Depends
from app.services.payments import payment_service
from app.models.user import User
from typing import Dict, Any

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/create-order")
async def create_order(
    amount: int,
    currency: str = "INR",
    notes: Dict[str, str] = None
):
    """Create a Razorpay order"""
    result = payment_service.create_order(amount, currency, notes)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/verify-payment")
async def verify_payment(
    payment_id: str,
    order_id: str,
    signature: str
):
    """Verify payment signature"""
    is_valid = payment_service.verify_payment(payment_id, order_id, signature)
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    return {"message": "Payment verified successfully"}

@router.get("/payment/{payment_id}")
async def get_payment_details(payment_id: str):
    """Get payment details"""
    result = payment_service.get_payment_details(payment_id)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/upgrade-plan")
async def upgrade_plan(
    plan_type: str,  # basic, premium, enterprise
    user_id: str
):
    """Upgrade user plan"""
    # Plan pricing in paise (₹100 = 10000 paise)
    plan_prices = {
        "basic": 10000,      # ₹100
        "premium": 50000,    # ₹500
        "enterprise": 100000 # ₹1000
    }
    
    if plan_type not in plan_prices:
        raise HTTPException(status_code=400, detail="Invalid plan type")
    
    amount = plan_prices[plan_type]
    
    result = payment_service.create_order(
        amount=amount,
        currency="INR",
        notes={
            "plan_type": plan_type,
            "user_id": user_id
        }
    )
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {
        **result,
        "plan_type": plan_type,
        "amount_inr": amount / 100
    } 