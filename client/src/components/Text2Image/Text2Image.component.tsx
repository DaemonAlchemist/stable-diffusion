import { api } from '@/lib/api';
import { getRandomInt } from '@/lib/random';
import { truncate } from '@/lib/truncate';
import { useInput } from '@/lib/useInput';
import { useLastImage } from '@/lib/useLastImage';
import { useStandardParams } from '@/lib/useStandardParams';
import { BulbOutlined, CheckCircleTwoTone, CheckOutlined, ControlOutlined, EditOutlined, ExpandOutlined, PictureOutlined, ReloadOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Typography } from 'antd';
import { pipe, prop } from 'ts-functional';
import { AdvancedOptions } from '../AdvancedOptions';
import { ControlNet } from '../ControlNet';
import { preprocessors } from '../ControlNet/ControlNet.component';
import { CurrentImage } from '../CurrentImage';
import { MaskImageUploader } from '../MaskImageUploader';
import { Prompts } from '../Prompts';
import { SourceImageUploader } from '../SourceImageUploader';
import { StandardParameters } from '../StandardParameters';
import { StatusBar } from '../StatusBar';
import { Text2ImageProps } from "./Text2Image.d";
import styles from './Text2Image.module.scss';


export const Text2ImageComponent = (props:Text2ImageProps) => {
    const [, setLastImage] = useLastImage();
    const [numImages, setNumImages] = useInput("1");
    const {
        prompt, negativePrompt,
        width, height, cfgScale, numSteps,
        sourceImage, maskImage, controlNetImage, preprocessor,
        seed, sampler,
        setSeed, values
    } = useStandardParams();

    const onCreate = () => {
        const newSeed = getRandomInt(0, Number.MAX_SAFE_INTEGER);
        setSeed(newSeed);
        api.get("txt2img", {numImages, ...values(), newSeed}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    const onRedo = () => {
        api.get("txt2img", {numImages, ...values()}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    return <div className={styles.txt2Img}>
        <Row gutter={24}>
            <Col xs={8}>
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
                    <Collapse.Panel
                        key="prompt"
                        header={<><EditOutlined /> Prompts</>}
                        extra={<>
                            <Typography.Text title={prompt} type="success">{truncate(prompt, 25)}</Typography.Text>
                            &nbsp;&nbsp;
                            <Typography.Text title={negativePrompt} type="danger">{truncate(negativePrompt, 25)}</Typography.Text>
                        </>}
                    >
                        <Prompts />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="params"
                        header={<><SettingOutlined/> Standard Options</>}
                        extra={<>{width}x{height}&nbsp;&nbsp;{cfgScale}&nbsp;&nbsp;{numSteps} steps</>}
                    >
                        <StandardParameters />
                    </Collapse.Panel>
                    <Collapse.Panel key="image" header={<><PictureOutlined /> Source Image</>} extra={!!sourceImage && <CheckCircleTwoTone twoToneColor="green" />}>
                        <SourceImageUploader />
                    </Collapse.Panel>
                    {!!sourceImage && <Collapse.Panel key="mask" header={<><ExpandOutlined /> Mask Image</>} extra={!!maskImage && <CheckCircleTwoTone twoToneColor="green" />}>
                        <MaskImageUploader />
                    </Collapse.Panel>}
                    <Collapse.Panel
                        key="controlnet"
                        header={<><BulbOutlined /> Hint Image</>}
                        extra={!!controlNetImage && <>{preprocessors[preprocessor]} <CheckCircleTwoTone twoToneColor="green" /></>}
                    >
                        <ControlNet />
                    </Collapse.Panel>
                    <Collapse.Panel key="advanced" header={<><ControlOutlined /> Advanced Options</>} extra={<>{sampler}&nbsp;&nbsp;s:{seed}</>}>
                        <AdvancedOptions />
                    </Collapse.Panel>
                </Collapse>
            </Col>
            <Col xs={16}>
                <CurrentImage />
            </Col>
        </Row>
        
        </div>;
}
