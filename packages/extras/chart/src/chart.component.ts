import {
    afterNextRender,
    afterRenderEffect,
    Component,
    DestroyRef,
    ElementRef,
    EnvironmentProviders,
    inject,
    input,
    InputSignal,
    makeEnvironmentProviders,
    provideEnvironmentInitializer,
    signal,
    untracked,
    viewChild,
    Signal,
    WritableSignal
} from '@angular/core'
import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    ChartComponentLike,
    ChartConfiguration,
    ChartData,
    ChartOptions,
    ChartType,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PieController,
    Plugin,
    PointElement,
    Tooltip
} from 'chart.js'
import { merge } from 'chart.js/helpers'
import { NbJSThemesRegistry, NbThemeService, NbThemeStyleChanges } from '@liquid-js/lyr-core'

import { NbChartColor, NbChartTheme, nbReadChartTheme } from './chart-theme'

/** What line charts need from chart.js, for `provideNbCharts`. */
export const NB_LINE_CHART_PARTS: ChartComponentLike[] = [
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler,
    Legend,
    Tooltip
]

/** What bar charts need from chart.js, for `provideNbCharts`. */
export const NB_BAR_CHART_PARTS: ChartComponentLike[] = [
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip
]

/** What pie and doughnut charts need from chart.js, for `provideNbCharts`. */
export const NB_PIE_CHART_PARTS: ChartComponentLike[] = [
    PieController,
    DoughnutController,
    ArcElement,
    Legend,
    Tooltip
]

/**
 * Registers the chart.js controllers, elements, scales and plugins an app's charts use, so the rest stays out of its
 * bundle; `provideNbCharts(...registerables)` registers all of them.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNbCharts(...NB_LINE_CHART_PARTS, ...NB_BAR_CHART_PARTS)],
 * });
 * ```
 */
export function provideNbCharts(...parts: ChartComponentLike[]): EnvironmentProviders {
    return makeEnvironmentProviders([provideEnvironmentInitializer(() => Chart.register(...parts))])
}

/** The statuses whose colours datasets without their own take, in order. */
export const NB_CHART_PALETTE: NbChartColor[] = ['primary', 'success', 'info', 'warning', 'danger']

const SLICED = new Set<string>(['pie', 'doughnut', 'polarArea'])
const LINED = new Set<string>(['line', 'radar'])
const CARTESIAN = new Set<string>(['line', 'bar', 'scatter', 'bubble'])

type Writable = Record<string, unknown>

/** The data, with the theme's colours on datasets that have none of their own. */
function themedData(type: string, data: ChartData, theme: NbChartTheme, palette: ReadonlyArray<NbChartColor>): ChartData {
    const color = (index: number) => theme.colorOf(palette[index % palette.length] ?? 'primary')
    const datasets = data.datasets.map((dataset, index) => {
        const own = dataset as unknown as Writable
        if (own['backgroundColor'] !== undefined || own['borderColor'] !== undefined) {
            return dataset
        }
        if (SLICED.has(type)) {
            return {
                ...dataset,
                backgroundColor: dataset.data.map((_, slice) => color(slice).color),
                borderColor: theme.surface
            }
        }
        const { color: main, tint } = color(index)
        return LINED.has(type)
            ? { ...dataset, borderColor: main, backgroundColor: tint, pointBackgroundColor: main }
            : { ...dataset, borderColor: main, backgroundColor: main }
    })
    return { ...data, datasets } as ChartData
}

/** The theme's text, grid, tooltip and font, under the chart's own options. */
function themedOptions(type: string, options: ChartOptions | undefined, theme: NbChartTheme): ChartOptions {
    const axis = { ticks: { color: theme.hint }, grid: { color: theme.grid }, border: { color: theme.grid } }
    const defaults: Writable = {
        color: theme.text,
        borderColor: theme.grid,
        font: { family: theme.fontFamily, size: theme.fontSize },
        plugins: {
            legend: { labels: { color: theme.text } },
            tooltip: {
                backgroundColor: theme.tooltipBackground,
                titleColor: theme.tooltipText,
                bodyColor: theme.tooltipText,
                footerColor: theme.tooltipText
            }
        }
    }
    if (CARTESIAN.has(type)) {
        defaults['scales'] = { x: axis, y: axis }
    } else if (type === 'radar' || type === 'polarArea') {
        defaults['scales'] = { r: { ...axis, angleLines: { color: theme.grid }, pointLabels: { color: theme.text } } }
    }
    return merge({}, [defaults, options ?? {}]) as ChartOptions
}

