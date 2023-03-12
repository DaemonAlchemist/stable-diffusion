import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useInput } from '@/lib/useInput';
import { useLastImage } from '@/lib/useLastImage';
import { useStandardParams } from '@/lib/useStandardParams';
import { BulbOutlined, ControlOutlined, EditOutlined, ExpandOutlined, PictureOutlined, ReloadOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Select, Slider } from 'antd';
import { ChangeEvent } from 'react';
import { pipe, prop } from 'ts-functional';
import { ControlNet } from '../ControlNet';
import { ImageUploader } from '../ImageUploader';
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
    const [numImages, setNumImages] = useInput("1");
    const params = useStandardParams();

    const onCreate = () => {
        const seed = getRandomInt(0, Number.MAX_SAFE_INTEGER);
        params.setSeed(seed);
        api.get("txt2img", {prompt, negativePrompt, numImages, ...params.values(), seed}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    const onRedo = () => {
        api.get("txt2img", {prompt, ...params.values()}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    const onChangeSeed = (e:ChangeEvent<HTMLInputElement>) => {
        params.setSeed(e.currentTarget.value);
    }

    return <div className={styles.txt2Img}>
        <Row gutter={24}>
            <Col xs={6}>
                <Row>
                    <Col xs={24}>
                        <StatusBar />
                    </Col>
                    <Col xs={24} className={styles.createButtons}>
                        <Input addonBefore="Create image(s)" type="number" style={{width: 200}} value={+numImages} onChange={setNumImages}/>
                        <Button type="primary" onClick={onRedo} title="Reuse the last seed">
                            <ReloadOutlined />
                        </Button>
                        <Button type="primary" onClick={onCreate} title="Create with a new seed">
                            <SendOutlined />
                        </Button>
                    </Col>
                </Row>
                <Collapse defaultActiveKey={["prompt", "params"]}>
                    <Collapse.Panel key="prompt" header={<><EditOutlined /> Prompts</>}>
                        <div>Prompt</div>
                        <Input.TextArea value={prompt} onChange={setPrompt}/>
                        <br/><br/>
                        <div>Negative Prompt</div>
                        <Input.TextArea value={negativePrompt} onChange={setNegativePrompt}/>
                    </Collapse.Panel>
                    <Collapse.Panel key="params" header={<><SettingOutlined/> Standard Options</>}>
                        <StandardParameters />
                    </Collapse.Panel>
                    <Collapse.Panel key="image" header={<><PictureOutlined /> Source Image</>}>
                        <ImageUploader
                            title='Source Image'
                            text="Click or drag an image here to start generating from."
                            file={params.sourceImage}
                            setFile={params.setSourceImage}
                        >
                            <br/>
                            Variation
                            <Slider value={params.sourceImageStrength} min={0} max={1} step={0.01} onChange={params.setSourceImageStrength} marks={{0: "less", 1: "more"}} />
                        </ImageUploader>
                    </Collapse.Panel>
                    {!!params.sourceImage && <Collapse.Panel key="mask" header={<><ExpandOutlined /> Mask Image</>}>
                        <ImageUploader
                            title='Mask Image'
                            text={<>Click or drag an image here to<br/>mask areas in the source image.</>}
                            file={params.maskImage}
                            setFile={params.setMaskImage}
                        />
                    </Collapse.Panel>}
                    <Collapse.Panel key="controlnet" header={<><BulbOutlined /> Hint Image</>}>
                        <ControlNet />
                    </Collapse.Panel>
                    <Collapse.Panel key="advanced" header={<><ControlOutlined /> Advanced Options</>}>
                        <p>
                            Sampler&nbsp;
                            <Select style={{width: "128px"}} value={params.sampler} onChange={params.setSampler}>
                                {schedulers.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                            </Select>
                        </p>

                        <p><Input addonBefore="Set Manual Seed" value={params.seed} onChange={onChangeSeed} /></p>
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
