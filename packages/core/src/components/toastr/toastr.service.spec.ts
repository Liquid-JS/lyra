import { assert } from 'vitest'
import { Component, ErrorHandler, inject } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
    NbToastContainer,
    NbToastrContainerRegistry,
    NbToastrService,
    NbGlobalLogicalPosition,
    NbGlobalPhysicalPosition,
    NbToast,
    NbToastrModule,
    NbThemeModule,
    NbLayoutModule,
    NbToastrConfig,
    NB_TOASTR_CONFIG,
    NbOverlayService,
    NbPositionBuilderService,
    NbPositionHelper,
    NB_DOCUMENT,
    NbLayoutDirection,
    NbLayoutDirectionService
} from '@liquid-js/lyr-core'
import { RouterModule } from '@angular/router'

function query<T extends Element>(selector: string) {
    const el = document.querySelector<T>(selector)
    assert(el, `${selector} not rendered`)
    return el
}

@Component({
    selector: 'nb-toastr-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <div class="test-div"></div>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule, NbToastrModule]
})
export class NbToastrTestComponent {
    private readonly toastrService = inject(NbToastrService)

    showToast(className: string) {
        this.toastrService.show('testing toastr', '', { toastClass: className })
    }

    showToastWithConfig(config: Partial<NbToastrConfig>) {
        return this.toastrService.show('testing toastr', '', config)
    }
}