/**
 * A chart.js chart, in the theme's colours and font, which follows the theme and the content size as they change:
 *
 * ```html
 * <nb-chart type="bar" [data]="{ labels: months, datasets: [{ label: 'Orders', data: orders() }] }"
 *   aria-label="Orders per month" />
 * ```
 *
 * @stacked-example(Showcase, chart/chart-showcase.component)
 *
 * `type`, `data`, `options` and `plugins` are chart.js's, with its types, and the chart updates when they change.
 * Datasets without colours of their own get the colours of the statuses in `palette` (primary, success, info,
 * warning, danger); slices of a pie or doughnut each get one. Text, grid lines, tooltips and the font come from the
 * theme, under the chart's own options. `chart()` is the chart.js chart.
 *
 * Register the chart.js parts the app's charts use with `provideNbCharts`, e.g. `NB_LINE_CHART_PARTS`. A chart is
 * drawn on a canvas, which assistive technologies see as an image: name it, or describe what it shows, with
 * `aria-label`.
 *
 * For common charts, `nb-line-chart`, `nb-bar-chart` and `nb-pie-chart` take labels and series instead.
 *
 * ### Installation
 *
 * Install [`chart.js`](https://www.npmjs.com/package/chart.js), which draws the charts, and import `NbChartComponent`
 * from `@liquid-js/lyr-extras/chart`:
 *
 * ```bash
 * npm install chart.js
 * ```
 */
@Component({
    selector: 'nb-chart',
    template: '<canvas #canvas role="img" [attr.aria-label]="ariaLabel() ?? null"></canvas>',
    styles: `
    :host {
      display: block;
      position: relative;
    }

    canvas {
      display: block;
      max-width: 100%;
    }
  `
})
export class NbChartComponent<TType extends ChartType = ChartType> {
    /** The chart's type, e.g. `line`, `bar` or `pie`. */
    readonly type: InputSignal<TType> = input.required<TType>()

    /** The chart's labels and datasets. */
    readonly data: InputSignal<ChartData<TType>> = input.required<ChartData<TType>>()

    /** chart.js options, over the theme's. */
    readonly options: InputSignal<ChartOptions<TType> | undefined> = input<ChartOptions<TType>>()

    /** chart.js plugins of this chart only. */
    readonly plugins: InputSignal<Array<Plugin<TType>>> = input(new Array<Plugin<TType>>())

    /** The colours datasets without their own take, in order: statuses, or CSS colours (`NbChartColor`). */
    readonly palette = input<ReadonlyArray<NbChartColor>>(NB_CHART_PALETTE)

    /** Names the chart, or tells what it shows, for assistive technologies. */
    readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' })

    protected readonly drawn: WritableSignal<Chart<TType> | undefined> = signal<Chart<TType> | undefined>(undefined)
    /** The chart.js chart, once it's drawn. */
    readonly chart: Signal<Chart<TType> | undefined> = this.drawn.asReadonly()

    protected readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')

    constructor() {
        const host: HTMLElement = inject(ElementRef).nativeElement
        const themeService = inject(NbThemeService, { optional: true })
        const jsThemes = inject(NbJSThemesRegistry, { optional: true })
        // The theme's variables, which may change without another theme, e.g. as an app sets one.
        const themeStyle = inject(NbThemeStyleChanges).changes

        // Drawn in the browser only, once rendered with the theme in place, and again as the theme changes.
        afterRenderEffect(() => {
            const themeName = themeService?.theme()
            themeService?.contentSize()
            themeStyle()
            const type: string = this.type()
            const data = this.data() as ChartData
            const options = this.options() as ChartOptions | undefined
            const plugins = this.plugins() as Plugin[]
            const palette = this.palette()

            const theme = nbReadChartTheme(host, themeName && jsThemes?.has(themeName) ? jsThemes.get(themeName) : undefined)
            const config = {
                type,
                data: themedData(type, data, theme, palette),
                options: themedOptions(type, options, theme),
                plugins
            } as ChartConfiguration

            untracked(() => {
                let chart = this.chart() as Chart | undefined
                // chart.js can't change a chart's type in place.
                if (chart && (chart.config as ChartConfiguration).type !== type) {
                    chart.destroy()
                    chart = undefined
                }
                if (chart) {
                    chart.data = config.data
                    chart.options = config.options ?? {}
                    chart.update()
                } else {
                    this.drawn.set(new Chart(this.canvas().nativeElement, config) as unknown as Chart<TType>)
                }
            })
        })

        // chart.js fits a chart into its container's height, which is the chart's own, so a chart whose container widens,
        // as when a sidebar collapses, would keep its size; it's sized to the container's width as that changes.
        const destroyRef = inject(DestroyRef)
        afterNextRender(() => {
            if (typeof ResizeObserver === 'undefined') {
                return
            }
            let width = host.clientWidth
            const observer = new ResizeObserver(() => {
                if (host.clientWidth !== width) {
                    width = host.clientWidth
                    this.chart()?.resize()
                }
            })
            observer.observe(host)
            destroyRef.onDestroy(() => observer.disconnect())
        })

        destroyRef.onDestroy(() => this.chart()?.destroy())
    }
}
