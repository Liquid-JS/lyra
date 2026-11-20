import { Component, computed, inject, input } from '@angular/core'

import { NbComponentSize, NbComponentOrCustomStatus, NB_SYSTEM_THEME, NbContentSize, NbThemeService, injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base'
import { NbSelectComponent, NbOptionComponent } from '@liquid-js/lyr-core/select'
import { NbButtonGroupComponent, NbButtonToggleDirective } from '@liquid-js/lyr-core/button'

/** @internal */
declare const $localize: NbLocalize

let lastId = 0

/** @internal */
function injectNbThemeTexts() {
    return injectNbTexts('theme', () => ({
        theme: $localize`:@@nb.theme.theme:Theme`,
        system: $localize`:@@nb.theme.system:System`,
        contentSize: $localize`:@@nb.theme.contentSize:Text size`,
        small: $localize`:@@nb.theme.small:Small`,
        medium: $localize`:@@nb.theme.medium:Medium`,
        large: $localize`:@@nb.theme.large:Large`,
        larger: $localize`:@@nb.theme.larger:Larger`
    }))
}

/**
 * A select of the app's themes, which the user's choice changes and, with `preferences`, keeps:
 *
 * ```ts
 * provideNbTheme({
 *   name: 'default',
 *   themes: [
 *     { name: 'default', scheme: 'light' },
 *     { name: 'dark', scheme: 'dark' },
 *   ],
 *   preferences: true,
 * })
 * ```
 *
 * ```html
 * <nb-theme-select />
 * ```
 *
 * @stacked-example(Showcase, theme-select/theme-select-showcase.component)
 *
 * It offers the themes the app declares in `provideNbTheme`, named with their `label`, and "System": the declared
 * theme that fits the system's colour scheme and contrast, which it follows as they change, and which is the theme
 * until the user picks one. A high-contrast theme (`contrast: 'more'`) is picked when the system asks for more
 * contrast. With `preferences`, the choice is kept in `NB_PREFERENCE_STORAGE`, `localStorage` by default; provide
 * your own, e.g. to keep it in the user's profile:
 *
 * ```ts
 * {
 *   provide: NB_PREFERENCE_STORAGE,
 *   useValue: { get: (key) => profile.get(key), set: (key, value) => profile.set(key, value) },
 * }
 * ```
 *
 * `NbThemeService` has the same in code: `theme()`, `themePreference()` and `setThemePreference()`.
 * `nb-content-size-switcher` sets how large the content is the same way.
 */
@Component({
    selector: 'nb-theme-select',
    template: `
    <span class="visually-hidden" [id]="labelId">{{ texts().theme }}</span>
    <nb-select
      [aria-labelledby]="labelId"
      [selected]="themeService.themePreference()"
      [size]="size()"
      [status]="status()"
      (selectedChange)="selectTheme($event)"
    >
      @if (themeService.themes.length) {
        <nb-option [value]="system">{{ texts().system }}</nb-option>
      }
      @for (theme of themes(); track theme.name) {
        <nb-option [value]="theme.name">{{ theme.label }}</nb-option>
      }
    </nb-select>
  `,
    imports: [NbSelectComponent, NbOptionComponent],
    host: {
        class: 'nb-theme-select'
    }
})
export class NbThemeSelectComponent {
    protected readonly themeService = inject(NbThemeService)
    protected readonly texts = injectNbThemeTexts()
    protected readonly labelId = `nb-theme-select-${lastId++}`
    protected readonly system = NB_SYSTEM_THEME

    /** Select size: `tiny`, `small`, `medium`, `large` or `giant`; by default, the selects' (`medium` unless set). */
    readonly size = input<NbComponentSize>()
    /** The select's status, `basic` by default. */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    /** The declared themes, or the current one without them, with their names. */
    protected readonly themes = computed(() => {
        const declared = this.themeService.themes
        const themes = declared.length ? declared : [{ name: this.themeService.theme() }]
        return themes.map((theme) => ({
            name: theme.name,
            label: ('label' in theme && theme.label) || theme.name.charAt(0).toUpperCase() + theme.name.slice(1)
        }))
    })

    protected selectTheme(preference: string | null) {
        if (preference !== null) {
            this.themeService.setThemePreference(preference)
        }
    }
}

/** How much larger or smaller each content size makes the text, which its button shows. */
const CONTENT_SCALES: Record<NbContentSize, number> = { small: 0.875, medium: 1, large: 1.125, larger: 1.25 }

/**
 * A compact switcher of how large the content is: a button for each size, with an "A" in that size. It scales the
 * root font size, so everything sized in `rem`, Lyra and the app, follows: small (87.5%), medium (the browser's
 * size), large (112.5%) and larger (125%). With `preferences` in `provideNbTheme`, the choice is kept like the
 * theme's; `NbThemeService` has the same in code: `contentSize()` and `setContentSize()`.
 *
 * ```html
 * <nb-content-size-switcher />
 * ```
 */
@Component({
    selector: 'nb-content-size-switcher',
    template: `
    <nb-button-group ghost [size]="size()" role="group" [attr.aria-label]="texts().contentSize">
      @for (option of sizes; track option) {
        <button
          nbButtonToggle
          type="button"
          [pressed]="themeService.contentSize() === option"
          [attr.aria-label]="texts()[option]"
          [title]="texts()[option]"
          (click)="themeService.setContentSize(option)"
        >
          <span class="glyph" aria-hidden="true" [style.font-size.em]="scales[option]">A</span>
        </button>
      }
    </nb-button-group>
  `,
    styles: `
    :host {
      display: inline-flex;
      align-self: flex-start;
    }

    /*
     * The letters stand on one line, so their sizes compare: each sits on the baseline of a line of the button's text,
     * which is in the button's middle, as its label would be, and takes no room in it, so a bigger letter doesn't move it.
     */
    :host button {
      display: inline-grid;
      align-content: center;
      text-transform: none;
    }

    .glyph {
      line-height: 0;
    }
  `,
    imports: [NbButtonGroupComponent, NbButtonToggleDirective],
    host: {
        class: 'nb-content-size-switcher'
    }
})
export class NbContentSizeSwitcherComponent {
    protected readonly themeService = inject(NbThemeService)
    protected readonly texts = injectNbThemeTexts()
    protected readonly sizes: NbContentSize[] = ['small', 'medium', 'large', 'larger']
    protected readonly scales = CONTENT_SCALES

    /**
     * Button size: `tiny`, `small`, `medium`, `large` or `giant`; by default, the button groups' (`medium` unless
     * set), so it's as tall as a theme select beside it.
     */
    readonly size = input<NbComponentSize>()
}
