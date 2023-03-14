from fastapi import APIRouter
from src.lib.status import event

router = APIRouter()

@router.get("/cancel")
def getHandler():
    event.set()
    return {
        "msg": "Image cancelled"
    }