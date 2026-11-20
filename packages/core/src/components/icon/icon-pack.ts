import { NbIcon } from './icon'

export interface NbIcons {
    [key: string]: NbIcon | string
}

export enum NbIconPackType {
    SVG = 'svg',
    FONT = 'font'
}

export interface NbIconPackParams {
    packClass?: string
    /**
     * Makes an icon of the markup a pack holds or is given (`registerSvgIcons`), e.g. one that wraps it in the pack's own
     * `<svg>`. Without it, an SVG pack's markup is a whole SVG.
     */
    createIcon?(name: string, content: string, params: NbIconPackParams): NbIcon
    [name: string]: unknown
}

export interface NbFontIconPackParams extends NbIconPackParams {
    iconClassPrefix?: string
    /**
     * Whether the font renders an icon from its name (a ligature) rather than from a character.
     */
    ligature?: boolean
}

export interface NbIconPack {
    name: string
    type: NbIconPackType
    icons: Map<string, NbIcon | string>
    params: NbIconPackParams
}
