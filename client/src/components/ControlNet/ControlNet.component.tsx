import { apiBase } from '@/lib/config';
import { useStandardParams } from '@/lib/useStandardParams';
import { CloseOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Select, Upload } from 'antd';
import { Index } from 'ts-functional/dist/types';
import { ControlNetProps, IUploadChange } from "./ControlNet.d";
import styles from './ControlNet.module.scss';

export const ControlNetComponent = (props:ControlNetProps) => {
    const {controlNetImage, setControlNetImage, preprocessor, setPreprocessor} = useStandardParams();
    const clear = () => {
        setControlNetImage("");
        setPreprocessor("");
    }

    const preprocessors:Index<string> = {
        "canny": "Hard Edges",
        "depth": "Depth Map",
        "hed": "Soft Edges",
        "mlsd": "Straight Lines",
        "normal": "Normals",
        "openpose": "Pose",
        "scribble": "Scribble",
        "segments": "Objects",
    }

    const onChange = (data:IUploadChange) => {
        if(!!data.file.status && data.file.status === "done") {
            setControlNetImage(data.file.response?.file || "");
        }
    }

    return <div className={styles.controlNet}>
        <p>
            <span>Hint Image</span>
            {!!controlNetImage && <>
                <Select placeholder="Select a hint type" value={preprocessor || undefined} onChange={setPreprocessor}>
                    {Object.keys(preprocessors).map(p => <Select.Option key={p} value={p}>
                        {preprocessors[p]}
                    </Select.Option>)}
                </Select>
                <Button className={styles.removeBtn} type="ghost" onClick={clear}>
                    Remove <CloseOutlined />
                </Button>
                <img src={`${apiBase}${controlNetImage}`} />
            </>}
            {!controlNetImage && <em>None Selected</em>}
        </p>
        {!controlNetImage && <Upload.Dragger
            height={256}
            accept=".png,.jpg,.jpeg,.gif"
            action={`${apiBase}/uploads`}
            onChange={onChange}
            showUploadList={false}
            multiple={false}
            maxCount={1}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">
                Click or drag an image here to give<br/> a hint to the image generator.
            </p>
        </Upload.Dragger>}
    </div>;
}
