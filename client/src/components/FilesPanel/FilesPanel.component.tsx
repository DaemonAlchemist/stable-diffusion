import { api } from '@/lib/api';
import { apiBase } from '@/lib/config';
import { useEffect, useState } from 'react';
import { FilesPanelProps } from "./FilesPanel.d";
import styles from './FilesPanel.module.scss';

export const FilesPanelComponent = (props:FilesPanelProps) => {
    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        api.get<string[]>("files", {}).then(setFiles);
    }, []);
    
    return <div className={styles.files}>
        <header>File List</header>
        <div className={styles.content}>
            {files.map(file => <img key={file} src={`${apiBase}${file}`} />)}
        </div>
    </div>;
}
