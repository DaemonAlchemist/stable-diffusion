export const truncate = (str:string, maxLen:number=10) => str.length > maxLen + 3
    ? str.substring(0, maxLen) + "..."
    : str;