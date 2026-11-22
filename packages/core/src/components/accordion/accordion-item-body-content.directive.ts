import { Directive, TemplateRef, inject } from '@angular/core'

/**
 * An accordion item's content, rendered when the item is first expanded and then kept:
 * `<ng-template nbAccordionItemBodyContent>` in an `nb-accordion-item-body`.
 */
@Directive({ selector: '[nbAccordionItemBodyContent]' })
export class NbAccordionItemBodyContentDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
}
