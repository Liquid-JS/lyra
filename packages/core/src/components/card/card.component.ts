import { Component, computed, Directive, input, linkedSignal } from '@angular/core';

import { injectNbDefaults, NbCardAppearance } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus, NbComponentStatus } from '@liquid-js/lyr-core/base';

/**
 * The header of an `nb-card`, coloured by the card's `status`.
 *
 * @styles
 *
 * card-header-text-color:
 * card-header-text-font-family:
 * card-header-text-font-size:
 * card-header-text-font-weight:
 * card-header-text-line-height:
 * card-header-basic-background-color:
 * card-header-basic-text-color:
 * card-header-primary-background-color:
 * card-header-primary-text-color:
 * card-header-info-background-color:
 * card-header-info-text-color:
 * card-header-success-background-color:
 * card-header-success-text-color:
 * card-header-warning-background-color:
 * card-header-warning-text-color:
 * card-header-danger-background-color:
 * card-header-danger-text-color:
 * card-header-control-background-color:
 * card-header-control-text-color:
 */
@Component({
  selector: 'nb-card-header',
  template: `<ng-content />`,
})
export class NbCardHeaderComponent {}

/**
 * The main content of an `nb-card`, padded and aligned with its header and footer.
 */
@Component({
  selector: 'nb-card-body',
  template: `<ng-content />`,
})
export class NbCardBodyComponent {}

/**
 * The footer of an `nb-card`, divided from the content above it.
 */
@Component({
  selector: 'nb-card-footer',
  template: `<ng-content />`,
})
export class NbCardFooterComponent {}

/**
 * Buttons at the end of a card's header or footer. They're centered on a line of its text, and as tall as the
 * header or footer's padding allows without making it taller.
 *
 * ```html
 * <nb-card-header>
 *   <h6>Users</h6>
 *   <nb-card-actions>
 *     <button nbButton ghost aria-label="Edit"><nb-icon icon="edit-outline" /></button>
 *   </nb-card-actions>
 * </nb-card-header>
 * ```
 *
 * @styles
 *
 * card-actions-gap:
 */
@Component({
  selector: 'nb-card-actions',
  template: `<ng-content />`,
})
export class NbCardActionsComponent {}

/**
 * Basic content container component.
 *
 * Basic card example:
 * @stacked-example(Showcase, card/card-showcase.component)
 *
 * Basic card configuration:
 *
 * ```html
 * <nb-card>
 *   <nb-card-body>
 *     Card
 *   </nb-card-body>
 * </nb-card>
 * ```
 *
 * ### Installation
 *
 * Import `NbCardComponent`, `NbCardHeaderComponent`, `NbCardBodyComponent`, `NbCardFooterComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbCardFooterComponent],
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
 * Card with header and footer:
 * @stacked-example(With Header & Footer, card/card-full.component)
 *
 * The main content goes in `nb-card-body`, padded and aligned with the header and footer. Content put straight in
 * `nb-card` gets no padding, e.g. an `nb-list` that reaches the card's edges:
 * @stacked-example(Card with list, card/card-without-body.component)
 *
 * Put buttons in `nb-card-actions`, at the end of the header or footer:
 * @stacked-example(Card actions, card/card-actions.component)
 *
 * `status` colours the card's header:
 * @stacked-example(Colored Card, card/card-colors.component)
 *
 * `accent` is a band of a status colour along the card's top, a slighter highlight, which combines with `status`:
 * @stacked-example(Accent Card, card/card-accents.component)
 *
 * Put an image or a coloured block at a card's top with `nbCardMedia`, or its bottom with `nbCardMedia="bottom"`. It
 * reaches the card's edges and covers the card's border, as a coloured header and an accent do:
 * @stacked-example(Card with media, card/card-media.component)
 *
 * `appearance="filled"` makes a tinted card without an outer border, e.g. for cards inside a card or on a white page,
 * and `appearance="floating"` a card with a shadow instead of a border, over the page; chats, accordions and tables
 * have it too:
 * @stacked-example(Card Appearances, card/card-appearances.component)
 *
 * A card that leads somewhere has an `nbCardLink`: a link or button inside it, usually its title, that covers the
 * whole card, so the card responds to hover, presses and focus as one. Other buttons and links in the card stay
 * their own. Screen readers find the link with its own text, so give it one that names the card:
 * @stacked-example(Interactive Card, card/card-interactive.component)
 *
 * `size` gives a card a fixed height, so cards of smaller sizes stack beside a bigger one in a row:
 * @stacked-example(Card sizes combinations, card/card-sizes-combinations.component)
 *
 * @additional-example(Multiple Sizes, card/card-sizes.component)
 *
 * @styles
 *
 * card-background-color:
 * card-text-color:
 * card-text-font-family:
 * card-text-font-size:
 * card-text-font-weight:
 * card-text-line-height:
 * card-border-width:
 * card-border-style:
 * card-border-color:
 * card-border-radius:
 * card-accent-height:
 * card-padding:
 * card-shadow:
 * card-floating-shadow:
 * card-divider-color:
 * card-divider-style:
 * card-divider-width:
 * card-height-tiny:
 * card-height-small:
 * card-height-medium:
 * card-height-large:
 * card-height-giant:
 * card-margin-bottom:
 * card-scrollbar-color:
 * card-scrollbar-background-color:
 * card-scrollbar-width:
 * card-filled-background-color:
 * card-filled-divider-color:
 * card-hover-background-color:
 * card-hover-border-color:
 * card-active-background-color:
 * card-active-border-color:
 * card-filled-hover-background-color:
 * card-filled-active-background-color:
 * card-outline-width:
 * card-outline-color:
 */
