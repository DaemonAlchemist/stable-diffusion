# Stable Diffusion GUI and Server

This is a project I started for two reason:

- The existing Stable Diffusion GUI projects did not (at the time) have the features I wanted.
- I wanted to learn how Stable Diffusion worked under the hood in more depth.

## Features
- Multi-tier architecture
  - Next.JS React front-end
  - FastAPI Python backend
  - Completely separate tiers.  The backend can be run independently from the client, allowing you to write your own client if you don't like mine.
- Unified interface
  - Text-to-Image and Image-to-Image workflows are integrated into one workflow.
- ControlNet support

## Planned features
- Face restoration
- Upscaling
- Inpainting
- Outpainting
- Fine-tuning (Textual inversion, Dreambooth, LoRA, etc.)
- End-to-end movie processing

## Installing

Clone the repository

```
git clone https://github.com/DaemonAlchemist/stable-diffusion.git
```

Install the server:

```
> cd server
> ./install
```

Install the client:

```
> cd client
> yarn
```

# Running

Run the server:

```
> cd server
> ./start
```

Run the client:

```
> cd client
> yarn dev
```

By default, the server will attach to port 8000 and the client will attach to port 3000.

Once everything is running, view the webapp at http://localhost:3000
