import { Directive, inject, input, TemplateRef, ViewContainerRef } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { switchMap } from 'rxjs/operators'

import { NbAccessChecker } from '../services/access-checker.service'

@Directive({ selector: '[nbIsGranted]' })
export class NbIsGrantedDirective {
    private readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef)
    private readonly viewContainer = inject(ViewContainerRef)
    private readonly accessChecker = inject(NbAccessChecker)

    private hasView = false

    readonly nbIsGranted = input.required<[string, string]>()

    constructor() {
    // A new permission or resource replaces the previous check.
        toObservable(this.nbIsGranted)
            .pipe(
                switchMap(([permission, resource]) => this.accessChecker.isGranted(permission, resource)),
                takeUntilDestroyed()
            )
            .subscribe((can: boolean) => {
                if (can && !this.hasView) {
                    this.viewContainer.createEmbeddedView(this.templateRef)
                    this.hasView = true
                } else if (!can && this.hasView) {
                    this.viewContainer.clear()
                    this.hasView = false
                }
            })
    }
}
