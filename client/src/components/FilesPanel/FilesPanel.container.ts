import { inject, mergeProps } from "unstateless";
import {FilesPanelComponent} from "./FilesPanel.component";
import {IFilesPanelInputProps, FilesPanelProps} from "./FilesPanel.d";

const connect = inject<IFilesPanelInputProps, FilesPanelProps>(mergeProps((a:any) => a));

export const FilesPanel = connect(FilesPanelComponent);
