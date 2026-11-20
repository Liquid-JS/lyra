import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, TemplateRef } from '@angular/core';

import { NbStatusService } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbRenderableContainer } from '@liquid-js/lyr-core/cdk';
import { NbPosition } from '@liquid-js/lyr-core/cdk';
import { NbIconConfig, NbIconComponent } from '@liquid-js/lyr-core/icon';

/**
 * The bubble `nbTooltip` opens, with the directive's text or template and an optional icon.
 *
 * @styles
 *
 * tooltip-background-color:
 * tooltip-border-color:
 * tooltip-border-style:
 * tooltip-border-width:
 * tooltip-border-radius:
 * tooltip-padding:
 * tooltip-text-color:
 * tooltip-text-font-family:
 * tooltip-text-font-size:
 * tooltip-text-font-weight:
 * tooltip-text-line-height:
 * tooltip-icon-height:
 * tooltip-icon-width:
 * tooltip-max-width:
 * tooltip-basic-background-color:
 * tooltip-basic-border-color:
 * tooltip-basic-text-color:
 * tooltip-primary-background-color:
 * tooltip-primary-border-color:
 * tooltip-primary-text-color:
 * tooltip-info-background-color:
 * tooltip-info-border-color:
 * tooltip-info-text-color:
 * tooltip-success-background-color:
 * tooltip-success-border-color:
 * tooltip-success-text-color:
 * tooltip-warning-background-color:
 * tooltip-warning-border-color:
 * tooltip-warning-text-color:
 * tooltip-danger-background-color:
 * tooltip-danger-border-color:
 * tooltip-danger-text-color:
 * tooltip-control-background-color:
 * tooltip-control-border-color:
 * tooltip-control-text-color:
 * tooltip-shadow:
 */
@Component({
  selector: 'nb-tooltip',
  styleUrls: ['./tooltip.component.scss'],
  templateUrl: './tooltip.component.html',
  imports: [NgTemplateOutlet, NbIconComponent],
  host: {
    role: 'tooltip',
    '[id]': 'context()?.id',
    '[class]': 'binding()',
    'animate.enter': 'nb-tooltip-enter',
    'animate.leave': 'nb-tooltip-leave',
  },
})
export class NbTooltipComponent implements NbRenderableContainer {
  protected readonly statusService = inject(NbStatusService);

  readonly content = input<string | TemplateRef<unknown>>();

  protected readonly text = computed(() => {
    const content = this.content();
    return typeof content === 'string' ? content : undefined;
  });

  protected readonly template = computed(() => {
    const content = this.content();
    return content instanceof TemplateRef ? content : undefined;
  });

  /** The side of the host the tooltip is on, which places its arrow. */
  readonly position = input<NbPosition>(NbPosition.TOP);

  /** The directive's icon, status and template context, and the id its host is described by. */
  readonly context = input<{
    icon?: string | NbIconConfig;
    status?: NbComponentOrCustomStatus;
    templateContext?: unknown;
    id?: string;
  }>({});

  readonly statusClass = computed(() => {
    const status = this.context()?.status;
    return status ? this.statusService.getStatusClass(status) : '';
  });

  protected readonly binding = computed(() => `${this.position()} ${this.statusClass()}`);

  renderContent() {}
}
