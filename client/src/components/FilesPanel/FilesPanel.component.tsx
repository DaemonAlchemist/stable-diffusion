import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useLastImage } from '@/lib/useLastImage';
import { Card } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FilesPanelProps } from "./FilesPanel.d";
import styles from './FilesPanel.module.scss';

export const FilesPanelComponent = (props:FilesPanelProps) => {
    const [files, setFiles] = useState<string[]>([]);
    const [lastImage, , updateLastImage] = useLastImage();

    const refresh = () => {
        api.get<string[]>("files", {}).then(setFiles);
    }

    useEffect(() => {
        refresh();
        const timer = window.setInterval(refresh, 5000);
        return () => window.clearInterval(timer);
    }, []);
    
    return <Card className={styles.files} title="File List">
        <div className={styles.content}>
            {files.map(file => <div className={clsx([file.substring(1) === lastImage && styles.selected])}>
                <img key={file} src={`${apiBase}${file}`} onClick={updateLastImage(file.substring(1))} />
            </div>)}
        </div>
    </Card>;
}
