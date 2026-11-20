import {
    AfterContentChecked,
    afterRenderEffect,
    Component,
    computed,
    contentChild,
    contentChildren,
    DestroyRef,
    ElementRef,
    inject,
    NgZone,
    Signal,
    viewChild
} from '@angular/core'

import { ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base'
import { NbPrefixDirective } from './prefix.directive'
import { NbSuffixDirective } from './suffix.directive'
import { NbFormFieldControl, NbFormControlState, NbFormFieldControlConfig } from './form-field-control'

export type NbFormControlAddon = 'prefix' | 'suffix'

function throwFormControlElementNotFound() {
    throw new Error('NbFormFieldComponent must contain [nbInput]')
}

/**
 * Shows content before and after a control, such as `nbInput`: an icon, a button or text marked `nbPrefix` or
 * `nbSuffix`.
 *
 * Addons are at least `form-field-addon-{size}-width` wide, and grow to fit their content, e.g. a unit or a URL
 * scheme; the control's padding follows their width.
 *
 * @styles
 *
 * form-field-addon-basic-text-color:
 * form-field-addon-basic-highlight-text-color:
 * form-field-addon-primary-text-color:
 * form-field-addon-primary-highlight-text-color:
 * form-field-addon-success-text-color:
 * form-field-addon-success-highlight-text-color:
 * form-field-addon-info-text-color:
 * form-field-addon-info-highlight-text-color:
 * form-field-addon-warning-text-color:
 * form-field-addon-warning-highlight-text-color:
 * form-field-addon-danger-text-color:
 * form-field-addon-danger-highlight-text-color:
 * form-field-addon-control-text-color:
 * form-field-addon-control-highlight-text-color:
 * form-field-addon-disabled-text-color:
 * form-field-addon-tiny-height:
 * form-field-addon-tiny-width:
 * form-field-tiny-width:
 * form-field-small-width:
 * form-field-medium-width:
 * form-field-large-width:
 * form-field-giant-width:
 * form-field-tiny-max-width:
 * form-field-small-max-width:
 * form-field-medium-max-width:
 * form-field-large-max-width:
 * form-field-giant-max-width:
 * form-field-addon-tiny-icon-size:
 * form-field-addon-tiny-font-size:
 * form-field-addon-tiny-line-height:
 * form-field-addon-tiny-font-weight:
 * form-field-addon-small-height:
 * form-field-addon-small-width:
 * form-field-addon-small-icon-size:
 * form-field-addon-small-font-size:
 * form-field-addon-small-line-height:
 * form-field-addon-small-font-weight:
 * form-field-addon-medium-height:
 * form-field-addon-medium-width:
 * form-field-addon-medium-icon-size:
 * form-field-addon-medium-font-size:
 * form-field-addon-medium-line-height:
 * form-field-addon-medium-font-weight:
 * form-field-addon-large-height:
 * form-field-addon-large-width:
 * form-field-addon-large-icon-size:
 * form-field-addon-large-font-size:
 * form-field-addon-large-line-height:
 * form-field-addon-large-font-weight:
 * form-field-addon-giant-height:
 * form-field-addon-giant-width:
 * form-field-addon-giant-icon-size:
 * form-field-addon-giant-font-size:
 * form-field-addon-giant-line-height:
 * form-field-addon-giant-font-weight:
 **/
@Component({
    selector: 'nb-form-field',
    styleUrls: ['./form-field.component.scss'],
    templateUrl: './form-field.component.html',
    host: {
        '[class]': 'formFieldClasses()'
    }
})
export class NbFormFieldComponent implements AfterContentChecked {
    protected readonly elementRef = inject(ElementRef)

    readonly prefix = contentChildren(NbPrefixDirective, { descendants: true })
    readonly suffix = contentChildren(NbSuffixDirective, { descendants: true })

    readonly formControl = contentChild(NbFormFieldControl)
    readonly formControlConfig = contentChild(NbFormFieldControlConfig)

    protected readonly formControlState = computed(() => this.formControl()?.controlState(), {
        equal: (oldState, state) => this.isStatesEqual(oldState, state)
    })

    protected readonly formFieldClasses = computed(() => {
        const state = this.formControlState()
        if (!state) {
            return []
        }
        return [`nb-form-field-size-${state.size}`, ...(state.fullWidth ? [] : ['nb-form-field-limited-width'])]
    })

    readonly shouldShowPrefix = computed(() => this.getFormControlConfig().supportsPrefix && !!this.prefix().length)
    readonly shouldShowSuffix = computed(() => this.getFormControlConfig().supportsSuffix && !!this.suffix().length)

    readonly prefixClasses = computed(() => this.getAddonClasses('prefix', this.formControlState()))
    readonly suffixClasses = computed(() => this.getAddonClasses('suffix', this.formControlState()))

    protected readonly prefixElement = viewChild<ElementRef<HTMLElement>>('prefixAddon')
    protected readonly suffixElement = viewChild<ElementRef<HTMLElement>>('suffixAddon')
    protected readonly zone = inject(NgZone)
    protected resizeObserver?: ResizeObserver
    protected readonly addonProperties = new Map<Element, string>()

    constructor() {
        enableTransitionsAfterRender(this.elementRef.nativeElement)
        this.observeAddonWidth(this.prefixElement, '--nb-form-field-prefix-width')
        this.observeAddonWidth(this.suffixElement, '--nb-form-field-suffix-width')
        inject(DestroyRef).onDestroy(() => this.resizeObserver?.disconnect())
    }

    ngAfterContentChecked() {
        if (!this.formControl()) {
            throwFormControlElementNotFound()
        }
    }

    protected getAddonClasses(addon: NbFormControlAddon, state?: NbFormControlState): string[] {
        if (!state) {
            return []
        }
        const classes = [
            'nb-form-field-addon',
            `nb-form-field-${addon}-${state.size}`
        ]

        if (state.disabled) {
            classes.push('nb-form-field-addon-disabled')
        } else if (state.focused) {
            classes.push(`nb-form-field-addon-${state.status}-highlight`)
        } else {
            classes.push(`nb-form-field-addon-${state.status}`)
        }

        return classes
    }

    // The control is padded by the addon's width, which the theme uses as a fallback until it's measured.
    protected observeAddonWidth(addon: Signal<ElementRef<HTMLElement> | undefined>, property: string) {
        afterRenderEffect((onCleanup) => {
            const element = addon()?.nativeElement
            if (!element || typeof ResizeObserver === 'undefined') {
                return
            }
            const host: HTMLElement = this.elementRef.nativeElement
            this.zone.runOutsideAngular(() => {
                this.resizeObserver ??= new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        const name = this.addonProperties.get(entry.target)
                        if (name) {
                            host.style.setProperty(name, `${entry.borderBoxSize[0].inlineSize}px`)
                        }
                    }
                })
                this.addonProperties.set(element, property)
                this.resizeObserver.observe(element)
            })
            onCleanup(() => {
                this.resizeObserver?.unobserve(element)
                this.addonProperties.delete(element)
                host.style.removeProperty(property)
            })
        })
    }

    protected getFormControlConfig(): NbFormFieldControlConfig {
        return this.formControlConfig() || new NbFormFieldControlConfig()
    }

    protected isStatesEqual(oldState?: NbFormControlState, state?: NbFormControlState): boolean {
        return oldState?.status === state?.status &&
           oldState?.disabled === state?.disabled &&
           oldState?.focused === state?.focused &&
           oldState?.fullWidth === state?.fullWidth &&
           oldState?.size === state?.size
    }
}
