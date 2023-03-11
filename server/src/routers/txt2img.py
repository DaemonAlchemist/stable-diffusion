from logging import warning
from random import randint

import torch
from diffusers import StableDiffusionPipeline, ControlNetModel, StableDiffusionControlNetPipeline
from diffusers.schedulers import (DDIMScheduler, DDPMScheduler,
                                  DPMSolverMultistepScheduler,
                                  EulerAncestralDiscreteScheduler,
                                  EulerDiscreteScheduler, LMSDiscreteScheduler,
                                  PNDMScheduler)
from fastapi import APIRouter
from src.lib.status import Status
from src.routers.files import outputFilePath
import os
from diffusers.utils import load_image
import numpy as np
import cv2
from PIL import Image
from controlnet_aux import OpenposeDetector, HEDdetector, MLSDdetector
from transformers import pipeline, AutoImageProcessor, UperNetForSemanticSegmentation

router = APIRouter()
status = Status()

# define a function to update the iteration status
def step(step, timestep, latents):
    status.updateIter(step)

def getControlNetPipeline(preprocessor:str, model:str):
    controlNetModel =\
        "lllyasviel/sd-controlnet-canny"    if preprocessor == "canny"    else\
        "lllyasviel/sd-controlnet-depth"    if preprocessor == "depth"    else\
        "lllyasviel/sd-controlnet-hed"      if preprocessor == "hed"      else\
        "lllyasviel/sd-controlnet-mlsd"     if preprocessor == "mlsd"     else\
        "lllyasviel/sd-controlnet-normal"   if preprocessor == "normal"   else\
        "lllyasviel/sd-controlnet-openpose" if preprocessor == "openpose" else\
        "lllyasviel/sd-controlnet-scribble" if preprocessor == "scribble" else\
        "lllyasviel/sd-controlnet-seg"      if preprocessor == "segments" else\
        "lllyasviel/sd-controlnet-canny"
    
    controlnet = ControlNetModel.from_pretrained(controlNetModel, torch_dtype=torch.float16)
    pipe = StableDiffusionControlNetPipeline.from_pretrained(
        model, controlnet=controlnet, torch_dtype=torch.float16, safety_checker=None
    )

    pipe.enable_model_cpu_offload()

    return pipe

def getControlNetImage(controlNetImage:str, preprocessor:str):
    image = load_image(os.getcwd() + "\\" + controlNetImage)

    hintImage =\
        canny(image)    if preprocessor == "canny"    else\
        depth(image)    if preprocessor == "depth"    else\
        hed(image)      if preprocessor == "hed"      else\
        mlsd(image)     if preprocessor == "mlsd"     else\
        normal(image)   if preprocessor == "normal"   else\
        pose(image)     if preprocessor == "openpose" else\
        scribble(image) if preprocessor == "scribble" else\
        segments(image) if preprocessor == "segments" else\
        canny(image)
    return hintImage

def canny(baseImage:np.ndarray):
    image = np.array(baseImage)
    low_threshold = 100
    high_threshold = 200

    image = cv2.Canny(image, low_threshold, high_threshold)
    image = image[:, :, None]
    image = np.concatenate([image, image, image], axis=2)
    return Image.fromarray(image)

def depth(baseImage:np.ndarray):
    depth_estimator = pipeline('depth-estimation')
    image = depth_estimator(baseImage)['depth']
    image = np.array(image)
    image = image[:, :, None]
    image = np.concatenate([image, image, image], axis=2)
    return Image.fromarray(image)

def pose(baseImage:np.ndarray):
    model = OpenposeDetector.from_pretrained("lllyasviel/ControlNet")
    return model(baseImage)

def hed(baseImage:np.ndarray):
    hed = HEDdetector.from_pretrained('lllyasviel/ControlNet')
    return hed(baseImage)

