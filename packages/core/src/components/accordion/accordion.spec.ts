import { Component, viewChild, viewChildren } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { NbAccordionItemComponent, NbAccordionModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    template: `
    <nb-accordion>
      <nb-accordion-item (collapsedChange)="changes.first.push($event)">
        <nb-accordion-item-header>First</nb-accordion-item-header>
        <nb-accordion-item-body>First body</nb-accordion-item-body>
      </nb-accordion-item>
      <nb-accordion-item (collapsedChange)="changes.second.push($event)">
        <nb-accordion-item-header>Second</nb-accordion-item-header>
        <nb-accordion-item-body>Second body</nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `,
    imports: [NbAccordionModule]
})
class NbAccordionTestComponent {
    readonly items = viewChildren(NbAccordionItemComponent)
    changes = { first: [] as boolean[], second: [] as boolean[] }
}

@Component({
    template: `
    <nb-accordion>
      <nb-accordion-item>
        <nb-accordion-item-header>Lazy</nb-accordion-item-header>
        <nb-accordion-item-body>
          <span class="lazy-content" *nbAccordionItemBodyContent>Lazy body</span>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `,
    imports: [NbAccordionModule]
})
class NbAccordionLazyTestComponent {
    readonly item = viewChild.required(NbAccordionItemComponent)
}

describe('nb-accordion', () => {
    it('should create nbAccordionItemBodyContent when the item first expands, and keep it', () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbAccordionLazyTestComponent] })
        const fixture = TestBed.createComponent(NbAccordionLazyTestComponent)
        fixture.detectChanges()
        const content = () => fixture.nativeElement.querySelector('.lazy-content') as HTMLElement | null

        expect(content()).toBeNull()

        fixture.componentInstance.item().open()
        fixture.detectChanges()
        expect(content()?.textContent).toBe('Lazy body')

        fixture.componentInstance.item().close()
        fixture.detectChanges()
        expect(content()).not.toBeNull()
    })

    it('should report each item state change once', () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbAccordionModule, NbAccordionTestComponent],
            providers: []
        })
        const fixture = TestBed.createComponent(NbAccordionTestComponent)
        fixture.detectChanges()
        const [first, second] = fixture.componentInstance.items()
        const { changes } = fixture.componentInstance

        first.toggle()
        second.toggle()
        fixture.detectChanges()

        expect(changes.first).toEqual([false, true])
        expect(changes.second).toEqual([false])
    })

    it('should have buttons for headers, which Enter and Space toggle without scrolling the page', () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbAccordionTestComponent] })
        const fixture = TestBed.createComponent(NbAccordionTestComponent)
        fixture.detectChanges()
        const header = fixture.nativeElement.querySelector('nb-accordion-item-header') as HTMLElement
        const press = (key: string) =>
            header.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

        expect(header.getAttribute('role')).toBe('button')
        expect(header.tabIndex).toBe(0)
        expect(press(' ')).toBe(false)
        fixture.detectChanges()
        expect(header.getAttribute('aria-expanded')).toBe('true')
        expect(press('Enter')).toBe(false)
        fixture.detectChanges()
        expect(header.getAttribute('aria-expanded')).toBe('false')
    })
})
