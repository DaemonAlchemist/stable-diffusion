import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useInput } from '@/lib/useInput';
import { useLastImage } from '@/lib/useLastImage';
import { useStandardParams } from '@/lib/useStandardParams';
import { PlayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Select } from 'antd';
import { pipe, prop } from 'ts-functional';
import { ControlNet } from '../ControlNet';
import { StandardParameters } from '../StandardParameters';
import { StatusBar } from '../StatusBar';
import { Text2ImageProps } from "./Text2Image.d";
import styles from './Text2Image.module.scss';

// TODO: Get an up-to-date list of schedulers from the server rather than hard-coding
const schedulers = ["DDIM","DDPM", "DPM", "EulerAncestral", "EulerDiscrete", "LMS", "PNDM"];

export const Text2ImageComponent = (props:Text2ImageProps) => {
    const [lastImage, setLastImage] = useLastImage();
    const [prompt, setPrompt] = useInput();
    const params = useStandardParams();

    const onCreate = () => {
        api.get("txt2img", {prompt, ...params.values()}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    return <div className={styles.txt2Img}>
        <Row gutter={24}>
            <Col xs={6}>
                <Row>
                    <Col xs={18}>
                        <StatusBar />
                    </Col>
                    <Col xs={6}>
                    <Button type="primary" onClick={onCreate}>
                            <PlayCircleOutlined /> Create
                    </Button>
                    </Col>
                </Row>
                <p>Prompt</p>
                <Input.TextArea value={prompt} onChange={setPrompt}/>
                <StandardParameters />
                <ControlNet />
                <Collapse>
                    <Collapse.Panel key="advanced" header={<><SettingOutlined /> Advanced Options</>}>
                        Sampler&nbsp;
                        <Select style={{width: "128px"}} value={params.sampler} onChange={params.setSampler}>
                            {schedulers.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                        </Select>
                    </Collapse.Panel>
                </Collapse>
            </Col>
            <Col xs={18}>
                <div className={styles.imgContainer} style={{width: params.width, height: params.height}}>
                    {!!lastImage && <img src={`${apiBase}/${lastImage}`} />}
                </div>
            </Col>
        </Row>
        
        </div>;
}
