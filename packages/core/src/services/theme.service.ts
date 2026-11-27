import { isPlatformBrowser } from '@angular/common'
import { DestroyRef, inject, PLATFORM_ID, Service, signal } from '@angular/core'

import { Observable, ReplaySubject, Subject } from 'rxjs'
import { map, filter, pairwise, distinctUntilChanged, startWith, share } from 'rxjs/operators'

import { NB_DOCUMENT, NB_PREFERENCE_STORAGE, NB_THEME_OPTIONS, NbThemeDescription } from '../theme.options'
import { NbJSThemeOptions } from './js-themes/theme.options'
import { NbJSThemesRegistry } from './js-themes-registry.service'
import { NbMediaBreakpointsService, NbMediaBreakpoint } from './breakpoints.service'

/** How large the content is: the root font size, which everything sized in `rem` follows. */
export type NbContentSize = 'small' | 'medium' | 'large' | 'larger'

/** The root font size of each content size; `medium` keeps the browser's own. */
const CONTENT_SIZES: Record<NbContentSize, string | undefined> = {
    small: '87.5%',
    medium: undefined,
    large: '112.5%',
    larger: '125%'
}

/** A theme change: the theme now shown and the one shown before, if any. */
export interface NbThemeChange {
    name: string
    previous?: string
}

/** The theme preference that follows the system's colour scheme and contrast. */
export const NB_SYSTEM_THEME = 'system'

/**
 * Keeps the theme shown, which `nb-layout` puts on the body as `nb-theme-<name>`, and gives its JS variables; it also
 * tells which media breakpoint the window's width is in, and relays classes to add to `nb-layout`.
 *
 * It keeps the user's theme and content size too: `setThemePreference` takes a theme's name, or `system` for the
 * declared theme that fits the system's colour scheme and contrast, which it follows as they change, and
 * `setContentSize` scales the root font size. With `preferences` on, both are saved in `NB_PREFERENCE_STORAGE` and
 * restored; `nb-theme-select` and `nb-content-size-switcher` offer them.
 */
@Service()
export class NbThemeService {
    protected readonly options = inject(NB_THEME_OPTIONS)
    private readonly breakpointService = inject(NbMediaBreakpointsService)
    private readonly jsThemesRegistry = inject(NbJSThemesRegistry)
    private readonly document = inject(NB_DOCUMENT)
    private readonly storage = inject(NB_PREFERENCE_STORAGE)
    private readonly browser = isPlatformBrowser(inject(PLATFORM_ID))

    /** The theme shown. */
    readonly theme = signal<string>(this.options?.name ?? 'default')

    /**
     * The user's theme: a theme's name, or `system` for the declared theme that fits the system's preferences, which
     * it is when the app declares its themes and the user chose none.
     */
    readonly themePreference = signal<string>(
        this.options?.themes?.length ? NB_SYSTEM_THEME : (this.options?.name ?? 'default')
    )

    /** How large the content is. */
    readonly contentSize = signal<NbContentSize>('medium')

    private readonly currentBreakpoint = signal<NbMediaBreakpoint | undefined>(undefined)

    /**
     * The media breakpoint the window's width is in, e.g. `md` from 768 px, as `nb-layout` measures it; until it
     * does, e.g. on the server, none. For what changes with the window's size in code, e.g. how many items a header
     * shows; `*nbShownBelow` and `*nbShownAbove` show or hide markup.
     *
     * ```ts
     * readonly phone = computed(() => (this.themeService.breakpoint()?.width ?? Infinity) < 768)
     * ```
     */
    readonly breakpoint = this.currentBreakpoint.asReadonly()

    currentTheme?: string
    private themeChanges$ = new ReplaySubject<NbThemeChange>(1)
    private appendLayoutClass$ = new Subject<string>()
    private removeLayoutClass$ = new Subject<string>()
    private changeWindowWidth$ = new ReplaySubject<number>(2)

    constructor() {
        const options = this.options

        if (options && options.name) {
            this.changeTheme(options.name)
        }
        this.followSystem()
        this.restorePreferences()
    }

    /** Shows a theme by name, without touching the user's preference; `setThemePreference` keeps the choice. */
    changeTheme(name: string) {
        if (name === this.currentTheme) {
            return
        }
        this.themeChanges$.next({ name, previous: this.currentTheme })
        this.currentTheme = name
        this.theme.set(name)
    }

    /** The app's declared themes. */
    get themes(): NbThemeDescription[] {
        return this.options?.themes ?? []
    }

    /** Shows a theme by the user's choice, or with `system` the one that fits the system's preferences, and keeps it. */
    setThemePreference(preference: string) {
        this.applyThemePreference(preference)
        this.save('theme', preference === NB_SYSTEM_THEME ? null : preference)
    }

    /** Sets how large the content is, and keeps it. */
    setContentSize(size: NbContentSize) {
        this.applyContentSize(size)
        this.save('content-size', size === 'medium' ? null : size)
    }

    /**
     * The declared theme that fits the system's colour scheme and contrast: a high-contrast theme only when more
     * contrast is asked for; the starting theme without declared themes.
     */
    systemTheme(): string {
        const fallback = this.options?.name ?? 'default'
        if (!this.themes.length || !this.browser || typeof matchMedia !== 'function') {
            return this.themes.find((theme) => theme.name === fallback)?.name ?? this.themes[0]?.name ?? fallback
        }
        const scheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const more = matchMedia('(prefers-contrast: more)').matches
        const score = (theme: NbThemeDescription) =>
            (theme.scheme === scheme ? 2 : theme.scheme ? -2 : 0) + (theme.contrast === 'more' ? (more ? 4 : -8) : 0)
        return this.themes.reduce((best, theme) => (score(theme) > score(best) ? theme : best)).name
    }

