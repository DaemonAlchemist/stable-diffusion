import { api } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import {StatusBarProps} from "./StatusBar.d";
import styles from './StatusBar.module.scss';
import {Progress} from 'antd';
import { useLastImage } from '@/lib/useLastImage';

interface IStatus {
    maxIterations: number;
    curIteration: number;
    percentComplete: number;
    status: string;
    lastImage: string;
}

export const StatusBarComponent = (props:StatusBarProps) => {
    const [status, setStatus] = useState<IStatus | null>(null);
    const [, setLastImage] = useLastImage();

    const refresh = () => {
        api.get<IStatus>("status", {}).then(setStatus);
    }

    useEffect(() => {
        if(!!status?.lastImage) {
            setLastImage(status.lastImage);
        }
    }, [status]);

    useEffect(() => {
        const timer = window.setInterval(refresh, 250);
        return () => window.clearInterval(timer);
    }, []);
    
    return <div className={styles.statusBar}>
        {!!status && <Progress percent={status.percentComplete} format={() => status.status} />}
    </div>;
}
