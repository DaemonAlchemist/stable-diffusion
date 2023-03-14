import { inject, mergeProps } from "unstateless";
import {LoraSelectorComponent} from "./LoraSelector.component";
import {ILoraSelectorInputProps, LoraSelectorProps} from "./LoraSelector.d";

const connect = inject<ILoraSelectorInputProps, LoraSelectorProps>(mergeProps((a:any) => a));

export const LoraSelector = connect(LoraSelectorComponent);
