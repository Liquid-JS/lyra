import { NbJSThemeOptions } from './theme.options'

const palette = {
    primary: '#d0bcff',
    success: '#8fd88a',
    info: '#96ccff',
    warning: '#ffb869',
    danger: '#f2b8b5'
}

/** Material 3's baseline dark scheme, for charts and other code that draws with the theme's colours. */
export const MATERIAL_DARK_THEME: NbJSThemeOptions = {
    name: 'material-dark',
    base: 'dark',
    variables: {
        fontMain: 'Roboto, sans-serif',
        fontSecondary: 'Roboto, sans-serif',

        bg: '#211f26',
        bg2: '#1d1b20',
        bg3: '#141218',
        bg4: '#0f0d13',

        border: '#211f26',
        border2: '#2b2930',
        border3: '#49454f',
        border4: '#938f99',
        border5: '#cac4d0',

        fg: '#cac4d0',
        fgHeading: '#e6e0e9',
        fgText: '#e6e0e9',
        fgHighlight: palette.primary,
        layoutBg: '#141218',
        separator: '#49454f',

        primary: palette.primary,
        success: palette.success,
        info: palette.info,
        warning: palette.warning,
        danger: palette.danger,

        primaryLight: '#ddcdff',
        successLight: '#9ddd95',
        infoLight: '#a0d2ff',
        warningLight: '#ffbf7b',
        dangerLight: '#f5cbc8'
    }
}
