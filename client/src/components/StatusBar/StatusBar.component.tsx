import { api } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import {StatusBarProps} from "./StatusBar.d";
import styles from './StatusBar.module.scss';

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
        const timer = window.setInterval(refresh, 1000);
        return () => window.clearInterval(timer);
    }, []);
    
    return <>
        {!!status && <div className={styles.statusBar}>
            <div className={styles.progress} style={{width: `${status.percentComplete}%`}}>&nbsp;</div>
            <span className={styles.status}>{status.status}</span>
        </div>}
    </>;
}
