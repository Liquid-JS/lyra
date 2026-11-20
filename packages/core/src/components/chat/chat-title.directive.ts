import { Directive, TemplateRef, inject, input } from '@angular/core';

/**
 * A template for the chat's title, in place of its `title` text: `<ng-template nbChatTitle [context]="..." let-data>`
 * in an `nb-chat`, which renders it with `context` as `$implicit`.
 */
@Directive({ selector: `[nbChatTitle]` })
export class NbChatTitleDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  /** The value the template gets as `$implicit`. */
  readonly context = input<object>({});
}
