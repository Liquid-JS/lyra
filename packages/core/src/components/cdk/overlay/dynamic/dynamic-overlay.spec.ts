import { TestBed } from '@angular/core/testing'
import { ApplicationRef, Component, input } from '@angular/core'
import { Subject } from 'rxjs'
import { ScrollStrategy } from '@angular/cdk/overlay'
import {
    NbDynamicOverlay,
    NbOverlayService,
    NbRenderableContainer,
    NbComponentPortal,
    NbOverlayConfig,
    NbOverlayContainer
} from '@liquid-js/lyr-core'

@Component({
    template: ''
})
export class NbDynamicOverlayMockComponent implements NbRenderableContainer {
    readonly content = input<any>()
    readonly context = input<object>()

    renderContent() {}
}

@Component({
    template: ''
})
export class NbDynamicOverlayMock2Component extends NbDynamicOverlayMockComponent {}

const instance = {
    position: '',
    content: '',
    context: null,
    cfr: null,
    renderContent: () => {}
}

const container: any = {
    instance,
    changeDetectorRef: { detectChanges: () => {}, markForCheck: () => {} }
}

const ref = {
    portal: undefined as NbComponentPortal | undefined,

    hasAttached: (): boolean => false,
    updatePosition: () => {},
    updatePositionStrategy: () => {},

    attach(portal: NbComponentPortal) {
        this.portal = portal
        return container
    },

    detach: () => {},
    dispose: () => {}
}
const repositionRes = 'something'
const scrollStrategies = {
    reposition: () => (<unknown>repositionRes) as ScrollStrategy
}

export class NbOverlayContainerMock {
    getContainerElement() {
        return {
            contains: () => true
        }
    }
}

export class NbOverlayServiceMock {
    _config: NbOverlayConfig = {}

    get scrollStrategies() {
        return scrollStrategies
    }

    create(config: NbOverlayConfig) {
        this._config = config

        return ref
    }
}

class PositionStrategy {
    constructor(public position: string) {}
    positionChange = new Subject<any>()
    originElement?: Element
}

const bottomPositionStrategy: any = new PositionStrategy('bottom')
const topPositionStrategy: any = new PositionStrategy('top')

