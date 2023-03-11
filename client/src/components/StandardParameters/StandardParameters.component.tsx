import { useStandardParams } from '@/lib/useStandardParams';
import { Col, Row, Slider } from 'antd';
import { StandardParametersProps } from "./StandardParameters.d";
import styles from './StandardParameters.module.scss';

export const StandardParametersComponent = (props:StandardParametersProps) => {
    const params = useStandardParams();

    return <Row className={styles.params} gutter={16}>
    <Col xs={12}>
        <p>Image Width <b>{params.width} px</b><Slider min={0} max={1024} step={64} value={params.width} onChange={params.setWidth} marks={{0: " ", 1024: " "}}/></p>
        <p>Image Height <b>{params.height} px</b><Slider min={0} max={1024} step={64} value={params.height} onChange={params.setHeight} marks={{0: " ", 1024: " "}}/></p>
    </Col>
    <Col xs={12}>
        <p>Prompt Strength <b>{params.cfgScale}</b><Slider min={1} max={20} step={0.1} value={params.cfgScale} onChange={params.setCfgScale} marks={{1: "ignore", 20: "follow"}}/></p>
        <p>Quality <b>{params.numSteps} steps</b><Slider min={1} max={300} step={1} value={params.numSteps} onChange={params.setNumSteps} marks={{0: "faster", 300: "better"}}/></p>
    </Col>
</Row>
;
}
