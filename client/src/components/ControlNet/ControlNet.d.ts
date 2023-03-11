export declare interface IUploadChange {
    file: {
        status?: string;
        response?: {
            file: string;
        }
    }
}

// What gets passed into the component from the parent as attributes
export declare interface IControlNetInputProps {

}

export type ControlNetProps = IControlNetInputProps;