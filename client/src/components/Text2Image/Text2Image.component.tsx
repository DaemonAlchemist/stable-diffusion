import React, { useState } from 'react';
import {Text2ImageProps} from "./Text2Image.d";
import styles from './Text2Image.module.scss';
import {Row, Col, Input, Button} from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useInput } from '@/lib/useInput';
import { api } from '@/lib/api';
import { pipe, prop } from 'ts-functional';
import { apiBase } from '@/lib/config';

export const Text2ImageComponent = (props:Text2ImageProps) => {
    const [lastImage, setLastImage] = useState("");
    const [prompt, setPrompt] = useInput();

    const onCreate = () => {
        api.get("txt2img", {prompt}).then(pipe(prop<any, any>("img"), setLastImage));
    }
    
    return <div className={styles.txt2Img}>
        <h1>Text to Image</h1>
        <Row gutter={16}>
            <Col xs={6}>
                <Input.TextArea value={prompt} onChange={setPrompt}/>
                <Button type="primary" onClick={onCreate}>
                    <PlayCircleOutlined /> Create
                </Button>
            </Col>
            <Col xs={18}>
                <div className={styles.imgContainer}>
                    {!!lastImage && <img src={`${apiBase}/${lastImage}`} />}
                </div>
            </Col>
        </Row>
        
        </div>;
}
