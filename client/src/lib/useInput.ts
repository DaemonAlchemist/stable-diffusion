import { ChangeEvent, useState } from "react";

export const useInput = (defaultValue=""):[string, (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void] => {
    const [value, setValue] = useState(defaultValue);

    const onChange = (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }

    return [value, onChange];
}