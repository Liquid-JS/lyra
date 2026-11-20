import { Component, ElementRef, viewChild, signal } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TestBed, ComponentFixture, inject } from '@angular/core/testing'
import {
    NbLayoutScrollService,
    NbScrollPosition,
    NbLayoutModule,
    NbThemeService,
    NbThemeModule,
    NB_WINDOW
} from '@liquid-js/lyr-core'

let currentWindow: Window
let fixture: ComponentFixture<ScrollTestComponent>
let componentInstance: ScrollTestComponent
let scrollService: NbLayoutScrollService

@Component({
    template: `
    <nb-layout [withScroll]="localScroll()" #layout>
      <nb-layout-column>
        <div #resize></div>
      </nb-layout-column>
    </nb-layout>
  `,
    styles: [
        `
      ::ng-deep nb-layout.with-scroll .scrollable-container {
        overflow: auto;
        height: 100vh;
      }
    `
    ],
    imports: [NbLayoutModule, RouterModule]
})
class ScrollTestComponent {
    private readonly resizeElement = viewChild.required('resize', { read: ElementRef })
    private readonly layout = viewChild.required('layout', { read: ElementRef })
    readonly localScroll = signal(false)

    setSize(width: string, height: string) {
        const resizeElement = this.resizeElement()
        resizeElement.nativeElement.style.width = width
        resizeElement.nativeElement.style.height = height
    }

    useLocalScroll() {
        this.localScroll.set(true)
    }

    useGlobalScroll() {
        this.localScroll.set(false)
    }

    getScrollableElement() {
        return this.layout().nativeElement.querySelector('.scrollable-container')
    }
}

describe('NbScrollService', () => {
    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, ScrollTestComponent],
            providers: [NbLayoutScrollService, NbThemeService, { provide: APP_BASE_HREF, useValue: '/' }]
        }).createComponent(ScrollTestComponent)

        componentInstance = fixture.componentInstance

        fixture.detectChanges()
    })

    beforeEach(inject([NbLayoutScrollService, NB_WINDOW], (_scrollService: NbLayoutScrollService, _window: Window) => {
        scrollService = _scrollService
        currentWindow = _window
    }))

    afterEach(async () => {
        fixture.destroy()
        await fixture.whenStable()
        fixture.nativeElement.remove()
    })

    it('should get initial scroll position', () => new Promise<void>((done) => {
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(0)
            expect(pos.y).toEqual(0)
            done()
        })
    }))

    it('should get initial scroll position as nothing to scroll', () => new Promise<void>((done) => {
        currentWindow.scrollTo(10, 10)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(0)
            expect(pos.y).toEqual(0)
            done()
        })
    }))

    it('should get updated scroll position', () => new Promise<void>((done) => {
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        currentWindow.scrollTo(10, 10)
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(10)
            expect(pos.y).toEqual(10)
            done()
        })
    }))

    it('should get initial scroll position on scrollable', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        fixture.detectChanges()
        const scrollable = componentInstance.getScrollableElement()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(scrollable.scrollLeft)
            expect(pos.y).toEqual(scrollable.scrollTop)
            done()
        })
    }))

    it('should get updated scroll position on scrollable', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        const scrollable = componentInstance.getScrollableElement()
        scrollable.scrollTo(10, 10)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(10)
            expect(pos.y).toEqual(10)
            done()
        })
    }))

    it('should scroll using service', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(10, 10)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(10)
            expect(pos.y).toEqual(10)
            done()
        })
    }))

    it('should scroll using service (with default x)', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(undefined, 10)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(0)
            expect(pos.y).toEqual(10)
            done()
        })
    }))

    it('should scroll using service (with default y)', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(10, undefined)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(10)
            expect(pos.y).toEqual(0)
            done()
        })
    }))

    it('should scroll using service (keeping the current x)', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(10, 10)
        fixture.detectChanges()

        scrollService.scrollTo(undefined, 20)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(10)
            expect(pos.y).toEqual(20)
            done()
        })
    }))

    it('should scroll using service (keeping the current y)', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(10, 10)
        fixture.detectChanges()

        scrollService.scrollTo(20, undefined)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(20)
            expect(pos.y).toEqual(10)
            done()
        })
    }))

    it('should scroll using service back to 0,0', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(10, 10)
        fixture.detectChanges()

        scrollService.scrollTo(0, 0)
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(0)
            expect(pos.y).toEqual(0)
            done()
        })
    }))

    it('should scroll using service back (with default x,y)', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        scrollService.scrollTo(10, 10)
        fixture.detectChanges()

        scrollService.scrollTo()
        fixture.detectChanges()
        scrollService.getPosition().subscribe((pos: NbScrollPosition) => {
            expect(pos.x).toEqual(10)
            expect(pos.y).toEqual(10)
            done()
        })
    }))

    it('should listen to scroll', () => new Promise<void>((done) => {
        scrollService.onScroll().subscribe((event: any) => {
            expect(event).not.toBeNull()
            done()
        })

        currentWindow.dispatchEvent(new Event('scroll'))
    }))
})
