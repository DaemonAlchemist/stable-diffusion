import os

from fastapi import APIRouter
from realesrgan import RealESRGANer
import cv2
from basicsr.archs.rrdbnet_arch import RRDBNet

router = APIRouter()

@router.get("/upscale")
def upscale(image:str):
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)

    upsampler = RealESRGANer(
        scale=4,
        model_path=os.getcwd() + "\\models\\esrgan\\RealESRGAN_x4plus.pth",
        model=model,
        tile=0,
        tile_pad=10,
        pre_pad=0)
    
    img = cv2.imread(os.getcwd() + "\\" + image, cv2.IMREAD_UNCHANGED)
    output, _ = upsampler.enhance(img, outscale=4)

    newFileName = image.replace(".", "-upscaled.")
    cv2.imwrite(newFileName, output)

    return {"img": newFileName}
