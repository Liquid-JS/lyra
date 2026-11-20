import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartData, ChartType } from 'chart.js';

import { NbThemeModule, NbThemeService } from '@liquid-js/lyr-core';
import {
  NB_BAR_CHART_PARTS,
  NB_LINE_CHART_PARTS,
  NB_PIE_CHART_PARTS,
  NbBarChartComponent,
  NbChartComponent,
  NbChartSeries,
  NbChartSlice,
  NbLineChartComponent,
  NbPieChartComponent,
  provideNbCharts,
} from '@liquid-js/lyr-extras/chart';

@Component({
  template: `
    <div [style.width]="width()">
      <nb-chart class="plain" [type]="type()" [data]="data()" aria-label="Orders per month" />
      <nb-line-chart class="line" area [labels]="['Jan', 'Feb']" [series]="series()" aria-label="Visits" />
      <nb-line-chart class="target" area [labels]="['Jan', 'Feb']" [series]="targetSeries" />
      <nb-bar-chart class="bar" horizontal stacked [labels]="['Jan', 'Feb']" [series]="series()" />
      <nb-pie-chart class="pie" doughnut [slices]="[{ label: 'Paid', value: 3, status: 'success' }, { label: 'Due', value: 1 }]" />
      <nb-pie-chart class="colours" style="--test-teal: #0e7490" [slices]="colourSlices" />
      <nb-pie-chart class="custom" style="--color-tertiary-default: rgb(10, 20, 30)" [slices]="customSlices" />
    </div>
  `,
  imports: [NbChartComponent, NbLineChartComponent, NbBarChartComponent, NbPieChartComponent],
})
class ChartHostComponent {
  // More slices than statuses: two with colours of their own, one a CSS variable where the chart is.
  readonly colourSlices: NbChartSlice[] = [
    { label: 'Groceries', value: 5, status: 'primary' },
    { label: 'Dining', value: 4, color: '#7c3aed' },
    { label: 'Transport', value: 3, color: 'var(--test-teal)' },
    { label: 'Utilities', value: 2 },
  ];
  // A custom status, whose colour the app's theme has.
  readonly customSlices: NbChartSlice[] = [{ label: 'Other', value: 1, status: 'tertiary' }];
  // A target to reach, as a dashed line without an area in a chart that has areas.
  readonly targetSeries: NbChartSeries[] = [
    { name: 'Visits', data: [10, 20] },
    { name: 'Target', data: [15, 15], status: 'basic', area: false, dashed: true },
  ];
  readonly width = signal('30rem');
  readonly type = signal<ChartType>('bar');
  readonly data = signal<ChartData>({
    labels: ['Jan', 'Feb'],
    datasets: [
      { label: 'Online', data: [4, 5] },
      { label: 'In store', data: [2, 3] },
      { label: 'Own colour', data: [1, 1], backgroundColor: '#123456' },
    ],
  });
  readonly series = signal<NbChartSeries[]>([
    { name: 'Visits', data: [10, 20] },
    { name: 'Sign-ups', data: [1, 2], status: 'danger' },
  ]);
}

