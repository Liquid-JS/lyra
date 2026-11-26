import { computed, inject, InjectionToken, Provider, Service, Signal, signal } from '@angular/core'

import type { NbFileDropTexts, NbPaginationTexts, NbSelectTexts, NbTimepickerLocalizationConfig } from '../components/component-texts'
import type { NbValidationMessage } from '../components/component-validation'

/** The `$localize` tag of `@angular/localize`, which Lyra's default texts use. */
export type NbLocalize = (messageParts: TemplateStringsArray, ...expressions: ReadonlyArray<unknown>) => string

// Lyra's default texts are `$localize` messages, so `ng extract-i18n` finds them and an app's translations apply.
// When the app doesn't load `@angular/localize`, they're their English text; `@angular/localize/init` replaces this.
/**
 * Makes a `$localize` message its text: without the id and description before it and the names after its values.
 *
 * @internal
 */
export const nbLocalizeFallback: NbLocalize = (messageParts, ...expressions) => {
    const strip = (part: string, raw: string) => {
        if (raw.charAt(0) !== ':') {
            return part
        }
        for (let cooked = 1, index = 1; cooked < part.length; cooked++, index++) {
            if (raw[index] === '\\') {
                index++
            } else if (part[cooked] === ':') {
                return part.substring(cooked + 1)
            }
        }
        return part
    }
    let message = strip(messageParts[0], messageParts.raw[0])
    for (let i = 1; i < messageParts.length; i++) {
        message += String(expressions[i - 1]) + strip(messageParts[i], messageParts.raw[i])
    }
    return message
}

const scope = globalThis as { $localize?: NbLocalize }
if (typeof scope.$localize !== 'function') {
    scope.$localize = nbLocalizeFallback
}

/**
 * The texts of Lyra's components, by component. Other Lyra packages add theirs.
 */
export interface NbTexts {
    actions: {
    /** Label of the button that opens the actions as a menu, where they fold into one. */
        more: string
    }
    alert: {
    /** Label of the close button. */
        close: string
    }
    breadcrumbs: {
    /** Names the navigation landmark. */
        label: string
    }
    calendar: {
    /** Label of the button that shows the previous month, year or years. */
        previous: string
        /** Label of the button that shows the next month, year or years. */
        next: string
        /** Heads the week numbers. */
        weekNumber: string
        /** The button that keeps a date and time. */
        apply: string
        /** The button that sets the current time. */
        now: string
        /** Names a datepicker's popup with the calendar. */
        dialog: string
    }
    theme: {
    /** Names the theme select. */
        theme: string
        /** The theme that follows the system's colour scheme and contrast. */
        system: string
        /** Names the content size select. */
        contentSize: string
        small: string
        medium: string
        large: string
        larger: string
    }
    menu: {
    /** Names the button that opens and closes the submenu of an item with its own page, given the item's title. */
        submenu: (title: string) => string
    }
    table: {
    /** Names the checkbox that selects all rows of a table's page. */
        selectAll: string
        /** Names the checkbox that selects a row. */
        selectRow: string
    }
    pageIndicator: {
    /** Names the group of a page indicator's dots. */
        pages: string
        /** Names a page's dot, given the page, from 1, and how many there are. */
        page: (page: number, count: number) => string
    }
    slider: {
    /** Names the start thumb of a range slider, after the slider's own name. */
        start: string
        /** Names the end thumb of a range slider, after the slider's own name. */
        end: string
    }
    confirmDialog: {
    /** The button that confirms, e.g. in `NbDialogService.confirm`. */
        confirm: string
        /** The button that cancels. */
        cancel: string
    }
    chat: {
    /** Shown while there are no messages. */
        noMessages: string
        /** Name of the message list for screen readers, in a chat without a title. */
        messages: string
        /** Placeholder of the message field. */
        messagePlaceholder: string
        /** Placeholder of the message field while files are dragged over it. */
        dropFilePlaceholder: string
        /** Label of the button that removes a dropped file, given its name. */
        removeFile: (name: string) => string
    }
    fileDrop: NbFileDropTexts
    flipCard: {
    /** Label of the button that flips the card. */
        toggle: string
    }
    pagination: NbPaginationTexts
    progressBar: {
    /** Names a progress bar without an `aria-label` of its own. */
        label: string
    }
    revealCard: {
    /** Label of the button that reveals the back of the card. */
        toggle: string
    }
    routeTabset: {
    /** Label of the button that opens the tabs as a menu, where they fold into one. */
        menu: string
    }
    search: {
    /** Placeholder of the search field. */
        placeholder: string
        /** Shown below the search field. */
        hint: string
        /** Label of the button that opens the search field. */
        open: string
        /** Label of the button that closes the search field. */
        close: string
    }
    select: NbSelectTexts
    spinner: {
    /** Shown with the spinner. */
        message: string
    }
    tag: {
    /** Label of the button that removes a tag outside a tag list, given its text. */
        remove: (text: string) => string
    }
    timepicker: Required<NbTimepickerLocalizationConfig>
    toastr: {
    /** Label of a toast's close button. */
        close: string
    }
    toc: {
    /** Names the navigation landmark. */
        label: string
    }
    treeGrid: {
    /** Label of the button that collapses a row. */
        collapse: string
        /** Label of the button that expands a row. */
        expand: string
    }
    /** Messages for kinds of errors, given the error, e.g. `required` or `minlength`. */
    validation: Record<string, NbValidationMessage>
    user: {
    /** The name shown without one. */
        anonymous: string
    }
    window: {
    /** Label of the button that minimizes the window. */
        minimize: string
        /** Label of the button that restores a minimized window. */
        restore: string
        /** Label of the button that collapses the window. */
        collapse: string
        /** Label of the button that expands the window to full screen. */
        expand: string
        /** Label of the button that closes the window. */
        close: string
    }
}

