import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbLayoutModule, NbSidebarModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <div class="nb-theme-default">
      <nb-layout>
        <nb-layout-header fixed>Acme</nb-layout-header>
        <nb-sidebar fixed drawer tag="drawer" [state]="state()">Menu</nb-sidebar>
        <nb-layout-column>Page</nb-layout-column>
      </nb-layout>
    </div>
  `,
    styleUrl: './sidebar-drawer.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbLayoutModule, NbSidebarModule]
})
class DrawerHostComponent {
    readonly state = signal<'expanded' | 'collapsed'>('expanded')
}

describe('nb-sidebar drawer', () => {
    it('should lie over a fixed header while it\'s open, from the top of the screen', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbSidebarModule.forRoot(), DrawerHostComponent] })
        const fixture = TestBed.createComponent(DrawerHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()

        const element: HTMLElement = fixture.nativeElement
        const sidebar = element.querySelector('nb-sidebar') as HTMLElement
        const header = element.querySelector('nb-layout-header') as HTMLElement
        expect(sidebar.classList).toContain('drawer')
        expect(sidebar.getBoundingClientRect().top).toBe(0)
        expect(Number(getComputedStyle(sidebar).zIndex)).toBeGreaterThan(Number(getComputedStyle(header).zIndex))
        const { left, width } = sidebar.getBoundingClientRect()
        expect(document.elementFromPoint(left + width / 2, header.getBoundingClientRect().height / 2)?.closest('nb-sidebar')).toBe(sidebar)

        // Closed, a fixed sidebar is under the header again.
        fixture.componentInstance.state.set('collapsed')
        fixture.detectChanges()
        await fixture.whenStable()
        expect(sidebar.classList).not.toContain('drawer')
        fixture.destroy()
    })
})
