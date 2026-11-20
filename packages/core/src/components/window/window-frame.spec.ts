import { Component, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbThemeModule, NbWindowModule, NbWindowService } from '@liquid-js/lyr-core'

@Component({
    template: '<ng-template #content>Notes</ng-template>',
    styleUrl: './window-frame.spec.scss',
    encapsulation: ViewEncapsulation.None
})
class WindowFrameHostComponent {
    readonly content = viewChild.required<TemplateRef<unknown>>('content')
}

// The theme's values the frame takes: its own, which follow a floating card's.
const THEME = {
    '--window-background-color': 'rgb(1, 2, 3)',
    '--window-border-color': 'rgb(4, 5, 6)',
    '--window-border-radius': '7px',
    '--window-shadow': 'rgb(7, 8, 9) 0px 0px 4px 0px',
    '--card-background-color': 'rgb(200, 0, 0)',
    '--card-floating-shadow': 'rgb(200, 0, 0) 0px 0px 9px 0px'
}

describe('nb-window frame', () => {
    afterEach(() => {
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.remove())
        document.body.classList.remove('nb-theme-default')
        Object.keys(THEME).forEach((name) => document.body.style.removeProperty(name))
    })

    it('should be framed by its own variables', () => {
        document.body.classList.add('nb-theme-default')
        Object.entries(THEME).forEach(([name, value]) => document.body.style.setProperty(name, value))
        const fixture = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbWindowModule.forRoot(), WindowFrameHostComponent]
        }).createComponent(WindowFrameHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const windowRef = TestBed.inject(NbWindowService).open(fixture.componentInstance.content(), { title: 'Notes' })
        windowRef.windowComponentRef.changeDetectorRef.detectChanges()

        const card = windowRef.windowComponentRef.location.nativeElement.querySelector('nb-card') as HTMLElement
        const style = getComputedStyle(card)
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)')
        expect(style.borderTopColor).toBe('rgb(4, 5, 6)')
        expect(style.borderTopLeftRadius).toBe('7px')
        expect(style.boxShadow).toBe('rgb(7, 8, 9) 0px 0px 4px 0px')
        fixture.destroy()
    })
})