/** Texts to change, by component; the others stay as they are. */
export type NbTextsOverrides = { [Section in keyof NbTexts]?: Partial<NbTexts[Section]> }

const NB_TEXTS_OVERRIDES = new InjectionToken<NbTextsOverrides>('Lyra Texts Overrides')

/**
 * The texts Lyra's components show and announce, such as labels, placeholders and messages for screen readers.
 *
 * They're English and translated with Angular's i18n, as `$localize` messages with ids like `@@nb.pagination.next`.
 * `provideNbTexts` changes them for the app or for the components inside one, e.g. for texts an app keeps
 * elsewhere, and `set` changes them at run time.
 */
@Service()
export class NbTextsService {
    protected readonly parent = inject(NbTextsService, { optional: true, skipSelf: true })
    protected readonly own = signal(inject(NB_TEXTS_OVERRIDES, { optional: true }) ?? {})

    /** The changed texts, the parent's under these. */
    readonly overrides: Signal<NbTextsOverrides> = computed(() => {
        const parent = this.parent?.overrides() ?? {}
        const own = this.own()
        const merged: Record<string, object> = { ...parent }
        for (const [section, texts] of Object.entries(own)) {
            merged[section] = { ...(merged[section] ?? {}), ...texts }
        }
        return merged as NbTextsOverrides
    })

    /** Changes the texts, e.g. when the user picks another language. */
    set(overrides: NbTextsOverrides) {
        this.own.set(overrides)
    }
}

/**
 * Changes the texts of Lyra's components, for the app or for the components inside the one that provides it:
 *
 * ```ts
 * providers: [provideNbTexts({ pagination: { next: 'Next page' } })]
 * ```
 */
export function provideNbTexts(overrides: NbTextsOverrides): Provider[] {
    return [{ provide: NB_TEXTS_OVERRIDES, useValue: overrides }, NbTextsService]
}

/**
 * The texts of a component: its defaults, which `defaults` makes in the injection context, under the changed ones.
 *
 * @internal
 */
export function injectNbTexts<Section extends keyof NbTexts>(
    section: Section,
    defaults: () => NbTexts[Section]
): Signal<NbTexts[Section]> {
    const service = inject(NbTextsService)
    const base = defaults()
    return computed(() => ({ ...base, ...(service.overrides()[section] ?? {}) }) as NbTexts[Section])
}

/** Joins names into a list in the app's language, e.g. "a, b and c". @internal */
export function nbFormatList(locale: string, items: string[]) {
    try {
        return new Intl.ListFormat(locale, { type: 'conjunction' }).format(items)
    } catch {
        return items.join(', ')
    }
}
