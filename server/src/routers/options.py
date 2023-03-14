from fastapi import APIRouter
from os import listdir, getcwd, path
from numpy import unique

loraFilePath = "models\\lora"
def addPath(file:str):
    return "\\" + loraFilePath + "\\" + file

def stripExtension(file:str):
    return file.replace(".safetensors", "").replace(".bin", "")

router = APIRouter()

@router.get("/options/lora")
def getHandler():
    files = listdir(getcwd() + "\\" + loraFilePath)
    files = [stripExtension(file) for file in files if file != ".gitignore"]
    files = unique(files)
    files = [addPath(file) for file in files]
    files.sort(key=lambda x: x)
    return files
