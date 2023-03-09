import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { FilesPanelProps } from "./FilesPanel.d";
import styles from './FilesPanel.module.scss';

export const FilesPanelComponent = (props:FilesPanelProps) => {
    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        api.get<string[]>("files", {}).then(setFiles);
    }, []);
    
    return <Card className={styles.files} title="File List">
        <div className={styles.content}>
            {files.map(file => <img key={file} src={`${apiBase}${file}`} />)}
        </div>
    </Card>;
}