describe('toastr-component', () => {
    let fixture: ComponentFixture<NbToastrTestComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbToastrModule.forRoot(),
                NbToastrTestComponent
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(NbToastrTestComponent)
    })

    it("should add 'toastr-overlay-container' class to overlay", () => {
        fixture.debugElement.componentInstance.showToast('toast-test-class')
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.cdk-global-overlay-wrapper').classList).toContain(
            'toastr-overlay-container'
        )
    })

    it('should set class if provided', () => {
        fixture.debugElement.componentInstance.showToast('toast-test-class')
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.toast-test-class')).toBeTruthy()
    })

    it('should place end toasts on the left in right-to-left layouts', () => {
        TestBed.inject(NbLayoutDirectionService).setDirection(NbLayoutDirection.RTL)
        fixture.componentInstance.showToastWithConfig({
            position: NbGlobalLogicalPosition.TOP_END,
            toastClass: 'end-toast'
        })
        fixture.detectChanges()

        const pane = query('nb-toast.end-toast').getBoundingClientRect()
        expect(pane.left + pane.width / 2).toBeLessThan(document.documentElement.clientWidth / 2)
    })

    it('should take a position by its value as well as by its enum', () => {
        fixture.componentInstance.showToastWithConfig({ position: 'bottom-start', toastClass: 'bottom-toast' })
        fixture.detectChanges()

        const pane = query('nb-toast.bottom-toast').getBoundingClientRect()
        expect(pane.top + pane.height / 2).toBeGreaterThan(document.documentElement.clientHeight / 2)
    })

    it('should announce danger toasts as alerts and others as status messages', () => {
        fixture.componentInstance.showToastWithConfig({ status: 'danger', toastClass: 'danger-toast' })
        fixture.componentInstance.showToastWithConfig({ status: 'success', toastClass: 'success-toast' })
        fixture.detectChanges()

        const danger = query('nb-toast.danger-toast')
        const success = query('nb-toast.success-toast')
        expect(danger.getAttribute('role')).toBe('alert')
        expect(danger.getAttribute('aria-live')).toBe('assertive')
        expect(success.getAttribute('role')).toBe('status')
        expect(success.getAttribute('aria-live')).toBe('polite')
        expect(success.getAttribute('aria-atomic')).toBe('true')
    })

    // The texts take their own direction, without changing how they're aligned in the toast.
    it('should isolate the direction of the title and the message', () => {
        TestBed.inject(NbToastrService).show('Your changes were saved.', 'Saved', { toastClass: 'texts-toast' })
        fixture.detectChanges()

        const toast = query('nb-toast.texts-toast')
        const title = toast.querySelector('.title')
        expect(title?.getAttribute('dir')).toBe('auto')
        expect(title?.textContent).toBe('Saved')
        const message = toast.querySelector('.message')
        expect(message?.hasAttribute('dir')).toBe(false)
        expect(message?.querySelector('[dir="auto"]')?.textContent).toBe('Your changes were saved.')
    })

    it('should not render a close button by default', () => {
        fixture.debugElement.componentInstance.showToast('toast-test-class')
        fixture.detectChanges()
        expect(document.querySelector('nb-toast .close-button')).toBeNull()
    })

    it('should remove the toast when its close button is clicked', async () => {
        const ref = fixture.debugElement.componentInstance.showToastWithConfig({
            closeButton: true,
            closeButtonLabel: 'Schließen',
            destroyByClick: false,
            duration: 0
        })
        // An observable, as a dialog's and a window's `onClose` are.
        const closed = vi.fn()
        ref.onClose.subscribe(closed)
        fixture.detectChanges()
        const closeButton = query<HTMLButtonElement>('nb-toast .close-button')
        expect(closeButton.getAttribute('aria-label')).toEqual('Schließen')

        closeButton.click()
        await fixture.whenStable()
        fixture.detectChanges()

        expect(document.querySelectorAll('nb-toast').length).toEqual(0)
        expect(closed).toHaveBeenCalled()
    })

    it('should keep the toast when its body is clicked and destroyByClick is off', async () => {
        fixture.debugElement.componentInstance.showToastWithConfig({ destroyByClick: false, duration: 0 })
        fixture.detectChanges()

        query<HTMLElement>('nb-toast').click()
        await fixture.whenStable()
        fixture.detectChanges()

        expect(document.querySelectorAll('nb-toast').length).toEqual(1)
    })

    it('should pause the auto-dismiss while hovered and restart it on leave', async () => {
        vi.useFakeTimers()
        fixture.debugElement.componentInstance.showToastWithConfig({ duration: 2000, pauseOnHover: true })
        fixture.detectChanges()
        const toast = query<HTMLElement>('nb-toast')

        await vi.advanceTimersByTimeAsync(1000)
        toast.dispatchEvent(new MouseEvent('mouseenter'))
        await vi.advanceTimersByTimeAsync(5000)
        fixture.detectChanges()
        expect(document.querySelectorAll('nb-toast').length).toEqual(1)

        toast.dispatchEvent(new MouseEvent('mouseleave'))
        await vi.advanceTimersByTimeAsync(1999)
        fixture.detectChanges()
        expect(document.querySelectorAll('nb-toast').length).toEqual(1)

        await vi.advanceTimersByTimeAsync(1)
        fixture.detectChanges()
        // The toast's leave animation runs after the render, then removes it.
        await vi.advanceTimersByTimeAsync(0)
        expect(document.querySelectorAll('nb-toast').length).toEqual(0)
    })
})

