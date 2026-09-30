import * as React from "react"

export function useControlledState<T>(
    value: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [controlledValue, setValue] = React.useState(value)
    React.useEffect(() => {
        setValue(value)
    }, [value])
    return [controlledValue, setValue]
}