describe('nb-chart', () => {
  let fixture: ComponentFixture<ChartHostComponent>;
  let host: ChartHostComponent;

  const chartOf = (selector: string) => {
    const element = fixture.nativeElement.querySelector(`${selector} nb-chart, nb-chart${selector}`) as HTMLElement;
    return (window as unknown as { ng: { getComponent: (el: Element) => NbChartComponent } }).ng
      .getComponent(element)
      .chart();
  };
  const typeOf = (selector: string) => (chartOf(selector)?.config as { type?: string } | undefined)?.type;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot({ name: 'default' }), ChartHostComponent],
      providers: [provideNbCharts(...NB_LINE_CHART_PARTS, ...NB_BAR_CHART_PARTS, ...NB_PIE_CHART_PARTS)],
    });
    fixture = TestBed.createComponent(ChartHostComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    await render();
  });

  afterEach(() => fixture.destroy());

  it('should draw on a canvas named for assistive technologies', () => {
    const canvas = fixture.nativeElement.querySelector('nb-chart.plain canvas') as HTMLCanvasElement;
    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Orders per month');
    expect(typeOf('.plain')).toBe('bar');
  });

  it('should give datasets without colours the theme\'s status colours, and keep their own', () => {
    const datasets = chartOf('.plain')?.data.datasets ?? [];
    // The default theme's primary and success, here from its JS theme.
    expect(datasets[0].backgroundColor).toBe('#3469d1');
    expect(datasets[1].backgroundColor).toBe('#03ce86');
    expect(datasets[2].backgroundColor).toBe('#123456');
    const options = chartOf('.plain')?.options as { plugins: { legend: { labels: { color: string } } } };
    expect(options.plugins.legend.labels.color).toBe('#1a2138');
  });

  it('should update with its data, and draw a new chart for a new type', async () => {
    const first = chartOf('.plain');
    host.data.update((data) => ({ ...data, datasets: [{ label: 'Online', data: [9, 9] }] }));
    await render();
    expect(chartOf('.plain')).toBe(first);
    expect(chartOf('.plain')?.data.datasets[0].data).toEqual([9, 9]);

    host.type.set('line');
    await render();
    expect(chartOf('.plain')).not.toBe(first);
    expect(typeOf('.plain')).toBe('line');
    // A line takes the colour, with a tint under it.
    expect(chartOf('.plain')?.data.datasets[0].borderColor).toBe('#3469d1');
    expect(chartOf('.plain')?.data.datasets[0].backgroundColor).toBe('rgba(52, 105, 209, 0.16)');
  });

  it('should grow and shrink with its container', async () => {
    const canvas = () => fixture.nativeElement.querySelector('nb-chart.plain canvas') as HTMLCanvasElement;
    const frames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const narrow = canvas().getBoundingClientRect().width;
    // chart.js alone wouldn't grow it: it keeps a chart within its container's height, which is the chart's own.
    host.width.set('40rem');
    await render();
    await frames();
    expect(canvas().getBoundingClientRect().width).toBeCloseTo((narrow * 40) / 30, -1);
    host.width.set('30rem');
    await render();
    await frames();
    expect(canvas().getBoundingClientRect().width).toBeCloseTo(narrow, -1);
  });

  it('should draw series and slices in colours of their own, a CSS variable as its value where the chart is', () => {
    const pie = chartOf('.colours');
    // The first free status after the ones taken, primary here, is success.
    expect(pie?.data.datasets[0].backgroundColor).toEqual(['#3469d1', '#7c3aed', '#0e7490', '#03ce86']);
  });

  it('should follow the theme as it changes', async () => {
    TestBed.inject(NbThemeService).changeTheme('dark');
    await render();
    const options = chartOf('.plain')?.options as { plugins: { legend: { labels: { color: string } } } };
    // The dark theme's text.
    expect(options.plugins.legend.labels.color).toBe('#ffffff');
  });

  it('should follow the theme\'s variables as an app changes them, and draw tooltips as the theme\'s', async () => {
    const tooltip = () =>
      (chartOf('.plain')?.options as { plugins: { tooltip: { backgroundColor: string; bodyColor: string } } }).plugins
        .tooltip;
    document.body.style.setProperty('--text-basic-color', 'rgb(1, 2, 3)');
    document.body.style.setProperty('--tooltip-background-color', 'rgb(4, 5, 6)');
    document.body.style.setProperty('--tooltip-text-color', 'rgb(7, 8, 9)');
    try {
      await expect
        .poll(async () => {
          await render();
          return (chartOf('.plain')?.options as { plugins: { legend: { labels: { color: string } } } }).plugins.legend
            .labels.color;
        })
        .toBe('rgb(1, 2, 3)');
      expect(tooltip().backgroundColor).toBe('rgb(4, 5, 6)');
      expect(tooltip().bodyColor).toBe('rgb(7, 8, 9)');
    } finally {
      ['--text-basic-color', '--tooltip-background-color', '--tooltip-text-color'].forEach((name) =>
        document.body.style.removeProperty(name),
      );
    }
  });

  it('should draw a custom status in its theme colour', () => {
    expect(chartOf('.custom')?.data.datasets[0].backgroundColor).toEqual(['rgb(10, 20, 30)']);
  });

  it('should make line, bar and pie charts of series and slices, in their statuses\' colours', () => {
    const line = chartOf('.line');
    expect(typeOf('.line')).toBe('line');
    expect(line?.data.labels).toEqual(['Jan', 'Feb']);
    expect(line?.data.datasets.map((dataset) => [dataset.label, dataset.borderColor])).toEqual([
      ['Visits', '#3469d1'],
      ['Sign-ups', '#ff3d71'],
    ]);
    expect((line?.data.datasets[0] as { fill?: unknown }).fill).toBe('origin');

    // A series without an area of its own, in basic's colour: the hint's, as a line can be seen in it.
    const target = chartOf('.target')?.data.datasets ?? [];
    expect(target.map((dataset) => (dataset as { fill?: unknown }).fill)).toEqual(['origin', false]);
    expect(target[1].borderColor).toBe('#8f9bb3');
    expect(target[1]).toEqual(expect.objectContaining({ borderDash: [6, 4], pointRadius: 0 }));

    const bar = chartOf('.bar');
    expect(bar?.options.indexAxis).toBe('y');
    expect((bar?.options.scales?.['x'] as { stacked?: boolean }).stacked).toBe(true);

    const pie = chartOf('.pie');
    expect(typeOf('.pie')).toBe('doughnut');
    // Each slice in its status's colour: its own, or the next of the palette that no other slice has.
    expect(pie?.data.datasets[0].backgroundColor).toEqual(['#03ce86', '#3469d1']);
  });
});
