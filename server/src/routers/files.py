from fastapi import APIRouter, UploadFile
from src.lib.status import Status
from os import listdir, getcwd, path, remove
import aiofiles

outputFilePath = "static\\outputs"
uploadFilePath = outputFilePath

router = APIRouter()

def addPath(file:str):
    return "\\" + outputFilePath + "\\" + file

@router.get("/files")
def getHandler():
    files = listdir(getcwd() + "\\" + outputFilePath)
    files = [addPath(file) for file in files if file != ".gitignore"]
    files.sort(key=lambda x: path.getmtime(getcwd() + x))
    files.reverse()
    return files

@router.post("/files")
async def uploadHandler(file:UploadFile):
    filePath = "\\" + uploadFilePath + "\\" + file.filename
    outPath = getcwd() + filePath
    async with aiofiles.open(outPath, 'wb') as out_file:
        content = await file.read()  # async read
        await out_file.write(content)  # async write
    return {"file": filePath}

@router.delete("/files/{fileName}")
async def deleteHandler(fileName:str):
    remove(getcwd() + "\\" + outputFilePath + "\\" + fileName)
    return "File deleted"