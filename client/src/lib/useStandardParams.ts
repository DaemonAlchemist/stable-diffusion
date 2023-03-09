import { useSharedState } from "unstateless";

export const useStandardParams = () => {
    const [width, setWidth] = useSharedState("width", 512)();
    const [height, setHeight] = useSharedState("height", 512)();
    const [cfgScale, setCfgScale] = useSharedState("cfgScale", 7.5)();
    const [numSteps, setNumSteps] = useSharedState("numSteps", 50)();
    const [sampler, setSampler] = useSharedState("sampler", "DDIM")();

    return {
        width, setWidth,
        height, setHeight,
        cfgScale, setCfgScale,
        numSteps, setNumSteps,
        sampler, setSampler
    };
}