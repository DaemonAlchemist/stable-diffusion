from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routers import status, txt2img, files

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(status.router)
app.include_router(txt2img.router)
app.include_router(files.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Stable Diffusion Server running"}
