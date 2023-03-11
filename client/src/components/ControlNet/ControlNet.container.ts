import { inject, mergeProps } from "unstateless";
import {ControlNetComponent} from "./ControlNet.component";
import {IControlNetInputProps, ControlNetProps} from "./ControlNet.d";

const connect = inject<IControlNetInputProps, ControlNetProps>(mergeProps((a:any) => a));

export const ControlNet = connect(ControlNetComponent);