describe('dynamic-overlay', () => {
    let dynamicOverlayService: NbDynamicOverlay
    let dynamicOverlay: NbDynamicOverlay
    let overlayService: NbOverlayServiceMock
    const content = 'Overlay Content'
    const context = {}

    beforeEach(() => {
        TestBed.resetTestingModule()
        const bed = TestBed.configureTestingModule({
            imports: [NbDynamicOverlayMockComponent, NbDynamicOverlayMock2Component],
            providers: [
                NbDynamicOverlay,
                { provide: NbOverlayService, useClass: NbOverlayServiceMock },
                { provide: NbOverlayContainer, useClass: NbOverlayContainerMock }
            ]
        })
        overlayService = bed.inject(NbOverlayService) as unknown as NbOverlayServiceMock
        dynamicOverlayService = bed.inject(NbDynamicOverlay)
    })

    beforeEach(() => {
        dynamicOverlay = dynamicOverlayService.create(
            NbDynamicOverlayMockComponent,
            content,
            context,
            bottomPositionStrategy
        )
    })

    afterEach(() => {
        dynamicOverlay.dispose()
    })

    it('should create overlay when show called', () => {
        const createOverlaySpy = vi.spyOn(overlayService, 'create')
        const renderSpy = vi.spyOn(instance, 'renderContent')
        const repositionSpy = vi.spyOn(scrollStrategies, 'reposition')
        const attachSpy = vi.spyOn(ref, 'attach')
        dynamicOverlay.show()
        vi.spyOn(ref, 'hasAttached').mockReturnValue(true)

        expect(createOverlaySpy).toHaveBeenCalledTimes(1)
        expect(renderSpy).toHaveBeenCalledTimes(1)
        expect(repositionSpy).toHaveBeenCalledTimes(1)
        expect(attachSpy).toHaveBeenCalledTimes(1)

        expect(overlayService._config.positionStrategy as any).toBe(bottomPositionStrategy)
        expect(overlayService._config.scrollStrategy as any).toBe(repositionRes)
        expect(dynamicOverlay.isAttached).toBe(true)

        expect(ref.portal?.component).toBe(NbDynamicOverlayMockComponent)
        expect(instance.content).toBe(content)
        expect(instance.context).toBe(context)
    })

    it('should destroy overlay when hide called', () => {
        const detachSpy = vi.spyOn(ref, 'detach')
        dynamicOverlay.show()
        dynamicOverlay.hide()
        vi.spyOn(ref, 'hasAttached').mockReturnValue(false)

        expect(detachSpy).toHaveBeenCalledTimes(1)
        expect(dynamicOverlay.isAttached).toBe(false)
        expect(dynamicOverlay.getContainer()).toBeUndefined()
    })

    it('should not create ref on the second time', () => {
        const detachSpy = vi.spyOn(ref, 'detach')
        const createOverlaySpy = vi.spyOn(overlayService, 'create')
        const hasAttacheSpy = vi.spyOn(ref, 'hasAttached').mockImplementation(() => false)

        dynamicOverlay.show()
        hasAttacheSpy.mockReturnValue(true)

        expect(detachSpy).toHaveBeenCalledTimes(0)
        expect(dynamicOverlay.isAttached).toBe(true)
        expect(dynamicOverlay.getContainer()).toBe(container)
        expect(createOverlaySpy).toHaveBeenCalledTimes(1)

        dynamicOverlay.hide()
        hasAttacheSpy.mockReturnValue(false)

        expect(detachSpy).toHaveBeenCalledTimes(1)
        expect(dynamicOverlay.isAttached).toBe(false)
        expect(dynamicOverlay.getContainer()).toBeUndefined()
        expect(createOverlaySpy).toHaveBeenCalledTimes(1)

        dynamicOverlay.show()
        hasAttacheSpy.mockReturnValue(true)

        expect(detachSpy).toHaveBeenCalledTimes(1)
        expect(dynamicOverlay.isAttached).toBe(true)
        expect(dynamicOverlay.getContainer()).toBe(container)
        expect(createOverlaySpy).toHaveBeenCalledTimes(1)
    })

    it('should not attach to ref if already shown', () => {
        const attachSpy = vi.spyOn(ref, 'attach')
        const hasAttacheSpy = vi.spyOn(ref, 'hasAttached').mockImplementation(() => false)

        dynamicOverlay.show()
        hasAttacheSpy.mockReturnValue(true)

        expect(attachSpy).toHaveBeenCalledTimes(1)

        dynamicOverlay.show()

        expect(attachSpy).toHaveBeenCalledTimes(1)
    })

    it('should create/destroy overlay when toggle called', () => {
        const createOverlaySpy = vi.spyOn(overlayService, 'create')
        const renderSpy = vi.spyOn(instance, 'renderContent')
        const repositionSpy = vi.spyOn(scrollStrategies, 'reposition')
        const attachSpy = vi.spyOn(ref, 'attach')
        const detachSpy = vi.spyOn(ref, 'detach')
        const hasAttacheSpy = vi.spyOn(ref, 'hasAttached').mockImplementation(() => false)

        hasAttacheSpy.mockReturnValue(false)

        dynamicOverlay.toggle()

        expect(createOverlaySpy).toHaveBeenCalledTimes(1)
        expect(renderSpy).toHaveBeenCalledTimes(1)
        expect(repositionSpy).toHaveBeenCalledTimes(1)
        expect(attachSpy).toHaveBeenCalledTimes(1)
        expect(detachSpy).toHaveBeenCalledTimes(0)

        hasAttacheSpy.mockReturnValue(true)

        dynamicOverlay.toggle()

        expect(createOverlaySpy).toHaveBeenCalledTimes(1)
        expect(renderSpy).toHaveBeenCalledTimes(1)
        expect(repositionSpy).toHaveBeenCalledTimes(1)
        expect(attachSpy).toHaveBeenCalledTimes(1)
        expect(detachSpy).toHaveBeenCalledTimes(1)
    })

    it('should dispose ref', () => {
        const detachSpy = vi.spyOn(ref, 'detach')
        const disposeSpy = vi.spyOn(ref, 'dispose')
        dynamicOverlay.show()
        dynamicOverlay.dispose()

        expect(detachSpy).toHaveBeenCalledTimes(1)
        expect(disposeSpy).toHaveBeenCalledTimes(1)
    })

    it('should set content', () => {
        const newContent = 'new content'
        dynamicOverlay.setContent(newContent)
        dynamicOverlay.show()

        expect(instance.content).toBe(newContent)
    })

    it('should set overlay config', () => {
        const overlayConfig: NbOverlayConfig = { panelClass: 'additional-overlay-class' }
        const createOverlaySpy = vi.spyOn(overlayService, 'create')

        dynamicOverlay.setOverlayConfig(overlayConfig)
        dynamicOverlay.show()

        expect(createOverlaySpy).toHaveBeenCalledWith(expect.objectContaining(overlayConfig))
    })

    it('should return container', () => {
        dynamicOverlay.show()
        expect(dynamicOverlay.getContainer()).toBe(container as any)
    })

    it('should not apply the position while hidden', () => {
        const updatePositionSpy = vi.spyOn(ref, 'updatePosition')
        vi.spyOn(ref, 'hasAttached').mockReturnValue(false)

        dynamicOverlay.show()
        dynamicOverlay.hide()
        dynamicOverlay.setContentAndContext('new content', { some: 'thing' })

        expect(updatePositionSpy).not.toHaveBeenCalled()
    })

    it('should position the container again when its size changes while shown', async () => {
        const element = document.createElement('div')
        document.body.appendChild(element)
        container.location = { nativeElement: element }
        const updatePositionSpy = vi.spyOn(ref, 'updatePosition')
        vi.spyOn(ref, 'hasAttached').mockReturnValue(true)
        const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

        dynamicOverlay.show()
        await frame()
        updatePositionSpy.mockClear()
        element.style.height = '100px'
        await frame()
        expect(updatePositionSpy).toHaveBeenCalled()

        dynamicOverlay.hide()
        await frame()
        updatePositionSpy.mockClear()
        element.style.height = '200px'
        await frame()
        expect(updatePositionSpy).not.toHaveBeenCalled()

        delete container.location
        element.remove()
    })

    it('should position the container again when the element it is placed against moves', async () => {
        const host = document.createElement('div')
        host.style.cssText = 'position: absolute; top: 50px; left: 50px; width: 40px; height: 20px;'
        document.body.appendChild(host)
        bottomPositionStrategy.originElement = host
        const updatePositionSpy = vi.spyOn(ref, 'updatePosition')
        vi.spyOn(ref, 'hasAttached').mockReturnValue(true)
        const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

        dynamicOverlay.show()
        await frame()
        updatePositionSpy.mockClear()
        // Moved without scrolling or resizing, as when a sidebar opens beside it.
        host.style.left = '150px'
        await expect.poll(() => updatePositionSpy.mock.calls.length).toBeGreaterThan(0)

        dynamicOverlay.hide()
        await frame()
        updatePositionSpy.mockClear()
        host.style.left = '250px'
        await frame()
        await frame()
        expect(updatePositionSpy).not.toHaveBeenCalled()

        delete bottomPositionStrategy.originElement
        host.remove()
    })

    it('should set content when shown', () => {
        const renderContentSpy = vi.spyOn(instance, 'renderContent')
        const updatePositionSpy = vi.spyOn(ref, 'updatePosition')
        vi.spyOn(ref, 'hasAttached').mockReturnValue(true)

        dynamicOverlay.show()
        const newContent = 'new content'
        TestBed.inject(ApplicationRef).tick()
        dynamicOverlay.setContent(newContent)

        expect(instance.content).toBe(newContent)
        expect(renderContentSpy).toHaveBeenCalledTimes(2)
        expect(updatePositionSpy).toHaveBeenCalledTimes(2)
    })

    it('should set context when shown', () => {
        const renderContentSpy = vi.spyOn(instance, 'renderContent')
        const updatePositionSpy = vi.spyOn(ref, 'updatePosition')
        vi.spyOn(ref, 'hasAttached').mockReturnValue(true)

        dynamicOverlay.show()
        const newContext = { some: 'thing' }
        TestBed.inject(ApplicationRef).tick()
        dynamicOverlay.setContext(newContext)

        expect(instance.context).toBe(newContext)
        expect(renderContentSpy).toHaveBeenCalledTimes(2)
        expect(updatePositionSpy).toHaveBeenCalledTimes(2)
    })

    it('should set context & content when shown', () => {
        const renderContentSpy = vi.spyOn(instance, 'renderContent')
        const updatePositionSpy = vi.spyOn(ref, 'updatePosition')
        vi.spyOn(ref, 'hasAttached').mockReturnValue(true)

        dynamicOverlay.show()
        const newContext = { some: 'thing' }
        const newContent = 'new content'
        TestBed.inject(ApplicationRef).tick()
        dynamicOverlay.setContent(newContent)
        TestBed.inject(ApplicationRef).tick()
        dynamicOverlay.setContext(newContext)

        expect(instance.context).toBe(newContext)
        expect(instance.content).toBe(newContent)
        expect(renderContentSpy).toHaveBeenCalledTimes(3)
        expect(updatePositionSpy).toHaveBeenCalledTimes(3)
    })

    it('should set component', () => {
        const disposeSpy = vi.spyOn(ref, 'dispose')
        const attachSpy = vi.spyOn(ref, 'attach')
        const hasAttacheSpy = vi.spyOn(ref, 'hasAttached').mockImplementation(() => false)

        dynamicOverlay.setComponent(NbDynamicOverlayMock2Component)

        expect(disposeSpy).toHaveBeenCalledTimes(0)
        expect(attachSpy).toHaveBeenCalledTimes(0)

        dynamicOverlay.show()
        hasAttacheSpy.mockReturnValue(true)

        expect(ref.portal?.component).toBe(NbDynamicOverlayMock2Component)
        expect(disposeSpy).toHaveBeenCalledTimes(0)
        expect(attachSpy).toHaveBeenCalledTimes(1)

        dynamicOverlay.setComponent(NbDynamicOverlayMockComponent)

        expect(ref.portal?.component).toBe(NbDynamicOverlayMockComponent)
        expect(disposeSpy).toHaveBeenCalledTimes(1)
        expect(attachSpy).toHaveBeenCalledTimes(2)

        dynamicOverlay.hide()
        hasAttacheSpy.mockReturnValue(false)

        dynamicOverlay.setComponent(NbDynamicOverlayMock2Component)

        expect(disposeSpy).toHaveBeenCalledTimes(2)
        expect(attachSpy).toHaveBeenCalledTimes(2)
    })

    it('should listen to position change', () => {
        dynamicOverlay.show()
        bottomPositionStrategy.positionChange.next('left')
        expect(instance.position).toEqual('left')
    })

    it('should set position strategy', () => {
        const updatePositionSpy = vi.spyOn(ref, 'updatePositionStrategy')
        dynamicOverlay.setPositionStrategy(topPositionStrategy)
        dynamicOverlay.show()

        // checking that the old subscription doesn't overlaps with the new one
        topPositionStrategy.positionChange.next('right')
        expect(instance.position).toEqual('right')
        expect(overlayService._config.positionStrategy as any).toBe(topPositionStrategy)

        bottomPositionStrategy.positionChange.next('left')
        expect(instance.position).toEqual('right')

        dynamicOverlay.setPositionStrategy(bottomPositionStrategy)
        bottomPositionStrategy.positionChange.next('left')
        expect(instance.position).toEqual('left')
        topPositionStrategy.positionChange.next('right')
        expect(instance.position).toEqual('left')
        expect(updatePositionSpy).toHaveBeenCalledTimes(1)
    })

    it('should recreate overlay if it\'s host isn\'t child of overlay container', () => {
        dynamicOverlay.show()
        dynamicOverlay.hide()

        const overlayContainer = TestBed.inject(NbOverlayContainer)
        const getContainerElementSpy = vi.spyOn(overlayContainer, 'getContainerElement').mockReturnValueOnce({
            contains: () => false
        } as unknown as HTMLElement).mockReturnValueOnce({
            contains: () => true
        } as unknown as HTMLElement)

        dynamicOverlay.show()

        expect(getContainerElementSpy).toHaveBeenCalledTimes(2)
    })

    it('should dispose overlay ref when recreating overlay', () => {
        const disposeSpy = vi.spyOn(ref, 'dispose')

        dynamicOverlay.show()
        dynamicOverlay.hide()

        const overlayContainer = TestBed.inject(NbOverlayContainer)
        // return false once to force overlay ref recreation and then always return true
        overlayContainer.getContainerElement = () => {
            overlayContainer.getContainerElement = () => ({ contains: () => true } as unknown as HTMLElement)
            return { contains: () => false } as unknown as HTMLElement
        }

        dynamicOverlay.show()

        expect(disposeSpy).toHaveBeenCalledTimes(1)
    })
})
