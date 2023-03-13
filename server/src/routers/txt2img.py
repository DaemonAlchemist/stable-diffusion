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
from src.lib.status import Status
from src.lib.control_net import getControlNetImage, getControlNetPipeline
from src.routers.files import outputFilePath
from diffusers.utils import load_image
import PIL

router = APIRouter()
status = Status()

# define a function to update the iteration status
def step(step:int, timestep:int, latents:torch.FloatTensor):
    status.updateIter(step)

@router.get("/txt2img")
def txt2imgHandler(
    prompt:str="", negativePrompt:str="", seed:int=0, numImages:int=1,
    sourceImage:str = None, sourceImageStrength:float=0.5, maskImage:str = None,
    width:int=512, height:int=512, sizeSource:str = "manual",
    numSteps:int=150, cfgScale:float = 7.5, sampler:str = "DDIM",
    controlNetImage:str = None, preprocessor:str = None, controlNetStrength:float = 1.0
):
    source = load_image(os.getcwd() + "\\" + sourceImage) if sourceImage else None
    mask   = load_image(os.getcwd() + "\\" + maskImage  ) if maskImage   else None
    hint   = load_image(os.getcwd() + "\\" + controlNetImage)

    if sizeSource == "source" :
        width = source.width
        height = source.height
    if sizeSource == "hint":
        width = hint.width
        height = hint.height

    # Startup the pipeline
    status.start(numSteps)
    model = "runwayml/stable-diffusion-v1-5"
    pipe =          StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None & source == None\
        else StableDiffusionImg2ImgPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None & source != None & mask == None\
        else StableDiffusionInpaintPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None & source != None & mask != None\
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

    pipe = pipe.to("cuda")


    # Generate the image
    for x in range(numImages):
        status.updateIter(0)
        status.updateStatus("Generating")
        generator = torch.Generator("cuda").manual_seed(seed)
        seed+=1
        image = pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            image=getControlNetImage(controlNetImage, preprocessor),
            controlnet_conditioning_scale=controlNetStrength,
            generator=generator,
            scheduler=scheduler,
            callback=step,
        ).images[0] if controlNetImage != None & source == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            controlnet_conditioning_image=getControlNetImage(controlNetImage, preprocessor),
            image=source,
            strength=sourceImageStrength,
            controlnet_conditioning_scale=controlNetStrength,
            generator=generator,
            scheduler=scheduler,
            callback=step,
        ).images[0] if controlNetImage != None & source != None & mask == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            controlnet_conditioning_image=getControlNetImage(controlNetImage, preprocessor),
            image=source,
            mask_image=mask,
            strength=sourceImageStrength,
            controlnet_conditioning_scale=controlNetStrength,
            generator=generator,
            scheduler=scheduler,
            callback=step,
        ).images[0] if controlNetImage != None & source != None & mask != None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            scheduler=scheduler,
            generator=generator,
            callback=step,
        ).images[0] if source == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            image=source,
            strength=sourceImageStrength,
            scheduler=scheduler,
            generator=generator,
            callback=step,
        ).images[0] if mask == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            image=source,
            mask_image=mask,
            strength=sourceImageStrength,
            scheduler=scheduler,
            generator=generator,
            callback=step,
        ).images[0]

        # Save the final image
        status.updateStatus("Saving image")
        fileName = outputFilePath + "\\{}-{}.png".format(prompt, randint(0, 1000000))
        status.updateLastImage(fileName)
        image.save(fileName)

    # Update the status
    status.done()

    # Return the new file's path
    return {"img": fileName}
