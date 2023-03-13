import { ChangeEvent, useState } from "react";
import { Setter } from "unstateless";

export const useInput = (defaultValue=""):[string, (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void] => {
    const [value, setValue] = useState(defaultValue);

    const onChange = (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }

    return [value, onChange];
}

export const onInputChange = (setter:Setter<string>) => (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setter(e.currentTarget.value);
}