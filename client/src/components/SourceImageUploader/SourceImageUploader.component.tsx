import { useStandardParams } from '@/lib/useStandardParams';
import { Slider } from 'antd';
import React from 'react';
import { ImageUploader } from '../ImageUploader';
import {SourceImageUploaderProps} from "./SourceImageUploader.d";
import styles from './SourceImageUploader.module.scss';

export const SourceImageUploaderComponent = (props:SourceImageUploaderProps) => {
    const {sourceImage, setSourceImage, sourceImageStrength, setSourceImageStrength} = useStandardParams();
    
    return <ImageUploader
        title='Source Image'
        text="Click or drag an image here to start generating from."
        file={sourceImage}
        setFile={setSourceImage}
    >
        <br/>
        Variation
        <Slider value={sourceImageStrength} min={0} max={1} step={0.01} onChange={setSourceImageStrength} marks={{0: "less", 1: "more"}} />
    </ImageUploader>;
}