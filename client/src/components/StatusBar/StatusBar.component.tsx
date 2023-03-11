import { api } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import {StatusBarProps} from "./StatusBar.d";
import styles from './StatusBar.module.scss';
import {Progress} from 'antd';

interface IStatus {
    maxIterations: number;
    curIteration: number;
    percentComplete: number;
    status: string;
}

export const StatusBarComponent = (props:StatusBarProps) => {
    const [status, setStatus] = useState<IStatus | null>(null);

    const refresh = () => {
        api.get<IStatus>("status", {}).then(setStatus);
    }

    useEffect(() => {
        const timer = window.setInterval(refresh, 250);
        return () => window.clearInterval(timer);
    }, []);
    
    return <div className={styles.statusBar}>
        {!!status && <Progress percent={status.percentComplete} format={() => status.status} />}
    </div>;
}
