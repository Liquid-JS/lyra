import { Component, computed, input, linkedSignal, output } from '@angular/core'
import { NbButtonComponent } from '@liquid-js/lyr-core/button'
import { NbIconComponent } from '@liquid-js/lyr-core/icon'

import { injectNbDefaults, NbComponentSize, NbComponentOrCustomStatus, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput, injectNbTexts, NbLocalize, type NbAlertAppearance } from '@liquid-js/lyr-core/base'

/** @internal */
declare const $localize: NbLocalize

/**
 * A message that stands out from the page, coloured by its status.
 *
 * Basic alert example:
 *
 * @stacked-example(Showcase, alert/alert-showcase.component)
 *
 * Alert configuration:
 *
 * ```html
 * <nb-alert status="success">
 *   You have been successfully authenticated!
 * </nb-alert>
 * ```
 * ### Installation
 *
 * Import `NbAlertComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbAlertComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbAlertModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbAlertModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Alert could additionally have a `close` button when `closable` property is set:
 * ```html
 * <nb-alert status="success" closable (close)="onClose()">
 *   You have been successfully authenticated!
 * </nb-alert>
 * ```
 *
 * Colored alerts could be simply configured by providing a `status` property:
 * @stacked-example(Alert status, alert/alert-colors.component)
 *
 * The `appearance` shows the status in other ways: `accent` with a coloured top border, for a slight highlight,
 * set with `appearance="accent"` or the `accent` attribute:
 * @stacked-example(Alert accent, alert/alert-accents.component)
 *
 * And `outline`, tinted with a border in the status' colour:
 * @stacked-example(Outline Alert, alert/alert-outline.component)
 * @additional-example(Multiple Sizes, alert/alert-sizes.component)
 * @styles
 *
 * alert-border-radius:
 * alert-bottom-margin:
 * alert-padding:
 * alert-scrollbar-color:
 * alert-scrollbar-background-color:
 * alert-scrollbar-width:
 * alert-shadow:
 * alert-text-font-family:
 * alert-text-font-size:
 * alert-text-font-weight:
 * alert-text-line-height:
 * alert-closable-start-padding:
 * alert-tiny-height:
 * alert-small-height:
 * alert-medium-height:
 * alert-large-height:
 * alert-giant-height:
 * alert-basic-background-color:
 * alert-basic-text-color:
 * alert-primary-background-color:
 * alert-primary-text-color:
 * alert-success-background-color:
 * alert-success-text-color:
 * alert-info-background-color:
 * alert-info-text-color:
 * alert-warning-background-color:
 * alert-warning-text-color:
 * alert-danger-background-color:
 * alert-danger-text-color:
 * alert-control-background-color:
 * alert-control-text-color:
 * alert-accent-basic-color:
 * alert-accent-primary-color:
 * alert-accent-info-color:
 * alert-accent-success-color:
 * alert-accent-warning-color:
 * alert-accent-danger-color:
 * alert-accent-control-color:
 * alert-outline-width:
 * alert-outline-basic-color:
 * alert-outline-primary-color:
 * alert-outline-info-color:
 * alert-outline-success-color:
 * alert-outline-warning-color:
 * alert-outline-danger-color:
 * alert-outline-control-color:
 * alert-outline-basic-background-color:
 * alert-outline-primary-background-color:
 * alert-outline-info-background-color:
 * alert-outline-success-background-color:
 * alert-outline-warning-background-color:
 * alert-outline-danger-background-color:
 * alert-outline-control-background-color:
 * alert-outline-basic-text-color:
 * alert-outline-primary-text-color:
 * alert-outline-info-text-color:
 * alert-outline-success-text-color:
 * alert-outline-warning-text-color:
 * alert-outline-danger-text-color:
 * alert-outline-control-text-color:
 */
@Component({
    selector: 'nb-alert',
    styleUrls: ['./alert.component.scss'],
    templateUrl: './alert.component.html',
    imports: [NbButtonComponent, NbIconComponent],
    host: {
        '[class]': 'hostClasses()',
        '[class.closable]': 'closable()'
    }
})
export class NbAlertComponent {
    // The app's defaults for this type, which the inputs below start from.
    protected readonly nbDefaults = injectNbDefaults('alert')

    protected readonly texts = injectNbTexts('alert', () => ({
        close: $localize`:@@nb.alert.close:Close`
    }))

    // The close button shows on the alert: light on a filled colour, as text on it is, and basic otherwise.
    protected readonly closeStatus = computed<NbComponentOrCustomStatus>(() => {
        const status = this.status()
        return this.appearance() === 'filled' && status !== 'basic' && status !== 'control' ? 'control' : 'basic'
    })

    /**
     * A fixed height: `tiny`, `small`, `medium`, `large` or `giant`. Unset by default, so the alert is as tall as its
     * content.
     */
    readonly size = input<'' | NbComponentSize>('')

    /**
     * Alert status: `basic` (default), `primary`, `success`, `info`, `warning`, `danger`, `control` or a custom one.
     */
    readonly status = input<NbComponentOrCustomStatus>('basic')

    /**
     * How the alert shows its status: `filled`, `outline` or `accent`. Unset, it follows the app's default, or
     * `filled`.
     */
    readonly appearanceInput = input<NbAlertAppearance | undefined>(undefined, { alias: 'appearance' })
    /** The appearance in use: the input's, the app's default, or 'filled'. */
    readonly appearance = linkedSignal<NbAlertAppearance>(() => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'filled')

    /**
     * Sets the `filled` appearance, over `appearance`.
     */
    readonly filled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Sets the `outline` appearance, tinted with a border in the status' colour, over `appearance` and the other
     * boolean appearances.
     */
    readonly outline = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Sets the `accent` appearance, a top border in the status' colour, over `appearance` and `filled`.
     */
    readonly accent = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Shows a close button, which emits `close`.
     */
    readonly closable = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty })

    /**
     * Emits when the close button is clicked. The alert stays until the app removes it.
     */
    readonly close = output()

    /**
     * The close button's click handler; emits `close`.
     */
    onClose() {
        this.close.emit()
    }

    /** The appearance, from the boolean inputs first: outline, then accent, then filled. */
    protected readonly resolvedAppearance = computed<NbAlertAppearance>(() => {
        if (this.outline()) {
            return 'outline'
        }
        if (this.accent()) {
            return 'accent'
        }
        if (this.filled()) {
            return 'filled'
        }
        return this.appearance()
    })

    protected readonly hostClasses = computed(() =>
        [
            this.size() && `size-${this.size()}`,
            this.status() && `status-${this.status()}`,
            `appearance-${this.resolvedAppearance()}`
        ].filter(Boolean)
    )
}
