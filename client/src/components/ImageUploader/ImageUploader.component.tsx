import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { CloseOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useEffect } from 'react';
import {ImageUploaderProps, IUploadChange} from "./ImageUploader.d";
import styles from './ImageUploader.module.scss';

export const ImageUploaderComponent = ({title, text, file, setFile, onClear, children}:ImageUploaderProps) => {
    const onChange = (data:IUploadChange) => {
        if(!!data.file.status && data.file.status === "done") {
            setFile(data.file.response?.file || "");
        }
    }
    const clear = () => {
        setFile("");
        if(onClear) {onClear();}
    }

    const checkFile = () => {
        console.log(file);
        if(file) {
            console.log(`Checking file ${file}`);
            api.exists(file).then(exists => {
                console.log(exists ? "Exists" : "Doesn't exist");
                if(!exists) {clear();}
            });
        }
    }

    useEffect(() => {
        const timer = window.setInterval(checkFile, 2000);

        return () => window.clearInterval(timer);
    }, [file]);

    return <div className={styles.imageUploader}>
        <p>
            <span>{title}</span>
            {!!file && <>
                <Button className={styles.removeBtn} type="ghost" onClick={clear}>
                    Remove <CloseOutlined />
                </Button>
                {children}
                <img src={`${apiBase}${file}`} />
            </>}
            {!file && <em>None Selected</em>}
        </p>
        {!file && <Upload.Dragger
            height={256}
            accept=".png,.jpg,.jpeg,.gif"
            action={`${apiBase}/files`}
            onChange={onChange}
            showUploadList={false}
            multiple={false}
            maxCount={1}
            >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">
                {text}
            </p>
            </Upload.Dragger>}
    </div>;
}