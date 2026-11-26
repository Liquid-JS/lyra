/**
 * The parts of Sketch's JavaScript API (https://developer.sketch.com/reference/api/) the kit's scripts use, as Sketch
 * 2025 has them. No maintained typings cover stacks, swatches or flex sizing, so these are the kit's own: checked
 * against the API's behaviour in Sketch, with what the reference doesn't say noted where it matters.
 */

/** The global the scripts run in: Sketch's JavaScriptCore, with CommonJS modules and timers. */
declare function require(id: string): unknown
declare function setTimeout(callback: () => void, delay?: number): unknown
declare const console: { log(...values: unknown[]): void }

declare module 'sketch' {
    export interface Rectangle {
        x: number
        y: number
        width: number
        height: number
    }

    /** A colour as `#rrggbbaa`, the way Sketch gives and takes it. */
    export type Colour = string

    export interface Swatch {
        readonly id: string
        name: string
        color: Colour
        getLibrary(): Library | null
    }

    export interface Library {
        readonly name: string
    }

    export interface GradientStop {
        position: number
        color: Colour
        swatch?: Swatch
    }

    export interface Gradient {
        gradientType: string
        from: { x: number, y: number }
        to: { x: number, y: number }
        stops: GradientStop[]
    }

    export interface Fill {
        fillType: string
        enabled?: boolean
        color?: Colour
        gradient?: Gradient
        swatch?: Swatch
    }

    export interface Border extends Fill {
        thickness?: number
        position?: string
    }

    export interface Shadow {
        color: Colour
        x: number
        y: number
        blur: number
        spread: number
        enabled?: boolean
        swatch?: Swatch
    }

    export interface Style {
        fills: Fill[]
        borders: Border[]
        borderOptions: { dashPattern: number[] }
        shadows: Shadow[]
        innerShadows: Shadow[]
        opacity: number
        blur?: { enabled: boolean }
        corners: { radii: number[] }
        /** An icon's colour: a colour variable, or a colour. */
        tint?: { swatch: Swatch } | { color: Colour }
        fontFamily: string
        fontSize: number
        /** Sketch's weight index: 5 is regular, 9 bold. */
        fontWeight: number
        lineHeight: number | null
        kerning: number | null
        textTransform: 'none' | 'uppercase' | 'lowercase'
        alignment: string
        textColor: Colour
        textSwatch?: Swatch
        syncWithSharedStyle(shared: SharedStyle): void
    }

    export interface SharedStyle {
        readonly id: string
        name: string
        /** A copy of the style: set it again to change the shared style. */
        style: Style
        getLibrary(): Library | null
        getAllInstancesLayers(): Layer[]
    }

    export interface StackLayout {
        direction: number
        alignItems: number
        justifyContent: number
        /** A number where it's the same all round. */
        padding: number | { top: number, right: number, bottom: number, left: number }
        gap: number
        /** Lays out the stack, by processing the document's pending changes: the whole document's, not this stack's. */
        apply(): void
    }

    export interface StackLayoutInit {
        direction: number
        alignItems?: number
        justifyContent?: number
        padding?: number | { top: number, right: number, bottom: number, left: number }
        gap?: number
    }

    export type LayerType = 'Page' | 'Artboard' | 'SymbolMaster' | 'SymbolInstance' | 'Group' | 'Text' | 'ShapePath' | 'Shape' | 'Image' | 'HotSpot' | 'Slice'

    export interface Layer {
        readonly id: string
        readonly type: LayerType
        name: string
        parent: Group | Page
        index: number
        frame: Rectangle
        hidden: boolean
        style: Style
        sharedStyle: SharedStyle | null
        transform: { rotation: number }
        horizontalSizing: number
        verticalSizing: number
        ignoresStackLayout: boolean
        horizontalPins: number
        verticalPins: number
        /** Only on a group, frame or symbol with a stack. */
        stackLayout?: StackLayout
        remove(): void
        moveToBack(): void
    }

    export interface Group extends Layer {
        layers: Layer[]
        clipsContents: boolean
    }

