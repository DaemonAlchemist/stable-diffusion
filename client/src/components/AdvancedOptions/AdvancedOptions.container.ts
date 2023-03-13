import { inject, mergeProps } from "unstateless";
import {AdvancedOptionsComponent} from "./AdvancedOptions.component";
import {IAdvancedOptionsInputProps, AdvancedOptionsProps} from "./AdvancedOptions.d";

const connect = inject<IAdvancedOptionsInputProps, AdvancedOptionsProps>(mergeProps((a:any) => a));

export const AdvancedOptions = connect(AdvancedOptionsComponent);
