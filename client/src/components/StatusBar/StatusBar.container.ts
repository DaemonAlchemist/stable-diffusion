import { inject, mergeProps } from "unstateless";
import {StatusBarComponent} from "./StatusBar.component";
import {IStatusBarInputProps, StatusBarProps} from "./StatusBar.d";

const connect = inject<IStatusBarInputProps, StatusBarProps>(mergeProps((a:any) => a));

export const StatusBar = connect(StatusBarComponent);
