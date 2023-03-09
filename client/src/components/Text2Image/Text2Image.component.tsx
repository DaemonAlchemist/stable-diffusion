import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useInput } from '@/lib/useInput';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Slider } from 'antd';
import { useState } from 'react';
import { pipe, prop } from 'ts-functional';
import { StatusBar } from '../StatusBar';
import { Text2ImageProps } from "./Text2Image.d";
import styles from './Text2Image.module.scss';

export const Text2ImageComponent = (props:Text2ImageProps) => {
    const [lastImage, setLastImage] = useState("");
    const [prompt, setPrompt] = useInput();
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);
    const [cfgScale, setCfgScale] = useState(7.5);
    const [numSteps, setNumSteps] = useState(50);

    const onCreate = () => {
        api.get("txt2img", {prompt, width, height, cfgScale, numSteps}).then(pipe(prop<any, any>("img"), setLastImage));
    }

    return <div className={styles.txt2Img}>
        <Row gutter={24}>
            <Col xs={6}>
                <StatusBar />
                <h1>
                    Text to Image
                    <Button type="primary" onClick={onCreate}>
                            <PlayCircleOutlined /> Create
                    </Button>
                </h1>
                <p>Prompt</p>
                <Input.TextArea value={prompt} onChange={setPrompt}/>
                <Row>
                    <Col xs={12}><p>Image Width <b>{width} px</b><Slider min={0} max={1024} step={64} value={width} onChange={setWidth}/></p></Col>
                    <Col xs={12}><p>Image Height <b>{height} px</b><Slider min={0} max={1024} step={64} value={height} onChange={setHeight}/></p></Col>
                </Row>              
                
                <p>Creativity <b>{cfgScale}</b><Slider min={1} max={20} step={0.1} value={cfgScale} onChange={setCfgScale} marks={{1: "more", 20: "less"}}/></p>
                <p>Quality <b>{numSteps} steps</b><Slider min={1} max={300} step={1} value={numSteps} onChange={setNumSteps} marks={{0: "faster", 300: "better"}}/></p>
            </Col>
            <Col xs={18}>
                <div className={styles.imgContainer} style={{width, height}}>
                    {!!lastImage && <img src={`${apiBase}/${lastImage}`} />}
                </div>
            </Col>
        </Row>
        
        </div>;
}
