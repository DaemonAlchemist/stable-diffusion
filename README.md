# Stable Diffusion GUI and Server

A webapp for Stable Diffusion

![Stable Diffusion GUI Screenshot](/doc/screen-shot.png)

I created this project for two reason:

- The existing Stable Diffusion GUI projects did not (at the time I started this) have the features I wanted.
- I wanted to learn how Stable Diffusion worked under the hood in more depth.

## Features
- Text 2 Image
- Image 2 Image
- Inpainting / Outpainting
- ControlNet support for all three of these workflows
- Upscaling
- Batch processing
- Unified interface
  - All workflows integrated into one page.  Source image (for img2img and inpainting), mask image (for inpainting), and hint image (for control net) are all optional.  The correct pipeline will be chosen automatically based on what's selected.
- Multi-tier architecture
  - Next.JS React front-end
  - FastAPI Python backend
  - Completely separate tiers.  The backend can be run independently from the client, allowing you to write your own client if you don't like mine.

## Planned features
- Face restoration
- Fine-tuning (Textual inversion, Dreambooth, LoRA, etc.)
- End-to-end movie processing
- Unified canvas

## Prerequisites

You will need to install Python, PIP, NodeJS, NPM, Yarn, and Git before installing this app.

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

## Running

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

## Notes

Please note that this app is an *active PoC/WIP*.  Comprehensive testing has not been completed yet on either the app itself or the installation steps.  There will probably be bugs, so please let me know if there are any issues.