import torch
from logging import warning
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
pipe = pipe.to("cuda")

def debug(step, timestep, latents):
    warning('Step:%d Timestep:%d', step, timestep)

prompt = "a photo of an astronaut riding a horse on mars"
image = pipe(prompt, num_inference_steps=50, callback=debug).images[0]
image.save("test-sd.png")
