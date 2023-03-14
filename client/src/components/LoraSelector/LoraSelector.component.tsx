import { api } from '@/lib/api';
import { useStandardParams } from '@/lib/useStandardParams';
import { Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { last } from 'ts-functional';
import {LoraSelectorProps} from "./LoraSelector.d";
import styles from './LoraSelector.module.scss';

export const LoraSelectorComponent = (props:LoraSelectorProps) => {
    const [options, setOptions] = useState<string[]>([]);
    const {loraFile, setLoraFile, loraStrength, setLoraStrength} = useStandardParams();

    const refresh = () => {
        api.get("options/lora", {}).then(setOptions);
    };

    useEffect(() => {
        const timer = window.setInterval(refresh, 10000);
        refresh();
        return () => window.clearInterval(timer);
    }, []);

    const name = (file:string) => last(file.split("\\"))?.replace(".safetensors", "")
    
    return <>
        <Select value={loraFile} onChange={setLoraFile} style={{width: "100%"}}>
            <Select.Option value=""><em>None selected</em></Select.Option>
            {options.map(file => <Select.Option key={file} value={name(file)}>
                {name(file)}
            </Select.Option>)}
        </Select>
        <Slider value={loraStrength} onChange={setLoraStrength} min={0} max={1} step={0.05} marks={{0: "less", 1: "more"}} />
    </>;
}