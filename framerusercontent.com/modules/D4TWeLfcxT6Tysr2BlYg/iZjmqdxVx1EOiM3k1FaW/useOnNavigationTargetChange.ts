import { useIsInCurrentNavigationTarget } from "framer"
import { useRef, useEffect } from "react"

export function useOnEnter(onEnter: () => void, enabled?: boolean): void {
    return useOnSpecificTargetChange(true, onEnter, enabled)
}

export function useOnExit(onExit: () => void, enabled?: boolean): void {
    return useOnSpecificTargetChange(false, onExit, enabled)
}

function useOnSpecificTargetChange(
    goal: boolean,
    callback: () => void,
    enabled = true
): void {
    const isInTarget = useIsInCurrentNavigationTarget()

    useEffect(() => {
        if (enabled && isInTarget === goal) callback()
    }, [isInTarget])
}
