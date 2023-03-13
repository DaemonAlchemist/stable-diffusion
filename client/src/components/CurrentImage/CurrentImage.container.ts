import { inject, mergeProps } from "unstateless";
import {CurrentImageComponent} from "./CurrentImage.component";
import {ICurrentImageInputProps, CurrentImageProps} from "./CurrentImage.d";

const connect = inject<ICurrentImageInputProps, CurrentImageProps>(mergeProps((a:any) => a));

export const CurrentImage = connect(CurrentImageComponent);
