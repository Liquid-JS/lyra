import { DOCUMENT } from '@angular/common'
import {
    CSP_NONCE,
    EnvironmentProviders,
    inject,
    makeEnvironmentProviders,
    NgModule,
    provideEnvironmentInitializer
} from '@angular/core'
import { NbIconLibraries, NbSvgIcon } from '@liquid-js/lyr-core'

import { ANIMATION_STYLES } from './animations'
import { NB_ICONS } from './generated/icons'

export interface NbAnimatedIconOptions {
    width: string
    height: string
    fill: string
    animation: {
        type: string
        hover: boolean
        infinite: boolean
    }
}

/** Icons by name: the markup inside an icon's `<svg>`, or a whole SVG file. */
export type NbIconSet = Readonly<Record<string, string>>

export interface NbIconsConfig {
    /**
     * Icons to add to the pack, or to replace, by name: the markup inside their `<svg>`, or whole SVG files, which can be
     * imported as text with `import vegan from './icons/vegan.svg' with { loader: 'text' };`. They render, size and
     * animate like the pack's own.
     */
    extra?: NbIconSet
}

/** The name the icons are registered under, which is the default pack: `<nb-icon icon="star" pack="icons" />`. */
export const NB_ICONS_PACK = 'icons'

const SVG_ATTRIBUTES = { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24' }

/** A whole SVG file: its attributes and the markup inside. */
const SVG_FILE = /^\s*(?:<\?xml[^>]*\?>\s*)?(?:<!--[\s\S]*?-->\s*)*(?:<!DOCTYPE[^>]*>\s*)?<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i

/** Animation flags may arrive as strings from template attributes. */
function parseFlag(value?: boolean | string): boolean | undefined {
    return typeof value === 'string' ? JSON.parse(value) : value
}

/**
 * An icon's `<svg>`: default SVG attributes, `nb-icons nb-icons-<name>` classes, and the animation classes
 * (`nb-icons-animation nb-icons-animate-<type>`, wrapped in `<i class="nb-icons-hover">` for hover animations) when an
 * animation is set.
 *
 * The content is the markup inside an icon's `<svg>`, or a whole SVG file, of which it keeps the inner markup and a
 * `viewBox` other than the pack's 24 × 24.
 */
export class NbAnimatedSvgIcon extends NbSvgIcon {
    protected readonly viewBox: string

    constructor(
        protected override name: string,
        protected override content: string
    ) {
        super(name, '')
        const file = SVG_FILE.exec(content)
        this.content = file ? file[2].trim() : content
        this.viewBox = (file && /\bviewBox\s*=\s*["']([^"']*)["']/i.exec(file[1])?.[1]) || SVG_ATTRIBUTES.viewBox
    }

    override getContent(options?: Partial<NbAnimatedIconOptions> & Record<string, unknown>): string {
        const { animation, class: extraClass, ...attributes } = {
            width: '100%',
            height: '100%',
            fill: 'currentColor',
            ...options
        } as Partial<NbAnimatedIconOptions> & Record<string, unknown>
        const hover = animation ? (parseFlag(animation.hover) ?? true) : false
        const classes = [`nb-icons nb-icons-${this.name}`, extraClass]
        if (animation) {
            classes.push(
                'nb-icons-animation',
                parseFlag(animation.infinite) ? 'nb-icons-infinite' : '',
                `nb-icons-animate-${hover ? 'hover-' : ''}${animation.type}`
            )
        }
        const allAttributes = {
            ...SVG_ATTRIBUTES,
            viewBox: this.viewBox,
            class: [...new Set(classes.filter(Boolean))].join(' '),
            ...attributes
        }
        const attributeString = Object.entries(allAttributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')
        const svg = `<svg ${attributeString}>${this.content}</svg>`
        return hover ? `<i class="nb-icons-hover">${svg}</i>` : svg
    }
}

/** Adds the icons' animation styles to the page once; a server-rendered page already has them. */
function addAnimationStyles() {
    const document = inject(DOCUMENT)
    if (document.head.querySelector('style[data-nb-icons]')) {
        return
    }
    const style = document.createElement('style')
    style.setAttribute('data-nb-icons', '')
    const nonce = inject(CSP_NONCE, { optional: true })
    if (nonce) {
        style.setAttribute('nonce', nonce)
    }
    style.textContent = ANIMATION_STYLES
    document.head.appendChild(style)
}

function registerPack(icons: NbIconSet, config: NbIconsConfig) {
    const iconLibrary = inject(NbIconLibraries)
    iconLibrary.registerSvgPack(NB_ICONS_PACK, { ...icons, ...config.extra }, {
        createIcon: (name, content) => new NbAnimatedSvgIcon(name, content)
    })
    iconLibrary.setDefaultPack(NB_ICONS_PACK)
    addAnimationStyles()
}

/**
 * Registers the icons as the default icon pack, named `icons`, in place of importing `NbIconsModule`, with `extra`
 * icons of the app's own. `provideNbSvgIcons('icons', icons)` adds more later on, e.g. from a lazy route.
 */
export function provideNbIcons(config: NbIconsConfig = {}): EnvironmentProviders {
    return makeEnvironmentProviders([provideEnvironmentInitializer(() => registerPack(NB_ICONS, config))])
}

/**
 * Registers only the given icons as the icon pack, so the others stay out of the app's bundle:
 *
 * ```ts
 * import { nbIconStar, nbIconStarOutline, provideNbIconSet } from '@liquid-js/lyr-icons';
 *
 * provideNbIconSet({ star: nbIconStar, 'star-outline': nbIconStarOutline });
 * ```
 *
 * An icon left out renders nothing, so this suits apps that know every icon name they use.
 */
export function provideNbIconSet(icons: NbIconSet, config: NbIconsConfig = {}): EnvironmentProviders {
    return makeEnvironmentProviders([provideEnvironmentInitializer(() => registerPack(icons, config))])
}

@NgModule({
    providers: [provideNbIcons()]
})
export class NbIconsModule {}
