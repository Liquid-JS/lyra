import { DestroyRef, Directive, inject, input, OnDestroy, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { NbFilterable } from './data-source/tree-grid-data-source'

/**
 * Filters what it's given, e.g. the tree grid's data source, through `filter(query)`.
 */
@Directive({ selector: '[nbFilter]' })
export class NbFilterDirective {
    readonly filterable = input.required<NbFilterable>({ alias: 'nbFilter' })

    filter(filterRequest: string) {
        this.filterable().filter(filterRequest)
    }
}

/**
 * On an input: filters what it's given, e.g. the tree grid's data source, by the input's value as the user types,
 * after a pause of `debounceTime`.
 */
@Directive({
    selector: '[nbFilterInput]',
    providers: [{ provide: NbFilterDirective, useExisting: NbFilterInputDirective }],
    host: {
        '(input)': 'filter($event)'
    }
})
export class NbFilterInputDirective extends NbFilterDirective implements OnInit, OnDestroy {
    protected readonly destroyRef = inject(DestroyRef)
    private search$: Subject<string> = new Subject<string>()

    override readonly filterable = input.required<NbFilterable>({ alias: 'nbFilterInput' })

    /**
     * How long typing pauses, in ms, before the filter runs.
     */
    readonly debounceTime = input(200)

    ngOnInit() {
        this.search$
            .pipe(
                debounceTime(this.debounceTime()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((query: string) => {
                super.filter(query)
            })
    }

    ngOnDestroy() {
        this.search$.complete()
    }

    override filter(event: Event | string) {
        this.search$.next(typeof event === 'string' ? event : (event.target as HTMLInputElement).value)
    }
}
