interface AutoSizingAxis {
    width: boolean
    height: boolean
}

export function detectAutoSizingAxis(props: any): AutoSizingAxis {
    return {
        width: props.style?.width !== "100%",
        height: props.style?.height !== "100%",
    }
}
