/**
 * What the scripts read of a layer as Sketch's file format keeps it, from `sketch.export(layer, { formats: 'json' })`:
 * one call for a layer and everything in it. Sketch checks every property a script reads through the API, taking a
 * stack trace each time, so reading a symbol's measures from this is many times faster. The file format's published
 * typings predate stacks, so these are the kit's own.
 */

export interface FileColour {
    red: number
    green: number
    blue: number
    alpha: number
    swatchID?: string
}

export interface FilePaint {
    isEnabled?: boolean
    /** 0 for a colour, 1 for a gradient, 4 for an image. */
    fillType: number
    color?: FileColour
    /** A gradient's: 0 linear, 1 radial, 2 angular, with its stops. */
    gradient?: { gradientType: number, stops: Array<{ position: number, color: FileColour }> }
}

export interface FileStyle {
    fills?: FilePaint[]
    borders?: FilePaint[]
    /** How the layer blends with what's under it: `blendMode` 0 is normal, e.g. 2 multiply. */
    contextSettings?: { blendMode?: number, opacity?: number }
    textStyle?: {
        encodedAttributes: {
            MSAttributedStringFontAttribute?: { attributes: { name: string, size: number } }
            MSAttributedStringColorAttribute?: FileColour
            MSAttributedStringTextTransformAttribute?: number
            paragraphStyle?: { minimumLineHeight?: number }
            kerning?: number
        }
    }
}

export interface FileLayer {
    _class: string
    do_objectID: string
    name: string
    isVisible: boolean
    frame: { x: number, y: number, width: number, height: number }
    layers?: FileLayer[]
    style?: FileStyle
    /** A stack's, as `MSImmutableFlexGroupLayout`. */
    groupLayout?: { _class: string }
    flexItem?: { ignoreLayout?: boolean }
    horizontalSizing?: number
    rightPadding?: number
    /** An instance's symbol. */
    symbolID?: string
    /** The shared style it has. */
    sharedStyleID?: string
    /** A text's content. */
    attributedString?: { string: string }
    /** Layer settings, by the plugin or script that wrote them. */
    userInfo?: Record<string, Record<string, unknown> | undefined>
}
