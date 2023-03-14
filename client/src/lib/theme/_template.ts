import { theme, ThemeConfig } from "antd";
import { AliasToken } from "antd/es/theme/internal";

const seedTokens = {
    borderRadius: 6,
    colorBgBase: "#fff",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorTextBase: "#000",
    colorWarning: "#faad14",
    controlHeight: 32,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    fontFamilyCode: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: 14,
    lineType: "solid",
    lineWidth: 1,
    motionBase: 0,
    motionEaseInBack: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
    motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
    motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    motionEaseOutBack: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
    motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
    motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
    motionUnit: 0.1,
    opacityImage: 1,
    sizePopupArrow: 16,
    sizeStep: 4,
    sizeUnit: 4,
    wireframe: false,
    zIndexBase: 0,
    zIndexPopupBase: 1000,
}

const s = seedTokens;
const mapTokens:Partial<AliasToken> = {
    borderRadiusLG: s.borderRadius * 4/3,
    borderRadiusOuter: s.borderRadius * 2/3,
    borderRadiusSM: s.borderRadius * 2/3,
    borderRadiusXS: s.borderRadius * 1/3,
    colorBgContainer: s.colorBgBase,
    colorBgElevated: s.colorBgBase,
    colorBgLayout: "#f5f5f5",
    
}

export const myTheme:ThemeConfig = {
    algorithm: theme.defaultAlgorithm,
    token: {
        ...seedTokens,
    }
}