describe('toastr actions', () => {
    let fixture: ComponentFixture<NbToastrTestComponent>
    let errors: unknown[]

    const show = async (config: Partial<NbToastrConfig>) => {
        fixture.componentInstance.showToastWithConfig(config)
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const button = (text: string) =>
        [...document.querySelectorAll<HTMLButtonElement>('nb-toast .actions button')].find(
            (element) => element.textContent?.trim() === text
        ) as HTMLButtonElement
    const toasts = () => document.querySelectorAll('nb-toast').length
    const settle = async () => {
        await fixture.whenStable()
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        errors = []
        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbToastrModule.forRoot(),
                NbToastrTestComponent
            ],
            providers: [{ provide: ErrorHandler, useValue: { handleError: (error: unknown) => errors.push(error) } }]
        }).compileComponents()
        fixture = TestBed.createComponent(NbToastrTestComponent)
    })

    afterEach(() => vi.useRealTimers())

    it('should render actions as buttons that stand out on the toast', async () => {
        await show({ status: 'success', duration: 0, actions: [{ text: 'Undo' }, { text: 'Delete', status: 'danger', appearance: 'outline' }] })

        expect(button('Undo').getAttribute('type')).toBe('button')
        expect(button('Undo').getAttribute('tabindex')).toBe('0')
        expect(button('Undo').classList).toContain('status-control')
        expect(button('Undo').classList).toContain('appearance-ghost')
        expect(button('Delete').classList).toContain('status-danger')
        expect(button('Delete').classList).toContain('appearance-outline')
        expect(document.querySelector('nb-toast')?.classList).toContain('has-actions')
    })

    it('should use primary buttons on a basic toast', async () => {
        await show({ status: 'basic', duration: 0, actions: [{ text: 'Undo' }] })

        expect(button('Undo').classList).toContain('status-primary')
    })

    it('should run an action with the toast and close it, without counting as a toast click', async () => {
        const action = vi.fn()
        await show({ duration: 0, destroyByClick: true, actions: [{ text: 'Undo', action }] })
        const toastClicks = vi.fn()
        document.querySelector('nb-toast')?.addEventListener('click', toastClicks)

        button('Undo').click()
        await settle()

        expect(action).toHaveBeenCalledTimes(1)
        expect(action.mock.calls[0][0].close).toBeTypeOf('function')
        expect(toastClicks).not.toHaveBeenCalled()
        expect(toasts()).toBe(0)
    })

    it('should keep the toast open after an action that says so', async () => {
        await show({ duration: 0, actions: [{ text: 'Details', close: false }] })

        button('Details').click()
        await settle()

        expect(toasts()).toBe(1)
    })

    it('should show a loading button while an action runs, and close once it is done', async () => {
        let done = () => {}
        await show({ duration: 0, actions: [{ text: 'Undo', action: () => new Promise<void>((resolve) => (done = resolve)) }] })

        button('Undo').click()
        await settle()
        expect(button('Undo').getAttribute('aria-busy')).toBe('true')
        expect(toasts()).toBe(1)

        done()
        await settle()
        expect(toasts()).toBe(0)
    })

    it('should keep the toast open when an action fails, reporting the error', async () => {
        const failure = new Error('offline')
        await show({ duration: 0, actions: [{ text: 'Undo', action: () => Promise.reject(failure) }] })

        button('Undo').click()
        await settle()

        expect(toasts()).toBe(1)
        expect(errors).toEqual([failure])
        expect(button('Undo').getAttribute('aria-busy')).toBeNull()
    })

    it('should pause the auto-dismiss while the focus is in the toast or an action runs', async () => {
        vi.useFakeTimers()
        let done = () => {}
        fixture.componentInstance.showToastWithConfig({
            duration: 2000,
            actions: [{ text: 'Undo', action: () => new Promise<void>((resolve) => (done = resolve)) }]
        })
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)

        button('Undo').focus()
        await vi.advanceTimersByTimeAsync(5000)
        expect(toasts()).toBe(1)

        button('Undo').click()
        button('Undo').blur()
        await vi.advanceTimersByTimeAsync(5000)
        expect(toasts()).toBe(1)

        done()
        await vi.advanceTimersByTimeAsync(0)
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)
        expect(toasts()).toBe(0)
    })

    it('should give the focus back when it closes with the focus in it', async () => {
        const trigger = document.createElement('button')
        document.body.appendChild(trigger)
        trigger.focus()
        await show({ duration: 0, actions: [{ text: 'Undo' }] })

        button('Undo').focus()
        button('Undo').click()
        await settle()

        expect(toasts()).toBe(0)
        expect(document.activeElement).toBe(trigger)
        trigger.remove()
    })

    it('should restart the auto-dismiss once the focus leaves', async () => {
        vi.useFakeTimers()
        fixture.componentInstance.showToastWithConfig({ duration: 2000, actions: [{ text: 'Undo' }] })
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)

        button('Undo').focus()
        await vi.advanceTimersByTimeAsync(5000)
        button('Undo').blur()
        await vi.advanceTimersByTimeAsync(1999)
        fixture.detectChanges()
        expect(toasts()).toBe(1)

        await vi.advanceTimersByTimeAsync(1)
        fixture.detectChanges()
        await vi.advanceTimersByTimeAsync(0)
        expect(toasts()).toBe(0)
    })
})

