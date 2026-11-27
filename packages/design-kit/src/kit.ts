/**
 * The design kit's model, the same for every design tool, and the data the Sketch scripts take from it: what
 * `model.ts` writes to `kit.json`, and what `sketch.ts` puts in each script. Types only, so the scripts that run in
 * Sketch share them with the generator.
 */

/**
 * How a measure follows theme variables. A length or a number moves with them: by `per` pixels (or units) for each
 * pixel (or unit) a part of a variable's value moves, e.g. a semi-round button's radius by 3 for each pixel of
 * `border-radius`. A keyword or a font takes a variable's value, e.g. a button's text case.
 */
export interface Binding {
    terms?: Array<{ variable: string, part: number, per: number }>
    variable?: string
}

/** A colour, with the colour variable it comes from, if any. */
export interface Paint {
    color: string
    variable?: string
}

export interface Gradient {
    /** Degrees, CSS's: 180 is top to bottom; for an angular gradient, where it starts, clockwise from the top. */
    angle: number
    stops: Array<{ paint: Paint, position: number }>
    /** Around a centre, as a CSS conic gradient, rather than along a line. */
    angular?: boolean
}

export interface Shadow {
    x: number
    y: number
    blur: number
    spread: number
    paint: Paint
    inset?: boolean
}

export interface LayerStyle {
    fills: Array<Paint | Gradient>
    border?: { width: number, paint: Paint, dashed?: boolean, gradient?: Gradient }
    shadows: Shadow[]
    opacity?: number
}

export interface TextStyle {
    font: { family: string, size: number, weight: number, lineHeight: number, letterSpacing: number, transform?: string }
    paint: Paint
    shadows: Shadow[]
    /** The theme typography it is, if it's one of the typography text styles. */
    typography?: string
}

export interface Layer {
    name: string
    kind: 'frame' | 'text' | 'icon' | 'ref' | 'path'
    x: number
    y: number
    width: number
    height: number
    radius?: [number, number, number, number]
    layerStyle?: string
    textStyle?: string
    /** Whether the layer's style is a parameter of the symbol, chosen by its overrides. */
    styled?: boolean
    /** Whether a text's colour is a parameter of the symbol: a look's colour, kept when the symbol is swapped. */
    tinted?: boolean
    /** Whether a design sets the layer's fill colour, e.g. a swatch's: an override. */
    recolour?: boolean
    text?: string
    /** A text's sizing: `fixed` wraps at its width, `auto` grows with its text. */
    textSizing?: 'fixed' | 'auto'
    /** An icon's symbol and colour, and how far it's turned, in degrees clockwise, e.g. a tree grid's toggle. */
    icon?: { symbol: string, paint: Paint, turn?: number }
    /** A shape's outline, as an SVG path in the layer's box, e.g. a tooltip's arrow. */
    path?: string
    ref?: {
        component: string
        inputs: Record<string, string>
        icon?: string
        text?: string
        /** Its texts in order, where its spec reads them all, e.g. a step's number and label. */
        texts?: string[]
        /** For a component of the kit: its symbol, and the overrides that give it the captured look. */
        symbol?: string
        /** Whether its symbol sizes to its content, so the instance does too, e.g. a button with a longer label. */
        hug?: { width: boolean, height: boolean }
        overrides?: Starter['overrides']
    }
    layout?: {
        direction: 'row' | 'column'
        gap: number
        padding: [number, number, number, number]
        align: string
        justify: string
        /** How the frame sizes along its main and cross axes: to its content or as captured. */
        hug: { width: boolean, height: boolean }
        /** Keeps its size whatever its content, as a field does. */
        fixed?: boolean
    }
    /** An image the layer shows, by its key in the kit's images, stretched over it: a background or a picture. */
    image?: string
    /**
     * How the frame's corners, padding and gap follow theme variables, as the theme's values move from those it was
     * captured in: by corner and side, in the order of `radius` and the layout's `padding`.
     */
    bindings?: LayerBindings
    /** Placed where it is, outside its parent's layout. */
    absolute?: boolean
    /** A side of its parent's border, which the browser paints under the parent's content. */
    band?: boolean
    /** How it sizes in its parent's layout across the main axis. */
    fill?: boolean
    /** Takes the room its parent's layout leaves along it, as a flex item that grows does, e.g. a list item's title. */
    grow?: boolean
    /** Scales with its parent's width, which has no stack, e.g. a progress bar's value at its share of the track. */
    relative?: boolean
    /**
     * Keeps its place at the same share of its parent's width, pinned to neither side, as its parent is drawn wider or
     * narrower, e.g. a slider's thumb.
     */
    floats?: boolean
    clip?: boolean
    children: Layer[]
}

