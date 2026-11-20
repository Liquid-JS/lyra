import { computed, Directive, inject, input, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbChatCustomMessageService } from './chat-custom-message.service';

function throwCustomMessageTypeIsRequired(): never {
  throw new Error('[nbCustomMessage]: custom message type is required.');
}

/**
 * A template for the messages of a custom `type` in an `nb-chat`, declared before them, as a structural directive or
 * on an `ng-template`. It gets the message's `customMessageData` as `$implicit` and whether it's a reply as `isReply`:
 *
 * ```html
 * <div *nbCustomMessage="'my-custom-type'; let data">
 *   <!-- custom message -->
 * </div>
 * ```
 * or
 * ```html
 * <ng-template nbCustomMessage='my-custom-type' let-data>
 *   <!-- custom message -->
 * </ng-template>
 * ```
 */
@Directive({ selector: `[nbCustomMessage]` })
export class NbChatCustomMessageDirective implements OnInit, OnDestroy {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  protected readonly customMessageService = inject(NbChatCustomMessageService);

  /**
   * The message type the template renders.
   */
  readonly nbCustomMessage = input.required<string>();

  /**
   * Drops the message styles, such as the rounded corners, text colour and background, so a custom message can be
   * styled from the ground up.
   */
  readonly nbCustomMessageNoStyles = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * The custom message type.
   */
  readonly type = computed(() => this.nbCustomMessage());

  /**
   * Whether the message is rendered without the default message styles.
   */
  readonly noStyles = computed(() => this.nbCustomMessageNoStyles());

  ngOnInit() {
    const type = this.type();
    if (!type) {
      throwCustomMessageTypeIsRequired();
    }
    this.customMessageService.register(type, this);
  }

  ngOnDestroy() {
    this.customMessageService.unregister(this.type());
  }
}
