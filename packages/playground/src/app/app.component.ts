import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NB_DOCUMENT } from '@liquid-js/lyr-core';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ComponentsListService } from './components-list.service';
import { LayoutDirectionToggleComponent } from './layout-direction-toggle/layout-direction-toggle.component';
import { LayoutThemeToggleComponent } from './layout-theme-toggle/layout-theme-toggle.component';
import { ComponentsListComponent } from './components-list/components-list.component';

@Component({
  selector: 'npg-app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  imports: [
    LayoutDirectionToggleComponent,
    LayoutThemeToggleComponent,
    ComponentsListComponent,
    RouterOutlet,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly componentsListService = inject(ComponentsListService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly document: Document;
  private lastFocusedElement: HTMLElement;
  readonly showToolbar = signal(true);
  readonly showComponentsList = signal(false);
  readonly components = toSignal(this.componentsListService.components$, { requireSync: true });

  readonly componentSearch = viewChild<ElementRef>('componentSearch');

  constructor() {
    const document = inject(NB_DOCUMENT);

    this.document = document;
    this.lastFocusedElement = this.document.body;
  }

  ngAfterViewInit() {
    if (!this.document) {
      return;
    }

    fromEvent<KeyboardEvent>(this.document, 'keyup')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: KeyboardEvent) => this.handleButtonPressUp(e));

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.hideComponentsList());
  }

  navigateToComponent() {
    this.componentSearch()?.nativeElement.blur(); // remove focus from search input
    this.componentsListService.selectedLink$.pipe(take(1)).subscribe((selectedLink) => {
      void this.router.navigate([selectedLink]);
    });
  }

  toggleToolbar() {
    this.showToolbar.update((show) => !show);
    if (!this.showToolbar()) {
      this.hideComponentsList();
    }
  }

  showComponentList() {
    this.showComponentsList.set(true);
  }

  hideComponentsList() {
    this.showComponentsList.set(false);
  }

  onSearchChange(event: Event) {
    this.showComponentList();
    this.componentsListService.updateSearch((event.target as HTMLInputElement).value);
  }

  private handleButtonPressUp(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      this.componentsListService.selectNextComponent();
    }

    if (e.key === 'ArrowUp') {
      this.componentsListService.selectPreviousComponent();
    }

    if (e.key === 'Escape') {
      this.hideComponentsList();
      this.lastFocusedElement.focus();
    }

    if (e.key === '/') {
      this.lastFocusedElement = this.document.activeElement as HTMLElement;
      this.componentSearch()?.nativeElement.focus();
    }
  }
}
