import { Component, input, model } from '@angular/core';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * A card with a back that slides up over its front.
 *
 * Reveal card example:
 * @stacked-example(My example, reveal-card/reveal-card-showcase.component)
 *
 * Its content is two `nb-card`s, in `nb-card-front` and `nb-card-back`. A button in the corner reveals the back, by
 * a click, Enter or Space; `revealed` does it from code.
 *
 * Basic reveal card configuration:
 *
 * ```html
 * <nb-reveal-card>
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
 * </nb-reveal-card>
 * ```
 *
 * ### Installation
 *
 * Import `NbRevealCardComponent`, `NbCardFrontComponent`, `NbCardBackComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbRevealCardComponent, NbCardFrontComponent, NbCardBackComponent],
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
 * Reveal Card with header and footer:
 * @stacked-example(With Header & Footer, reveal-card/reveal-card-full.component)
 *
 * Colored reveal-cards could be simply configured by providing a `status` property:
 * @stacked-example(Colored Card, reveal-card/reveal-card-colors.component)
 *
 * It is also possible to assign an `accent` property for a slight card highlight
 * as well as combine it with `status`:
 * @stacked-example(Accent Card, reveal-card/reveal-card-accents.component)
 *
 * @additional-example(Multiple Sizes, reveal-card/reveal-card-sizes.component)
 */
@Component({
  selector: 'nb-reveal-card',
  styleUrls: ['./reveal-card.component.scss'],
  templateUrl: './reveal-card.component.html',
  imports: [NbIconComponent],
  host: {
    '[class.revealed]': 'revealed()',
  },
})
export class NbRevealCardComponent {
  protected readonly texts = injectNbTexts('revealCard', () => ({
    toggle: $localize`:@@nb.revealCard.toggle:Reveal card`,
  }));

  /**
   * Whether the back is shown. Two-way bindable, so the card can be revealed from code.
   */
  readonly revealed = model<boolean>(false);

  /**
   * Shows the button that reveals the back (default). Without it, reveal it with `revealed`.
   */
  readonly showToggleButton = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /**
   * Accessible name of the toggle button; "Reveal card" by default.
   */
  readonly toggleButtonLabel = input<string>();

  toggle() {
    this.revealed.update((revealed) => !revealed);
  }
}
