import { Component, computed, inject, input } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

import { injectNbIconStyle, NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base'
import { NbIconLibraries } from './icon-libraries'
import { NbIconOptions } from './icon'
import { NbIconRef } from './icon-ref'

export interface NbIconConfig {
    icon: string
    pack?: string
    status?: NbComponentOrCustomStatus
    options?: NbIconOptions
}

/**
 * Renders an SVG or font icon from a registered icon pack.
 *
 * Uses the icons of `@liquid-js/lyr-icons` by default, once they're registered.
 *
 * @stacked-example(Showcase, icon/icon-showcase.component)
 *
 * ```html
 * <nb-icon icon="star"></nb-icon>
 * ```
 * ### Installation
 *
 * Import `NbIconComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbIconComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * By default Lyra comes only with the icons its components use. The rest of its icons ship as a separate package,
 * `@liquid-js/lyr-icons`:
 * ```sh
 * npm i @liquid-js/lyr-icons
 * ```
 * Register it in the application's providers, which makes it the default pack:
 * ```ts
 * import { provideNbIcons } from '@liquid-js/lyr-icons';
 *
 * bootstrapApplication(AppComponent, { providers: [provideNbTheme(), provideNbIcons()] });
 * ```
 * All the icons are in the [icon browser](icons/browse-icons); an app's own icons can join the pack, see
 * [Register Icon Packs](icons/register-icon-packs).
 *
 * ### Usage
 *
 * `status` colours the icon:
 * ```html
 * <nb-icon icon="star" status="warning"></nb-icon>
 * ```
 * @stacked-example(Colored Icons, icon/icon-colors.component)
 *
 * `pack` takes the icon from a pack other than the default one:
 * ```html
 * <nb-icon icon="star" pack="font-awesome"></nb-icon>
 * ```
 * `options` passes settings the icon pack supports, if any:
 *
 * ```html
 * <nb-icon icon="star" [options]="{ animation: { type: 'zoom' } }"></nb-icon>
 * ```
 *
 * The icons animate with `zoom`, `pulse`, `shake` or `flip`; `infinite: true` repeats it, and `hover: false` plays it
 * right away instead of on hover:
 *
 * ```html
 * <nb-icon icon="heart-outline" [options]="{ animation: { type: 'pulse', infinite: true, hover: false } }"></nb-icon>
 * ```
 * @styles
 *
 * icon-font-size:
 * icon-line-height:
 * icon-width:
 * icon-height:
 * icon-svg-vertical-align:
 * icon-basic-color:
 * icon-primary-color:
 * icon-info-color:
 * icon-success-color:
 * icon-warning-color:
 * icon-danger-color:
 * icon-control-color:
 */
@Component({
    selector: 'nb-icon',
    styleUrls: ['./icon.component.scss'],
    template: '',
    providers: [{ provide: NbIconRef, useExisting: NbIconComponent }],
    host: {
        '[class]': 'hostClasses()',
        '[innerHtml]': 'html()'
    }
})
export class NbIconComponent {
    protected readonly sanitizer = inject(DomSanitizer)
    protected readonly iconLibrary = inject(NbIconLibraries)

    /** The icon's name in its pack. */
    readonly icon = input<string>()

    /** The pack to take the icon from; the default pack when unset. Throws when no pack is registered as the default. */
    readonly pack = input<string>()

    /** Settings the icon pack supports, e.g. an animation. */
    readonly options = input<NbIconOptions>()

    /** Colours the icon with a status colour. */
    readonly status = input<NbComponentOrCustomStatus>()

    /**
     * All the icon's inputs as one object, or just the icon's name as a string; an object replaces the separate inputs
     * entirely.
     *
     * @docs-private
     */
    readonly config = input<string | NbIconConfig>()

    // The icon to render: `config` when it is set, the separate inputs otherwise.
    protected readonly resolved = computed<Partial<NbIconConfig>>(() => {
        const config = this.config()
        if (!config) {
            return { icon: this.icon(), pack: this.pack(), status: this.status(), options: this.options() }
        }
        if (typeof config === 'string') {
            return { icon: config, pack: this.pack(), status: this.status(), options: this.options() }
        }
        return config
    })

    // The app's icon style, if it has one: icons in the other style use this one where their pack has both.
    protected readonly iconStyle = injectNbIconStyle()

    protected readonly iconDefinition = computed(() => {
        const { icon, pack } = this.resolved()
        // An unset icon is still looked up (as an empty name), so a missing pack fails as it does for a set one.
        return this.iconLibrary.getIcon(icon ?? '', pack, this.iconStyle())
    })

    protected readonly html = computed<SafeHtml>(() => {
        const content = this.iconDefinition()?.icon.getContent(this.resolved().options)
        return content ? this.sanitizer.bypassSecurityTrustHtml(content) : ''
    })

    protected readonly hostClasses = computed(() => {
        const { status, options } = this.resolved()
        // Pack and icon classes may hold several space-separated names.
        const iconClasses = (this.iconDefinition()?.icon.getClasses(options) ?? []).flatMap((name) => name.split(/\s+/))
        return [...iconClasses, status && `status-${status}`].filter(Boolean)
    })
}