export interface LayerBindings {
    radius?: Record<number, Binding>
    padding?: Record<number, Binding>
    gap?: Binding
    /** A size the styles set rather than the layout, of a layer placed on its own, e.g. an alert's accent. */
    width?: Binding
    height?: Binding
}

/** The measures of layer and text styles that follow theme variables. */
export type StyleMeasure = 'borderWidth' | 'fill' | 'borderColor' | 'shadow' | 'size' | 'lineHeight' | 'weight' | 'letterSpacing' | 'transform' | 'family'

/** How a style's measures follow theme variables, by measure. */
export type StyleBindings = Partial<Record<StyleMeasure, Binding[]>>

/**
 * A style's measures as the kit draws them, and how they follow theme variables. A style can stand for parts whose
 * measures follow different variables, e.g. a button's label in every appearance, each with a text case of its own:
 * each is listed.
 */
export interface StyleBinding {
    at: Partial<Record<StyleMeasure, number | string>>
    follows: StyleBindings
}

export interface KitSymbol {
    name: string
    inputs: Record<string, unknown>
    width: number
    height: number
    layer: Layer
}

export interface Starter {
    name: string
    symbol: string
    inputs: Record<string, unknown>
    /** How the style inputs' values read, e.g. `Disabled` for `disabled: true`. */
    labels: Record<string, string>
    /** Styles by the name of the layer they're for. */
    /**
     * By layer: `follows` is the component's colour variable a tint comes from, e.g. a toast's text from
     * `toastr-success-text-color`, which a theme can set apart from the colour variable the tint links to.
     */
    overrides: Record<string, { layerStyle?: string, textStyle?: string, tint?: Paint, follows?: string, text?: string, symbol?: string }>
}

export interface KitComponent {
    name: string
    key: string
    symbols: KitSymbol[]
    starters: Starter[]
    /**
     * The theme variables its own parts follow, as captured: corners, padding, gaps, sizes, borders, fonts and colours;
     * not those of components it holds, or of other components that share its styles.
     */
    follows: string[]
}

export interface Kit {
    theme: string
    /** The images layers show, by their keys: SVG markup, or a raster image's data URL. */
    images: Record<string, string>
    layerStyles: Record<string, LayerStyle>
    textStyles: Record<string, TextStyle>
    /** How each style's measures follow theme variables, by its name. */
    styleBindings: Record<string, StyleBinding>
    components: KitComponent[]
}

// ---- What the Sketch scripts take ----

/** A component's part of the model, for the script that builds it in a Sketch document (sketch/component.ts). */
export interface ComponentData {
    component: string
    /** The page its board goes on, and the board's name. */
    page: string
    board: string
    /** The inputs its starters are named by, e.g. appearance and status. */
    style: string[]
    symbols: KitSymbol[]
    starters: Starter[]
    /** The styles its symbols and starters use. */
    layerStyles: Record<string, LayerStyle>
    textStyles: Record<string, TextStyle>
    /** Every style the model has, of every component, so another component's aren't removed as unused. */
    allStyles: string[]
    images: Record<string, string>
}

/** A variable the Theme board shows, in its group. */
export interface ThemeKnob {
    group: string
    variable: string
    /** One of the colours a theme starts from, shown with a chip. */
    colour?: boolean
}

