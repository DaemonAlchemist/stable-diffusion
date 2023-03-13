import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useLastImage } from '@/lib/useLastImage';
import { useLoader } from '@/lib/useLoader';
import { DeleteOutlined, FullscreenOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Spin } from 'antd';
import React from 'react';
import { last, pipe, prop } from 'ts-functional';
import {CurrentImageProps} from "./CurrentImage.d";
import styles from './CurrentImage.module.scss';

export const CurrentImageComponent = (props:CurrentImageProps) => {
    const [lastImage, setLastImage] = useLastImage();

    const editor = useLoader();

    const processWith = (url:string) => () => {
        const prompt = lastImage.replace("static\\outputs\\", "").split("-")[0];
        editor.start();
        api.get(url, {image: lastImage, prompt})
            .then(pipe(prop<any, any>("img"), setLastImage))
            .finally(editor.done);
    }

    const upscale  = processWith("upscale");
    const fixFaces = processWith("fixFaces");

    const deleteFile = () => {
        api.delete(`files/${last(lastImage.split("\\"))}`).then(() => {
            notification.success({message: "File deleted"});
            setLastImage("");
        });
    }

    return <div className={styles.currentImage}>
        {!!lastImage && <Spin spinning={editor.isLoading}>
            <Button onClick={fixFaces} title="Fix Faces" disabled={editor.isLoading}>
                <SmileOutlined /> Fix Faces
            </Button>
            &nbsp;
            <Button onClick={upscale} title="Upscale" disabled={editor.isLoading}>
                <FullscreenOutlined /> Upscale
            </Button>
            &nbsp;
            <Popconfirm title="Are you sure you want to delete this file?" onConfirm={deleteFile}>
                <Button type="primary" danger><DeleteOutlined /> Delete</Button>
            </Popconfirm>
            <br/><br/>
            <div className={styles.imgContainer}>
                <img src={`${apiBase}/${lastImage}`} />
            </div>
        </Spin>}
    </div>;
}
