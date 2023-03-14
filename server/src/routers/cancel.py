from fastapi import APIRouter
from src.lib.status import Status, event

router = APIRouter()
status = Status()

@router.get("/cancel")
def getHandler():
    event.set()
    return {
        "msg": "Image cancelled"
    }