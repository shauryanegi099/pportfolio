import { useEffect } from "react"
import { MotionValue } from "framer"
//@ts-ignore
import { isMotionValue } from "./isMotionValue.ts"

export type Subscriber<T> = (v: T) => void

export function useOnChange<T>(
    value: MotionValue<T> | number | string,
    callback: Subscriber<T>
) {
    useEffect(() =>
        // @ts-ignore this should be detected as a MV :shrug:
        isMotionValue(value) ? value.onChange(callback) : undefined
    )
}

export function useMultiOnChange(values: MotionValue[], handler: () => void) {
    useEffect(() => {
        const subscriptions = values.map((value) => value.onChange(handler))
        return () => subscriptions.forEach((unsubscribe) => unsubscribe())
    })
}
