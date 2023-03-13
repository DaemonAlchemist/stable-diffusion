import os

from fastapi import APIRouter
from realesrgan import RealESRGANer
from gfpgan import GFPGANer
import cv2
from basicsr.archs.rrdbnet_arch import RRDBNet
from basicsr.archs.srvgg_arch import SRVGGNetCompact
import torch

router = APIRouter()

@router.get("/fixFaces")
def fixFaces(image:str):
    model = SRVGGNetCompact(num_in_ch=3, num_out_ch=3, num_feat=64, num_conv=32, upscale=4, act_type='prelu')
    model_path = os.getcwd() + "\\models\\esrgan\\realesr-general-x4v3.pth"
    half = True if torch.cuda.is_available() else False
    upsampler = RealESRGANer(scale=4, model_path=model_path, model=model, tile=0, tile_pad=10, pre_pad=0, half=half)

    face_enhancer = GFPGANer(
        model_path=os.getcwd() + "\\models\\esrgan\\GFPGANv1.4.pth",
        upscale=2,
        arch='clean',
        channel_multiplier=2,
        bg_upsampler=upsampler
    )

    img = cv2.imread(os.getcwd() + "\\" + image, cv2.IMREAD_UNCHANGED)
    _, _, output = face_enhancer.enhance(img, has_aligned=False, only_center_face=False, paste_back=True)

    newFileName = image.replace(".", "-fixedFaces.")
    cv2.imwrite(newFileName, output)

    return {"img": newFileName}