describe('toastr-service', () => {
    let toastr: NbToastrService
    let containerStub: { attach(toast: NbToast): void }
    let containerRegistryStub: { get(): unknown }

    beforeEach(() => {
        containerStub = {
            attach: () => {}
        }
    })

    beforeEach(() => {
        containerRegistryStub = {
            get: () => containerStub
        }
    })

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NbToastrService,
                { provide: NB_TOASTR_CONFIG, useValue: {} },
                { provide: NbToastrContainerRegistry, useValue: containerRegistryStub }
            ]
        })
        toastr = TestBed.inject(NbToastrService)
    })

    it('should attach to toastr container', () => {
        const getContainerSpy = vi.spyOn(containerRegistryStub, 'get').mockImplementation(() => undefined)
        const attachSpy = vi.spyOn(containerStub, 'attach').mockImplementation(() => undefined)
        getContainerSpy.mockReturnValue(containerStub)

        toastr.show('')

        expect(getContainerSpy).toHaveBeenCalled()
        expect(attachSpy).toHaveBeenCalled()
    })

    it('should merge user configurations with defaults', () => {
        const attachSpy = vi.spyOn(containerStub, 'attach').mockImplementation(() => undefined)

        toastr.show('', '', {
            position: NbGlobalLogicalPosition.BOTTOM_START,
            duration: 1234,
            preventDuplicates: true,
            toastClass: 'my-toast-class'
        })

        expect(attachSpy).toHaveBeenCalled()
        const [[{ config }]] = attachSpy.mock.calls
        expect(config.position, 'incorrect position').toBe(NbGlobalLogicalPosition.BOTTOM_START)
        expect(config.status, 'incorrect status').toBe('basic')
        expect(config.duration, 'incorrect duration').toBe(1234)
        expect(config.destroyByClick, 'incorrect destroyByClick').toBe(true)
        expect(config.preventDuplicates, 'incorrect preventDuplicates').toBe(true)
        expect(config.hasIcon, 'incorrect hasIcon').toBe(true)
        expect(config.toastClass, 'incorrect toastClass').toBe('my-toast-class')
    })

    it('should take the status icon from statusIcons when the toast sets no icon', () => {
        const attachSpy = vi.spyOn(containerStub, 'attach').mockImplementation(() => undefined)

        toastr.show('', '', { status: 'success', statusIcons: { success: 'checkmark-circle-2-outline' } })
        toastr.show('', '', { status: 'danger', statusIcons: { success: 'checkmark-circle-2-outline' } })
        toastr.show('', '', { status: 'success', icon: 'star', statusIcons: { success: 'checkmark-circle-2-outline' } })

        const configs = attachSpy.mock.calls.map(([{ config }]) => config)
        expect(configs[0].icon).toBe('checkmark-circle-2-outline')
        expect(configs[1].icon).toEqual({ icon: 'flash-outline', pack: 'essentials' })
        expect(configs[2].icon).toBe('star')
    })

    it('should call show with success status when success called', () => {
        const toastrSpy = vi.spyOn(toastr, 'show').mockImplementation(() => undefined)

        toastr.success('')

        expect(toastrSpy).toHaveBeenCalled()
        const [, , { status } = {}] = toastrSpy.mock.calls[0]
        expect(status).toBe('success')
    })

    it('should call show with info status when info called', () => {
        const toastrSpy = vi.spyOn(toastr, 'show').mockImplementation(() => undefined)

        toastr.info('')

        expect(toastrSpy).toHaveBeenCalled()
        const [, , { status } = {}] = toastrSpy.mock.calls[0]
        expect(status).toBe('info')
    })

    it('should call show with warning status when warning called', () => {
        const toastrSpy = vi.spyOn(toastr, 'show').mockImplementation(() => undefined)

        toastr.warning('')

        expect(toastrSpy).toHaveBeenCalled()
        const [, , { status } = {}] = toastrSpy.mock.calls[0]
        expect(status).toBe('warning')
    })

    it('should call show with primary status when primary called', () => {
        const toastrSpy = vi.spyOn(toastr, 'show').mockImplementation(() => undefined)

        toastr.primary('')

        expect(toastrSpy).toHaveBeenCalled()
        const [, , { status } = {}] = toastrSpy.mock.calls[0]
        expect(status).toBe('primary')
    })

    it('should call show with danger status when danger called', () => {
        const toastrSpy = vi.spyOn(toastr, 'show').mockImplementation(() => undefined)

        toastr.danger('')

        expect(toastrSpy).toHaveBeenCalled()
        const [, , { status } = {}] = toastrSpy.mock.calls[0]
        expect(status).toBe('danger')
    })

    it('should call show with default status when default called', () => {
        const toastrSpy = vi.spyOn(toastr, 'show').mockImplementation(() => undefined)

        toastr.default('')

        expect(toastrSpy).toHaveBeenCalled()
        const [, , { status } = {}] = toastrSpy.mock.calls[0]
        expect(status).toBe('basic')
    })
})