    export interface Page {
        readonly id: string
        readonly type: 'Page'
        name: string
        layers: Layer[]
        parent: Document
    }

    export interface Background {
        enabled: boolean
        includedInExport?: boolean
        color?: Colour
    }

    export interface Artboard extends Group {
        background: Background
    }

    export interface Override {
        readonly path: string
        readonly property: string
        readonly affectedLayer: Layer
        readonly isDefault: boolean
        value: unknown
        swatchValue?: Swatch
        editable: boolean
    }

    export interface SymbolMaster extends Artboard {
        readonly symbolId: string
        readonly overrides: Override[]
        createNewInstance(): SymbolInstance
        getLibrary(): Library | null
    }

    export interface SymbolInstance extends Layer {
        readonly symbolId: string
        readonly master: SymbolMaster | undefined
        readonly overrides: Override[]
        /** Sizes the instance to its symbol's content again, as Sketch does when it changes. */
        resizeWithSmartLayout(): void
    }

    export interface Text extends Layer {
        text: string
        fixedWidth: boolean
        adjustToFit(): void
    }

    export interface Document {
        readonly id: string
        /** The file's path, URL-encoded, e.g. spaces as `%20`; none before it's saved. */
        readonly path: string | undefined
        pages: Page[]
        selectedPage: Page
        swatches: Swatch[]
        sharedLayerStyles: SharedStyle[]
        sharedTextStyles: SharedStyle[]
        getSymbols(): SymbolMaster[]
        getSharedLayerStyleWithID(id: unknown): SharedStyle | undefined
        getSharedTextStyleWithID(id: unknown): SharedStyle | undefined
        getSymbolMasterWithID(id: string): SymbolMaster | undefined
        getLayerWithID(id: string): Layer | undefined
        /** Lays out what changed: stacks, and instances of changed symbols. */
        processPendingChanges(): void
        save(): void
        close(): void
    }

    interface Parented {
        parent?: Group | Page | Document
        name?: string
        frame?: Rectangle
    }

    export function getDocuments(): Document[]
    export function getSelectedDocument(): Document | undefined
    /** A layer as the file format keeps it, read in one call; see file-format.ts. */
    export function fromSketchJSON(json: unknown): Layer
    export function createLayerFromData(data: string, type: 'svg'): Layer

    function exportJSON(layer: Layer, options: { formats: 'json', output: false }): unknown
    export { exportJSON as export }

    export const Page: {
        new (init: { name: string, parent: Document }): Page
        getSymbolsPage(document: Document): Page
    }
    export const Artboard: new (init: Parented) => Artboard
    export const SymbolMaster: new (init: Parented) => SymbolMaster
    export const ShapePath: {
        new (init: Parented): Layer
        fromSVGPath(path: string): Layer
    }
    export const Text: new (init: Parented & { text: string }) => Text
    export const Group: { Frame: new (init: Parented) => Group }
    export const Image: new (init: { image: { base64: string } }) => Layer
    export const SharedStyle: { fromStyle(init: { name: string, style: Style, document: Document }): SharedStyle }

    export const Style: {
        FillType: { Color: string, Gradient: string, Pattern: string }
        GradientType: { Linear: string, Radial: string, Angular: string }
        BorderPosition: { Center: string, Inside: string, Outside: string }
    }
    export const StackLayout: { Direction: { Row: number, Column: number } }
    export const FlexSizing: { Fixed: number, Fit: number, Fill: number, Relative: number }
    export const Pin: { None: number, Min: number, Max: number, All: number }

    export const Settings: {
        documentSettingForKey(document: Document, key: string): unknown
        setDocumentSettingForKey(document: Document, key: string, value: unknown): void
        layerSettingForKey(layer: Layer, key: string): unknown
        setLayerSettingForKey(layer: Layer, key: string, value: unknown): void
        globalSettingForKey(key: string): unknown
        setGlobalSettingForKey(key: string, value: unknown): void
    }

    export const UI: {
        message(text: string): void
        alert(title: string, text: string): void
    }
}
