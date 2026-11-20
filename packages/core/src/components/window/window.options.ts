import { TemplateRef, InjectionToken, ViewContainerRef } from '@angular/core'
// Do not remove (TS4023).
// eslint-disable-next-line
import { ComponentType } from '@angular/cdk/overlay';
import { NbComponentType } from '@liquid-js/lyr-core/cdk'

export enum NbWindowState {
    /** Collapsed to its header, docked at the bottom of the page. */
    MINIMIZED = 'minimized',
    /** Open, docked at the bottom of the page, beside the content. */
    DOCKED = 'docked',
    /** Open in the middle of the page, over the content. */
    FULL_SCREEN = 'full-screen'
}

/** The states in the order a window prefers them, e.g. to open in. */
const NB_WINDOW_STATES = [NbWindowState.FULL_SCREEN, NbWindowState.DOCKED, NbWindowState.MINIMIZED]

export interface NbWindowStateChange {
    oldState?: NbWindowState
    newState: NbWindowState
}

/**
 * Window options as they're passed in, the others left as they are.
 */
export type NbPartialWindowConfig = Partial<NbWindowConfig>

/**
 * A window's own options, as `NbWindowService.open()` takes them: all but the app's, e.g. `closeOnBackdropClick`, which
 * concerns every window.
 */
export type NbWindowOpenConfig = Omit<NbPartialWindowConfig, 'closeOnBackdropClick'>

/**
 * A window's options: the app's defaults from `provideNbWindow()`, which `NbWindowService.open()` takes overrides of.
 */
export class NbWindowConfig {
    /**
     * The title, which names the window for assistive technologies and takes the focus as it opens.
     */
    title = ''

    /**
     * A template in place of `title`, with `titleTemplateContext` as its `$implicit` context.
     */
    titleTemplate?: TemplateRef<unknown>

    /**
     * The `$implicit` context of `titleTemplate`.
     */
    titleTemplateContext?: object = {}

    /**
     * The states the window can be in, which its buttons move it between: `full-screen`, over the page; `docked`, open at
     * the bottom of the page; and `minimized`, collapsed to its header there. All three by default; e.g. `['docked',
     * 'minimized']` keeps a window docked, like a chat.
     */
    states: NbWindowState[] = [...NB_WINDOW_STATES]

    /**
     * The state the window opens in, when it's one of `states`; otherwise the first of them, in the order full screen,
     * docked, minimized. Full screen by default.
     */
    initialState: NbWindowState = NbWindowState.FULL_SCREEN

    /**
     * Whether the window has a close button. True by default. `closeOnEsc` and `NbWindowRef.close()` still close it.
     */
    closeButton = true

    /**
     * Whether a backdrop covers the page while the window is full screen; docked and minimized windows leave
     * the page uncovered. Windows share one backdrop, shown while any of them that has one is full screen. True by
     * default.
     */
    hasBackdrop = true

    /**
     * Whether a click on the backdrop closes every open window (true, the default) or none (false). Windows share one
     * backdrop, so it's the app's setting, in `provideNbWindow()` or `NbWindowModule.forRoot()`, not a window's own.
     */
    closeOnBackdropClick = true

    /**
     * Whether Escape closes the window, when it's the one in front; a minimized window is passed over. True by default.
     */
    closeOnEsc = true

    /**
     * A class added to the window's element.
     */
    windowClass = ''

    /**
     * Data for the content: set as the component's properties, or the template's `$implicit`.
     */
    context?: object = {}

    /**
     * Where the attached component should live in Angular's *logical* component tree.
     * This affects what is available for injection and the change detection order for the
     * component instantiated inside of the window. This does not affect where the window
     * content will be rendered.
     */
    viewContainerRef?: ViewContainerRef

    constructor(...configs: Array<NbPartialWindowConfig | undefined>) {
        Object.assign(this, ...configs)
        if (!this.states.length) {
            this.states = [...NB_WINDOW_STATES]
        }
        if (!this.states.includes(this.initialState)) {
            this.initialState = NB_WINDOW_STATES.find((state) => this.states.includes(state)) ?? NbWindowState.FULL_SCREEN
        }
    }
}

export const NB_WINDOW_CONTENT = new InjectionToken<TemplateRef<unknown> | NbComponentType>('Lyra Window Content')
export const NB_WINDOW_CONFIG = new InjectionToken<NbWindowConfig>('Lyra Window Config')
export const NB_WINDOW_CONTEXT = new InjectionToken<object>('Lyra Window Context')
