import { inject, mergeProps } from "unstateless";
import {MaskImageUploaderComponent} from "./MaskImageUploader.component";
import {IMaskImageUploaderInputProps, MaskImageUploaderProps} from "./MaskImageUploader.d";

const connect = inject<IMaskImageUploaderInputProps, MaskImageUploaderProps>(mergeProps((a:any) => a));

export const MaskImageUploader = connect(MaskImageUploaderComponent);
