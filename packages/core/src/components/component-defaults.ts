import { computed, inject, InjectionToken, isSignal, Provider, Signal, signal } from '@angular/core'

import type { NbAlertAppearance, NbButtonAppearance, NbButtonToggleAppearance, NbSelectAppearance, NbTagAppearance } from './component-appearance'
import type { NbComponentShape } from './component-shape'
import type { NbComponentSize } from './component-size'

/** Outline or filled icons, as icon packs like Lyra's have most icons in both (`star-outline` and `star`). */
export type NbIconStyle = 'outline' | 'filled'

/** Any of the components' appearances; each component has some of them. */
export type NbComponentAppearance =
    | NbButtonAppearance
    | NbSelectAppearance
    | NbTagAppearance
    | NbAlertAppearance
    | NbCardAppearance
    | 'outline'
    | 'filled'

/**
 * How a container sits on the page: `outline`, with a border, among other content, or `floating`, with a shadow
 * instead, over the page, e.g. opened from a button.
 */
export type NbContainerAppearance = 'outline' | 'floating'

/** A card's appearance: a container's, or `filled`, tinted without a border, e.g. for cards in a card. */
export type NbCardAppearance = NbContainerAppearance | 'filled'

/** The shape and size of a control. */
export interface NbControlDefaults {
    shape?: NbComponentShape
    size?: NbComponentSize
}

/**
 * Defaults for the components' `shape`, `size` and `appearance`, which a component's own inputs override. `shape` and
 * `size` at the top apply to the controls (buttons, button groups, fields, selects, tags, checkboxes, radios, toggles,
 * sliders, file drops, swatches), `appearance` at the top to each component that has it, and each type's own defaults to that
 * type.
 */
export interface NbComponentDefaults extends NbControlDefaults {
    /**
     * The appearance of each component that has it: buttons, button groups, selects, tags, alerts, and the containers
     * (cards, chats, accordions, tables and tree grids), e.g. `outline` for all of them, `hero` for buttons, selects and
     * tags while the others keep their own, or `floating` for the containers. A type's own `appearance` wins.
     */
    appearance?: NbComponentAppearance
    /**
     * Draws icons in one style: an icon named in the other style uses this one where its pack has both, e.g.
     * `star-outline` is drawn as `star` with `filled`, the components' own icons included. Unset, icons are drawn as
     * named.
     */
    iconStyle?: NbIconStyle
    /** `nbButton`, and `nbButtonToggle` outside a group (which has no `hero` appearance). */
    button?: NbControlDefaults & { appearance?: NbButtonAppearance }
    buttonGroup?: NbControlDefaults & { appearance?: NbButtonToggleAppearance }
    /** `nbInput`, and fields like it: the phone input and the colour picker; an autocomplete's options match them. */
    input?: NbControlDefaults
    select?: NbControlDefaults & { appearance?: NbSelectAppearance }
    /** Tags and tag lists; tags are always round. */
    tag?: { size?: NbComponentSize, appearance?: NbTagAppearance }
    checkbox?: { size?: NbComponentSize }
    /** Radios and radio groups. */
    radio?: { size?: NbComponentSize }
    toggle?: { size?: NbComponentSize }
    slider?: { size?: NbComponentSize }
    fileDrop?: NbControlDefaults
    /** Swatch groups; their swatches are round unless the app sets another shape. */
    swatch?: NbControlDefaults
    /** Alerts; their size is a height, so the controls' size doesn't apply. */
    alert?: { appearance?: NbAlertAppearance }
    /** Cards; their size is a height, so the controls' size doesn't apply. */
    card?: { appearance?: NbCardAppearance }
    chat?: { appearance?: NbContainerAppearance }
    accordion?: { appearance?: NbContainerAppearance }
    /** Data tables (`nbTable`); one in a card has the card's appearance. */
    table?: { appearance?: NbContainerAppearance }
    /** Tree grids (`nbTreeGrid`); one in a card has the card's appearance. */
    treeGrid?: { appearance?: NbContainerAppearance }
    /** Avatars; the controls' shape and size don't apply. */
    user?: NbControlDefaults
    /**
     * The controls' size doesn't apply; pagination is `small` by default. `edge` is whether its last button lines up its
     * icon with the end of the row (the default), see `NbPaginationComponent.edge`.
     */
    pagination?: { size?: NbComponentSize, edge?: boolean }
}

/** The types `NbComponentDefaults` has defaults for. */
export type NbComponentDefaultsType = Exclude<
    keyof NbComponentDefaults,
    keyof NbControlDefaults | 'appearance' | 'iconStyle'
