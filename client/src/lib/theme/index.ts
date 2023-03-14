import { ThemeConfig } from "antd";
import { Index } from "ts-functional/dist/types";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export const themes:Index<ThemeConfig> = {
    "Dark": darkTheme,
    "Light": lightTheme,
}