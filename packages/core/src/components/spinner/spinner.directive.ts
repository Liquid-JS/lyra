import { ComponentRef, Directive, ElementRef, Renderer2, ViewContainerRef, effect, inject, input, untracked } from '@angular/core';

import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbSpinnerComponent } from './spinner.component';
import { setComponentContext } from '@liquid-js/lyr-core/cdk';

/**
 * Covers its host with a spinner while something loads; the host is `aria-busy` meanwhile.
 *
 * @stacked-example(Spinner Showcase, spinner/spinner-card.component)
 *
 * ```html
 * <nb-card [nbSpinner]="loading" nbSpinnerStatus="danger">
 *   <nb-card-body>Card Content</nb-card-body>
 * </nb-card>
 * ```
 *
 * ### Installation
 *
 * Import `NbSpinnerDirective` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbSpinnerDirective],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbSpinnerModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbSpinnerModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `nbSpinnerStatus` colours it:
 *
 * @stacked-example(Spinner Colors, spinner/spinner-colors.component)
 *
 * `nbSpinnerSize` sizes it:
 *
 * @stacked-example(Spinner Sizes, spinner/spinner-sizes.component)
 *
 * On a button:
 * @stacked-example(Buttons with spinner, spinner/spinner-button.component)
 *
 * Or in tabs:
 * @stacked-example(Spinner in tabs, spinner/spinner-tabs.component)
 */
@Directive({
  selector: '[nbSpinner]',
  host: {
    '[class.nb-spinner-container]': 'nbSpinner()',
    // What the spinner covers is loading.
    '[attr.aria-busy]': 'nbSpinner() || null',
  },
})
export class NbSpinnerDirective {
  private readonly directiveView = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly directiveElement = inject(ElementRef);

  private spinner?: ComponentRef<NbSpinnerComponent>;

  /** A message beside the spinner; none by default, unlike `nb-spinner` on its own. */
  readonly spinnerMessage = input<string>(undefined, { alias: 'nbSpinnerMessage' });

  /** `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. */
  readonly spinnerStatus = input<NbComponentOrCustomStatus>('basic', { alias: 'nbSpinnerStatus' });

  /** `tiny`, `small`, `medium` (default), `large` or `giant`. */
  readonly spinnerSize = input<NbComponentSize>('medium', { alias: 'nbSpinnerSize' });

  /** Whether the spinner shows. */
  readonly nbSpinner = input<boolean, unknown>(false, { transform: Boolean });

  constructor() {
    effect(() => {
      // Without a message, the directive's spinner shows none.
      const context = { message: this.spinnerMessage() ?? '', status: this.spinnerStatus(), size: this.spinnerSize() };
      if (!this.nbSpinner()) {
        untracked(() => this.hide());
        return;
      }
      untracked(() => {
        setComponentContext(this.show(), context);
      });
    });
  }

  private show(): ComponentRef<NbSpinnerComponent> {
    if (!this.spinner) {
      this.spinner = this.directiveView.createComponent(NbSpinnerComponent);
      this.renderer.appendChild(this.directiveElement.nativeElement, this.spinner.location.nativeElement);
    }
    return this.spinner;
  }

  private hide() {
    if (this.spinner) {
      this.directiveView.clear();
      this.spinner = undefined;
    }
  }
}
