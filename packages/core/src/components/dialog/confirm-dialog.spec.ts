import { assert } from 'vitest'
import { ErrorHandler, Service } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Subject } from 'rxjs'

import {
    NbDialogModule,
    NbDialogService,
    NbOverlayContainerAdapter,
    NbThemeModule,
    NbViewportRulerAdapter,
    provideNbConfirmDialog
} from '@liquid-js/lyr-core'

@Service({ autoProvided: false })
class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
    override getViewportSize(): Readonly<{ width: number, height: number }> {
        return { width: 1600, height: 900 }
    }
    override getViewportScrollPosition(): { left: number, top: number } {
        return { left: 0, top: 0 }
    }
}

describe('NbDialogService.confirm', () => {
    let dialog: NbDialogService
    let overlayContainer: HTMLElement
    let errorHandler: { handleError: ReturnType<typeof vi.fn> }

    const render = async () => {
        TestBed.tick()
        await Promise.resolve()
    }
    const container = () => {
        const element = overlayContainer.querySelector('nb-dialog-container')
        assert(element, 'dialog not rendered')
        return element
    }
    const button = (text: string) => {
        const found = [...overlayContainer.querySelectorAll('button')].find((b) => b.textContent?.trim() === text)
        assert(found, `no ${text} button`)
        return found
    }
    const escape = async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
        await render()
    }

    const setup = (providers = new Array<unknown>()) => {
        errorHandler = { handleError: vi.fn() }
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbDialogModule.forRoot()],
            providers: [
                { provide: ErrorHandler, useValue: errorHandler },
                { provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter },
                ...(providers as [])
            ]
        })
        dialog = TestBed.inject(NbDialogService)
        overlayContainer = document.createElement('div')
        document.body.appendChild(overlayContainer)
        TestBed.inject(NbOverlayContainerAdapter).setContainer(overlayContainer)
    }

    afterEach(() => {
        TestBed.inject(NbOverlayContainerAdapter).clearContainer()
        overlayContainer.remove()
    })

    describe('with defaults', () => {
        beforeEach(() => setup())

        it('should show the title, message and buttons as an alert dialog', async () => {
            void dialog.confirm({ title: 'Delete the invoice?', message: "It can't be restored." })
            await render()

            expect(container().getAttribute('role')).toBe('alertdialog')
            expect(container().getAttribute('aria-modal')).toBe('true')
            const title = document.getElementById(container().getAttribute('aria-labelledby') ?? '')
            const message = document.getElementById(container().getAttribute('aria-describedby') ?? '')
            expect(title?.textContent?.trim()).toBe('Delete the invoice?')
            expect(message?.textContent?.trim()).toBe("It can't be restored.")
            // The texts take their own direction, without changing how they're aligned in the dialog.
            expect(title?.hasAttribute('dir')).toBe(false)
            expect(title?.querySelector('[dir="auto"]')?.textContent).toBe('Delete the invoice?')
            expect(message?.hasAttribute('dir')).toBe(false)
            expect(message?.querySelector('[dir="auto"]')?.textContent).toBe("It can't be restored.")
            expect(button('Confirm').classList).toContain('status-primary')
            expect(button('Cancel')).toBeTruthy()
        })

        it('should focus the cancel button', async () => {
            void dialog.confirm({ title: 'Leave?' })
            await render()

            expect(document.activeElement).toBe(button('Cancel'))
        })

        it('should not describe the dialog without a message', async () => {
            void dialog.confirm({ title: 'Leave?' })
            await render()

            expect(container().hasAttribute('aria-describedby')).toBe(false)
        })

        it('should resolve to true when confirmed', async () => {
            const result = dialog.confirm({ title: 'Leave?' })
            await render()
            button('Confirm').click()

            await expect(result).resolves.toBe(true)
            expect(overlayContainer.querySelector('nb-dialog-container')).toBeNull()
        })

        it('should resolve to false when cancelled with the button or Escape', async () => {
            const cancelled = dialog.confirm({ title: 'Leave?' })
            await render()
            button('Cancel').click()
            await expect(cancelled).resolves.toBe(false)

            const escaped = dialog.confirm({ title: 'Leave?' })
            await render()
            await escape()
            await expect(escaped).resolves.toBe(false)
        })

        it('should use the given texts and status', async () => {
            void dialog.confirm({ title: 'Delete?', confirmText: 'Delete', cancelText: 'Keep', status: 'danger' })
            await render()

            expect(button('Delete').classList).toContain('status-danger')
            expect(button('Keep')).toBeTruthy()
        })

        it('should stay open and busy while the action runs, then close', async () => {
            const done = new Subject<void>()
            const result = dialog.confirm({ title: 'Delete?', action: () => done })
            await render()
            button('Confirm').click()
            await render()

            expect(button('Confirm').getAttribute('aria-busy')).toBe('true')
            expect(button('Cancel').disabled).toBe(true)
            await escape()
            expect(overlayContainer.querySelector('nb-dialog-container')).not.toBeNull()

            done.next()
            done.complete()

            await expect(result).resolves.toBe(true)
        })

        it('should stay open after a failed action and report the error', async () => {
            const error = new Error('Network down')
            const action = vi.fn().mockRejectedValueOnce(error).mockResolvedValueOnce(undefined)
            const result = dialog.confirm({ title: 'Delete?', action })
            await render()

            button('Confirm').click()
            await vi.waitFor(() => expect(errorHandler.handleError).toHaveBeenCalledWith(error))
            await render()

            expect(overlayContainer.querySelector('nb-dialog-container')).not.toBeNull()
            expect(button('Confirm').hasAttribute('aria-busy')).toBe(false)
            expect(button('Cancel').disabled).toBe(false)

            button('Confirm').click()

            await expect(result).resolves.toBe(true)
            expect(action).toHaveBeenCalledTimes(2)
        })

        it('should not close on a backdrop click', async () => {
            void dialog.confirm({ title: 'Leave?' })
            await render();
            (overlayContainer.querySelector('.overlay-backdrop') as HTMLElement).click()
            await render()

            expect(overlayContainer.querySelector('nb-dialog-container')).not.toBeNull()
        })
    })

    describe('with provided defaults', () => {
        beforeEach(() => setup([provideNbConfirmDialog({ confirmText: 'Potrdi', cancelText: 'Prekliči' })]))

        it('should use them', async () => {
            void dialog.confirm({ title: 'Odstranim?' })
            await render()

            expect(button('Potrdi').classList).toContain('status-primary')
            expect(button('Prekliči')).toBeTruthy()
        })
    })
})
