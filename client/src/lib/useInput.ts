import { ChangeEvent, useState } from "react";

export const useInput = ():[string, (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void] => {
    const [value, setValue] = useState("");

    const onChange = (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }

    return [value, onChange];
}