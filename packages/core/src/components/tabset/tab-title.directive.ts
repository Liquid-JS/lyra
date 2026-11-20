import { Directive, TemplateRef, inject } from '@angular/core'

/**
 * A template for a tab's title, in place of its `tabTitle` text: `<ng-template nbTabTitle>` in an `nb-tab`.
 */
@Directive({ selector: '[nbTabTitle]' })
export class NbTabTitleDirective {
    readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
}