describe('toastr-container-registry', () => {
    let toastrContainerRegistry: NbToastrContainerRegistry
    let overlayStub: any
    let positionBuilder: any
    let positionHelper: any
    let containerStub: any
    let documentStub: any

    beforeEach(() => {
        containerStub = {
            attach: () => ({
                location: {
                    nativeElement: 'element'
                }
            }),
            dispose: () => {},
            hostElement: {
                classList: {
                    add: () => {}
                }
            }
        }

        overlayStub = {
            create: () => containerStub
        }

        positionBuilder = {
            global: () => ({
                position: () => {}
            })
        }

        positionHelper = {
            toLogicalPosition: (position: NbGlobalLogicalPosition | NbGlobalPhysicalPosition) => position
        }

        documentStub = {
            _contains: true,

            body: {
                contains: () => documentStub._contains
            }
        }
    })

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NbToastrContainerRegistry,
                { provide: NbOverlayService, useValue: overlayStub },
                { provide: NbPositionBuilderService, useValue: positionBuilder },
                { provide: NbPositionHelper, useValue: positionHelper },
                { provide: NB_DOCUMENT, useValue: documentStub }
            ]
        })
        toastrContainerRegistry = TestBed.inject(NbToastrContainerRegistry)
    })

    it('should create new container if not exists for requested position', () => {
        const overlayCreateSpy = vi.spyOn(overlayStub, 'create').mockReturnValue(containerStub)

        toastrContainerRegistry.get(NbGlobalLogicalPosition.BOTTOM_START)

        expect(overlayCreateSpy).toHaveBeenCalled()
    })

    it('should return existing container if same position called twice', () => {
        const overlayCreateSpy = vi.spyOn(overlayStub, 'create').mockReturnValue(containerStub)

        toastrContainerRegistry.get(NbGlobalLogicalPosition.BOTTOM_START)
        toastrContainerRegistry.get(NbGlobalLogicalPosition.BOTTOM_START)

        expect(overlayCreateSpy).toHaveBeenCalledTimes(1)
    })

    it('should re-create when unattached from document', () => {
        const overlayCreateSpy = vi.spyOn(overlayStub, 'create').mockReturnValue(containerStub)

        toastrContainerRegistry.get(NbGlobalLogicalPosition.BOTTOM_START)
        documentStub._contains = false
        toastrContainerRegistry.get(NbGlobalLogicalPosition.BOTTOM_START)

        expect(overlayCreateSpy).toHaveBeenCalledTimes(2)
    })

    it('should return the same position for top-end and top-right when ltr', () => {
        vi.spyOn(positionHelper, 'toLogicalPosition').mockReturnValue(NbGlobalLogicalPosition.TOP_END)

        const topEnd = toastrContainerRegistry.get(NbGlobalLogicalPosition.TOP_END)
        const topRight = toastrContainerRegistry.get(NbGlobalPhysicalPosition.TOP_RIGHT)

        expect(topEnd).toBe(topRight)
    })

    it('should dispose overlay before replacing with new one', () => {
        toastrContainerRegistry.get(NbGlobalLogicalPosition.TOP_END)

        const overlayDisposeSpy = vi.spyOn(containerStub, 'dispose').mockImplementation(() => undefined)
        documentStub._contains = false
        toastrContainerRegistry.get(NbGlobalLogicalPosition.TOP_END)

        expect(overlayDisposeSpy).toHaveBeenCalledTimes(1)
    })
})

