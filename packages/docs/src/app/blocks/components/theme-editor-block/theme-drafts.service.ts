import { computed, effect, inject, linkedSignal, Service, untracked } from '@angular/core'
import { NbComponentDefaults, NbDialogService } from '@liquid-js/lyr-core'
import { firstValueFrom } from 'rxjs'

import { NgdExampleTheme } from '../example-gallery-block/example-apps'
import { NgdThemeDraft, NgdThemeStatus, NgdWorkingTheme, themeEditorState } from './theme-editor-state'
import { NgdThemeValuesService } from './theme-values.service'
import { NgdUnsavedThemeDialogComponent } from './unsaved-theme-dialog.component'
import { draftFromBase, NgdThemeSwatches, themeDefaults, themeSwatches, themeVariables } from './theme-export'

/** A theme card: a saved draft, or a base theme to start one from. */
export interface NgdThemeCard {
    id: string
    name: string
    base: string
    swatches: NgdThemeSwatches
}

/** `material-light` → `Material Light`. */
export const themeLabel = (name: string) =>
    name.replace(/(^|-)(\w)/g, (_, dash: string, letter: string) => `${dash && ' '}${letter.toUpperCase()}`)

/**
 * The themes the editor keeps, and the one being edited: shared by the theme editor, its pop-up on full-screen
 * examples, and the examples that show it. Edits are a working copy until saved; saved themes reach the other tabs.
 */
@Service()
export class NgdThemeDrafts {
    protected readonly values = inject(NgdThemeValuesService)
    protected readonly dialogs = inject(NbDialogService)

    /** The saved themes, in step across tabs. */
    readonly drafts = themeEditorState.signal('drafts')
    readonly selected = themeEditorState.signal('selected')
    readonly loading = computed(() => this.drafts.loading() || this.selected.loading())

    /** The theme being edited and its unsaved changes, shared by the tabs: the editor's and full-screen examples'. */
    readonly working = themeEditorState.signal('working')
    // The theme the editor starts with when none is saved: from the default theme, once its values are loaded; one id,
    // so it stays the same theme.
    protected readonly firstTheme = computed(() => this.fromBase('default', 'My theme', FIRST_THEME_ID))

    /** The theme as saved, or as it started if it isn't saved yet: what the draft's changes are to. */
    readonly origin = computed<NgdThemeDraft>(() => {
        const drafts = this.drafts()
        return this.working()?.start ?? drafts.find(({ id }) => id === this.selected()) ?? drafts[0] ?? this.firstTheme()
    })

    protected readonly source = computed(() => ({ origin: this.origin(), working: this.working() }))

    /**
     * The theme being edited: a working copy of `origin`, saved only with `save()`. It takes the shared working copy, so
     * another tab's edits show here, and follows a new origin, e.g. one another tab saved, unless it has changes of its
     * own that aren't shared yet.
     */
    readonly draft = linkedSignal<{ origin: NgdThemeDraft, working?: NgdWorkingTheme }, NgdThemeDraft>({
        source: this.source,
        computation: ({ origin, working }, previous) => {
            if (working && working.draft.id === origin.id) {
                return working.draft
            }
            const own = previous && previous.value.id === origin.id && !same(previous.value, previous.source.origin)
            return own ? previous.value : origin
        }
    })

    /** Whether the draft has changes that aren't saved. */
    readonly dirty = computed(() => !same(this.draft(), this.origin()))
    /** Whether the draft is one of the saved themes. */
    readonly isSaved = computed(() => this.drafts().some(({ id }) => id === this.draft().id))

    readonly baseValues = computed(() => this.valuesOf(this.draft().base))
    /** Whether the draft's base theme is loaded, so the draft's values are its own, not blanks. */
    readonly ready = computed(() => this.values.has()(this.draft().base))
    /** The theme variables the draft changes from its base. */
    readonly variables = computed(() => themeVariables(this.draft(), this.baseValues()))
    /** The draft's component defaults, without the ones left unset. */
    readonly defaults = computed<NbComponentDefaults>(() => themeDefaults(this.draft()))
    /** How many things the draft changes from its base. */
    readonly changed = computed(() => Object.keys(this.variables()).length + Object.keys(this.defaults()).length)

    constructor() {
    // The draft's base theme, whichever it is, e.g. a saved theme's: its values are loaded as soon as it's known.
        effect(() => {
            const base = this.draft().base
            untracked(() => void this.values.loadThemes(base))
        })

        // Shares the draft a moment after each edit, while it has changes or isn't saved; once it's neither, clears it.
        let timer: ReturnType<typeof setTimeout> | undefined
        effect((onCleanup) => {
            const draft = this.draft()
            const origin = this.origin()
            const saved = this.isSaved()
            if (this.loading() || this.working.loading()) {
                return
            }
            const next: NgdWorkingTheme | undefined =
                saved && same(draft, origin) ? undefined : { draft, ...(saved ? {} : { start: origin }) }
            if (JSON.stringify(next) === JSON.stringify(untracked(this.working))) {
                return
            }
            timer = setTimeout(() => void this.working.set(next), 150)
            onCleanup(() => clearTimeout(timer))
        })
    }

    update(change: Partial<NgdThemeDraft>) {
        this.draft.update((draft) => ({ ...draft, ...change }))
    }

    setColor(status: NgdThemeStatus, color: string | null) {
        if (color) {
            this.update({ colors: { ...this.draft().colors, [status]: color } })
        }
    }

