import { useStandardParams } from '@/lib/useStandardParams';
import { BulbOutlined, PictureOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Radio, RadioChangeEvent, Row, Slider } from 'antd';
import { useEffect } from 'react';
import { StandardParametersProps } from "./StandardParameters.d";
import styles from './StandardParameters.module.scss';

export const StandardParametersComponent = (props:StandardParametersProps) => {
    const {
        width, setWidth, height, setHeight,
        sizeSource, setSizeSource,
        cfgScale, setCfgScale,
        numSteps, setNumSteps,
        sourceImage, controlNetImage,
    } = useStandardParams();

    const onSizeSourceChange = (e:RadioChangeEvent) => {
        setSizeSource(e.target.value);
    }

    useEffect(() => {
        if(!sourceImage && sizeSource == "source") {
            setSizeSource("manual");
        }
    }, [sourceImage]);

    useEffect(() => {
        if(!controlNetImage && sizeSource == "hint") {
            setSizeSource("manual");
        }
    }, [controlNetImage]);

return <Row className={styles.params} gutter={16}>
    <Col xs={12}>
        <p>Width <b>{width} px</b><Slider disabled={sizeSource !== "manual"} min={0} max={1024} step={64} value={width} onChange={setWidth} marks={{0: " ", 1024: " "}}/></p>
        <p>Height <b>{height} px</b><Slider disabled={sizeSource !== "manual"} min={0} max={1024} step={64} value={height} onChange={setHeight} marks={{0: " ", 1024: " "}}/></p>
    </Col>
    <Col xs={12}>
        <p>Prompt Strength <b>{cfgScale}</b><Slider min={1} max={20} step={0.1} value={cfgScale} onChange={setCfgScale} marks={{1: "ignore", 20: "follow"}}/></p>
        <p>Quality <b>{numSteps} steps</b><Slider min={1} max={300} step={1} value={numSteps} onChange={setNumSteps} marks={{0: "faster", 300: "better"}}/></p>
    </Col>
    <Col xs={24}>
        Get output size from...<br/>
        <Radio.Group optionType="button" value={sizeSource} onChange={onSizeSourceChange}>
            <Radio value="manual"><SettingOutlined /> Options</Radio>
            <Radio value="source" disabled={!sourceImage}><PictureOutlined /> Source Image</Radio>
            <Radio value="hint" disabled={!controlNetImage}><BulbOutlined /> Hint Image</Radio>
        </Radio.Group>
    </Col>
</Row>
;
}
