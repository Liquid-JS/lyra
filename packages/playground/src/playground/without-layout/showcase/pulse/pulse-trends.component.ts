import { Component, computed, signal } from '@angular/core'
import {
    NbButtonGroupComponent,
    NbButtonToggleDirective,
    NbCardBodyComponent,
    NbCardComponent,
    NbCardHeaderComponent,
    NbIconComponent,
    NbListComponent,
    NbListItemComponent
} from '@liquid-js/lyr-core'
import { NbBarChartComponent, NbChartSeries, NbLineChartComponent } from '@liquid-js/lyr-extras/chart'

import { PULSE_BESTS, PULSE_PERIODS } from './pulse-data'

type PulsePeriodName = keyof typeof PULSE_PERIODS

/** How things are going: the week's or month's figures against the one before, the charts behind them, and the bests. */
@Component({
    selector: 'npg-pulse-trends',
    templateUrl: './pulse-trends.component.html',
    styleUrls: ['./pulse-screen.scss', './pulse-trends.component.scss'],
    imports: [
        NbBarChartComponent,
        NbButtonGroupComponent,
        NbButtonToggleDirective,
        NbCardBodyComponent,
        NbCardComponent,
        NbCardHeaderComponent,
        NbIconComponent,
        NbLineChartComponent,
        NbListComponent,
        NbListItemComponent
    ]
})
export class PulseTrendsComponent {
    readonly periods: PulsePeriodName[] = ['week', 'month']
    readonly period = signal<PulsePeriodName>('week')
    readonly data = computed(() => PULSE_PERIODS[this.period()])
    readonly steps = computed<NbChartSeries[]>(() => [{ name: 'Steps', data: this.data().steps, status: 'primary' }])
    readonly heartRate = computed<NbChartSeries[]>(() => [
        { name: 'Resting heart rate', data: this.data().heartRate, status: 'danger' }
    ])
    readonly bests = PULSE_BESTS

    pick(value: unknown) {
        if (value === 'week' || value === 'month') {
            this.period.set(value)
        }
    }
}
