import { inject, mergeProps } from "unstateless";
import {Text2ImageComponent} from "./Text2Image.component";
import {IText2ImageInputProps, Text2ImageProps} from "./Text2Image.d";

const connect = inject<IText2ImageInputProps, Text2ImageProps>(mergeProps((a:any) => a));

export const Text2Image = connect(Text2ImageComponent);
