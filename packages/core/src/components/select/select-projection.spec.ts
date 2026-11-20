import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbSelectModule, NbThemeModule, NbViewportRulerAdapter } from '@liquid-js/lyr-core'

class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
    override getViewportSize(): Readonly<{ width: number, height: number }> {
        return { width: 1600, height: 900 }
    }
    override getViewportScrollPosition(): { left: number, top: number } {
        return { left: 0, top: 0 }
    }
}

// Options in control flow nested in another, which a slot for options by their selector wouldn't take.
@Component({
    imports: [NbSelectModule],
    template: `
    <nb-select [selected]="guests()" (selectedChange)="guests.set($event ?? 1)">
      <nb-select-label>Guests</nb-select-label>
      <nb-option [value]="1">1 guest</nb-option>
      @for (count of counts; track count) {
        @if (count <= limit()) {
          <nb-option [value]="count">{{ count }} guests</nb-option>
        }
      }
    </nb-select>
  `
})
class NbSelectProjectionHostComponent {
    readonly counts = [2, 3, 4, 5]
    readonly limit = signal(4)
    readonly guests = signal(2)
}

describe('NbSelectComponent - projected options', () => {
    let fixture: ComponentFixture<NbSelectProjectionHostComponent>

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }]
        })
        fixture = TestBed.createComponent(NbSelectProjectionHostComponent)
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => fixture.destroy())

    it('should list options from nested control flow, in their order, and keep the label out of the list', async () => {
        (fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement).click()
        await render()
        const list = document.querySelector('nb-option-list') as HTMLElement
        const options = [...list.querySelectorAll('nb-option')].map((option) => option.textContent?.trim())
        expect(options).toEqual(['1 guest', '2 guests', '3 guests', '4 guests'])
        expect(list.querySelector('nb-select-label')).toBeNull();

        (list.querySelectorAll('nb-option')[2] as HTMLElement).click()
        await render()
        expect(fixture.componentInstance.guests()).toBe(3)
    })
})
