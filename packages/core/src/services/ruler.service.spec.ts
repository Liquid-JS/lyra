import { Component, ElementRef, viewChild, signal } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TestBed, ComponentFixture, inject } from '@angular/core/testing'
import {
    NbLayoutRulerService,
    NbLayoutDimensions,
    NbLayoutModule,
    NbThemeService,
    NbThemeModule,
    NB_DOCUMENT
} from '@liquid-js/lyr-core'

let currentDocument: Document
let fixture: ComponentFixture<RulerTestComponent>
let componentInstance: RulerTestComponent
let rulerService: NbLayoutRulerService

@Component({
    template: `
    <nb-layout [withScroll]="localScroll()" #layout>
      <nb-layout-column>
        <div #resize></div>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule]
})
class RulerTestComponent {
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

// This is rather a smoke test
describe('NbLayoutRulerService', () => {
    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, RulerTestComponent],
            providers: [NbLayoutRulerService, NbThemeService, { provide: APP_BASE_HREF, useValue: '/' }]
        }).createComponent(RulerTestComponent)

        componentInstance = fixture.componentInstance

        fixture.detectChanges()
    })

    beforeEach(inject([NbLayoutRulerService, NB_DOCUMENT], (_rulerService: NbLayoutRulerService, _document: Document) => {
        rulerService = _rulerService
        currentDocument = _document
    }))

    afterEach(async () => {
        fixture.destroy()
        await fixture.whenStable()
        fixture.nativeElement.remove()
    })

    it('should get dimensions from document', () => new Promise<void>((done) => {
        fixture.detectChanges()
        rulerService.getDimensions().subscribe((size: NbLayoutDimensions) => {
            expect(size.clientHeight).toEqual(currentDocument.documentElement.clientHeight)
            expect(size.clientWidth).toEqual(currentDocument.documentElement.clientWidth)
            expect(size.scrollHeight).toEqual(currentDocument.documentElement.scrollHeight)
            expect(size.scrollWidth).toEqual(currentDocument.documentElement.scrollWidth)
            done()
        })
    }))

    it('should get dimensions from document when scrolls', () => new Promise<void>((done) => {
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        rulerService.getDimensions().subscribe((size: NbLayoutDimensions) => {
            expect(size.clientHeight).toEqual(currentDocument.documentElement.clientHeight)
            expect(size.clientWidth).toEqual(currentDocument.documentElement.clientWidth)
            expect(size.scrollHeight).toEqual(currentDocument.documentElement.scrollHeight)
            expect(size.scrollWidth).toEqual(currentDocument.documentElement.scrollWidth)
            done()
        })
    }))

    it('should get dimensions from scrollable', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        fixture.detectChanges()
        const scrollable = componentInstance.getScrollableElement()
        rulerService.getDimensions().subscribe((size: NbLayoutDimensions) => {
            expect(size.clientHeight).toEqual(scrollable.clientHeight)
            expect(size.clientWidth).toEqual(scrollable.clientWidth)
            expect(size.scrollHeight).toEqual(scrollable.scrollHeight)
            expect(size.scrollWidth).toEqual(scrollable.scrollWidth)
            done()
        })
    }))

    it('should get dimensions from scrollable when scrolls', () => new Promise<void>((done) => {
        componentInstance.useLocalScroll()
        componentInstance.setSize('10000px', '10000px')
        fixture.detectChanges()
        const scrollable = componentInstance.getScrollableElement()
        rulerService.getDimensions().subscribe((size: NbLayoutDimensions) => {
            expect(size.clientHeight).toEqual(scrollable.clientHeight)
            expect(size.clientWidth).toEqual(scrollable.clientWidth)
            expect(size.scrollHeight).toEqual(scrollable.scrollHeight)
            expect(size.scrollWidth).toEqual(scrollable.scrollWidth)
            done()
        })
    }))
})
