# Lyra extras

[![GitHub license](https://img.shields.io/github/license/Liquid-JS/lyra.svg)](https://github.com/Liquid-JS/lyra/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/dm/@liquid-js/lyr-extras.svg)](https://www.npmjs.com/package/@liquid-js/lyr-extras)
[![scope](https://img.shields.io/npm/v/@liquid-js/lyr-extras.svg)](https://www.npmjs.com/package/@liquid-js/lyr-extras)

Lyra components built on other libraries. Each component is in its own entry point, so an app only installs the
libraries of the components it uses.

## Quick links

- [QR code](https://liquid-js.github.io/lyra/extras/components/qr-code/overview/)
- [Markdown editor](https://liquid-js.github.io/lyra/extras/components/markdown-editor/overview/)
- [Markdown viewer](https://liquid-js.github.io/lyra/extras/components/markdown-viewer/overview/)
- [Phone input](https://liquid-js.github.io/lyra/extras/components/phone-input/overview/)
- [Input mask](https://liquid-js.github.io/lyra/extras/components/input-mask/overview/)
- [Color picker](https://liquid-js.github.io/lyra/extras/components/color-picker/overview/)
- [Chart](https://liquid-js.github.io/lyra/extras/components/chart/overview/)
- [Video and audio](https://liquid-js.github.io/lyra/extras/components/video-audio/overview/)

### Installing

Install the package with the libraries of the components you use, e.g. for the QR code:

```sh
npm install --save @liquid-js/lyr-extras @liquid-js/qr-code-styling
```

| Entry point                             | Component                                                        | Needs                                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `@liquid-js/lyr-extras/qr-code`         | `nb-qr-code`, a QR code with downloads                           | `@liquid-js/qr-code-styling`                                                                            |
| `@liquid-js/lyr-extras/markdown-editor` | `nb-markdown-editor`, markdown with a preview and a WYSIWYG mode | `@liquid-js/underflow`, `remark`, `remark-gfm`, `remark-frontmatter`, `nxt-highlightjs`, `highlight.js` |
| `@liquid-js/lyr-extras/markdown-viewer` | `nb-markdown-viewer`, markdown rendered with Angular templates   | `ngx-remark`, `remark`, `remark-gfm`, `remark-smartypants`, `nxt-highlightjs`, `highlight.js`           |
| `@liquid-js/lyr-extras/phone-input`     | `nb-phone-input`, a phone number with its country                | `libphonenumber-js`, `i18n-iso-countries`, `nxt-flags`                                                  |
| `@liquid-js/lyr-extras/mask`            | `nbMask`, formats what is typed with a mask                      | `maska`                                                                                                 |
| `@liquid-js/lyr-extras/color-picker`    | `nb-color-picker`, a colour field with a picker dialog           | `nxt-color-picker`                                                                                      |
| `@liquid-js/lyr-extras/chart`           | `nb-chart` and line, bar and pie charts in the theme's colours   | `chart.js`                                                                                              |
| `@liquid-js/lyr-extras/media`           | `nb-video` and `nb-audio`, players with Lyra's controls          | `@videojs/core`, `@videojs/media`, `@videojs/store`                                                     |

Video.js 10's packages, which the video and audio players need, are under the Apache 2.0 licence. Streams and
embeds play with Video.js's engines, e.g. `@videojs/hlsjs-video` for HLS, which an app sets with
`provideNbMediaPlayer` and which are only downloaded when a player first needs one.

### Import a component

```ts
import { NbQrCodeComponent } from '@liquid-js/lyr-extras/qr-code'

@Component({
    ...
    imports: [
        ...
        NbQrCodeComponent
    ]
})
```

### Include it in HTML template

```html
<nb-qr-code data="https://example.com/" />
```
