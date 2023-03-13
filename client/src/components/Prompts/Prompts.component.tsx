import { onInputChange } from '@/lib/useInput';
import { useStandardParams } from '@/lib/useStandardParams';
import { Input } from 'antd';
import React from 'react';
import {PromptsProps} from "./Prompts.d";
import styles from './Prompts.module.scss';

export const PromptsComponent = (props:PromptsProps) => {
    const {prompt, setPrompt, negativePrompt, setNegativePrompt} = useStandardParams();
    
    return <>
        <div>Prompt</div>
        <Input.TextArea value={prompt} onChange={onInputChange(setPrompt)}/>
        <br/><br/>
        <div>Negative Prompt</div>
        <Input.TextArea value={negativePrompt} onChange={onInputChange(setNegativePrompt)}/>
    </>;
}
