import {
    AfterViewInit,
    computed,
    DestroyRef,
    Directive,
    ElementRef,
    inject,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    output,
    TemplateRef
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { skip } from 'rxjs/operators'

import { NbComponentOrCustomStatus, ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base'
import { NbAdjustment, NbPosition, NbPositionValues, NbAdjustmentValues, NbTrigger, NbTriggerValues, NbDynamicOverlay, NbDynamicOverlayHandler, nbCreateDynamicOverlayHandler, NbOverlayConfig } from '@liquid-js/lyr-core/cdk'
import { NbIconConfig } from '@liquid-js/lyr-core/icon'
import { NbValidationDirective } from '@liquid-js/lyr-core/validation'
import { NbTooltipComponent } from './tooltip.component'

let lastTooltipId = 0

/**
 * Shows a short hint, text and/or an icon, beside its host element.
 *
 * ### Installation
 *
 * Import `NbTooltipDirective` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbTooltipDirective],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbTooltipModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbTooltipModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * @stacked-example(Showcase, tooltip/tooltip-showcase.component)
 *
 * `nbTooltipIcon` adds an icon before the text, or stands alone:
 * @stacked-example(With Icon, tooltip/tooltip-with-icon.component)
 *
 * `nbTooltipPlacement` places it on a side of the host, as a popover's does:
 * @stacked-example(Placements, tooltip/tooltip-placements.component)
 *
 * A template shows richer content, such as a few lines or a keyboard shortcut. `nbTooltipContext` is the template's
 * `$implicit` context. Keep it to text and icons: a tooltip can't be reached with the keyboard, so it must not hold
 * links or buttons (use a popover for those).
 *
 * ```html
 * <button nbButton [nbTooltip]="shortcut" [nbTooltipContext]="'S'">Save</button>
 * <ng-template #shortcut let-key>Save the draft <kbd>Ctrl+{{ key }}</kbd></ng-template>
 * ```
 * @stacked-example(Template content, tooltip/tooltip-template.component)
 *
 * `nbTooltipStatus` colours it:
 * @stacked-example(Colored Tooltips, tooltip/tooltip-colors.component)
 *
 * While it shows, the tooltip describes its host element (`aria-describedby`), so assistive technologies read it.
 *
 * `nbTooltipTrigger` sets what shows and hides it:
 *
 * - `hint` (default) shows it while the mouse is over the host or the keyboard focus is in it, and hides it on
 * Escape.
 * - `hover` is `hint` for the mouse only, and keeps the tooltip open while the mouse moves into it.
 * - `click` shows it on a click on the host and hides it on a click anywhere else, and on Escape.
 * - `focus` shows it while the focus is in the host, and hides it on a click outside.
 * - `noop` leaves it to `show()`, `hide()` and `toggle()`.
 */
@Directive({
    selector: '[nbTooltip]',
    exportAs: 'nbTooltip'
})
export class NbTooltipDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    protected readonly hostRef = inject(ElementRef)
    protected readonly destroyRef = inject(DestroyRef)

    protected tooltipComponent = NbTooltipComponent
    protected dynamicOverlay?: NbDynamicOverlay
    protected readonly tooltipId = `nb-tooltip-${lastTooltipId++}`
    // A host with `nbValidation` binds its own `aria-describedby`; the tooltip joins its descriptions.
    protected readonly validation = inject(NbValidationDirective, { self: true, optional: true })
    protected describing = false

    /** The hint: text, or a template. Without text or an icon the tooltip doesn't show. */
    readonly content = input<string | TemplateRef<unknown>>(undefined, { alias: 'nbTooltip' })

    /** The `$implicit` context of a template in `nbTooltip`. */
    readonly templateContext = input<unknown>(undefined, { alias: 'nbTooltipContext' })

    /**
     * The side of the host the tooltip opens on: `top` (default), `bottom`, `left`, `right`, `start` or `end`, or a
     * corner such as `top-start` or `end-bottom`.
     */
    readonly position = input<NbPosition, NbPositionValues>(NbPosition.TOP, {
        alias: 'nbTooltipPlacement',
        transform: (value) => value as NbPosition
    })

    /**
     * The order in which other sides are tried when the tooltip doesn't fit the viewport: `clockwise` (default),
     * `counterclockwise`, `vertical`, `horizontal`, or `noop` to keep the placement.
     */
    readonly adjustment = input<NbAdjustment, NbAdjustmentValues>(NbAdjustment.CLOCKWISE, {
        alias: 'nbTooltipAdjustment',
        transform: (value) => value as NbAdjustment
    })

    /** A class for the overlay pane. */
    readonly tooltipClass = input('', { alias: 'nbTooltipClass' })

    /** An icon before the text: its name, or an `NbIconConfig` with its pack, status or options. */
    readonly icon = input<string | NbIconConfig>(undefined, { alias: 'nbTooltipIcon' })

    /** Colours the tooltip: `basic`, `primary`, `success`, `info`, `warning`, `danger` or `control`. */
    readonly status = input<NbComponentOrCustomStatus>(undefined, { alias: 'nbTooltipStatus' })

    /** What shows and hides the tooltip: `hint` (default), `hover`, `click`, `focus` or `noop`. */
    readonly trigger = input<NbTrigger, NbTriggerValues>(NbTrigger.HINT, {
        alias: 'nbTooltipTrigger',
        transform: (value) => value as NbTrigger
    })

    /** The distance from the host, in pixels; read once, when the directive initialises. */
    readonly offset = input(8, { alias: 'nbTooltipOffset' })

    /** Keeps the tooltip closed. */
    readonly disabled = input<boolean, NbBooleanInput>(false, {
        alias: 'nbTooltipDisabled',
        transform: convertToBoolProperty
    })

    /** Emits when the tooltip opens or closes, after the view initialises. */
    readonly nbTooltipShowStateChange = output<{ isShown: boolean }>()

    /** The context the tooltip renders its icon, status and template with. */
    readonly context = computed(() => {
        const icon = this.icon()
        const status = this.status()
        const templateContext = this.templateContext()
        return {
            id: this.tooltipId,
            ...(icon !== undefined && { icon }),
            ...(status !== undefined && { status }),
            ...(templateContext !== undefined && { templateContext })
        }
    })

    protected readonly overlayConfig = computed<NbOverlayConfig>(() => ({ panelClass: this.tooltipClass() }))

    get isShown(): boolean {
        return !!(this.dynamicOverlay && this.dynamicOverlay.isAttached)
    }

    protected readonly dynamicOverlayHandler =
        inject(NbDynamicOverlayHandler, { optional: true, self: true }) ?? nbCreateDynamicOverlayHandler()

    ngOnInit() {
        this.dynamicOverlayHandler.host(this.hostRef).componentType(this.tooltipComponent).offset(this.offset())
    }

    ngOnChanges() {
        this.rebuild()
    }

    ngAfterViewInit() {
        this.dynamicOverlay = this.configureDynamicOverlay().build()

        this.dynamicOverlay.isShown
            .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((isShown: boolean) => this.nbTooltipShowStateChange.emit({ isShown }))
        this.dynamicOverlay.isShown
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((isShown: boolean) => this.describeHost(isShown))
    }

    /** Applies settings changed in code; bindings apply on their own. */
    rebuild() {
        this.dynamicOverlay = this.configureDynamicOverlay().rebuild()
    }

    show() {
        this.builtOverlay().show()
    }

    hide() {
        this.builtOverlay().hide()
    }

    toggle() {
        this.builtOverlay().toggle()
    }

    ngOnDestroy() {
        this.describeHost(false)
        this.dynamicOverlayHandler.destroy()
    }

    /** Adds the shown tooltip to the host's `aria-describedby`, or takes it away. */
    protected describeHost(describe: boolean) {
        if (describe === this.describing) {
            return
        }
        this.describing = describe
        if (this.validation) {
            if (describe) {
                this.validation.addDescription(this.tooltipId)
            } else {
                this.validation.removeDescription(this.tooltipId)
            }
            return
        }
        const host: HTMLElement = this.hostRef.nativeElement
        const ids = (host.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id && id !== this.tooltipId)
        if (describe) {
            ids.push(this.tooltipId)
        }
        if (ids.length) {
            host.setAttribute('aria-describedby', ids.join(' '))
        } else {
            host.removeAttribute('aria-describedby')
        }
    }

    private builtOverlay(): NbDynamicOverlay {
        if (!this.dynamicOverlay) {
            throw new Error('NbTooltipDirective: the tooltip is built once the view initialises.')
        }
        return this.dynamicOverlay
    }

    protected configureDynamicOverlay() {
        const content = this.content()
        return this.dynamicOverlayHandler
            .position(this.position())
            .trigger(this.trigger())
        // Without text or an icon the tooltip would be an empty bubble.
            .disabled(this.disabled() || ((content == null || content === '') && !this.icon()))
            .adjustment(this.adjustment())
            .content(content)
            .context(this.context())
            .overlayConfig(this.overlayConfig())
    }
}
