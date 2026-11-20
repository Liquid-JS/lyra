import { Directive, TemplateRef, inject } from '@angular/core'

/**
 * A tab's content, rendered when the tab is first opened and then kept: `<ng-template nbTabContent>` in an
 * `nb-tab`.
 */
@Directive({ selector: '[nbTabContent]' })
export class NbTabContentDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
}
