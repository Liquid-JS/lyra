import { Component, effect, viewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbSelectComponent, NbSelectModule, NbThemeModule } from '@liquid-js/lyr-core'

interface City {
    name: string
}

const LONDON: City = { name: 'London' }
const BOSTON: City = { name: 'Boston' }

@Component({
    imports: [NbSelectModule],
    template: `
    <nb-select>
      <nb-option [value]="london">London</nb-option>
      <nb-option [value]="boston">Boston</nb-option>
    </nb-select>
  `
})
class NbSelectWriteValueHostComponent {
    readonly london = LONDON
    readonly boston = BOSTON
    readonly select = viewChild.required<NbSelectComponent<City>>(NbSelectComponent)
}

/**
 * Forms write values from wherever an app sets them, e.g. an effect that fills a form from a config the form itself
 * produces. A select mustn't turn that into a loop: writing the value it shows changes nothing, and the effect doesn't
 * come to depend on the select.
 */
describe('NbSelectComponent - writeValue', () => {
    let fixture: ComponentFixture<NbSelectWriteValueHostComponent>
    let select: NbSelectComponent<City>

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(NbSelectWriteValueHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        select = fixture.componentInstance.select()
    })

    afterEach(() => fixture.destroy())

    it('should keep the selection when the value it shows is written again', () => {
        select.writeValue(LONDON)
        const selection = select.selectionModel()

        select.writeValue(LONDON)

        expect(select.selectionModel()).toBe(selection)
        expect(select.selectedValue()).toBe(LONDON)
    })

    it('should not make an effect that writes the value depend on the select', () => {
        let runs = 0
        TestBed.runInInjectionContext(() =>
            effect(() => {
                runs++
                select.writeValue(LONDON)
            })
        )
        TestBed.tick()
        expect(runs).toBe(1)

        select.writeValue(BOSTON)
        TestBed.tick()

        expect(runs).toBe(1)
        expect(select.selectedValue()).toBe(BOSTON)
    })
})
