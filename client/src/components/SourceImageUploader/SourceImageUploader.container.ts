import { inject, mergeProps } from "unstateless";
import {SourceImageUploaderComponent} from "./SourceImageUploader.component";
import {ISourceImageUploaderInputProps, SourceImageUploaderProps} from "./SourceImageUploader.d";

const connect = inject<ISourceImageUploaderInputProps, SourceImageUploaderProps>(mergeProps((a:any) => a));

export const SourceImageUploader = connect(SourceImageUploaderComponent);
