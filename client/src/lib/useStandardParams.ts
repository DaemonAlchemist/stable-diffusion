import { useSharedState } from "unstateless";

export const useStandardParams = () => {
    const [prompt, setPrompt]                           = useSharedState("prompt",              ""      )();
    const [negativePrompt, setNegativePrompt]           = useSharedState("negativePrompt",      ""      )();
    const [seed, setSeed]                               = useSharedState("seed",                0       )();
    const [width, setWidth]                             = useSharedState("width",               512     )();
    const [height, setHeight]                           = useSharedState("height",              512     )();
    const [sourceImage, setSourceImage]                 = useSharedState("sourceImage",         ""      )();
    const [maskImage, setMaskImage]                     = useSharedState("maskImage",           ""      )();
    const [sourceImageStrength, setSourceImageStrength] = useSharedState("sourceImageStrength", 0.5     )();
    const [cfgScale, setCfgScale]                       = useSharedState("cfgScale",            7.5     )();
    const [numSteps, setNumSteps]                       = useSharedState("numSteps",            50      )();
    const [sampler, setSampler]                         = useSharedState("sampler",             "DDIM"  )();
    const [controlNetImage, setControlNetImage]         = useSharedState("controlNetImage",     ""      )();
    const [preprocessor, setPreprocessor]               = useSharedState("preprocessor",        ""      )();
    const [controlNetStrength, setControlNetStrength]   = useSharedState("controlNetStrength",  1.0     )();
    const [loraFile, setLoraFile]                       = useSharedState("loraFile",            ""      )();
    const [loraStrength, setLoraStrength]               =useSharedState("loraStrength",         0.5     )();

    const values = {
        prompt, negativePrompt, seed,
        width, height,
        sourceImage, maskImage, sourceImageStrength,
        cfgScale, numSteps, sampler,
        controlNetImage, preprocessor, controlNetStrength,
        loraFile, loraStrength
    };

    return {
        ...values,
        setPrompt, setNegativePrompt, setSeed,
        setWidth, setHeight,
        setSourceImage, setMaskImage, setSourceImageStrength,
        setCfgScale, setNumSteps, setSampler,
        setControlNetImage, setPreprocessor, setControlNetStrength,
        setLoraFile, setLoraStrength,
        values: () => values,
    };
}
