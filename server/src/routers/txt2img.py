from fastapi import APIRouter

import torch
from logging import warning
from diffusers import StableDiffusionPipeline
from src.lib.status import Status
from src.routers.files import outputFilePath

from random import randint

router = APIRouter()
status = Status()

# define a function to update the iteration status
def step(step, timestep, latents):
    status.updateIter(step)

@router.get("/txt2img")
def txt2imgHandler(prompt:str, width:int, height:int, numSteps:int=150, cfgScale:float = 7.5):
    # Startup the pipeline
    status.start(numSteps)
    pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16, safe_checker=None)
    pipe = pipe.to("cuda")

    # Generate the image
    status.updateStatus("Generating")
    image = pipe(
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
