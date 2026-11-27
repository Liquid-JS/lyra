import { Component, signal, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbDialogModule, NbDialogService, NbLayoutModule, NbSidebarModule, NbThemeModule } from '@liquid-js/lyr-core'
import { ɵnbSwipeToDismiss as nbSwipeToDismiss } from '@liquid-js/lyr-core/base'

/** A finger on `target` at each point in turn, 16 ms apart, unless `pause` waits before it lifts. */
function swipe(target: Element, points: Array<[number, number]>, pause = 0) {
    let time = performance.now()
    const touch = ([clientX, clientY]: [number, number]) => new Touch({ identifier: 1, target, clientX, clientY })
    const fire = (type: string, point: [number, number], touches: Touch[]) => {
        const event = new TouchEvent(type, { bubbles: true, cancelable: true, touches, changedTouches: [touch(point)] })
        Object.defineProperty(event, 'timeStamp', { value: time })
        target.dispatchEvent(event)
        return event
    }
    fire('touchstart', points[0], [touch(points[0])])
    const moves = points.slice(1).map((point) => {
        time += 16
        return fire('touchmove', point, [touch(point)])
    })
    time += 16 + pause
    fire('touchend', points[points.length - 1], [])
    return moves
}

describe('nbSwipeToDismiss', () => {
    let panel: HTMLElement
    let dismissed: number
    let progress: number[]
    let stop: () => void

    beforeEach(() => {
        panel = document.createElement('div')
        panel.style.cssText = 'position: fixed; bottom: 0; left: 0; width: 300px; height: 200px; overflow: auto'
        panel.innerHTML = '<div class="tall" style="height: 600px"></div>'
        document.body.append(panel)
        dismissed = 0
        progress = []
        stop = nbSwipeToDismiss(panel, { edge: 'bottom', dismiss: () => dismissed++, progress: (fraction) => progress.push(fraction) })
    })
    afterEach(() => {
        stop()
        panel.remove()
    })

    it('should dismiss a panel dragged past a third of its size, which follows the finger', () => {
        const moves = swipe(panel, [[100, 300], [100, 320], [100, 360], [100, 380]], 200)
        expect(moves[1].defaultPrevented).toBe(true)
        expect(panel.style.transform).toBe('translateY(80px)')
        expect(progress.at(-1)).toBeCloseTo(0.4)
        expect(dismissed).toBe(1)
    })

    it('should dismiss a panel flicked a little way', () => {
        swipe(panel, [[100, 300], [100, 315], [100, 340]])
        expect(dismissed).toBe(1)
    })

    it('should move a panel dragged a little way back, slowly', () => {
        swipe(panel, [[100, 300], [100, 315], [100, 330]], 200)
        expect(dismissed).toBe(0)
        expect(panel.style.transform).toBe('')
        expect(progress.at(-1)).toBe(0)
    })

    it('should leave a drag the other way or across to the page', () => {
        const up = swipe(panel, [[100, 300], [100, 280], [100, 200]])
        const across = swipe(panel, [[100, 300], [140, 310], [200, 330]])
        expect([...up, ...across].some((event) => event.defaultPrevented)).toBe(false)
        expect(dismissed).toBe(0)
    })

    it('should let content scrolled down scroll back first', () => {
        panel.scrollTop = 100
        const moves = swipe(panel.querySelector('.tall') as Element, [[100, 300], [100, 340], [100, 400]])
        expect(moves.some((event) => event.defaultPrevented)).toBe(false)
        expect(dismissed).toBe(0)
    })

    it('should stop when it\'s stopped', () => {
        stop()
        swipe(panel, [[100, 300], [100, 340], [100, 400]])
        expect(dismissed).toBe(0)
    })
})

@Component({
    template: `
    <div class="nb-theme-default">
      <nb-layout>
        <nb-layout-header fixed>Acme</nb-layout-header>
        <nb-sidebar fixed drawer tag="drawer" [state]="state()" [end]="end()"><span class="menu">Menu</span></nb-sidebar>
        <nb-layout-column>Page</nb-layout-column>
      </nb-layout>
    </div>
  `,
    styleUrl: './swipe-to-dismiss.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbLayoutModule, NbSidebarModule]
})
class PhoneHostComponent {
    readonly state = signal<'expanded' | 'collapsed'>('collapsed')
    readonly end = signal(false)
}

@Component({
    template: '<div class="sheet-content" style="height: 240px">Details</div>'
})
class SheetContentComponent {}

describe('Swiping a sheet and a drawer away', () => {
    const create = async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbSidebarModule.forRoot(), NbDialogModule.forRoot(), PhoneHostComponent]
        })
        const fixture = TestBed.createComponent(PhoneHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
        return fixture
    }
    const settle = async () => {
        await new Promise((resolve) => setTimeout(resolve, 400))
    }

    it('should close a sheet swiped down, and keep one swiped a little', async () => {
        const fixture = await create()
        const dialogs = TestBed.inject(NbDialogService)
        const ref = dialogs.open(SheetContentComponent, { sheet: true })
        let closed = false
        ref.onClose.subscribe(() => (closed = true))
        await settle()
        const content = document.querySelector('.sheet-content') as HTMLElement
        const top = content.getBoundingClientRect().top

        swipe(content, [[100, top + 10], [100, top + 25], [100, top + 40]], 200)
        await settle()
        expect(closed).toBe(false)

        swipe(content, [[100, top + 10], [100, top + 60], [100, top + 140]], 200)
        await settle()
        expect(closed).toBe(true)
        fixture.destroy()
    })

    it('should keep a sheet its backdrop doesn\'t close', async () => {
        const fixture = await create()
        const ref = TestBed.inject(NbDialogService).open(SheetContentComponent, { sheet: true, closeOnBackdropClick: false })
        let closed = false
        ref.onClose.subscribe(() => (closed = true))
        await settle()
        const content = document.querySelector('.sheet-content') as HTMLElement
        const top = content.getBoundingClientRect().top
        swipe(content, [[100, top + 10], [100, top + 60], [100, top + 200]], 200)
        await settle()
        expect(closed).toBe(false)
        ref.close()
        await settle()
        fixture.destroy()
    })

    for (const end of [false, true]) {
        it(`should close a drawer at the screen's ${end ? 'right' : 'left'} swiped toward it`, async () => {
            const fixture = await create()
            fixture.componentInstance.end.set(end)
            fixture.componentInstance.state.set('expanded')
            fixture.detectChanges()
            await fixture.whenStable()
            const sidebar = fixture.nativeElement.querySelector('nb-sidebar') as HTMLElement
            expect(sidebar.classList).toContain('drawer')
            const menu = sidebar.querySelector('.menu') as HTMLElement
            const { left, top } = menu.getBoundingClientRect()
            const way = end ? 1 : -1
            swipe(menu, [[left + 100, top], [left + 100 + way * 40, top + 2], [left + 100 + way * 160, top + 4]], 200)
            await settle()
            fixture.detectChanges()
            await fixture.whenStable()
            expect(sidebar.classList).not.toContain('drawer')
            expect(sidebar.classList).toContain('collapsed')
            expect((sidebar.querySelector('.main-container') as HTMLElement).style.transform).toBe('')
            fixture.destroy()
        })
    }
})
