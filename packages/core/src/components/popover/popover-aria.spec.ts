import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { NbContextMenuModule, NbMenuModule, NbPopoverModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <button class="popover-host" nbPopover="Details">Details</button>
    <button class="menu-host" [nbContextMenu]="items">Actions</button>
    <button class="hint-host" nbPopover="A hint" nbPopoverTrigger="hint">Hint</button>
    <button class="menu-off" [nbContextMenu]="items" nbContextMenuDisabled>Off</button>
  `,
    imports: [NbPopoverModule, NbContextMenuModule]
})
class DisclosureHostComponent {
    readonly items = [{ title: 'Edit' }, { title: 'Delete' }]
}

// A popover or context menu that opens on click says so, as a disclosure does, and as fields with overlays do.
describe('popover and context menu hosts', () => {
    let fixture: ComponentFixture<DisclosureHostComponent>

    const host = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbMenuModule.forRoot(), DisclosureHostComponent],
            providers: [provideRouter([])]
        })
        fixture = TestBed.createComponent(DisclosureHostComponent)
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => {
        fixture.destroy()
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
    })

    for (const [name, selector, container] of [
        ['popover', '.popover-host', 'nb-popover'],
        ['context menu', '.menu-host', 'nb-context-menu']
    ]) {
        it(`should say whether its ${name} is open, and which it is`, async () => {
            expect(host(selector).getAttribute('aria-expanded')).toBe('false')
            expect(host(selector).hasAttribute('aria-controls')).toBe(false)

            host(selector).click()
            await render()
            const opened = document.querySelector(container)
            expect(host(selector).getAttribute('aria-expanded')).toBe('true')
            expect(host(selector).getAttribute('aria-controls')).toBe(opened?.id)
        })
    }

    it('should keep a disabled context menu closed, as a disabled popover', async () => {
        host('.menu-off').click()
        await render()
        expect(document.querySelector('nb-context-menu')).toBeNull()
    })

    it('should not say so for a popover that opens on hover', () => {
        expect(host('.hint-host').hasAttribute('aria-expanded')).toBe(false)
    })
})
