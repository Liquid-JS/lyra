import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { expectTypeOf } from 'vitest'

import {
    NbBooleanInput,
    NbSelectComponent,
    NbSelectModule,
    NbSelectValue,
    NbThemeModule,
    NbViewportRulerAdapter
} from '@liquid-js/lyr-core'

interface City {
    name: string
}

class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
    override getViewportSize(): Readonly<{ width: number, height: number }> {
        return { width: 1600, height: 900 }
    }
    override getViewportScrollPosition(): { left: number, top: number } {
        return { left: 0, top: 0 }
    }
}

const LONDON: City = { name: 'London' }
const BOSTON: City = { name: 'Boston' }

/**
 * The handlers take what each select's type says it gives: one value or null without `multiple` (or with `false`),
 * arrays with it, either for a `boolean` that may be either. This checks the values at runtime; the template type
 * checking itself is guarded by builds that check templates (the library's single selects and the playground's
 * multiple select example), since unit tests compile templates without it.
 */
@Component({
    imports: [NbSelectModule],
    template: `
    <nb-select class="single" [selected]="city()" (selectedChange)="single($event)">
      <nb-option [value]="london">London</nb-option>
      <nb-option [value]="boston">Boston</nb-option>
    </nb-select>
    <nb-select class="single-false" [multiple]="false" [selected]="city()" (selectedChange)="single($event)">
      <nb-option [value]="london">London</nb-option>
    </nb-select>
    <nb-select class="multiple" multiple [selected]="cities()" (selectedChange)="multiple($event)">
      <nb-option [value]="london">London</nb-option>
      <nb-option [value]="boston">Boston</nb-option>
    </nb-select>
    <nb-select class="multiple-true" [multiple]="true" [selected]="cities()" (selectedChange)="multiple($event)">
      <nb-option [value]="london">London</nb-option>
    </nb-select>
    <nb-select class="either" [multiple]="flag()" [selected]="either()" (selectedChange)="either.set($event)">
      <nb-option [value]="london">London</nb-option>
    </nb-select>
  `
})
class NbSelectValueHostComponent {
    readonly london = LONDON
    readonly boston = BOSTON
    readonly city = signal<City | null>(null)
    readonly cities = signal(new Array<City>())
    readonly flag = signal(false)
    readonly either = signal<City | City[] | null>(null)
    readonly singles = new Array<City | null>()
    readonly multiples = new Array<City[]>()

    single(value: City | null) {
        this.singles.push(value)
    }

    multiple(value: City[]) {
        this.multiples.push(value)
    }
}

describe('NbSelectComponent - selectedChange types', () => {
    let fixture: ComponentFixture<NbSelectValueHostComponent>
    let host: NbSelectValueHostComponent

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const choose = async (select: string, text: string) => {
        (fixture.nativeElement.querySelector(`nb-select.${select} button`) as HTMLButtonElement).click()
        await render()
        const option = [...document.querySelectorAll('nb-option')].find((o) => o.textContent?.trim() === text);
        (option as HTMLElement).click()
        await render()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }]
        })
        fixture = TestBed.createComponent(NbSelectValueHostComponent)
        host = fixture.componentInstance
        document.body.appendChild(fixture.nativeElement)
        await render()
    })

    afterEach(() => fixture.destroy())

    it('should give a single select one value', async () => {
        await choose('single', 'Boston')
        expect(host.singles).toEqual([BOSTON])
    })

    it('should give a multiple select an array, with the attribute or a true binding', async () => {
        await choose('multiple', 'Boston')
        await choose('multiple-true', 'London')
        expect(host.multiples).toEqual([[BOSTON], [LONDON]])
    })

    it('should follow a boolean multiple at runtime', async () => {
        await choose('either', 'London')
        expect(host.either()).toEqual(LONDON)
    })

    it('should type the value by the multiple input', () => {
        expectTypeOf<NbSelectValue<City, false>>().toEqualTypeOf<City | null>()
        expectTypeOf<NbSelectValue<City, 'false'>>().toEqualTypeOf<City | null>()
        expectTypeOf<NbSelectValue<City, true>>().toEqualTypeOf<City[]>()
        expectTypeOf<NbSelectValue<City, ''>>().toEqualTypeOf<City[]>()
        expectTypeOf<NbSelectValue<City, 'true'>>().toEqualTypeOf<City[]>()
        expectTypeOf<NbSelectValue<City, boolean>>().toEqualTypeOf<City | City[] | null>()
        // A mode that isn't known, as a query or a reference without `M` gives it, is a single select.
        expectTypeOf<NbSelectValue<City, NbBooleanInput>>().toEqualTypeOf<City | null>()
        expectTypeOf<NbSelectComponent<City>['selectedChange']>().toEqualTypeOf<
            NbSelectComponent<City, NbBooleanInput>['selectedChange']
        >()
    })
})