/** What the theme script knows of the kit (sketch/theme/apply.ts). */
export interface KitTheme {
    /** The Lyra theme the kit is drawn in, and its variables' formulas, e.g. `calc(var(--border-radius) * 3)`. */
    theme: string
    formulas: Record<string, string>
    /** Lyra's other themes, which a theme can start from: their formulas where they differ from the kit's. */
    bases: Record<string, Record<string, string>>
    /** Each colour variable's theme variable, by the colour variable's name. */
    swatches: Record<string, string>
    /** How the styles follow theme variables, by the style's name. */
    styles: Record<string, StyleBinding>
    /** The typography text styles' prefixes, e.g. `Heading/H1`, by their typography, e.g. `heading-1`. */
    typography: Record<string, string>
    /** What each symbol depends on, by its name. */
    symbols: Record<string, ThemedSymbol>
    knobs: ThemeKnob[]
    /** Changes with the kit's data, so a theme applied with other data is applied in full again. */
    stamp: string
}

/**
 * What a symbol of the kit depends on, for the theme script to change only what a theme moves: a symbol is laid out
 * again where its frames, its texts' styles or a symbol it holds change.
 */
export interface ThemedSymbol {
    /** The starters board it's on. */
    board: string
    /** The symbols it holds, e.g. a dialog's buttons, or a starter's base. */
    uses?: string[]
    /** The styles of its layers, and those its overrides choose for the symbols it holds. */
    textStyles?: string[]
    layerStyles?: string[]
    /** The variables its frames' padding, gaps and sizes follow, which lay it out, and those its corners follow. */
    layout?: string[]
    corners?: string[]
    /**
     * A starter's texts' and icons' colours, by layer: the component's colour variable each comes from, and the colour
     * variable it's linked to in the kit.
     */
    tints?: Record<string, { variable: string, swatch?: string }>
}

export interface ThemeOptions {
    /** The document's path, or its ID. */
    document: string
    /** The Lyra theme the theme goes over: the recorded one, or the kit's, without one. */
    base?: string
    name?: string
    /** The theme's own variables: the recorded ones, with what was changed on the Theme board, without them. */
    theme?: Record<string, string>
    /** Whether to update the starters boards and the Theme board, by default. */
    boards?: boolean
    board?: boolean
    /**
     * Whether to apply every variable, rather than those whose values changed since the theme was last applied, e.g.
     * after changing the kit's styles by hand.
     */
    full?: boolean
}

/** What a theme changed, as the theme script returns and records it. */
export interface ThemeOutcome {
    counts: { colours: number, layerStyles: number, textStyles: number, layers: number }
    changed: string[]
    changedStyles: string[]
    warnings: string[]
    warningCount: number
}

/** What the design check knows of the kit (sketch/check.ts). */
export interface KitCheck {
    /** The component of each symbol and starter, by its name. */
    symbols: Record<string, string>
    /** The component of each style, `typography` for the theme's, by its name. */
    styles: Record<string, string>
    /** The other components whose symbols draw a style, by its name, e.g. a form field its input's. */
    usedBy: Record<string, string[]>
    swatches: Record<string, string>
    /** The kit's own pages, which aren't checked. */
    pages: string[]
    /** The names of each symbol's top layers, which a detached copy of it has. */
    parts: Record<string, string[]>
    /** The typography's text styles' names begin with these, e.g. `Heading/H4`, then a colour: the theme's own. */
    typography: string[]
}

export interface CheckOptions {
    document: string
    /** Whether to write the Check page, by default. */
    board?: boolean
    /** How many findings the result lists, 200 by default. */
    limit?: number
}

