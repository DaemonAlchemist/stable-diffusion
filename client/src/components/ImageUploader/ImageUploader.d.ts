import { Setter } from "unstateless";

export declare interface IUploadChange {
    file: {
        status?: string;
        response?: {
            file: string;
        }
    }
}

// What gets passed into the component from the parent as attributes
export declare interface IImageUploaderInputProps {
    title: string;
    text: string | JSX.Element;
    file: string;
    setFile: Setter<string>;
    onClear?: () => void;
    children?: any;
}

export type ImageUploaderProps = IImageUploaderInputProps;