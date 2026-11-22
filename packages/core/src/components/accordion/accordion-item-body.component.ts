import {
    afterRenderEffect,
    Component,
    computed,
    contentChild,
    ElementRef,
    inject,
    linkedSignal,
    viewChild
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { ɵanimateExpand as animateExpand } from '@liquid-js/lyr-core/base'
import { NbAccordionItemComponent } from './accordion-item.component'
import { NbAccordionItemBodyContentDirective } from './accordion-item-body-content.directive'

/**
 * The content of an `nb-accordion-item`, which slides open and closed. Content in an `nbAccordionItemBodyContent`
 * template is created when the item is first expanded, and kept from then on.
 */
@Component({
    selector: 'nb-accordion-item-body',
    templateUrl: './accordion-item-body.component.html',
    styleUrls: ['./accordion-item-body.component.scss'],
    imports: [NgTemplateOutlet]
})
export class NbAccordionItemBodyComponent {
    private readonly accordionItem = inject(NbAccordionItemComponent, { host: true })
    private readonly container = viewChild.required<ElementRef<HTMLElement>>('container')

    readonly contentDirective = contentChild(NbAccordionItemBodyContentDirective)

    readonly state = computed(() => (this.accordionItem.isCollapsed() ? 'collapsed' : 'expanded'))

    /** Whether the `nbAccordionItemBodyContent` is rendered: since the item was first expanded. */
    readonly init = linkedSignal<boolean, boolean>({
        source: () => this.state() === 'expanded',
        computation: (expanded, previous) => expanded || !!previous?.value
    })

    constructor() {
    // The body opens and closes from the height it shows; it renders in its first state without animating. Opening and
    // closing follow the same curve, so as one item opens while another of the same height closes, they even out and
    // the items below stay put.
        let previous: string | undefined
        afterRenderEffect(() => {
            const state = this.state()
            if (previous !== undefined && state !== previous) {
                animateExpand(
                    this.container().nativeElement,
                    state === 'expanded',
                    { easing: 'ease-in-out' },
                    { visibility: 'visible', overflow: 'hidden' }
                )
            }
            previous = state
        })
    }
}