export interface InspectOptions {
    document: string
    /** The screens to read, by name or ID: every screen of the design's pages by default. */
    boards?: string[]
    /** A layer to read, by ID, with what's in it, rather than whole screens, e.g. a card. */
    layer?: string
    /** How many levels of layers to read under each screen or layer; deeper ones are counted, in `more`. */
    depth?: number
    /**
     * A folder to export the design's own drawings to, e.g. a logo or an illustration, as SVG, and its pictures as PNG,
     * each named by its layer's ID; each drawing's `file` names its file.
     */
    svg?: string
    /**
     * Reads the screens as an outline, a line a layer, indented by depth, with its frame, style, symbol and text, rather
     * than JSON: a screen's structure at a glance.
     */
    outline?: boolean
}

/** A layer of a design as `inspect.js` reads it: in its screen's coordinates, with its look by name. */
export interface InspectedLayer {
    name: string
    type: string
    frame: { x: number, y: number, width: number, height: number }
    /** Its layer or text style. */
    style?: string
    /** Its fills' colour variables, else their colours; a gradient as CSS, e.g. `linear-gradient(90deg, …)`; `image`. */
    fills?: Array<string | undefined>
    borders?: Array<{ paint?: string, width?: number }>
    radius?: number[]
    opacity?: number
    /** How it blends with what's under it, as CSS's `mix-blend-mode`, e.g. `multiply`; normal isn't given. */
    blend?: string
    text?: string
    color?: string
    /** A text's font as the file has it, e.g. `DMMono-Regular` at 40 px, its line height, spacing and case. */
    font?: { family: string, postscript?: string, size?: number, weight?: number, lineHeight?: number, letterSpacing?: number, transform?: string, alignment: string }
    /** An instance's symbol, the kit's component it is, and its overrides, e.g. `Label stringValue`. */
    symbol?: string
    component?: string
    overrides?: Record<string, unknown>
    /** A frame's stack layout, and the same as CSS, e.g. `display: flex; flex-direction: column; gap: 16px`. */
    stack?: { direction: string, gap: number, padding: unknown, align: string, justify: string, css: string }
    layers?: InspectedLayer[]
    /** How many layers it holds that weren't read, beyond `depth`. */
    more?: number
    /** The file a drawing of the design's own was exported to, with `svg`. */
    file?: string
}

export interface MirrorOptions {
    document: string
    /** The screens to mirror, by name or ID: the selected ones by default. */
    boards?: string[]
}

export interface UnwrapOptions {
    document: string
    /** The starters to unwrap, or the frames and groups that hold them, by ID: the selected ones by default. */
    layers?: string[]
    /** The symbol to swap each for, with its look, e.g. `Tag/Small/Plain`; the one it holds by default. */
    symbol?: string
}

export interface UpdateOptions {
    document: string
}

export interface ResizeOptions {
    document: string
    /** The board or frame to resize, by ID. */
    layer: string
    width?: number
    height?: number
}

export interface CalendarMonthOptions {
    document: string
    /** The calendar instance, by ID. */
    layer: string
    /** The month, as `2026-11`. */
    month: string
    /** The week's first day: 0, Sunday, as the kit's calendars, or 1, Monday. */
    firstDay?: 0 | 1
    /** The days of the month that are selected, today and disabled. */
    selected?: number[]
    today?: number
    disabled?: number[]
}

export interface TypographyOptions {
    document: string
}

/** The theme's typographies, in order, for the kit's text styles and its Typography page; see typography.ts. */
export interface TypographyData {
    /** The typography whose text styles new ones start from, in each colour, e.g. `Paragraph/P1`. */
    template: string
    /** The text colours the text styles come in, by their names' last part, e.g. `Hint`. */
    colours: string[]
    /** Each typography's text styles' prefix, e.g. `Display`, its row's name, and its font in the kit's theme, in px. */
    categories: Array<{ category: string, prefix: string, label: string, family: string, size: number, lineHeight: number, weight: number }>
}

/** Findings that are the same thing, e.g. a logo on every screen, as the Check page lists them once. */
export interface CheckRow {
    kind: string
    where: string
    detail: string
    app: string
    boards: string[]
    count: number
}

export interface CheckFinding {
    kind: string
    layer: string
    id: string
    place: string
    detail: string
    app: string
}
