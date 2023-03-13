import { useStandardParams } from '@/lib/useStandardParams';
import React from 'react';
import { ImageUploader } from '../ImageUploader';
import {MaskImageUploaderProps} from "./MaskImageUploader.d";
import styles from './MaskImageUploader.module.scss';

export const MaskImageUploaderComponent = (props:MaskImageUploaderProps) => {
    const {maskImage, setMaskImage} = useStandardParams();
    
    return <ImageUploader
        title='Mask Image'
        text={<>Click or drag an image here to<br/>mask areas in the source image.</>}
        file={maskImage}
        setFile={setMaskImage}
    />;
}
