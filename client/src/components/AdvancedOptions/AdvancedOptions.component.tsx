import { useStandardParams } from '@/lib/useStandardParams';
import { Input, Select } from 'antd';
import React, { ChangeEvent } from 'react';
import {AdvancedOptionsProps} from "./AdvancedOptions.d";
import styles from './AdvancedOptions.module.scss';

// TODO: Get an up-to-date list of schedulers from the server rather than hard-coding
const schedulers = ["DDIM","DDPM", "DPM", "EulerAncestral", "EulerDiscrete", "LMS", "PNDM"];

export const AdvancedOptionsComponent = (props:AdvancedOptionsProps) => {
    const {sampler, setSampler, seed, setSeed} = useStandardParams();

    const onChangeSeed = (e:ChangeEvent<HTMLInputElement>) => {
        setSeed(e.currentTarget.value);
    }
    
    return <>
        <p>
            Sampler&nbsp;
            <Select style={{width: "128px"}} value={sampler} onChange={setSampler}>
                {schedulers.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
        </p>

        <p><Input addonBefore="Set Manual Seed" value={seed} onChange={onChangeSeed} /></p>
    </>;
}
