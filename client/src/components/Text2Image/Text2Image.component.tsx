import { api } from '@/lib/api';
import { getRandomInt } from '@/lib/random';
import { truncate } from '@/lib/truncate';
import { useInput } from '@/lib/useInput';
import { useLastImage } from '@/lib/useLastImage';
import { useStandardParams } from '@/lib/useStandardParams';
import { BranchesOutlined, BulbOutlined, CheckCircleTwoTone, CloseCircleOutlined, ControlOutlined, EditOutlined, ExpandOutlined, PictureOutlined, ReloadOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Typography } from 'antd';
import { AdvancedOptions } from '../AdvancedOptions';
import { ControlNet } from '../ControlNet';
import { preprocessors } from '../ControlNet/ControlNet.component';
import { CurrentImage } from '../CurrentImage';
import { LoraSelector } from '../LoraSelector';
import { MaskImageUploader } from '../MaskImageUploader';
import { Prompts } from '../Prompts';
import { SourceImageUploader } from '../SourceImageUploader';
import { StandardParameters } from '../StandardParameters';
import { StatusBar } from '../StatusBar';
import { useStatus } from '../StatusBar/StatusBar.component';
import { Text2ImageProps } from "./Text2Image.d";
import styles from './Text2Image.module.scss';


export const Text2ImageComponent = (props:Text2ImageProps) => {
    const [, setLastImage] = useLastImage();
    const [status] = useStatus();

    const [numImages, setNumImages] = useInput("1");
    const {
        prompt, negativePrompt,
        width, height, cfgScale, numSteps,
        sourceImage, maskImage, controlNetImage, preprocessor,
        loraFile, loraStrength,
        seed, sampler,
        setSeed, values
    } = useStandardParams();

    const updateImage = (res:any) => {
        if(res.img) {
            setLastImage(res.img);
        }
    }

    const onCreate = () => {
        const newSeed = getRandomInt(0, Number.MAX_SAFE_INTEGER);
        setSeed(newSeed);
        api.get("txt2img", {numImages, ...values(), newSeed}).then(updateImage);
    }

    const onRedo = () => {
        api.get("txt2img", {numImages, ...values()}).then(updateImage);
    }

    const onCancel = () => {
        api.get("cancel", {}).then(() => {
            console.log("Image cancelled");
        })
    }

    const isRunning = status?.status !== "Ready";

    return <div className={styles.txt2Img}>
        <Row gutter={24}>
            <Col xs={8}>
                <Row>
                    <Col xs={24}>
                        <StatusBar />
                    </Col>
                    <Col xs={24} className={styles.createButtons}>
                        <Input addonBefore="Create image(s)" type="number" style={{width: 200}} value={+numImages} onChange={setNumImages}/>
                        {!isRunning && <>
                            <Button className={styles.redoButton} type="primary" onClick={onRedo} title="Reuse the last seed">
                                <ReloadOutlined />
                            </Button>
                            <Button className={styles.createButton} type="primary" onClick={onCreate} title="Create with a new seed">
                                <SendOutlined />
                            </Button>
                        </>}
                        {isRunning && <Button className={styles.cancelButton} type="primary" danger onClick={onCancel} title="Cancel the image">
                            <CloseCircleOutlined />
                        </Button>}
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
                    <Collapse.Panel key="lora" header={<><BranchesOutlined /> LoRA</>} extra={!!loraFile ? <>{loraFile}&nbsp;&nbsp;{loraStrength}</> : undefined}>
                        <LoraSelector />
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