describe('toastr-container', () => {
    let toastrContainer: NbToastContainer
    let containerRefStub: any
    let positionHelperStub: any

    beforeEach(() => {
        positionHelperStub = {
            isTopPosition: () => true
        }

        containerRefStub = {
            instance: {
                toasts: () => []
            },
            changeDetectorRef: {
                detectChanges: () => {},
                markForCheck: () => {}
            }
        }
    })

    beforeEach(() => {
        toastrContainer = new NbToastContainer(<any>{}, containerRefStub, positionHelperStub)
    })

    it('should prevent duplicates if previous toast is the same', () => {
        const toast1 = {
            title: 'toast1',
            message: 'message',
            config: { status: 'dander', preventDuplicates: true, duplicatesBehaviour: 'previous' }
        }

        const toast2 = { ...toast1, title: 'toast2'}

        toastrContainer.attach(<NbToast>toast1)
        toastrContainer.attach(<NbToast>toast2)
        const duplicateToast = toastrContainer.attach(<NbToast>toast2)

        expect(duplicateToast).toBeUndefined()
    })

    it('should prevent duplicates if existing toast is the same', () => {
        const toast1 = {
            title: 'toast1',
            message: 'message',
            config: { status: 'dander', preventDuplicates: true, duplicatesBehaviour: 'all' }
        }

        const toast2 = { ...toast1, title: 'toast2'}

        toastrContainer.attach(<NbToast>toast1)
        toastrContainer.attach(<NbToast>toast2)
        const duplicateToast = toastrContainer.attach(<NbToast>toast1)

        expect(duplicateToast).toBeUndefined()
    })

    describe('if limit set', () => {
        const toast1 = {
            title: 'toast1',
            config: { limit: 3 }
        }

        const toast2 = { ...toast1, title: 'toast2'}
        const toast3 = { ...toast1, title: 'toast3'}
        const toast4 = { ...toast1, title: 'toast4'}

        function attachToasts() {
            toastrContainer.attach(<NbToast>toast1)
            toastrContainer.attach(<NbToast>toast2)
            toastrContainer.attach(<NbToast>toast3)
            toastrContainer.attach(<NbToast>toast4)
        }

        it('should remove the first toast in container in top position', () => {
            attachToasts()
            expect(containerRefStub.instance.content.length).toEqual(3)
            expect(containerRefStub.instance.content[0]).toEqual(toast4)
            expect(containerRefStub.instance.content[1]).toEqual(toast3)
            expect(containerRefStub.instance.content[2]).toEqual(toast2)
        })
        it('should remove the last toast in container in bottom position', () => {
            positionHelperStub = {
                isTopPosition: () => false
            }

            toastrContainer = new NbToastContainer(<any>{}, containerRefStub, positionHelperStub)

            attachToasts()
            expect(containerRefStub.instance.content.length).toEqual(3)
            expect(containerRefStub.instance.content[0]).toEqual(toast2)
            expect(containerRefStub.instance.content[1]).toEqual(toast3)
            expect(containerRefStub.instance.content[2]).toEqual(toast4)
        })
    })
})
