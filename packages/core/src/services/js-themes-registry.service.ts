import { inject, Service } from '@angular/core'

import { NB_BUILT_IN_JS_THEMES, NB_JS_THEMES } from '../theme.options'
import { NbJSThemeOptions } from './js-themes/theme.options'

export { BUILT_IN_THEMES } from '../theme.options'

/**
 * The JS themes' variables, by theme name; `NbThemeService.getJsTheme` gives the current theme's.
 *
 * It starts with the built-in themes and those `provideNbTheme` adds (`NB_JS_THEMES`), a theme of the same name
 * merged over the built-in one.
 */
@Service()
export class NbJSThemesRegistry {

    private themes: Record<string, NbJSThemeOptions> = {}

    constructor() {
        const builtInThemes = inject(NB_BUILT_IN_JS_THEMES)
        const newThemes = inject(NB_JS_THEMES) ?? []

        const themes = this.combineByNames(newThemes, builtInThemes)

        themes.forEach((theme: NbJSThemeOptions) => {
            this.register(theme, theme.name, theme.base)
        })
    }

    /**
     * Registers a theme's variables over its base theme's, when the base is registered, replacing a theme of the same
     * name.
     */
    register(config: NbJSThemeOptions, themeName: string, baseTheme?: string) {
        const base = baseTheme && this.has(baseTheme) ? this.get(baseTheme) : {}
        this.themes[themeName] = this.mergeDeep<NbJSThemeOptions>({ name: config.name }, base, config)
    }

    has(themeName: string): boolean {
        return !!this.themes[themeName]
    }

    /** A copy of the theme, with its base's variables merged in; throws when it isn't registered. */
    get(themeName: string): NbJSThemeOptions {
        if (!this.themes[themeName]) {
            throw Error(`NbThemeConfig: no theme '${themeName}' found registered.`)
        }
        return JSON.parse(JSON.stringify(this.themes[themeName]))
    }

    private combineByNames(newThemes: NbJSThemeOptions[], oldThemes: NbJSThemeOptions[]): NbJSThemeOptions[] {
        if (newThemes) {
            const mergedThemes = new Array<NbJSThemeOptions>()
            newThemes.forEach((theme: NbJSThemeOptions) => {
                const sameOld: NbJSThemeOptions = oldThemes.find((tm: NbJSThemeOptions) => tm.name === theme.name) ||
                    <NbJSThemeOptions>{}

                const mergedTheme = this.mergeDeep({ name: theme.name }, sameOld, theme)
                mergedThemes.push(mergedTheme)
            })

            oldThemes.forEach((theme: NbJSThemeOptions) => {
                if (!mergedThemes.find((tm: NbJSThemeOptions) => tm.name === theme.name)) {
                    mergedThemes.push(theme)
                }
            })
            return mergedThemes
        }
        return oldThemes
    }

    private isObject(item: unknown): item is Record<string, unknown> {
        return !!item && typeof item === 'object' && !Array.isArray(item)
    }

    private mergeDeep<T>(target: T, ...sources: unknown[]): T {
        if (!sources.length) {
            return target
        }
        const source = sources.shift()

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                const value = source[key]
                if (this.isObject(value)) {
                    if (!target[key]) {
                        Object.assign(target, { [key]: {} })
                    }
                    this.mergeDeep(target[key], value)
                } else {
                    Object.assign(target, { [key]: value })
                }
            }
        }
        return this.mergeDeep(target, ...sources)
    }
}