    protected applyThemePreference(preference: string) {
        this.themePreference.set(preference)
        this.changeTheme(preference === NB_SYSTEM_THEME ? this.systemTheme() : preference)
    }

    protected applyContentSize(size: NbContentSize) {
        this.contentSize.set(size)
        const root = this.document?.documentElement
        const fontSize = CONTENT_SIZES[size]
        if (fontSize) {
            root?.style.setProperty('font-size', fontSize)
        } else {
            root?.style.removeProperty('font-size')
        }
    }

    /** Follows the system's colour scheme and contrast while the preference is `system`. */
    protected followSystem() {
        if (this.themePreference() === NB_SYSTEM_THEME) {
            this.changeTheme(this.systemTheme())
        }
        if (!this.themes.length || !this.browser || typeof matchMedia !== 'function') {
            return
        }
        const update = () => {
            if (this.themePreference() === NB_SYSTEM_THEME) {
                this.changeTheme(this.systemTheme())
            }
        }
        const queries = ['(prefers-color-scheme: dark)', '(prefers-contrast: more)'].map((query) => matchMedia(query))
        queries.forEach((query) => query.addEventListener('change', update))
        inject(DestroyRef).onDestroy(() => queries.forEach((query) => query.removeEventListener('change', update)))
    }

    /** Restores the saved theme and content size, when the app keeps preferences; storage may answer later. */
    protected restorePreferences() {
        if (!this.options?.preferences) {
            return
        }
        const known = (theme: string) =>
            theme === NB_SYSTEM_THEME || !this.themes.length || this.themes.some((declared) => declared.name === theme)
        Promise.resolve(this.storage.get(this.key('theme')))
            .then((theme) => theme && known(theme) && this.applyThemePreference(theme))
            .catch(() => undefined)
        Promise.resolve(this.storage.get(this.key('content-size')))
            .then((size) => size && size in CONTENT_SIZES && this.applyContentSize(size as NbContentSize))
            .catch(() => undefined)
    }

    /** Keeps a preference; `null` clears it, as `NbPreferenceStorage.set` takes it. */
    protected save(name: string, value: string | null) {
        if (this.options?.preferences) {
            Promise.resolve(this.storage.set(this.key(name), value)).catch(() => undefined)
        }
    }

    protected key(name: string): string {
        const preferences = this.options?.preferences
        const prefix = (typeof preferences === 'object' && preferences.key) || 'nb'
        return `${prefix}-${name}`
    }

    /** Called by `nb-layout` with the window's width, which `breakpoint` and `onMediaQueryChange` follow. */
    changeWindowWidth(width: number) {
        const point = this.breakpointService.getByWidth(width)
        if (point.name !== this.currentBreakpoint()?.name) {
            this.currentBreakpoint.set(point)
        }
        this.changeWindowWidth$.next(width)
    }

    /**
     * The current theme's JS variables (colours, paddings…), and each theme's as the theme changes.
     */
    getJsTheme(): Observable<NbJSThemeOptions> {
        return this.onThemeChange().pipe(
            map((theme: NbThemeChange) => this.jsThemesRegistry.get(theme.name))
        )
    }

    /**
     * Emits when the window's width enters another media breakpoint, as the previous breakpoint and the current one;
     * the first emission's previous breakpoint is `unknown`. `breakpoint` is the current one as a signal.
     * ```ts
     *  [{ name: 'xs', width: 0 }, { name: 'md', width: 768 }] // change from `xs` to `md`
     * ```
     */
    onMediaQueryChange(): Observable<NbMediaBreakpoint[]> {
        return this.changeWindowWidth$
            .pipe(
                startWith(undefined),
                pairwise(),
                map(([prevWidth, width]: [number | undefined, number | undefined]) => [
                    // Only the first width has no previous one, which resolves to the unknown breakpoint.
                    this.breakpointService.getByWidth(prevWidth),
                    this.breakpointService.getByWidth(width)
                ] as [NbMediaBreakpoint, NbMediaBreakpoint]),
                filter(([prevPoint, point]: [NbMediaBreakpoint, NbMediaBreakpoint]) => prevPoint.name !== point.name),
                distinctUntilChanged(
                    (previous, current) => previous === current,
                    (params) => params[0].name + params[1].name
                ),
                share()
            )
    }

    /** Emits the theme shown and the one before it, starting with the current theme. */
    onThemeChange(): Observable<NbThemeChange> {
        return this.themeChanges$.pipe(share())
    }

    /** Adds a class to the `nb-layout` element. */
    appendLayoutClass(className: string) {
        this.appendLayoutClass$.next(className)
    }

    /** The classes `appendLayoutClass` adds, which `nb-layout` applies. */
    onAppendLayoutClass(): Observable<string> {
        return this.appendLayoutClass$.pipe(share())
    }

    /** Removes a class from the `nb-layout` element. */
    removeLayoutClass(className: string) {
        this.removeLayoutClass$.next(className)
    }

    /** The classes `removeLayoutClass` removes, which `nb-layout` applies. */
    onRemoveLayoutClass(): Observable<string> {
        return this.removeLayoutClass$.pipe(share())
    }
}