    /**
     * Sets the basic colour, which tints the greys; the base theme's own leaves them as they are. Greys the theme set one
     * by one give way to it.
     */
    setBasic(color: string | null) {
        if (!color) {
            return
        }
        const base = String(this.baseValues()['color-basic-600']?.value ?? '')
        const variables = Object.fromEntries(
            Object.entries(this.draft().variables ?? {}).filter(([key]) => !/^color-basic-(transparent-)?\d+$/.test(key))
        )
        this.update({
            basic: color.toLowerCase() === base.toLowerCase() ? undefined : color,
            variables: Object.keys(variables).length ? variables : undefined
        })
    }

    /** Sets a theme variable, e.g. a background; none brings back the base theme's. */
    setVariable(key: string, entry?: string | null) {
        const variables = { ...this.draft().variables }
        if (entry) {
            variables[key] = entry
        } else {
            delete variables[key]
        }
        this.update({ variables: Object.keys(variables).length ? variables : undefined })
    }

    /** Sets a component default; an empty value unsets it. `type` is a component type, or none for the controls'. */
    setDefault(name: string, value: string | null, type?: string) {
        const defaults: Record<string, unknown> = { ...this.draft().defaults }
        const entry = value || undefined
        if (type) {
            defaults[type] = { ...(defaults[type] as Record<string, unknown> | undefined), [name]: entry }
        } else {
            defaults[name] = entry
        }
        this.update({ defaults: defaults as NbComponentDefaults })
    }

    /** Starts over from another base theme, keeping the draft's name. */
    async setBase(base: string) {
        await this.values.loadThemes(base)
        const { id, name } = this.draft()
        this.draft.set(this.fromBase(base, name, id))
    }

    async reset() {
        await this.setBase(this.draft().base)
    }

    /** Saves the draft: as a new theme, or over the one it's a copy of. */
    async save() {
        const draft = this.draft()
        const drafts = this.drafts()
        const saved = drafts.some(({ id }) => id === draft.id)
        await this.drafts.set(saved ? drafts.map((item) => (item.id === draft.id ? draft : item)) : [...drafts, draft])
        await this.selected.set(draft.id)
        await this.working.set(undefined)
    }

    /** Drops the draft's changes; a new theme that isn't saved is dropped altogether. */
    discard() {
        const isNew = this.isNew()
        void this.working.set(undefined)
        if (!isNew) {
            this.draft.set(this.origin())
        }
    }

    /** Whether the draft is a new theme, started from a base theme and not saved yet. */
    readonly isNew = computed(() => !!this.working()?.start && !this.isSaved())

    /** Edits a saved theme, once the draft's changes are saved or dropped. */
    async select(id: string) {
        if (id !== this.draft().id && (await this.leave())) {
            await this.working.set(undefined)
            await this.selected.set(id)
        }
    }

    /**
     * Starts a new theme from a base theme or another theme, e.g. an example's own, once the draft's changes are saved
     * or dropped; it's saved with `save()`. Whether it started: cancelling stays on the draft.
     */
    async startFrom(from: string | NgdThemeDraft): Promise<boolean> {
        if (!(await this.leave())) {
            return false
        }
        const name = `${typeof from === 'string' ? themeLabel(from) : from.name} ${this.drafts().length + 1}`
        await this.values.loadThemes(typeof from === 'string' ? from : from.base)
        const draft =
            typeof from === 'string' ? this.fromBase(from, name) : { ...from, id: crypto.randomUUID(), name }
        await this.working.set({ draft, start: draft })
        return true
    }

    /** Loads the base themes' values, e.g. to show them as cards or an example's theme over one of them. */
    loadThemes(...bases: string[]) {
        return this.values.loadThemes(...bases)
    }

    /** An example's own theme as a draft: its base theme with the example's changes, once the base is loaded. */
    draftOf(theme: NgdExampleTheme): NgdThemeDraft {
        const { id, name, base, colors, defaults, ...changes } = theme
        const draft = this.fromBase(base, name, id)
        return {
            ...draft,
            ...changes,
            colors: { ...draft.colors, ...colors },
            ...(defaults || draft.defaults ? { defaults: { ...draft.defaults, ...defaults } } : {})
        }
    }

    /** The theme variables a draft changes from its base. */
    variablesOf(draft: NgdThemeDraft) {
        return themeVariables(draft, this.valuesOf(draft.base))
    }

    /** Deletes the draft's theme, or drops it if it isn't saved. */
    async remove() {
        const { id } = this.draft()
        await this.working.set(undefined)
        const rest = this.drafts().filter((draft) => draft.id !== id)
        await this.drafts.set(rest)
        await this.selected.set(rest[0]?.id)
    }

    /**
     * Whether the editor can move on from the draft: it has no changes, or the user saves or drops them when asked.
     * Cancelling stays on it.
     */
    async leave(): Promise<boolean> {
        if (!this.dirty()) {
            return true
        }
        const ref = this.dialogs.open(NgdUnsavedThemeDialogComponent, { context: { name: this.draft().name } })
        const choice = await firstValueFrom(ref.onClose)
        if (choice === 'save') {
            await this.save()
            return true
        }
        if (choice === 'discard') {
            this.discard()
            return true
        }
        return false
    }

    cardOf(draft: NgdThemeDraft): NgdThemeCard {
        const { id, name, base } = draft
        return { id, name, base, swatches: themeSwatches(draft, this.valuesOf(base)) }
    }

    fromBase(base: string, name: string, id: string = crypto.randomUUID()): NgdThemeDraft {
        return draftFromBase(id, name, base, this.valuesOf(base))
    }

    protected valuesOf(base: string) {
        return this.values.valuesOf(base)
    }
}

const FIRST_THEME_ID = 'my-theme'
const same = (a: NgdThemeDraft, b: NgdThemeDraft) => JSON.stringify(a) === JSON.stringify(b)
