import { inject, mergeProps } from "unstateless";
import {ImageUploaderComponent} from "./ImageUploader.component";
import {IImageUploaderInputProps, ImageUploaderProps} from "./ImageUploader.d";

const connect = inject<IImageUploaderInputProps, ImageUploaderProps>(mergeProps((a:any) => a));

export const ImageUploader = connect(ImageUploaderComponent);
