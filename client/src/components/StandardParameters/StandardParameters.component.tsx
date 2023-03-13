import { useStandardParams } from '@/lib/useStandardParams';
import { Col, Row, Slider } from 'antd';
import { StandardParametersProps } from "./StandardParameters.d";
import styles from './StandardParameters.module.scss';

export const StandardParametersComponent = (props:StandardParametersProps) => {
    const {
        width, setWidth, height, setHeight,
        cfgScale, setCfgScale,
        numSteps, setNumSteps,
    } = useStandardParams();

return <Row className={styles.params} gutter={16}>
    <Col xs={12}>
        <div>Width <b>{width} px</b><Slider min={0} max={1024} step={64} value={width} onChange={setWidth} marks={{0: " ", 1024: " "}}/></div>
        <div>Height <b>{height} px</b><Slider min={0} max={1024} step={64} value={height} onChange={setHeight} marks={{0: " ", 1024: " "}}/></div>
    </Col>
    <Col xs={12}>
        <div>Prompt Strength <b>{cfgScale}</b><Slider min={1} max={20} step={0.1} value={cfgScale} onChange={setCfgScale} marks={{1: "ignore", 20: "follow"}}/></div>
        <div>Quality <b>{numSteps} steps</b><Slider min={1} max={300} step={1} value={numSteps} onChange={setNumSteps} marks={{0: "faster", 300: "better"}}/></div>
    </Col>
</Row>
;
}