>

// The types the controls' shape and size apply to.
const CONTROLS: ReadonlySet<NbComponentDefaultsType> = new Set([
    'button',
    'buttonGroup',
    'input',
    'select',
    'tag',
    'checkbox',
    'radio',
    'toggle',
    'slider',
    'fileDrop',
    'swatch'
])

// The appearances each type has, which the appearance at the top reaches. Toggles outside a group take the buttons'.
const APPEARANCES: Partial<Record<NbComponentDefaultsType, ReadonlyArray<NbComponentAppearance>>> = {
    button: ['filled', 'outline', 'ghost', 'hero'],
    buttonGroup: ['filled', 'outline', 'ghost'],
    select: ['outline', 'filled', 'hero', 'ghost'],
    tag: ['filled', 'outline', 'hero'],
    alert: ['filled', 'outline', 'accent'],
    card: ['outline', 'filled', 'floating'],
    chat: ['outline', 'floating'],
    accordion: ['outline', 'floating'],
    table: ['outline', 'floating'],
    treeGrid: ['outline', 'floating']
}

/** The components' defaults, as a signal, so components follow changes to them. */
export const NB_COMPONENT_DEFAULTS = new InjectionToken<Signal<NbComponentDefaults>>('Lyra Component Defaults')

const NO_DEFAULTS: Signal<NbComponentDefaults> = signal({}).asReadonly()

/**
 * Sets the components' default shape, size, appearance and icon style, e.g. round buttons and large fields across an
 * app, or in one part of it when provided by a component:
 *
 * ```ts
 * providers: [
 *   provideNbComponentDefaults({
 *     shape: 'semi-round',
 *     size: 'large',
 *     appearance: 'outline',
 *     button: { shape: 'round' },
 *     select: { appearance: 'filled' },
 *   }),
 * ]
 * ```
 *
 * A component's own inputs still win; defaults provided closer to it override, type by type, the ones further up.
 * Given a signal, e.g. for a setting users change, the components follow it as it changes, without rendering again.
 */
export function provideNbComponentDefaults(defaults: NbComponentDefaults | Signal<NbComponentDefaults>): Provider {
    return {
        provide: NB_COMPONENT_DEFAULTS,
        useFactory: () => {
            const parent = inject(NB_COMPONENT_DEFAULTS, { optional: true, skipSelf: true }) ?? NO_DEFAULTS
            return computed(() => mergeDefaults(parent(), isSignal(defaults) ? defaults() : defaults))
        }
    }
}

/**
 * The defaults of a type, as a signal: its own, then the controls' shape and size where they apply to it, and the
 * appearance at the top where it's one of the type's. It changes only when they do, not when another type's do.
 */
export function injectNbDefaults<K extends NbComponentDefaultsType>(
    type: K
): Signal<NonNullable<NbComponentDefaults[K]>> {
    const defaults = inject(NB_COMPONENT_DEFAULTS, { optional: true }) ?? NO_DEFAULTS
    return computed(
        () => {
            const all = defaults()
            const own = withoutUndefined(all[type] ?? {})
            const appearance = all.appearance && APPEARANCES[type]?.includes(all.appearance) ? all.appearance : undefined
            const merged = {
                ...(CONTROLS.has(type) ? { shape: all.shape, size: all.size } : {}),
                ...(appearance ? { appearance } : {}),
                ...own
            }
            return merged as NonNullable<NbComponentDefaults[K]>
        },
        { equal: shallowEqual }
    )
}

/** The style icons are drawn in, if the app sets one, as a signal. */
export function injectNbIconStyle(): Signal<NbIconStyle | undefined> {
    const defaults = inject(NB_COMPONENT_DEFAULTS, { optional: true }) ?? NO_DEFAULTS
    return computed(() => defaults().iconStyle)
}

function mergeDefaults(parent: NbComponentDefaults, child: NbComponentDefaults): NbComponentDefaults {
    const merged: Record<string, unknown> = { ...parent, ...withoutUndefined(child) }
    for (const [key, value] of Object.entries(child)) {
        const inherited: unknown = parent[key as keyof NbComponentDefaults]
        if (isObject(value) && isObject(inherited)) {
            merged[key] = { ...inherited, ...withoutUndefined(value) }
        }
    }
    return merged as NbComponentDefaults
}

function withoutUndefined<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>
}

function isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null
}

function shallowEqual(a: object, b: object): boolean {
    const keys = Object.keys(a) as Array<keyof typeof a>
    return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key])
}
