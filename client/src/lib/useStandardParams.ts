import { useSharedState } from "unstateless";

export const useStandardParams = () => {
    const [seed, setSeed] = useSharedState("seed", 0)();
    const [width, setWidth] = useSharedState("width", 512)();
    const [height, setHeight] = useSharedState("height", 512)();
    const [cfgScale, setCfgScale] = useSharedState("cfgScale", 7.5)();
    const [numSteps, setNumSteps] = useSharedState("numSteps", 50)();
    const [sampler, setSampler] = useSharedState("sampler", "DDIM")();
    const [controlNetImage, setControlNetImage] = useSharedState("controlNetImage", "")();
    const [preprocessor, setPreprocessor] = useSharedState("preprocessor", "")();
    const [controlNetStrength, setControlNetStrength] = useSharedState("controlNetStrength", 1.0)();

    const values = {
        seed,
        width,
        height,
        cfgScale,
        numSteps,
        sampler,
        controlNetImage,
        preprocessor,
        controlNetStrength
    };

    return {
        ...values,
        setSeed,
        setWidth,
        setHeight,
        setCfgScale,
        setNumSteps,
        setSampler,
        setControlNetImage,
        setPreprocessor,
        setControlNetStrength,
        values: () => values,
    };
}
