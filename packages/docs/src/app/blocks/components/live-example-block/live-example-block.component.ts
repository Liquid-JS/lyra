import {
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    afterNextRender,
    afterRenderEffect,
    inject,
    input,
    output,
    signal,
    viewChild
} from '@angular/core'
import { Location } from '@angular/common'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { FormsModule } from '@angular/forms'
import { NbIconComponent } from '@liquid-js/lyr-core'
import { NgdAnalytics, NgdIframeCommunicatorService } from '../../../@theme/services'
import { NgdExampleView } from '../../enum.example-view'
import { NgdExampleContent } from '../../../docs.model'

@Component({
    selector: 'ngd-live-example-block',
    styleUrls: ['./live-example-block.component.scss'],
    templateUrl: './live-example-block.component.html',
    host: {
        '[class.theme-default]': 'currentTheme === "default"',
        '[class.theme-cosmic]': 'currentTheme === "cosmic"',
        '[class.theme-corporate]': 'currentTheme === "corporate"',
        '[class.theme-dark]': 'currentTheme === "dark"',
        '[class.theme-material-light]': 'currentTheme === "material-light"',
        '[class.theme-material-dark]': 'currentTheme === "material-dark"'
    },
    imports: [FormsModule, NbIconComponent]
})
export class NgdLiveExampleBlockComponent implements OnInit, OnDestroy {
    private readonly changeDetection = inject(ChangeDetectorRef)
    private readonly location = inject(Location)
    private readonly analytics = inject(NgdAnalytics)
    private readonly communicator = inject(NgdIframeCommunicatorService)
    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef)

    readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe')
    /**
     * Whether the example is near the viewport: each live example is the app in a frame, so a page's are opened as they
     * come into view, not all at once.
     */
    protected readonly inView = signal(false)
    readonly content = input.required<NgdExampleContent>()
    readonly hasViewSwitch = input<boolean>(false)
    readonly changeView = output<NgdExampleView>()

    iframeHeight = 0

    private destroy$ = new Subject<void>()

    themes: Array<{ label: string, value: string }> = [
        { label: 'Default', value: 'default' },
        { label: 'Dark', value: 'dark' },
        { label: 'Cosmic', value: 'cosmic' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Material light', value: 'material-light' },
        { label: 'Material dark', value: 'material-dark' }
    ]

    currentTheme = 'default'
    loading = true

    get url(): string {
        return this.location.prepareExternalUrl(`example/${this.content().id}`)
    }

    get iframeWindow(): Window | undefined {
        return this.iframe()?.nativeElement.contentWindow ?? undefined
    }

    constructor() {
    // Near the viewport, a screen's height ahead, so an example is ready by the time it's scrolled to. In the browser
    // only: a prerendered page has no frames, as they'd have nothing in them.
        afterNextRender(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        this.inView.set(true)
                        observer.disconnect()
                    }
                },
                { rootMargin: '100% 0px' }
            )
            observer.observe(this.element.nativeElement)
            this.destroy$.subscribe(() => observer.disconnect())
        })
        // The frame's address is set once it's there: not bound, as a binding would reload the frame on each change.
        afterRenderEffect(() => {
            const iframe = this.iframe()
            if (iframe && !iframe.nativeElement.src) {
                iframe.nativeElement.src = this.url
            }
        })
    }

    ngOnInit() {
        this.communicator.receive<{ height: number }>(this.content().id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((it) => {
                this.iframeHeight = it.height
                this.loading = false
                this.changeDetection.detectChanges()
            })
    }

    ngOnDestroy() {
        this.destroy$.next()
        this.destroy$.complete()
    }

    switchTheme(theme: string) {
        this.analytics.trackEvent('changeTheme', theme)
        const frame = this.iframeWindow
        if (frame) {
            this.communicator.send({ id: this.content().id, theme }, frame)
        }
    }

    switchToInlineVew() {
        this.changeView.emit(NgdExampleView.INLINE)
    }
}
