import { booleanAttribute, Component, computed, input, Signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core';

import { NB_CHART_PALETTE, NbChartComponent } from './chart.component';
import { NbChartColor } from './chart-theme';

/**
 * A series of a line or bar chart: its name, a value per label, and optionally the status whose colour it takes, or a
 * colour of its own.
 */
export interface NbChartSeries {
  name: string;
  /** A value per label; `null` leaves a gap, as Chart.js draws it. */
  data: readonly (number | null)[];
  status?: NbComponentOrCustomStatus;
  /** A colour of its own, over its status's, e.g. for more series than there are statuses. */
  color?: NbChartColor;
  /** In a line chart, whether the area under this line is filled, over the chart's `area`, e.g. not for a target. */
  area?: boolean;
  /** In a line chart, draws this line dashed and without points, e.g. for a target or a budget. */
  dashed?: boolean;
}

/**
 * A slice of a pie chart: its label, value, and optionally the status whose colour it takes, or a colour of its own.
 */
export interface NbChartSlice {
  label: string;
  value: number;
  status?: NbComponentOrCustomStatus;
  /** A colour of its own, over its status's, e.g. for more slices than there are statuses. */
  color?: NbChartColor;
}

/** The items' colours: their own, their status's, or the next of the palette that no other item has. */
function colorsOf(items: readonly { status?: NbComponentOrCustomStatus; color?: NbChartColor }[]): NbChartColor[] {
  const taken = new Set(items.map((item) => item.color ?? item.status).filter((color) => color !== undefined));
  const free = NB_CHART_PALETTE.filter((color) => !taken.has(color));
  const palette = free.length ? free : NB_CHART_PALETTE;
  let next = 0;
  return items.map((item) => item.color ?? item.status ?? palette[next++ % palette.length]);
}

/**
 * A line chart of series over labels, in the theme's colours; register `NB_LINE_CHART_PARTS`.
 *
 * ```html
 * <nb-line-chart [labels]="months" [series]="[{ name: 'Visits', data: visits() }]" aria-label="Visits per month" />
 * ```
 */
@Component({
  selector: 'nb-line-chart',
  template: `<nb-chart type="line" [data]="data()" [options]="options()" [palette]="palette()" [aria-label]="ariaLabel()" />`,
  styles: ':host { display: block; }',
  imports: [NbChartComponent],
})
export class NbLineChartComponent {
  readonly labels = input<readonly (string | number)[]>([]);
  readonly series = input<readonly NbChartSeries[]>([]);

  /** Fills the area under each line. */
  readonly area = input(false, { transform: booleanAttribute });

  /** Curves the lines between points. */
  readonly smooth = input(false, { transform: booleanAttribute });

  /** Names the chart, or tells what it shows, for assistive technologies. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  protected readonly palette = computed(() => colorsOf(this.series()));

  protected readonly data: Signal<ChartData<'line'>> = computed(() => ({
    labels: [...this.labels()],
    datasets: this.series().map((series) => ({
      label: series.name,
      data: [...series.data],
      fill: (series.area ?? this.area()) ? 'origin' : false,
      tension: this.smooth() ? 0.4 : 0,
      ...(series.dashed ? { borderDash: [6, 4], borderWidth: 2, pointRadius: 0, pointHoverRadius: 0 } : {}),
    })),
  }));

  protected readonly options: Signal<ChartOptions<'line'>> = computed(() => ({
    plugins: { legend: { display: this.series().length > 1 } },
  }));
}

/**
 * A bar chart of series over labels, in the theme's colours; register `NB_BAR_CHART_PARTS`.
 *
 * ```html
 * <nb-bar-chart [labels]="months" [series]="[{ name: 'Orders', data: orders() }]" aria-label="Orders per month" />
 * ```
 */
@Component({
  selector: 'nb-bar-chart',
  template: `<nb-chart type="bar" [data]="data()" [options]="options()" [palette]="palette()" [aria-label]="ariaLabel()" />`,
  styles: ':host { display: block; }',
  imports: [NbChartComponent],
})
export class NbBarChartComponent {
  readonly labels = input<readonly (string | number)[]>([]);
  readonly series = input<readonly NbChartSeries[]>([]);

  /** Bars across, with the labels down the side. */
  readonly horizontal = input(false, { transform: booleanAttribute });

  /** The series' bars on top of each other. */
  readonly stacked = input(false, { transform: booleanAttribute });

  /** Names the chart, or tells what it shows, for assistive technologies. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  protected readonly palette = computed(() => colorsOf(this.series()));

  protected readonly data: Signal<ChartData<'bar'>> = computed(() => ({
    labels: [...this.labels()],
    datasets: this.series().map((series) => ({ label: series.name, data: [...series.data] })),
  }));

  protected readonly options: Signal<ChartOptions<'bar'>> = computed(() => ({
    indexAxis: this.horizontal() ? 'y' : 'x',
    scales: { x: { stacked: this.stacked() }, y: { stacked: this.stacked() } },
    plugins: { legend: { display: this.series().length > 1 } },
  }));
}

/**
 * A pie, or with `doughnut` a doughnut, of slices in the theme's colours; register `NB_PIE_CHART_PARTS`.
 *
 * ```html
 * <nb-pie-chart doughnut [slices]="[{ label: 'Paid', value: 42 }, { label: 'Due', value: 8 }]" aria-label="Invoices" />
 * ```
 */
@Component({
  selector: 'nb-pie-chart',
  template: `
    <nb-chart
      [type]="doughnut() ? 'doughnut' : 'pie'"
      [data]="data()"
      [options]="options"
      [palette]="palette()"
      [aria-label]="ariaLabel()"
    />
  `,
  styles: ':host { display: block; }',
  imports: [NbChartComponent],
})
export class NbPieChartComponent {
  readonly slices = input<readonly NbChartSlice[]>([]);

  /** A ring rather than a pie. */
  readonly doughnut = input(false, { transform: booleanAttribute });

  /** Names the chart, or tells what it shows, for assistive technologies. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  protected readonly palette = computed(() => colorsOf(this.slices()));

  // Wider than tall, with the legend beside it, so it sits in a card as the other charts do.
  protected readonly options: ChartOptions<'pie' | 'doughnut'> = {
    aspectRatio: 2,
    plugins: { legend: { position: 'right' } },
  };

  protected readonly data: Signal<ChartData<'pie' | 'doughnut'>> = computed(() => ({
    labels: this.slices().map((slice) => slice.label),
    datasets: [{ data: this.slices().map((slice) => slice.value) }],
  }));
}
