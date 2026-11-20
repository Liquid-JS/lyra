import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  AnimationCallbackEvent,
  Component,
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  isDevMode,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';

import { NbValidationDirective } from './validation.directive';
import type { NbValidationError } from '@liquid-js/lyr-core/base';
import { injectNbValidationMessage } from './validation-messages';

/** A message's height and opacity, as it shows or where it's going. */
interface NbMessageShape {
  height: number;
  opacity: number;
}

/** A message's height animation, with where it goes from and to. */
interface NbMessageAnimation {
  animation: Animation;
  from: NbMessageShape;
  to: NbMessageShape;
}

const CLOSED: NbMessageShape = { height: 0, opacity: 0 };

/** How messages open and close. */
const MESSAGE_TRANSITION: KeyframeAnimationOptions = { duration: 200, easing: 'ease' };

function motionAllowed(element: HTMLElement) {
  return (
    typeof element.animate === 'function' &&
    typeof matchMedia === 'function' &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

let lastValidationErrorsId = 0;

/**
 * A message for one error kind of a `nb-validation-errors`, in place of the app-wide one.
 * The template gets the error as its context.
 *
 * ```html
 * <ng-template nbValidationError="minlength" let-error>
 *   At least {{ requiredLength(error) }} characters, please
 * </ng-template>
 * ```
 *
 * ```ts
 * protected readonly requiredLength = (error: NbValidationError) => nbValidationParam(error, 'requiredLength');
 * ```
 */
@Directive({
  selector: 'ng-template[nbValidationError]',
})
export class NbValidationErrorDirective {
  readonly template = inject<TemplateRef<{ $implicit: NbValidationError }>>(TemplateRef);

  /**
   * The error kind this message is for.
   */
  readonly kind = input.required<string>({ alias: 'nbValidationError' });

  static ngTemplateContextGuard(
    _dir: NbValidationErrorDirective,
    _ctx: unknown,
  ): _ctx is { $implicit: NbValidationError } {
    return true;
  }
}

/**
 * Shows the errors of a control with `nbValidation` once they should show, and describes the control with them
 * (`aria-describedby`). New errors are announced to screen readers.
 *
 * ```html
 * <input nbInput formControlName="password" nbValidation #password="nbValidation" />
 * <nb-validation-errors [for]="password" />
 * ```
 *
 * @stacked-example(Showcase, validation/validation-showcase.component)
 *
 * `nbLabel` labels the field, and marks it while it's required, see `NbLabelComponent`:
 *
 * ```html
 * <label nbLabel [for]="password">Password</label>
 * ```
 *
 * Its content is the field's helper text, which shows while the field shows no errors and gives way to them; it
 * describes the field too, and can have markup such as links. Errors and the helper text open and close smoothly as
 * they change, whatever their content and length, unless the user prefers reduced motion:
 *
 * ```html
 * <nb-validation-errors [for]="password">At least 8 characters.</nb-validation-errors>
 * ```
 *
 * It shows one error of each kind. Each takes its message from, in order: a `nbValidationError` template for its
 * kind, the message a signal forms rule gave, the messages set with `provideNbValidation`, the texts set with
 * `provideNbTexts({ validation })`, and the message the error's value carries, e.g.
 * `{ iban: { message: 'Enter a valid IBAN' } }`. Lyra has English messages for Angular's built-in validators and its
 * own controls; provide your own to translate them or to add messages for custom validators. Lyra's controls put the
 * same message in their errors' values, `{ kind, message, …data }`.
 *
 * @stacked-example(Messages, validation/validation-messages.component)
 *
 * To show errors your own way, the `nbValidationErrors` pipe lists a control's errors the same for all forms, also
 * the ones signal forms wrap, and `nbValidationMessage` gives an error's message as above; in code,
 * `toNbValidationErrors()` and `injectNbValidationMessage()` do the same:
 *
 * ```html
 * @for (error of field().errors() | nbValidationErrors; track error.kind) {
 *   <mat-error>{{ error | nbValidationMessage }}</mat-error>
 * }
 * ```
 *
 * The same works with template-driven and signal forms:
 *
 * @stacked-example(Template-driven forms, validation/validation-template-driven.component)
 * @stacked-example(Signal forms, validation/validation-signal-forms.component)
 *
 * Errors of the form group, such as a password confirmation mismatch, show on a control listed with
 * `nbValidationGroupErrors`. `nbValidationTrigger` sets when errors show, and `nbValidationSuccess` marks valid
 * changed controls with the `success` status:
 *
 * @stacked-example(Group errors and triggers, validation/validation-group.component)
 *
 * @styles
 *
 * validation-errors-text-color:
 * validation-errors-text-font-family:
 * validation-errors-text-font-size:
 * validation-errors-text-font-weight:
 * validation-errors-text-line-height:
 * validation-errors-margin:
 * validation-helper-text-color:
 * validation-helper-margin:
 */
@Component({
  selector: 'nb-validation-errors',
  styleUrls: ['./validation-errors.component.scss'],
  template: `
    <!-- Only errors are announced, not the helper text that comes back when they're gone. -->
    <div class="validation-errors" aria-live="polite">
      @for (shown of shownErrors(); track shown.error.kind) {
        <!-- Each message opens and closes its height, so the field's surroundings move smoothly. -->
        <div
          class="validation-error"
          (animate.enter)="opened($event, shown.error.kind)"
          (animate.leave)="closed($event, shown.error.kind)"
        >
          <div class="validation-text">
            @if (shown.template; as template) {
              <ng-container *ngTemplateOutlet="template; context: { $implicit: shown.error }" />
            } @else {
              {{ shown.message }}
            }
          </div>
        </div>
      }
    </div>
    <!-- Closed while errors show, which also leaves it out of the field's description. -->
    <div #helper class="validation-helper"><div class="validation-text"><ng-content /></div></div>
  `,
  imports: [NgTemplateOutlet],
  host: {
    '[id]': 'id',
  },
})
export class NbValidationErrorsComponent {
  protected readonly resolveMessage = injectNbValidationMessage();

  readonly id = `nb-validation-errors-${lastValidationErrorsId++}`;

  /**
   * The control to show the errors of: the `nbValidation` directive on it.
   */
  readonly for = input.required<NbValidationDirective>();

  protected readonly templates = contentChildren(NbValidationErrorDirective);

  protected readonly shownErrors = computed(() => {
    const validation = this.for();
    if (!validation.showErrors()) {
      return [];
    }
    const templates = this.templates();
    // One error of each kind, which nbValidation gives.
    return validation.errors().map((error) => {
      const template = templates.find((candidate) => candidate.kind() === error.kind)?.template;
      return { error, template, message: template ? '' : this.message(error) };
    });
  });

  protected readonly injector = inject(Injector);
  protected readonly helper = viewChild.required<ElementRef<HTMLElement>>('helper');
  protected readonly helperShown = computed(() => this.shownErrors().length === 0);
  /** The height animations running, by element, with where they go from and to. */
  protected readonly running = new Map<HTMLElement, NbMessageAnimation>();
  /** Errors that came in and open next, from where they start. */
  protected readonly opening = new Map<HTMLElement, NbMessageShape>();
  /** Errors on their way out, with their kind and what removes them. */
  protected readonly closing = new Map<HTMLElement, { kind: string; done: () => void }>();
  protected helperWasShown?: boolean;

  constructor() {
    effect((onCleanup) => {
      const validation = this.for();
      validation.addDescription(this.id);
      onCleanup(() => validation.removeDescription(this.id));
    });
    afterRenderEffect(() => {
      const helperShown = this.helperShown();
      untracked(() => this.settle(helperShown));
    });
  }

  /**
   * An error came in: it opens from nothing, or, when the error of its kind is still closing, from where that one is,
   * which it replaces, so a change back doesn't jump.
   * @internal
   */
  opened(event: AnimationCallbackEvent, kind: string) {
    const element = event.target as HTMLElement;
    event.animationComplete();
    if (!motionAllowed(element)) {
      return;
    }
    let start: NbMessageShape = { height: 0, opacity: 0 };
    for (const [other, closing] of this.closing) {
      if (closing.kind === kind) {
        // Angular may have removed it already, so where it is comes from its animation.
        start = this.shape(other);
        this.running.get(other)?.animation.cancel();
        this.running.delete(other);
        this.closing.delete(other);
        closing.done();
        break;
      }
    }
    // It stays where it starts until everything moves together, after this render.
    Object.assign(element.style, { height: `${start.height}px`, opacity: `${start.opacity}`, overflow: 'hidden' });
    this.opening.set(element, start);
    afterNextRender(() => this.settle(this.helperShown()), { injector: this.injector });
  }

  /**
   * An error went: it closes, then it's removed.
   * @internal
   */
  closed(event: AnimationCallbackEvent, kind: string) {
    const element = event.target as HTMLElement;
    this.opening.delete(element);
    if (!motionAllowed(element)) {
      event.animationComplete();
      return;
    }
    this.closing.set(element, { kind, done: () => event.animationComplete() });
    this.move(element, this.shape(element), CLOSED);
  }

  /**
   * Moves every message from where it is to where it goes, all at once and alike, so together they change height
   * steadily, also when a change comes while others still run.
   */
  protected settle(helperShown: boolean) {
    const helper = this.helper().nativeElement;
    const first = this.helperWasShown === undefined;
    const helperChanged = !first && this.helperWasShown !== helperShown;
    this.helperWasShown = helperShown;

    if (first || !motionAllowed(helper)) {
      helper.classList.toggle('validation-collapsed', !helperShown);
      this.opening.forEach((_, element) => this.release(element));
      this.opening.clear();
      return;
    }

    // What moves: the messages that change now, and the ones still on their way, unless Angular removed them; those
    // finish where they are, or an error of their kind takes over from them.
    const moving = new Set<HTMLElement>(
      [...this.opening.keys(), ...this.closing.keys(), ...this.running.keys()].filter((element) => element.isConnected),
    );
    if (helperChanged) {
      moving.add(helper);
    }
    if (!moving.size) {
      return;
    }

    // Where each is, before anything changes.
    const moves = [...moving].map((element) => ({ element, from: this.shape(element) }));
    // The new state, without the animations.
    moving.forEach((element) => {
      this.running.get(element)?.animation.cancel();
      this.running.delete(element);
      this.release(element);
    });
    helper.classList.toggle('validation-collapsed', !helperShown);
    this.opening.clear();
    // Where each goes, measured before any moves.
    const targets = moves.map(({ element, from }) => {
      const open = element === helper ? helperShown : !this.closing.has(element);
      const to = open ? { height: element.getBoundingClientRect().height, opacity: 1 } : CLOSED;
      return { element, from, to };
    });
    targets.forEach(({ element, from, to }) => this.move(element, from, to));
  }

  /** Lets an opening error take its own height again. */
  protected release(element: HTMLElement) {
    element.style.removeProperty('height');
    element.style.removeProperty('opacity');
    element.style.removeProperty('overflow');
  }

  /**
   * A message's height and opacity as it shows now: while it moves, from its animation, which also works once Angular
   * removed it from the page.
   */
  protected shape(element: HTMLElement): NbMessageShape {
    const running = this.running.get(element);
    if (running) {
      const progress = running.animation.effect?.getComputedTiming().progress ?? 0;
      const between = (from: number, to: number) => from + (to - from) * progress;
      return {
        height: between(running.from.height, running.to.height),
        opacity: between(running.from.opacity, running.to.opacity),
      };
    }
    return { height: element.getBoundingClientRect().height, opacity: Number(getComputedStyle(element).opacity) };
  }

  protected move(element: HTMLElement, from: NbMessageShape, to: NbMessageShape) {
    this.running.get(element)?.animation.cancel();
    // Content is clipped while the height changes; a closing message stays visible until it's closed.
    const frame = (shape: NbMessageShape): Keyframe => ({
      height: `${shape.height}px`,
      opacity: shape.opacity,
      overflow: 'hidden',
      visibility: 'visible',
    });
    const closing = this.closing.get(element);
    const animation = element.animate([frame(from), frame(to)], {
      ...MESSAGE_TRANSITION,
      // A closing error stays closed until it's removed.
      fill: closing ? 'forwards' : 'none',
    });
    this.running.set(element, { animation, from, to });
    animation.onfinish = () => {
      if (this.running.get(element)?.animation !== animation) {
        return;
      }
      this.running.delete(element);
      const ended = this.closing.get(element);
      if (ended) {
        this.closing.delete(element);
        ended.done();
      }
    };
  }

  protected message(error: NbValidationError): string {
    const message = this.resolveMessage(error);
    if (!message && isDevMode()) {
      console.warn(`nb-validation-errors: no message for the "${error.kind}" error; add one with provideNbValidation.`);
    }
    return message;
  }
}