@Component({
  selector: 'nb-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  host: {
    '[class]': 'hostClasses()',
    '[class.accent]': '!!accent()',
  },
})
export class NbCardComponent {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('card');

  /**
   * A fixed height: `tiny`, `small`, `medium`, `large` or `giant`. Unset by default, so the card is as tall as its
   * content.
   */
  readonly size = input<'' | NbComponentSize>('');

  /**
   * Colours the header: `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom status.
   * Unset by default.
   */
  readonly status = input<'' | NbComponentOrCustomStatus>('');

  /**
   * A band of a status colour along the top: `basic`, `primary`, `info`, `success`, `warning`, `danger` or
   * `control`. Unset by default.
   */
  readonly accent = input<'' | NbComponentStatus>('');

  /**
   * Card appearance: `outline`, a card with a border, `filled`, a tinted card without one, or `floating`, a card with
   * a shadow instead of a border, over the page.
   */
  readonly appearanceInput = input<NbCardAppearance | undefined>(undefined, { alias: 'appearance' });
  /** The appearance in use: the input's, the app's default, or 'outline'. */
  readonly appearance = linkedSignal<NbCardAppearance>(
    () => this.appearanceInput() ?? this.nbDefaults().appearance ?? 'outline',
  );

  protected readonly hostClasses = computed(() =>
    [
      `appearance-${this.appearance()}`,
      this.size() && `size-${this.size()}`,
      this.status() && `status-${this.status()}`,
      this.accent() && `accent-${this.accent()}`,
    ].filter(Boolean),
  );
}

/**
 * Makes a link or button inside a `nb-card`, usually its title, cover the whole card: a click anywhere on the card
 * follows it, and the card shows its hover, active and focus states. Other buttons and links in the card stay
 * clickable on their own.
 *
 * ```html
 * <nb-card>
 *   <nb-card-header><a nbCardLink routerLink="/plans/team">Team plan</a></nb-card-header>
 *   <nb-card-body>For up to 20 people.</nb-card-body>
 * </nb-card>
 * ```
 */
@Directive({
  selector: '[nbCardLink]',
  host: { class: 'card-link' },
})
export class NbCardLinkDirective {}

/**
 * An image, video or coloured block at a card's top, or with `nbCardMedia="bottom"` its bottom. It reaches the card's
 * edges, covers its border and follows its rounded corners.
 *
 * ```html
 * <nb-card>
 *   <img nbCardMedia src="cover.webp" alt="" />
 *   <nb-card-body>The team behind the product.</nb-card-body>
 * </nb-card>
 * ```
 */
@Directive({
  selector: '[nbCardMedia]',
  host: { class: 'card-media' },
})
export class NbCardMediaDirective {
  /** Where the media goes: the card's top (by default), or its `bottom`; set as a plain attribute. */
  readonly nbCardMedia = input<'' | 'top' | 'bottom'>('');
}
