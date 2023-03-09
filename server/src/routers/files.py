from fastapi import APIRouter
from src.lib.status import Status
from os import listdir, getcwd

outputFilePath = "static\\outputs"

router = APIRouter()

def addPath(file:str):
    return "\\" + outputFilePath + "\\" +file

@router.get("/files")
def getHandler():
    files = listdir(getcwd() + "\\" + outputFilePath)
    return [addPath(file) for file in files]