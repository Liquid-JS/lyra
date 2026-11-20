import { TestBed } from '@angular/core/testing'
import { NbOverlayContainerAdapter, NbThemeModule } from '@liquid-js/lyr-core'

describe('NbOverlayContainerAdapter', () => {
    let adapter: NbOverlayContainerAdapter
    let outer: HTMLElement
    let inner: HTMLElement

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        adapter = TestBed.inject(NbOverlayContainerAdapter)
        outer = document.body.appendChild(document.createElement('div'))
        inner = outer.appendChild(document.createElement('div'))
    })

    afterEach(() => {
        adapter.clearContainer()
        outer.remove()
    })

    it('should keep the overlays in the outer layout when a nested layout is removed', () => {
        adapter.setContainer(outer)
        expect(outer.contains(adapter.getContainerElement())).toBe(true)

        adapter.setContainer(inner)
        adapter.clearContainer(inner)
        inner.remove()

        const containerElement = adapter.getContainerElement()
        expect(containerElement.parentElement).toBe(outer)
    })

    it('should move the overlays to the remaining layout when the layout that holds them is removed', () => {
        const other = document.body.appendChild(document.createElement('div'))
        adapter.setContainer(outer)
        adapter.getContainerElement()
        adapter.setContainer(other)

        adapter.clearContainer(outer)

        expect(adapter.getContainerElement().parentElement).toBe(other)
        other.remove()
    })
})

describe('NbOverlayContainerAdapter without a layout', () => {
    it('should use the document body, and a layout once there is one', () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const adapter = TestBed.inject(NbOverlayContainerAdapter)
        adapter.clearContainer()

        const bodyContainer = adapter.getContainerElement()
        expect(bodyContainer.parentElement).toBe(document.body)

        const layout = document.body.appendChild(document.createElement('div'))
        adapter.setContainer(layout)
        expect(adapter.getContainerElement().parentElement).toBe(layout)

        adapter.clearContainer()
        layout.remove()
        bodyContainer.remove()
    })
})
