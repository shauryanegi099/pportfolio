import { useMemo, cloneElement } from "react"
import { RenderTarget } from "framer"
import UtilsComponentMessage from "https://framer.com/m/Utils-Component-Message-ZVoG.js@cRfVFRl0izzBulKFjOAe"

// Component to display in placeholder or empty states

interface ComponentMessageProps {
    title: string
    subtitle: string
    style?: React.CSSProperties
}

export const ComponentMessage: React.FC<ComponentMessageProps> = ({
    title,
    subtitle,
    style,
}) => {
    return (
        <UtilsComponentMessage
            yeAnKbEUZ={title}
            WuF2iG84P={subtitle}
            style={{
                width: "100%",
                height: "100%",
                ...style,
            }}
        />
    )
}

/* 
    This function is also used many times to make sure components work even if we set a color style like "Accent" on their color properties. We can make this into a utility function.
*/

export const extractRGBColorFromString = (str: string): string => {
    const rgbRegex = /(rgba|rgb)\(.*?\)/g
    const match = str.match(rgbRegex)
    return match ? match[0] : str
}

/*
    This function makes a connected layer use the sizing of the component it is inside,
    preventing it from being larger or smaller than the component's size.
    Use this on layers connected with ControlType.ComponentInstance.
*/
export function styleLayer(layer, style = {}) {
    layer = Array.isArray(layer) ? layer[0] : layer

    let newLayer = layer

    const { width, height, ...otherStyle } = style
    if (layer && layer.props && style && (width || height)) {
        if (
            typeof layer.type === "function" &&
            typeof layer.props.children === "object"
        ) {
            newLayer = cloneElement(layer, {
                children: {
                    ...layer.props.children,
                    props: {
                        ...layer.props.children.props,
                        style: {
                            ...layer.props.children.props.style,
                            ...(width && { width }),
                            ...(height && { height }),
                            ...otherStyle,
                        },
                    },
                },
            })
        } else {
            newLayer = cloneElement(layer, {
                style: {
                    ...layer.props.style,
                    ...(width && { width }),
                    ...(height && { height }),
                    ...otherStyle,
                },
            })
        }
    }

    return newLayer
}
