import { Component, input, computed, linkedSignal } from '@angular/core';

import { injectNbDefaults } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentShape } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbBadgePosition, NbBadgeComponent } from '@liquid-js/lyr-core/badge';
import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/** A word's first character as a reader sees it, e.g. a whole emoji. */
function firstGrapheme(word: string): string {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const [first] = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(word);
    return first?.segment ?? '';
  }
  return Array.from(word)[0] ?? '';
}

/**
 * A user's avatar with their name and title beside it.
 * @stacked-example(Showcase, user/user-showcase.component)
 *
 * ```html
 * <nb-user name="John Doe" title="Engineer"></nb-user>
 * ```
 *
 * ### Installation
 *
 * Import `NbUserComponent` into your standalone component:
 * ```ts
 * @Component({
 *   imports: [NbUserComponent],
 * })
 * export class PageComponent { }
 * ```
 *
 * With NgModules:
 *
 * Import `NbUserModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     NbUserModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * `size` sizes it:
 * @stacked-example(Multiple Sizes, user/user-sizes.component)
 *
 * `showName`, `showTitle` and `onlyPicture` hide the captions:
 * @stacked-example(Hide captions in user component, user/user-hide-captions.component)
 *
 * The avatar is `picture`, a URL or a data URL, or else the name's initials on a `color` or `status` background;
 * `showInitials` turns the initials off:
 * @stacked-example(Avatar image settings, user/user-avatar-settings.component)
 *
 * `shape` sets the avatar's corners:
 * @stacked-example(Shapes, user/user-shape.component)
 *
 * @styles
 *
 * user-picture-box-background-color:
 * user-picture-box-border-color:
 * user-picture-box-border-width:
 * user-initials-text-color:
 * user-initials-basic-background-color:
 * user-initials-basic-text-color:
 * user-initials-primary-background-color:
 * user-initials-primary-text-color:
 * user-initials-success-background-color:
 * user-initials-success-text-color:
 * user-initials-info-background-color:
 * user-initials-info-text-color:
 * user-initials-warning-background-color:
 * user-initials-warning-text-color:
 * user-initials-danger-background-color:
 * user-initials-danger-text-color:
 * user-initials-control-background-color:
 * user-initials-control-text-color:
 * user-initials-text-font-family:
 * user-initials-text-font-weight:
 * user-name-text-color:
 * user-name-text-font-family:
 * user-name-text-font-weight:
 * user-title-text-color:
 * user-title-text-font-family:
 * user-title-text-font-weight:
 * user-rectangle-border-radius:
 * user-semi-round-border-radius:
 * user-round-border-radius:
 * user-tiny-height:
 * user-tiny-width:
 * user-tiny-initials-text-font-size:
 * user-tiny-initials-text-line-height:
 * user-tiny-name-text-font-size:
 * user-tiny-name-text-line-height:
 * user-tiny-title-text-font-size:
 * user-tiny-title-text-line-height:
 * user-small-height:
 * user-small-width:
 * user-small-initials-text-font-size:
 * user-small-initials-text-line-height:
 * user-small-name-text-font-size:
 * user-small-name-text-line-height:
 * user-small-title-text-font-size:
 * user-small-title-text-line-height:
 * user-medium-height:
 * user-medium-width:
 * user-medium-initials-text-font-size:
 * user-medium-initials-text-line-height:
 * user-medium-name-text-font-size:
 * user-medium-name-text-line-height:
 * user-medium-title-text-font-size:
 * user-medium-title-text-line-height:
 * user-large-height:
 * user-large-width:
 * user-large-initials-text-font-size:
 * user-large-initials-text-line-height:
 * user-large-name-text-font-size:
 * user-large-name-text-line-height:
 * user-large-title-text-font-size:
 * user-large-title-text-line-height:
 * user-giant-height:
 * user-giant-width:
 * user-giant-initials-text-font-size:
 * user-giant-initials-text-line-height:
 * user-giant-name-text-font-size:
 * user-giant-name-text-line-height:
 * user-giant-title-text-font-size:
 * user-giant-title-text-line-height:
 */
@Component({
  selector: 'nb-user',
  styleUrls: ['./user.component.scss'],
  templateUrl: './user.component.html',
  imports: [NbBadgeComponent],
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NbUserComponent {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('user');

  protected readonly texts = injectNbTexts('user', () => ({
    anonymous: $localize`:@@nb.user.anonymous:Anonymous`,
  }));

  /** The name shown, "Anonymous" without one. */
  protected readonly displayName = computed(() => this.name() ?? this.texts().anonymous);

  /** The name, shown beside the avatar; "Anonymous" without one, which the initials follow too. */
  readonly name = input<string>();

  /** A title under the name, e.g. a role. */
  readonly title = input<string>();

  /**
   * The picture's URL, or a data URL. Without one, or when it fails to load, the initials show (JD for John Doe).
   * The picture names the user for assistive technologies only when the name isn't shown.
   */
  readonly picture = input<string>();

  /** Whether the picture failed to load, so the initials show; a new picture tries again. */
  protected readonly pictureFailed = linkedSignal({ source: this.picture, computation: () => false });

  /** Whether the picture shows, rather than the initials. */
  protected readonly pictureShown = computed(() => !!this.picture() && !this.pictureFailed());

  /** A CSS colour for the initials' background; takes precedence over `status`. */
  readonly color = input<string>();

  /**
   * Colours the initials' area with a status: `basic`, `primary`, `success`, `info`, `warning`, `danger` or
   * `control`. Unset by default, which shows the area's border; `color` takes precedence.
   */
  readonly status = input<NbComponentOrCustomStatus>();

  /** `tiny`, `small`, `medium` (default), `large` or `giant`. */
  readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' });
  /** The size in use: the input's, the app's default, or 'medium'. */
  readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium');

  /** The avatar's shape: `rectangle`, `semi-round` or `round` (default). */
  readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' });
  /** The shape in use: the input's, the app's default, or 'round'. */
  readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'round');

  /** Shows the name. */
  readonly showName = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /** Shows the title. */
  readonly showTitle = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /** Shows the initials when there's no picture; without them, the background shows on its own. */
  readonly showInitials = input<boolean, NbBooleanInput>(true, { transform: convertToBoolProperty });

  /** Shows the avatar alone, without the name and the title. */
  readonly onlyPicture = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /** Text of a badge on the avatar; no badge without it. */
  readonly badgeText = input<string>();

  /** The badge's status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger` or `control`. */
  readonly badgeStatus = input<NbComponentOrCustomStatus>('basic');

  /**
   * Where the badge sits on the avatar: `top left`, `top right` (default), `bottom left`, `bottom right`,
   * `top start`, `top end`, `bottom start` or `bottom end`.
   */
  readonly badgePosition = input<NbBadgePosition>();

  protected readonly nameVisible = computed(() => this.showName() && !this.onlyPicture());

  protected readonly titleVisible = computed(() => this.showTitle() && !this.onlyPicture());

  /**
   * The first letters of the first two words of the name: whole characters, so an emoji or a letter with a combining
   * mark stays whole.
   */
  getInitials(): string {
    const name = this.displayName();
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => firstGrapheme(word))
      .join('')
      .toLocaleUpperCase();
  }

  protected readonly hostClasses = computed(() =>
    [
      this.size() && `size-${this.size()}`,
      this.shape() && `shape-${this.shape()}`,
      this.status() && `status-${this.status()}`,
    ].filter(Boolean),
  );
}
