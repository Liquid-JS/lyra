import { Component, input } from '@angular/core'

/**
 * An app drawn in the theme's colours, in place of a screenshot: a window with a sidebar, a chart and a list. The
 * `chart` variant leads with the chart, the `list` one with the list.
 */
@Component({
    selector: 'npg-site-mockup',
    template: `
    <div class="window" [class.list-first]="variant() === 'list'" aria-hidden="true">
      <div class="bar"><span></span><span></span><span></span></div>
      <div class="body">
        <div class="side">
          @for (item of [1, 2, 3, 4, 5]; track item) {
            <span class="nav" [class.active]="item === 2"></span>
          }
        </div>
        <div class="main">
          <div class="chart">
            @for (height of bars; track $index) {
              <span [style.height.%]="height" [class.alt]="$index % 2 === 1"></span>
            }
          </div>
          <div class="rows">
            @for (row of [1, 2, 3]; track row) {
              <div class="row"><span class="dot"></span><span class="line"></span><span class="tag"></span></div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./site-mockup.component.scss']
})
export class SiteMockupComponent {
    readonly variant = input<'chart' | 'list'>('chart')
    readonly bars = [45, 70, 55, 85, 60, 95, 75, 65, 90, 50]
}
