import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { userEvent } from 'vitest/browser'

import { NbOverlayHostDirective, NbSelectModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    @if (hosted()) {
      <dialog nbOverlayHost class="hosted">
        <nb-select placeholder="Fruit"><nb-option value="apple">Apple</nb-option></nb-select>
      </dialog>
    }
    <dialog class="plain">
      <nb-select placeholder="Fruit"><nb-option value="pear">Pear</nb-option></nb-select>
    </dialog>
  `,
    imports: [NbOverlayHostDirective, NbSelectModule]
})
class OverlayHostTestComponent {
    readonly hosted = signal(true)
}

describe('NbOverlayHostDirective', () => {
    let fixture: ComponentFixture<OverlayHostTestComponent>

    const element = <T extends HTMLElement = HTMLElement>(selector: string) =>
        fixture.nativeElement.querySelector(selector) as T
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
        await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    const open = async (dialog: string) => {
        element<HTMLDialogElement>(dialog).showModal()
        element(`${dialog} nb-select button`).click()
        await render()
    }
    const topmost = (option: HTMLElement) => {
        const rect = option.getBoundingClientRect()
        return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('nb-option')
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(OverlayHostTestComponent)
        await render()
    })

    afterEach(() => {
        fixture.nativeElement.querySelectorAll('dialog').forEach((dialog: HTMLDialogElement) => dialog.close())
    })

    it('should show the overlays of the components inside it in its element, above a modal dialog', async () => {
        await open('.hosted')
        const option = document.querySelector('nb-option') as HTMLElement

        expect(element('.hosted').contains(option)).toBe(true)
        expect(topmost(option)).toBe(option)
    })

    it('should leave overlays outside it where they were, under a modal dialog', async () => {
        await open('.plain')
        const option = document.querySelector('nb-option') as HTMLElement

        expect(element('.hosted').contains(option)).toBe(false)
        expect(element('.plain').contains(option)).toBe(false)
        expect(topmost(option)).not.toBe(option)
    })

    it('should close only the select on Escape, not the dialog it is in', async () => {
        await open('.hosted')
        await userEvent.keyboard('{Escape}')
        await render()

        expect(document.querySelector('nb-option')).toBeNull()
        expect(element<HTMLDialogElement>('.hosted').open).toBe(true)

        await userEvent.keyboard('{Escape}')
        await render()
        expect(element<HTMLDialogElement>('.hosted').open).toBe(false)
    })

    it('should let go of its element when it is destroyed', async () => {
        await open('.hosted')
        element('.hosted nb-select button').click()
        element<HTMLDialogElement>('.hosted').close()
        fixture.componentInstance.hosted.set(false)
        await render()

        element('.plain nb-select button').click()
        await render()
        expect(document.querySelector('nb-option')?.isConnected).toBe(true)
        expect(document.querySelector('.hosted')).toBeNull()
    })
})
