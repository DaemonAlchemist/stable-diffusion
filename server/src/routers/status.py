from fastapi import APIRouter
from src.lib.status import Status

router = APIRouter()
status = Status()

@router.get("/status")
def getHandler():
    return {
        "maxIterations": status.maxIterations,
        "curIteration": status.curIteration,
        "percentComplete": round(status.curIteration / status.maxIterations * 100),
        "status": status.status
    }