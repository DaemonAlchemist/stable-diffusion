import { inject, mergeProps } from "unstateless";
import {PromptsComponent} from "./Prompts.component";
import {IPromptsInputProps, PromptsProps} from "./Prompts.d";

const connect = inject<IPromptsInputProps, PromptsProps>(mergeProps((a:any) => a));

export const Prompts = connect(PromptsComponent);
