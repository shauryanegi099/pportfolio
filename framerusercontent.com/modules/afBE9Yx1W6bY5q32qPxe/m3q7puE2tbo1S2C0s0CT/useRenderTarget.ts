import { useMemo } from "react"
import { RenderTarget } from "framer"

export function useRenderTarget() {
    const currentRenderTarget = useMemo(() => RenderTarget.current(), [])
    return currentRenderTarget
}

export function useIsInPreview() {
    const inPreview = useMemo(
        () => RenderTarget.current() === RenderTarget.preview,
        []
    )
    return inPreview
}

export function useIsOnCanvas() {
    const onCanvas = useMemo(
        () => RenderTarget.current() === RenderTarget.canvas,
        []
    )
    return onCanvas
}
