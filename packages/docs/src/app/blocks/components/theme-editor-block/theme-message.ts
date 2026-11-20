import { NbComponentDefaults, NbLayoutDirection } from '@liquid-js/lyr-core'

/** What the theme editor sends an example: the base theme, the changed variables, the defaults and the direction. */
export interface NgdThemeMessage {
    id: string
    theme: string
    variables: Record<string, string>
    defaults: NbComponentDefaults
    direction: NbLayoutDirection
    /** The Google Fonts families the theme's fonts come from. */
    fonts?: string[]
}
