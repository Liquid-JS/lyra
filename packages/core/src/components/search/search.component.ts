import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

import { of as observableOf } from 'rxjs';
import { filter, delay } from 'rxjs/operators';

import { NbSearchService } from './search.service';
import { NbThemeService } from '@liquid-js/lyr-core/base';
import { NbOverlayService } from '@liquid-js/lyr-core/cdk';
import { NbOverlayRef, NbPortalDirective } from '@liquid-js/lyr-core/cdk';
import { NbButtonComponent } from '@liquid-js/lyr-core/button';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { FormsModule } from '@angular/forms';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

let lastSearchHintId = 0;

/**
 * The field `nb-search` opens over the page; not for use on its own.
 */
@Component({
  selector: 'nb-search-field',
  styleUrls: [
    'styles/search.component.modal-zoomin.scss',
    'styles/search.component.layout-rotate.scss',
    'styles/search.component.modal-move.scss',
    'styles/search.component.curtain.scss',
    'styles/search.component.column-curtain.scss',
    'styles/search.component.modal-drop.scss',
    'styles/search.component.modal-half.scss',
  ],
  templateUrl: './search-field.component.html',
  imports: [NbButtonComponent, NbIconComponent, FormsModule],
  host: {
    '[class]': 'typeClass()',
    '[class.show]': 'show()',
  },
})
export class NbSearchFieldComponent implements OnChanges, AfterViewInit {
  protected readonly texts = injectNbTexts('search', () => ({
    placeholder: $localize`:@@nb.search.placeholder:Search...`,
    hint: $localize`:@@nb.search.hint:Hit enter to search`,
    open: $localize`:@@nb.search.open:Search`,
    close: $localize`:@@nb.search.close:Close search`,
  }));

  static readonly TYPE_MODAL_ZOOMIN = 'modal-zoomin';
  static readonly TYPE_ROTATE_LAYOUT = 'rotate-layout';
  static readonly TYPE_MODAL_MOVE = 'modal-move';
  static readonly TYPE_CURTAIN = 'curtain';
  static readonly TYPE_COLUMN_CURTAIN = 'column-curtain';
  static readonly TYPE_MODAL_DROP = 'modal-drop';
  static readonly TYPE_MODAL_HALF = 'modal-half';

  readonly type = input<string>();
  readonly placeholder = input<string>();
  readonly hint = input<string>();

  // The hint describes the field, as a field's errors do; the placeholder names it, with nothing else to.
  protected readonly hintId = `nb-search-hint-${lastSearchHintId++}`;

  readonly show = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  readonly close = output<void>();
  readonly search = output<string>();
  readonly searchInput = output<string>();

  readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly typeClass = computed(() => (searchTypes.includes(this.type() as NbSearchType) ? this.type() : ''));

  ngOnChanges({ show }: SimpleChanges) {
    const becameHidden = show && !show.isFirstChange() && show.currentValue === false;
    const inputElement = this.inputElement();
    if (becameHidden && inputElement) {
      inputElement.nativeElement.value = '';
    }

    this.focusInput();
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  emitClose() {
    this.close.emit();
  }

  /** Escape closes the search, on key down as the overlays close, and only the search. */
  protected onEscape(event: Event) {
    if (!event.defaultPrevented) {
      event.preventDefault();
      this.emitClose();
    }
  }

  submitSearch(term: string) {
    if (term) {
      this.search.emit(term);
    }
  }

  emitSearchInput(term: string) {
    this.searchInput.emit(term);
  }

  focusInput() {
    const inputElement = this.inputElement();
    if (this.show() && inputElement) {
      inputElement.nativeElement.focus();
    }
  }
}

export type NbSearchType = 'modal-zoomin' | 'rotate-layout' | 'modal-move'
  | 'curtain' | 'column-curtain' | 'modal-drop' | 'modal-half';

const searchTypes: NbSearchType[] = [
  'modal-zoomin', 'rotate-layout', 'modal-move', 'curtain', 'column-curtain', 'modal-drop', 'modal-half',
];

/**
 * A search button that opens a search field over the whole page, with an animation of the chosen `type`.
 *
 * @stacked-example(Showcase, search/search-showcase.component)
 *
 * ```html
 * <nb-search type="rotate-layout" />
 * ```
 * ### Installation
 *
 * Import `NbSearchComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbSearchComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbSearchModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbSearchModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * The animations are `modal-zoomin`, `rotate-layout`, `modal-move`, `curtain`, `column-curtain`, `modal-drop` and
 * `modal-half`. The field takes the focus while it's open; Escape or the close button closes it, and so does a
 * navigation. Enter submits the term through `NbSearchService`, which also opens and closes the search:
 *
 * @stacked-example(Search Event, search/search-event.component)
 *
 * `onSearchInput()` emits as the user types, e.g. to suggest results before they submit:
 *
 * @stacked-example(Search Input Event, search/search-with-input-event.component)
 *
 * @styles
 *
 * search-background-color:
 * search-divider-color:
 * search-divider-style:
 * search-divider-width:
 * search-extra-background-color:
 * search-text-color:
 * search-text-font-family:
 * search-text-font-size:
 * search-text-font-weight:
 * search-text-line-height:
 * search-placeholder-text-color:
 * search-info-text-color:
 * search-info-text-font-family:
 * search-info-text-font-size:
 * search-info-text-font-weight:
 * search-info-text-line-height:
 */
@Component({
  selector: 'nb-search',
  styleUrls: ['styles/search.component.scss'],
  templateUrl: './search.component.html',
  imports: [NbButtonComponent, NbIconComponent, NbPortalDirective, NbSearchFieldComponent],
})
export class NbSearchComponent implements OnInit, OnDestroy {
  protected readonly texts = injectNbTexts('search', () => ({
    placeholder: $localize`:@@nb.search.placeholder:Search...`,
    hint: $localize`:@@nb.search.hint:Hit enter to search`,
    open: $localize`:@@nb.search.open:Search`,
    close: $localize`:@@nb.search.close:Close search`,
  }));

