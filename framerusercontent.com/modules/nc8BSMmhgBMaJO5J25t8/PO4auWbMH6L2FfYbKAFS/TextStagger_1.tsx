// Text stagger per line animation, editable text, BDO Grotesk font (simulated with sans-serif), variable setting
import { useEffect, useMemo, useState, startTransition, type CSSProperties, useRef, useLayoutEffect } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useAnimationControls, useInView } from "framer-motion"
import React from "react"

interface TextStaggerProps {
  text: string
  delay: number
  duration: number
  font: any
  color: string
  variable: boolean // Only as a control to fulfill the 'variable' option
  trigger: "inView" | "hover" | "click"
  style?: CSSProperties
  halfOpacity: boolean // Toggle for half opacity effect
}

/**
 * Staggered text per line with editable text, BDO Grotesk (sans-serif), and variable toggle
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function TextStagger(props: TextStaggerProps) {
  const { text, delay, duration, font, color, variable, style, trigger = "inView", halfOpacity = false } = props
  const [hasAnimated, setHasAnimated] = useState(false)
  const [clicked, setClicked] = useState(false)
  const isStatic = useIsStaticRenderer()
  const [wrappedLines, setWrappedLines] = useState<string[]>([])
  const measureRef = useRef<HTMLDivElement | null>(null)
  const controls = useAnimationControls()
  // Use useRef, not useState for a DOM ref
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(containerRef)

  // Measure actual rendered lines including auto-wrap
  useLayoutEffect(() => {
    if (!measureRef.current || typeof window === "undefined") return

    const measureLines = () => {
      const element = measureRef.current
      if (!element) return

      const range = document.createRange()
      const textNode = element.firstChild
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return

      const lines: string[] = []
      const fullText = text || ""
      let currentLine = ""
      let lastBottom = -1

      // Measure character by character to detect line breaks
      for (let i = 0; i < fullText.length; i++) {
        range.setStart(textNode, 0)
        range.setEnd(textNode, i + 1)
        const rect = range.getBoundingClientRect()

        if (lastBottom === -1) {
          lastBottom = rect.bottom
        }

        // New line detected
        if (rect.bottom > lastBottom + 2) {
          lines.push(currentLine)
          currentLine = fullText[i]
          lastBottom = rect.bottom
        } else {
          currentLine += fullText[i]
        }
      }

      // Push the last line
      if (currentLine) {
        lines.push(currentLine)
      }

      setWrappedLines(lines.length > 0 ? lines : [fullText])
    }

    measureLines()
    window.addEventListener("resize", measureLines)
    return () => window.removeEventListener("resize", measureLines)
  }, [text, font, style])

  // Determine whether to fire animation trigger
  const shouldAnimate = useMemo(() => {
    if (isStatic) return false
    if (trigger === "inView") return inView
    if (trigger === "hover") return hasAnimated
    if (trigger === "click") return clicked
    return false
  }, [isStatic, inView, hasAnimated, clicked, trigger])

  useEffect(() => {
    if (!isStatic && shouldAnimate) {
      if (!hasAnimated) {
        controls.start(i => ({ y: 0, transition: { delay: i * delay, duration, ease: [0.44, 0, 0.34, 0.98] } }))
        setHasAnimated(true)
      }
    }
  }, [controls, delay, duration, isStatic, hasAnimated, shouldAnimate])

  // Simulate BDO Grotesk with sans-serif; for real, user must select it on font control if installed
  const fontFamily = (font && font.fontFamily) || "'BDO Grotesk', 'Inter', 'Helvetica Neue', Arial, sans-serif"

  // Event handlers for hover/click triggers
  const handleMouseEnter = () => {
    if (trigger === "hover" && !hasAnimated) startTransition(() => setHasAnimated(true))
  }
  const handleClick = () => {
    if (trigger === "click" && !clicked) startTransition(() => setClicked(true))
  }

  return (
    <>
      {/* Hidden measurement element */}
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
          ...font,
          fontFamily,
          width: style?.width || "100%",
        }}
        aria-hidden="true"
      >
        {text}
      </div>

      {/* Visible animated element */}
      <div
        ref={containerRef}
        style={{ 
          ...style, 
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color, 
          ...font, 
          fontFamily 
        }}
        onMouseEnter={trigger === "hover" ? handleMouseEnter : undefined}
        onClick={trigger === "click" ? handleClick : undefined}
      >
        {wrappedLines.map((line, i) => {
          // Calculate cumulative character count up to this line
          const charCountBeforeLine = wrappedLines.slice(0, i).reduce((sum, l) => sum + l.length, 0)
          const totalChars = text.length
          const halfPoint = totalChars / 2
          
          // Determine if this line is in the second half
          const lineOpacity = halfOpacity && charCountBeforeLine >= halfPoint ? 0.5 : 1
          
          return (
          <span
            key={i}
            style={{
              display: "block",
              overflow: "hidden",
              width: "100%",
              marginBottom: 0,
              lineHeight: font.lineHeight || 1.2,
            }}
          >
            <motion.span
              custom={i}
              initial={isStatic ? { y: 0 } : { y: 70 }}
              animate={isStatic ? undefined : controls}
              style={{
                display: "inline-block",
                whiteSpace: "pre-wrap",
                ...font,
                fontFamily,
                color,
                opacity: lineOpacity,
                fontVariationSettings: variable ? '"wght" 700' : '"wght" 500',
                fontWeight: variable ? 700 : 500,
                WebkitClipPath: "inset(0 0 0 0)",
                clipPath: "inset(0 0 0 0)",
                willChange: "transform",
                lineHeight: font.lineHeight || 1.2,
              }}
            >
              {line || " "}
            </motion.span>
          </span>
        )})}
      </div>
    </>
  )
}

addPropertyControls(TextStagger, {
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "Editable\nStaggered\nText",
    displayTextArea: true,
    placeholder: "Type your text...",
  },
  delay: {
    type: ControlType.Number,
    title: "Delay",
    defaultValue: 0.08,
    min: 0.01,
    max: 1,
    step: 0.01,
    unit: "s",
  },
  duration: {
    type: ControlType.Number,
    title: "Dur. per line",
    defaultValue: 0.5,
    min: 0.05,
    max: 2,
    step: 0.01,
    unit: "s",
  },
  color: {
    type: ControlType.Color,
    title: "Color",
    defaultValue: "#000000",
  },
  font: {
    type: ControlType.Font,
    title: "Font",
    controls: "extended",
    defaultFontType: "sans-serif",
    defaultValue: {
      fontSize: 40,
      lineHeight: "1em",
      letterSpacing: "-0.02em",
      variant: "Regular",
      textAlign: "left",
    },
  },
  variable: {
    type: ControlType.Boolean,
    title: "Variable Weight",
    defaultValue: false,
    enabledTitle: "Bold",
    disabledTitle: "Regular",
  },
  trigger: {
    type: ControlType.Enum,
    title: "Trigger",
    options: ["inView", "hover", "click"],
    optionTitles: ["When in view", "On hover", "On click"],
    defaultValue: "inView",
    displaySegmentedControl: true,
  },
  halfOpacity: {
    type: ControlType.Boolean,
    title: "Half Opacity",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
})
