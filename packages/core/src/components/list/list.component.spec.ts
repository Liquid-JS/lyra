import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { NbListModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <nb-list>
      @for (item of items; track item) {
        @if (item.visible) {
          <nb-list-item>{{ item.title }}</nb-list-item>
        }
      }
    </nb-list>
  `,
    imports: [NbListModule]
})
class NbListWrappedItemsTestComponent {
    items = [
        { title: 'First', visible: true },
        { title: 'Hidden', visible: false },
        { title: 'Third', visible: true }
    ]
}

describe('nb-list', () => {
    it('should render items wrapped in ng-container', () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbListModule, NbListWrappedItemsTestComponent]
        })
        const fixture = TestBed.createComponent(NbListWrappedItemsTestComponent)
        fixture.detectChanges()

        const items = [...fixture.nativeElement.querySelectorAll('nb-list-item')].map((item: HTMLElement) => item.textContent.trim())
        expect(items).toEqual(['First', 'Third'])
    })
})

@Component({
    template: `
    <nb-list [style.height.px]="100">
      @for (item of items(); track item) {
        <nb-list-item>{{ item }}</nb-list-item>
      }
    </nb-list>
  `,
    imports: [NbListModule]
})
class NbScrollableListTestComponent {
    readonly items = signal(['First'])
}

describe('nb-list keyboard access', () => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)))

    it('should take focus only while it scrolls', async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbListModule, NbScrollableListTestComponent]
        })
        const fixture = TestBed.createComponent(NbScrollableListTestComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const list: HTMLElement = fixture.nativeElement.querySelector('nb-list')

        await nextFrame()
        expect(list.getAttribute('tabindex')).toBeNull()

        fixture.componentInstance.items.set(Array.from({ length: 20 }, (_, i) => `Item ${i}`))
        fixture.detectChanges()
        await nextFrame()
        expect(list.getAttribute('tabindex')).toBe('0')

        fixture.componentInstance.items.set(['First'])
        fixture.detectChanges()
        await nextFrame()
        expect(list.getAttribute('tabindex')).toBeNull()
        fixture.nativeElement.remove()
    })
})
