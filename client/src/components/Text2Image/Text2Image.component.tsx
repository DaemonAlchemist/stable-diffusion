import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useInput } from '@/lib/useInput';
import { useLastImage } from '@/lib/useLastImage';
import { useStandardParams } from '@/lib/useStandardParams';
import { PlayCircleOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Select } from 'antd';
import { randomInt } from 'crypto';
import { pipe, prop } from 'ts-functional';
import { ControlNet } from '../ControlNet';
import { StandardParameters } from '../StandardParameters';
import { StatusBar } from '../StatusBar';
import { Text2ImageProps } from "./Text2Image.d";
import styles from './Text2Image.module.scss';

// TODO: Get an up-to-date list of schedulers from the server rather than hard-coding
const schedulers = ["DDIM","DDPM", "DPM", "EulerAncestral", "EulerDiscrete", "LMS", "PNDM"];

const getRandomInt = (min:number, max:number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const Text2ImageComponent = (props:Text2ImageProps) => {
    const [lastImage, setLastImage] = useLastImage();
    const [prompt, setPrompt] = useInput();
    const [negativePrompt, setNegativePrompt] = useInput();
    const params = useStandardParams();

    const onCreate = () => {
        const seed = getRandomInt(0, Number.MAX_SAFE_INTEGER);
        params.setSeed(seed);
        api.get("txt2img", {prompt, negativePrompt, ...params.values(), seed}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    const onRedo = () => {
        api.get("txt2img", {prompt, ...params.values()}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    return <div className={styles.txt2Img}>
        <Row gutter={24}>
            <Col xs={6}>
                <Row>
                    <Col xs={16}>
                        <StatusBar />
                    </Col>
                    <Col xs={8} className={styles.createButtons}>
                    <Button type="primary" onClick={onCreate} title="Create with a new seed">
                            <PlayCircleOutlined />
                    </Button>
                    <Button type="primary" onClick={onRedo} title="Reuse the last seed">
                        <ReloadOutlined />
                    </Button>
                    </Col>
                </Row>
                <p>Prompt</p>
                <Input.TextArea value={prompt} onChange={setPrompt}/>
                <p>Negative Prompt</p>
                <Input.TextArea value={negativePrompt} onChange={setNegativePrompt}/>
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
            <Col xs={18} className={styles.content}>
                <div className={styles.imgContainer}>
                    {!!lastImage && <img src={`${apiBase}/${lastImage}`} />}
                </div>
            </Col>
        </Row>
        
        </div>;
}
