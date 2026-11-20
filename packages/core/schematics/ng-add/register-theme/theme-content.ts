export function createThemeContent(themeName: string): string {
  return `@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/${themeName}';

$nb-themes: nb-register-theme((

  // add your variables here like:

  // color-primary-100: #f2f5ff,
  // color-primary-200: #cedcfb,
  // color-primary-300: #a0baf5,
  // color-primary-400: #5c89e4,
  // color-primary-500: #3469d1,
  // color-primary-600: #2955b1,
  // color-primary-700: #1e4396,
  // color-primary-800: #16347a,
  // color-primary-900: #0c225b,

), ${themeName}, ${themeName});
`;
}

export const stylesContent = `@use 'themes' as *;

@use '@liquid-js/lyr-core/styles/globals' as *;

@include nb-install() {
  @include nb-theme-global();
};
`;
