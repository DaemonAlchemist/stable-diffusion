import { inject, mergeProps } from "unstateless";
import {StandardParametersComponent} from "./StandardParameters.component";
import {IStandardParametersInputProps, StandardParametersProps} from "./StandardParameters.d";

const connect = inject<IStandardParametersInputProps, StandardParametersProps>(mergeProps((a:any) => a));

export const StandardParameters = connect(StandardParametersComponent);
