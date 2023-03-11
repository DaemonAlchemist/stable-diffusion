import { useSharedState } from "unstateless";

export const useLastImage = useSharedState("lastImage", "");