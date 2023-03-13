import { api } from '@/lib/api';
import { getRandomInt } from '@/lib/random';
import { useInput } from '@/lib/useInput';
import { useLastImage } from '@/lib/useLastImage';
import { useStandardParams } from '@/lib/useStandardParams';
import { BulbOutlined, ControlOutlined, EditOutlined, ExpandOutlined, PictureOutlined, ReloadOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row } from 'antd';
import { pipe, prop } from 'ts-functional';
import { AdvancedOptions } from '../AdvancedOptions';
import { ControlNet } from '../ControlNet';
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
    const params = useStandardParams();

    const onCreate = () => {
        const seed = getRandomInt(0, Number.MAX_SAFE_INTEGER);
        params.setSeed(seed);
        api.get("txt2img", {numImages, ...params.values(), seed}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    const onRedo = () => {
        api.get("txt2img", {numImages, ...params.values()}).then(pipe(prop<any, any>("img"), setLastImage));
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
                    <Collapse.Panel key="prompt" header={<><EditOutlined /> Prompts</>}>
                        <Prompts />
                    </Collapse.Panel>
                    <Collapse.Panel key="params" header={<><SettingOutlined/> Standard Options</>}>
                        <StandardParameters />
                    </Collapse.Panel>
                    <Collapse.Panel key="image" header={<><PictureOutlined /> Source Image</>}>
                        <SourceImageUploader />
                    </Collapse.Panel>
                    {!!params.sourceImage && <Collapse.Panel key="mask" header={<><ExpandOutlined /> Mask Image</>}>
                        <MaskImageUploader />
                    </Collapse.Panel>}
                    <Collapse.Panel key="controlnet" header={<><BulbOutlined /> Hint Image</>}>
                        <ControlNet />
                    </Collapse.Panel>
                    <Collapse.Panel key="advanced" header={<><ControlOutlined /> Advanced Options</>}>
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
