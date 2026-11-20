import { Component, input } from '@angular/core';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbBadgePosition, NbBadgeComponent } from '@liquid-js/lyr-core/badge';
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

/**
 * An action in `nb-actions`: a link with an icon, or any content given instead of an icon.
 */
@Component({
  selector: 'nb-action',
  styleUrls: ['./action.component.scss'],
  templateUrl: './actions.component.html',
  imports: [RouterLink, NbIconComponent, NgTemplateOutlet, NbBadgeComponent],
  host: {
    '[class.disabled]': 'disabled()',
  },
})
export class NbActionComponent {
  /**
   * Router link of the icon; wins over `href`.
   */
  readonly link = input<string>();

  /**
   * Plain `href` of the icon. Without `link` or `href` the icon is a link that goes nowhere.
   */
  readonly href = input<string>();

  /**
   * Title (tooltip) of the icon link.
   */
  readonly title = input<string>('');

  /**
   * Icon name or config. Without it the action shows its content instead.
   */
  readonly icon = input<string | NbIconConfig>();

  /**
   * Disables the item: dimmed, skipped by Tab and `aria-disabled`.
   */
  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Shows the badge as a dot, without text.
   */
  readonly badgeDot = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Text of the badge, which shows when this or `badgeDot` is set.
   */
  readonly badgeText = input<string>();

  /**
   * Badge status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom one.
   */
  readonly badgeStatus = input<NbComponentOrCustomStatus>('basic');

  /**
   * Badge position, `top right` by default: a physical corner such as `bottom left`, or a logical one such as
   * `top end`.
   */
  readonly badgePosition = input<NbBadgePosition>();
}

/**
 * Shows a row of actions, vertically centred, in several sizes.
 *
 * @stacked-example(Showcase, action/action-showcase.component)
 *
 * Basic actions setup:
 * ```html
 * <nb-actions size="small">
 *   <nb-action icon="search-outline"></nb-action>
 *   <nb-action icon="power-outline"></nb-action>
 *   <nb-action icon="person-outline"></nb-action>
 * </nb-actions>
 * ```
 * ### Installation
 *
 * Import `NbActionsComponent`, `NbActionComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbActionsComponent, NbActionComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbActionsModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbActionsModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Its sizes are the sizes of its icons, from 1rem for `tiny` to 4rem for `giant`, not the heights of controls, so the
 * app's size for controls doesn't change them:
 * @stacked-example(Multiple Sizes, action/action-sizes.component)
 *
 * It is also possible to specify a `badge` value:
 *
 * @stacked-example(Action Badge, action/action-badge.component)
 *
 * and we can set it to full a width of a parent component
 * @stacked-example(Full Width, action/action-width.component)
 *
 * Action dot mode
 * @stacked-example(Action badge in dot mode, action/action-dot-mode.component)
 *
 * @styles
 *
 * actions-background-color:
 * actions-divider-color:
 * actions-divider-style:
 * actions-divider-width:
 * actions-icon-color:
 * actions-text-color:
 * actions-text-font-family:
 * actions-text-font-weight:
 * actions-text-line-height:
 * actions-disabled-icon-color:
 * actions-disabled-text-color:
 * actions-tiny-height:
 * actions-tiny-icon-height:
 * actions-tiny-padding:
 * actions-tiny-text-font-size:
 * actions-small-height:
 * actions-small-icon-height:
 * actions-small-padding:
 * actions-small-text-font-size:
 * actions-medium-height:
 * actions-medium-icon-height:
 * actions-medium-padding:
 * actions-medium-text-font-size:
 * actions-large-height:
 * actions-large-icon-height:
 * actions-large-padding:
 * actions-large-text-font-size:
 * actions-giant-height:
 * actions-giant-icon-height:
 * actions-giant-padding:
 * actions-giant-text-font-size:
 */
@Component({
  selector: 'nb-actions',
  styleUrls: ['./actions.component.scss'],
  template: ` <ng-content select="nb-action" /> `,
  host: {
    '[class]': '`size-${size()}`',
    '[class.full-width]': 'fullWidth()',
  },
})
export class NbActionsComponent {
  /**
   * Size of the icons: `tiny`, `small` (default), `medium`, `large` or `giant`.
   */
  readonly size = input<NbComponentSize>('small');

  /**
   * Fills the width of the container, the actions sharing it equally.
   */
  readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });
}
