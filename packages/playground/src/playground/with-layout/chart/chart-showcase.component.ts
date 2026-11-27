import { Component, computed, signal } from '@angular/core'
import { NbButtonModule, NbCardModule } from '@liquid-js/lyr-core'
import {
    NbBarChartComponent,
    NbChartComponent,
    NbChartSeries,
    NbLineChartComponent,
    NbPieChartComponent
} from '@liquid-js/lyr-extras/chart'

@Component({
    selector: 'nb-chart-showcase',
    templateUrl: './chart-showcase.component.html',
    styles: `
    .charts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      gap: 1.5rem;
    }

  `,
    imports: [
        NbCardModule,
        NbButtonModule,
        NbChartComponent,
        NbLineChartComponent,
        NbBarChartComponent,
        NbPieChartComponent
    ]
})
export class ChartShowcaseComponent {
    readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    readonly visits = signal([1200, 1900, 1700, 2400, 2100, 2900])
    readonly signups = signal([140, 210, 180, 260, 240, 330])

    readonly traffic = computed<NbChartSeries[]>(() => [
        { name: 'Visits', data: this.visits() },
        { name: 'Sign-ups', data: this.signups(), status: 'success' }
    ])

    readonly orders: NbChartSeries[] = [
        { name: 'Online', data: [42, 51, 47, 62, 58, 70] },
        { name: 'In store', data: [30, 28, 35, 33, 40, 38], status: 'info' }
    ]

    readonly invoices = [
        { label: 'Paid', value: 42, status: 'success' as const },
        { label: 'Due', value: 8, status: 'warning' as const },
        { label: 'Overdue', value: 3, status: 'danger' as const }
    ]

    /** A month more of made-up visits, to show the chart updating. */
    addMonth() {
        this.visits.update((visits) => [...visits.slice(1), Math.round(1500 + Math.random() * 1800)])
        this.signups.update((signups) => [...signups.slice(1), Math.round(150 + Math.random() * 200)])
    }
}
