import { Service } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { share } from 'rxjs/operators'

/**
 * Connects the app to the page's `nb-search`: opens and closes it, and passes on what the user types and submits.
 *
 * A `tag` tells the searches apart when a page has several: a call with a tag reaches the search with that tag, or
 * the searches without one, and the events carry the tag of the search they come from.
 */
@Service()
export class NbSearchService {
    private searchSubmittings$ = new Subject<{ term: string, tag?: string }>()
    private searchActivations$ = new Subject<{ searchType?: string, tag?: string }>()
    private searchDeactivations$ = new Subject<{ searchType?: string, tag?: string }>()
    private searchInput$ = new Subject<{ term: string, tag?: string }>()

    /** Opens the search; the search button calls it too. `searchType` is passed on with the event. */
    activateSearch(searchType?: string, tag?: string) {
        this.searchActivations$.next({ searchType, tag })
    }

    /** Closes the search; the close button calls it too. `searchType` is passed on with the event. */
    deactivateSearch(searchType?: string, tag?: string) {
        this.searchDeactivations$.next({ searchType, tag })
    }

    /** Submits a term, as Enter in the field does. */
    submitSearch(term: string, tag?: string) {
        this.searchSubmittings$.next({ term, tag })
    }

    /** Reports the term as it's typed, as the field does. */
    searchInput(term: string, tag?: string) {
        this.searchInput$.next({ term, tag })
    }

    /** The searches opened: by the button, or `activateSearch`. */
    onSearchActivate(): Observable<{ searchType?: string, tag?: string }> {
        return this.searchActivations$.pipe(share())
    }

    /** The searches closed by the user: Escape or the close button, or `deactivateSearch`. */
    onSearchDeactivate(): Observable<{ searchType?: string, tag?: string }> {
        return this.searchDeactivations$.pipe(share())
    }

    /** The terms submitted with Enter, or `submitSearch`; the search closes on each. */
    onSearchSubmit(): Observable<{ term: string, tag?: string }> {
        return this.searchSubmittings$.pipe(share())
    }

    /** The term as the user types it, e.g. to suggest results before they submit. */
    onSearchInput(): Observable<{ term: string, tag?: string }> {
        return this.searchInput$.pipe(share())
    }
}
