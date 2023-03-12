import { useStandardParams } from '@/lib/useStandardParams';
import { Select, Slider } from 'antd';
import { Index } from 'ts-functional/dist/types';
import { ImageUploader } from '../ImageUploader';
import { ControlNetProps } from "./ControlNet.d";
import styles from './ControlNet.module.scss';

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

export const ControlNetComponent = (props:ControlNetProps) => {
    const {
        controlNetImage, setControlNetImage,
        preprocessor, setPreprocessor,
        controlNetStrength, setControlNetStrength,
    } = useStandardParams();
    
    const onClear = () => {
        setPreprocessor("");
    }

    return <div className={styles.controlNet}>
        <ImageUploader
            title="Hint Image"
            text={<>Click or drag an image here to give<br/> a hint to the image generator.</>}
            file={controlNetImage}
            setFile={setControlNetImage}
            onClear={onClear}
        >
            {!!controlNetImage && <>
                <Select placeholder="Select a hint type" value={preprocessor || undefined} onChange={setPreprocessor} style={{width: "150px"}}>
                    {Object.keys(preprocessors).map(p => <Select.Option key={p} value={p}>
                        {preprocessors[p]}
                    </Select.Option>)}
                </Select>
                <Slider value={controlNetStrength} min={0} max={2} step={0.05} onChange={setControlNetStrength} marks={{0: "ignore", 1: "use", 2: "more"}}/>
            </>}
        </ImageUploader>
    </div>;
}