def normal(baseImage:np.ndarray):
    depth_estimator = pipeline("depth-estimation", model ="Intel/dpt-hybrid-midas" )
    image = depth_estimator(baseImage)['predicted_depth'][0]

    image = image.numpy()

    image_depth = image.copy()
    image_depth -= np.min(image_depth)
    image_depth /= np.max(image_depth)

    bg_threhold = 0.4

    x = cv2.Sobel(image, cv2.CV_32F, 1, 0, ksize=3)
    x[image_depth < bg_threhold] = 0

    y = cv2.Sobel(image, cv2.CV_32F, 0, 1, ksize=3)
    y[image_depth < bg_threhold] = 0

    z = np.ones_like(x) * np.pi * 2.0

    image = np.stack([x, y, z], axis=2)
    image /= np.sum(image ** 2.0, axis=2, keepdims=True) ** 0.5
    image = (image * 127.5 + 127.5).clip(0, 255).astype(np.uint8)
    return Image.fromarray(image)

def mlsd(baseImage:np.ndarray):
    mlsd = MLSDdetector.from_pretrained('lllyasviel/ControlNet')
    return mlsd(baseImage)

# TODO - Implement these

def scribble(baseImage:np.ndarray):
    hed = HEDdetector.from_pretrained('lllyasviel/ControlNet')
    return hed(baseImage, scribble=true)

def segments(baseImage:np.ndarray):
    image_processor = AutoImageProcessor.from_pretrained("openmmlab/upernet-convnext-small")
    image_segmentor = UperNetForSemanticSegmentation.from_pretrained("openmmlab/upernet-convnext-small")
    pixel_values = image_processor(baseImage, return_tensors="pt").pixel_values

    with torch.no_grad():
        outputs = image_segmentor(pixel_values)

    seg = image_processor.post_process_semantic_segmentation(outputs, target_sizes=[image.size[::-1]])[0]

    color_seg = np.zeros((seg.shape[0], seg.shape[1], 3), dtype=np.uint8) # height, width, 3

    palette = np.array(ade_palette())

    for label, color in enumerate(palette):
        color_seg[seg == label, :] = color

    color_seg = color_seg.astype(np.uint8)

    return Image.fromarray(color_seg)

@router.get("/txt2img")
def txt2imgHandler(
    prompt:str,
    width:int, height:int,
    numSteps:int=150, cfgScale:float = 7.5, sampler:str = "DDIM",
    controlNetImage:str = None, preprocessor:str = None, controlNetStrength:float = 1.0
):

    # Startup the pipeline
    status.start(numSteps)
    model = "runwayml/stable-diffusion-v1-5"
    pipe = StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None\
        else getControlNetPipeline(preprocessor, model)
    
    # Instantiate the scheduler
    scheduler = {
        "DDIM": DDIMScheduler,
        "DDPM": DDPMScheduler,
        "DPM": DPMSolverMultistepScheduler,
        "EulerAncestral": EulerAncestralDiscreteScheduler,
        "EulerDiscrete": EulerDiscreteScheduler,
        "LMS": LMSDiscreteScheduler,
        "PNDM": PNDMScheduler,
    }[sampler].from_config(pipe.scheduler.config)

    pipe = pipe.to("cuda")

    # Generate the image
    status.updateStatus("Generating")
    image = pipe(
        prompt, width=width, height=height,
        num_inference_steps=numSteps, guidance_scale=cfgScale,
        image=getControlNetImage(controlNetImage, preprocessor),
        controlnet_conditioning_scale=controlNetStrength,
        callback=step,
    ).images[0] if controlNetImage != None else pipe(
        prompt, width=width, height=height,
        num_inference_steps=numSteps, guidance_scale=cfgScale,
        callback=step,
    ).images[0]

    # Save the final image
    status.updateStatus("Saving image")
    fileName = outputFilePath + "\\{}-{}.png".format(prompt, randint(0, 1000000))
    image.save(fileName)

    # Update the status
    status.done()

    # Return the new file's path
    return {"img": fileName}
