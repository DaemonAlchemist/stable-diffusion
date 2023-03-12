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

router = APIRouter()
status = Status()

# define a function to update the iteration status
def step(step:int, timestep:int, latents:torch.FloatTensor):
    status.updateIter(step)

@router.get("/txt2img")
def txt2imgHandler(
    prompt:str="", negativePrompt:str="", seed:int=0, numImages:int=1,
    sourceImage:str = None, sourceImageStrength:float=0.5, maskImage:str = None,
    width:int=512, height:int=512,
    numSteps:int=150, cfgScale:float = 7.5, sampler:str = "DDIM",
    controlNetImage:str = None, preprocessor:str = None, controlNetStrength:float = 1.0
):
    sourceImage = load_image(os.getcwd() + "\\" + sourceImage) if sourceImage else None
    maskImage   = load_image(os.getcwd() + "\\" + maskImage  ) if maskImage   else None

    # Startup the pipeline
    status.start(numSteps)
    model = "runwayml/stable-diffusion-v1-5"
    pipe =          StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None & sourceImage == None\
        else StableDiffusionImg2ImgPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None & sourceImage != None & maskImage == None\
        else StableDiffusionInpaintPipeline.from_pretrained(model, torch_dtype=torch.float16, safety_checker=None) if controlNetImage == None & sourceImage != None & maskImage != None\
        else getControlNetPipeline(preprocessor, model, sourceImage, maskImage)
    
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
        ).images[0] if controlNetImage != None & sourceImage == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            controlnet_conditioning_image=getControlNetImage(controlNetImage, preprocessor),
            image=sourceImage,
            strength=sourceImageStrength,
            controlnet_conditioning_scale=controlNetStrength,
            generator=generator,
            scheduler=scheduler,
            callback=step,
        ).images[0] if controlNetImage != None & sourceImage != None & maskImage == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            controlnet_conditioning_image=getControlNetImage(controlNetImage, preprocessor),
            image=sourceImage,
            mask_image=maskImage,
            strength=sourceImageStrength,
            controlnet_conditioning_scale=controlNetStrength,
            generator=generator,
            scheduler=scheduler,
            callback=step,
        ).images[0] if controlNetImage != None & sourceImage != None & maskImage != None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            scheduler=scheduler,
            generator=generator,
            callback=step,
        ).images[0] if sourceImage == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            image=sourceImage,
            strength=sourceImageStrength,
            scheduler=scheduler,
            generator=generator,
            callback=step,
        ).images[0] if maskImage == None else\
        pipe(
            prompt, negative_prompt=negativePrompt, width=width, height=height,
            num_inference_steps=numSteps, guidance_scale=cfgScale,
            image=sourceImage,
            mask_image=maskImage,
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
