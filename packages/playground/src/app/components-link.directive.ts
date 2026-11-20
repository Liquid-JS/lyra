import { OnInit, Directive, ElementRef, OnDestroy, inject, input, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { ComponentsListService } from './components-list.service';

@Directive({
  selector: '[npgComponentLink]',
  host: { '[class.selected]': 'selected()' },
})
export class ComponentLinkDirective implements OnInit, OnDestroy {
  private readonly componentsListService = inject(ComponentsListService);
  private readonly elementRef = inject<ElementRef<Element>>(ElementRef);

  private destroy$ = new Subject<void>();

  readonly npgComponentLink = input<string>('');

  readonly selected = signal(false);

  ngOnInit() {
    let isFirstEmission = true;
    this.componentsListService.selectedLink$
      .pipe(
        map((selectedLink: string) => this.npgComponentLink() === selectedLink),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((isSelected) => {
        this.selected.set(isSelected);

        if (isFirstEmission) {
          isFirstEmission = false;
        } else {
          this.elementRef.nativeElement.scrollIntoView({ block: 'nearest' });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
