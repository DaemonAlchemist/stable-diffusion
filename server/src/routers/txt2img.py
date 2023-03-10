import os
from logging import warning
from random import randint

import torch
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, StableDiffusionInpaintPipeline
from diffusers.schedulers import (DDIMScheduler, DDPMScheduler,
                                  DPMSolverMultistepScheduler,
                                  EulerAncestralDiscreteScheduler,
                                  EulerDiscreteScheduler, LMSDiscreteScheduler,
                                  PNDMScheduler)
from fastapi import APIRouter
from src.lib.status import Status, event
from src.lib.control_net import getControlNetImage, getControlNetPipeline
from src.lib.format_convert import safetensors_to_bin
from src.routers.files import outputFilePath
from diffusers.utils import load_image
from src.routers.options import loraFilePath
import PIL

router = APIRouter()
status = Status()

# define a function to update the iteration status
def step(step:int, timestep:int, latents:torch.FloatTensor):
    status.updateIter(step)
    if event.is_set():
        warning("Cancelled")
        raise Exception("Image cancelled")

@router.get("/txt2img")
def txt2imgHandler(
    prompt:str="", negativePrompt:str="", seed:int=0, numImages:int=1,
    sourceImage:str = None, sourceImageStrength:float=0.5, maskImage:str = None,
    width:int=512, height:int=512,
    numSteps:int=150, cfgScale:float = 7.5, sampler:str = "DDIM",
    controlNetImage:str = None, preprocessor:str = None, controlNetStrength:float = 1.0,
    loraFile:str = None, loraStrength:float = 0.5
):
    event.clear()

    source = load_image(os.getcwd() + "\\" + sourceImage) if sourceImage else None
    mask   = load_image(os.getcwd() + "\\" + maskImage  ) if maskImage   else None

    # Startup the pipeline
    status.start(numSteps)
    model = "runwayml/stable-diffusion-v1-5"
    pipe =          StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if (controlNetImage == None) & (source == None)\
        else StableDiffusionImg2ImgPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if (controlNetImage == None) & (source != None) & (mask == None)\
        else StableDiffusionInpaintPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if (controlNetImage == None) & (source != None) & (mask != None)\
        else getControlNetPipeline(preprocessor, model, source, mask)
    
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
    pipe.scheduler = scheduler

    if loraFile:
        basePath = os.getcwd() + "\\" + loraFilePath + "\\" + loraFile
        binPath = basePath + ".bin"
        sftPath = basePath + ".safetensors"
        if not os.path.exists(binPath):
            safetensors_to_bin(sftPath, binPath)
           
        pipe.unet.load_attn_procs(binPath, weight_name=binPath)

    pipe = pipe.to("cuda")

    # Generate the image
    try:
        for x in range(numImages):
            status.updateIter(0)
            status.updateStatus("Generating")
            generator = torch.Generator("cuda").manual_seed(seed)
            seed+=1
            image = pipe( # txt2img with controlnet
                prompt, negative_prompt=negativePrompt, width=width, height=height,
                num_inference_steps=numSteps, guidance_scale=cfgScale,
                image=getControlNetImage(controlNetImage, preprocessor),
                controlnet_conditioning_scale=controlNetStrength,
                generator=generator,
                cross_attention_kwargs={"scale": loraStrength},
                callback=step,
            ).images[0] if (controlNetImage != None) & (source == None) else\
            pipe( # img2img with controlnet
                prompt, negative_prompt=negativePrompt,
                num_inference_steps=numSteps, guidance_scale=cfgScale,
                controlnet_conditioning_image=getControlNetImage(controlNetImage, preprocessor),
                image=source,
                strength=sourceImageStrength,
                controlnet_conditioning_scale=controlNetStrength,
                generator=generator,
                cross_attention_kwargs={"scale": loraStrength},
                callback=step,
            ).images[0] if (controlNetImage != None) & (source != None) & (mask == None) else\
            pipe( # inpainting with controlnet
                prompt, negative_prompt=negativePrompt,
                num_inference_steps=numSteps, guidance_scale=cfgScale,
                controlnet_conditioning_image=getControlNetImage(controlNetImage, preprocessor),
                image=source,
                mask_image=mask,
                strength=sourceImageStrength,
                controlnet_conditioning_scale=controlNetStrength,
                generator=generator,
                cross_attention_kwargs={"scale": loraStrength},
                callback=step,
            ).images[0] if (controlNetImage != None) & (source != None) & (mask != None) else\
            pipe( # txt2img
                prompt, negative_prompt=negativePrompt, width=width, height=height,
                num_inference_steps=numSteps, guidance_scale=cfgScale,
                cross_attention_kwargs={"scale": loraStrength},
                generator=generator,
                callback=step,
            ).images[0] if (source == None) else\
            pipe( # img2img
                prompt, negative_prompt=negativePrompt,
                num_inference_steps=numSteps, guidance_scale=cfgScale,
                image=source,
                strength=sourceImageStrength,
                cross_attention_kwargs={"scale": loraStrength},
                generator=generator,
                callback=step,
            ).images[0] if (mask == None) else\
            pipe( # inpainting
                prompt, negative_prompt=negativePrompt,
                num_inference_steps=numSteps, guidance_scale=cfgScale,
                image=source,
                mask_image=mask,
                strength=sourceImageStrength,
                cross_attention_kwargs={"scale": loraStrength},
                generator=generator,
                callback=step,
            ).images[0]

            # Save the final image
            status.updateStatus("Saving image")
            fileName = outputFilePath + "\\" + prompt.replace(",", "").replace("(", "").replace(")", "")[0:50] + "-{}".format(randint(0, 1000000)) + ".png"
            status.updateLastImage(fileName)
            image.save(fileName)
    except Exception as e:
        warning(e)
        status.done()
        return {"img": ""}

    # Update the status
    status.done()

    # Return the new file's path
    return {"img": fileName}