  private readonly searchService = inject(NbSearchService);
  private readonly themeService = inject(NbThemeService);
  private readonly router = inject(Router);
  private readonly overlayService = inject(NbOverlayService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  private readonly destroyRef = inject(DestroyRef);
  private overlayRef?: NbOverlayRef;
  readonly showSearchField = signal(false);

  /**
   * Tells the searches apart in `NbSearchService` when a page has several: the service's events carry it, and a
   * call with a tag reaches only the search with that tag, or the searches without one.
   */
  readonly tag = input<string>();

  /** The field's placeholder; "Search..." by default, from the app's texts. */
  readonly placeholder = input<string>();

  /** A hint under the field; "Hit enter to search" by default, from the app's texts. */
  readonly hint = input<string>();

  /** The animation the field opens with; without one, the field shows without an animation. */
  readonly type = input<NbSearchType>();

  readonly searchFieldPortal = viewChild.required(NbPortalDirective);
  readonly searchButton = viewChild.required('searchButton', { read: ElementRef<HTMLElement> });

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.hideSearch());

    this.searchService.onSearchActivate()
      .pipe(
        filter((data) => !this.tag() || data.tag === this.tag()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.openSearch());

    this.searchService.onSearchDeactivate()
      .pipe(
        filter((data) => !this.tag() || data.tag === this.tag()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.hideSearch());
  }

  ngOnDestroy() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.removeLayoutClasses();
      this.overlayRef.detach();
    }
  }

  openSearch() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlayService.create();
      this.overlayRef.attach(this.searchFieldPortal());
    }

    const type = this.type();
    if (type) {
      this.themeService.appendLayoutClass(type);
    }
    observableOf(null).pipe(delay(0)).subscribe(() => {
      this.themeService.appendLayoutClass('with-search');
      this.showSearchField.set(true);
      this.changeDetector.detectChanges();
    });
  }

  hideSearch() {
    this.removeLayoutClasses();
    this.showSearchField.set(false);
    // Render now, so the search field is closed before the button takes the focus back.
    this.changeDetector.detectChanges();
    this.searchButton().nativeElement.focus();
  }

  search(term: string) {
    this.searchService.submitSearch(term, this.tag());
    this.hideSearch();
  }

  emitInput(term: string) {
    this.searchService.searchInput(term, this.tag());
  }

  emitActivate() {
    this.searchService.activateSearch(this.type(), this.tag());
  }

  emitDeactivate() {
    this.searchService.deactivateSearch(this.type(), this.tag());
  }

  private removeLayoutClasses() {
    this.themeService.removeLayoutClass('with-search');
    observableOf(null).pipe(delay(500)).subscribe(() => {
      const type = this.type();
      if (type) {
        this.themeService.removeLayoutClass(type);
      }
    });
  }
}
