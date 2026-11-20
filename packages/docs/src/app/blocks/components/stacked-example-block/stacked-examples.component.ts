import { Component, inject, input } from '@angular/core';

import { NgdExampleView } from '../../enum.example-view';
import { NgdAnalytics } from '../../../@theme/services';
import { NgdLiveExampleBlockComponent } from '../live-example-block/live-example-block.component';
import { NgdTabbedExampleBlockComponent } from '../tabbed-example-block/tabbed-example-block.component';
import { NgdExampleContent } from '../../../docs.model';

@Component({
  selector: 'ngd-stacked-example-block',
  templateUrl: './stacked-examples.component.html',
  styles: [
    `
      @keyframes ngd-example-pulse-a {
        50% {
          transform: scale3d(1.02, 1.02, 1.02);
        }
      }
      @keyframes ngd-example-pulse-b {
        50% {
          transform: scale3d(1.02, 1.02, 1.02);
        }
      }
      .pulse-a {
        animation: ngd-example-pulse-a 0.5s;
      }
      .pulse-b {
        animation: ngd-example-pulse-b 0.5s;
      }
    `,
  ],
  imports: [NgdLiveExampleBlockComponent, NgdTabbedExampleBlockComponent],
})
export class NgdStackedExampleComponent {
  private readonly analytics = inject(NgdAnalytics);

  readonly content = input.required<NgdExampleContent>();
  isLive = true;
  /** Alternates between two identical keyframe animations so each view switch restarts the pulse. */
  pulse: 0 | 1 | 2 = 0;

  changeView(view: NgdExampleView) {
    this.analytics.trackEvent('changeExampleView', view);
    this.isLive = view === NgdExampleView.LIVE;
    this.pulse = this.pulse === 1 ? 2 : 1;
  }
}
