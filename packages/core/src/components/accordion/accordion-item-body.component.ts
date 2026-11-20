import {
    afterRenderEffect,
    Component,
    computed,
    ElementRef,
    inject,
    viewChild
} from '@angular/core'

import { ɵanimateExpand as animateExpand } from '@liquid-js/lyr-core/base'
import { NbAccordionItemComponent } from './accordion-item.component'

/**
 * The content of an `nb-accordion-item`, which slides open and closed.
 */
@Component({
    selector: 'nb-accordion-item-body',
    templateUrl: './accordion-item-body.component.html',
    styleUrls: ['./accordion-item-body.component.scss']
})
export class NbAccordionItemBodyComponent {
    private readonly accordionItem = inject(NbAccordionItemComponent, { host: true })
    private readonly container = viewChild.required<ElementRef<HTMLElement>>('container')

    readonly state = computed(() => (this.accordionItem.isCollapsed() ? 'collapsed' : 'expanded'))

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
                    { visibility: 'visible' }
                )
            }
            previous = state
        })
    }
}
