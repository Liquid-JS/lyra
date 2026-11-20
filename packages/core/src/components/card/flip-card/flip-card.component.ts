import { Component, input, model } from '@angular/core';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * A card with two sides, which flips over to show its back.
 *
 * Flip card example:
 * @stacked-example(Showcase, flip-card/flip-card-showcase.component)
 *
 * Its content is two `nb-card`s, in `nb-card-front` and `nb-card-back`. A button in the corner flips it, by a click,
 * Enter or Space; `flipped` flips it from code.
 *
 * Basic flip card configuration:
 *
 * ```html
 * <nb-flip-card>
 *   <nb-card-front>
 *     <nb-card>
 *       <nb-card-body>
 *         Front
 *       </nb-card-body>
 *     </nb-card>
 *   </nb-card-front>
 *   <nb-card-back>
 *     <nb-card>
 *       <nb-card-body>
 *         Back
 *       </nb-card-body>
 *     </nb-card>
 *   </nb-card-back>
 * </nb-flip-card>
 * ```
 *
 * ### Installation
 *
 * Import `NbFlipCardComponent`, `NbCardFrontComponent`, `NbCardBackComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbFlipCardComponent, NbCardFrontComponent, NbCardBackComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbCardModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbCardModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Flip Card with header and footer:
 * @stacked-example(With Header & Footer, flip-card/flip-card-full.component.ts)
 *
 * Colored flip-cards could be simply configured by providing a `status` property:
 * @stacked-example(Colored Card, flip-card/flip-card-colors.component)
 *
 * It is also possible to assign an `accent` property for a slight card highlight
 * as well as combine it with `status`:
 * @stacked-example(Accent Card, flip-card/flip-card-accents.component)
 *
 * @additional-example(Multiple Sizes, flip-card/flip-card-sizes.component)
 *
 */
@Component({
  selector: 'nb-flip-card',
  styleUrls: ['./flip-card.component.scss'],
  templateUrl: './flip-card.component.html',
  imports: [NbIconComponent],
  host: {
    '[class.flipped]': 'flipped()',
  },
})
export class NbFlipCardComponent {
  protected readonly texts = injectNbTexts('flipCard', () => ({
    toggle: $localize`:@@nb.flipCard.toggle:Flip card`,
  }));

  /**
   * Whether the back is shown. Two-way bindable, so the card can be flipped from code.
   */
  readonly flipped = model<boolean>(false);

  /**
   * Shows the button that flips the card (default). Without it, flip the card with `flipped`.
   */
  readonly showToggleButton = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * Accessible name of the toggle button; "Flip card" by default.
   */
  readonly toggleButtonLabel = input<string>();

  toggle() {
    this.flipped.update((flipped) => !flipped);
  }
}
