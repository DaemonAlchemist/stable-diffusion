from fastapi import APIRouter
from src.lib.status import Status

router = APIRouter()
status = Status()

@router.get("/status")
def getHandler():
    return {
        "max_iterations": status.max_iterations,
        "cur_iteration": status.cur_iteration,
        "percent_complete": round(status.cur_iteration / status.max_iterations * 100),
        "status": status.status
    }