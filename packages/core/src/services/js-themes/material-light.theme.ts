import { NbJSThemeOptions } from './theme.options';

const palette = {
  primary: '#6750a4',
  success: '#2e6c2f',
  info: '#00629c',
  warning: '#8a5100',
  danger: '#b3261e',
};

/** Material 3's baseline light scheme, for charts and other code that draws with the theme's colours. */
export const MATERIAL_LIGHT_THEME: NbJSThemeOptions = {
  name: 'material-light',
  base: 'default',
  variables: {
    fontMain: 'Roboto, sans-serif',
    fontSecondary: 'Roboto, sans-serif',

    bg: '#fef7ff',
    bg2: '#f7f2fa',
    bg3: '#f3edf7',
    bg4: '#ece6f0',

    border: '#fef7ff',
    border2: '#ece6f0',
    border3: '#cac4d0',
    border4: '#79747e',
    border5: '#49454f',

    fg: '#49454f',
    fgHeading: '#1d1b20',
    fgText: '#1d1b20',
    fgHighlight: palette.primary,
    layoutBg: '#f3edf7',
    separator: '#cac4d0',

    primary: palette.primary,
    success: palette.success,
    info: palette.info,
    warning: palette.warning,
    danger: palette.danger,

    primaryLight: '#7f67be',
    successLight: '#477c44',
    infoLight: '#2b74a8',
    warningLight: '#98632b',
    dangerLight: '#dc362e',
  },
};
