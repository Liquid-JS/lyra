import { assert } from 'vitest'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
    Component,
    DebugElement,
    ElementRef,
    input,
    output,
    viewChild,
    viewChildren,
    signal
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'

import { NbThemeModule, NbRadioModule, NbRadioComponent, NbRadioGroupComponent, NB_DOCUMENT } from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-radio-test',
    template: `
    <nb-radio-group [value]="value()" (valueChange)="valueChange.emit($event)">
      <nb-radio value="1">1</nb-radio>
      <nb-radio value="2">2</nb-radio>
      <nb-radio value="3" disabled>3</nb-radio>
    </nb-radio-group>
  `,
    imports: [NbRadioModule]
})
export class NbRadioTestComponent {
    readonly value = input<any>()
    readonly valueChange = output<any>()
}

@Component({
    template: `
    <nb-radio-group [value]="groupValue()" [name]="groupName()" [disabled]="groupDisabled()" [status]="groupStatus()">
      @if (showRadios()) {
        @for (radio of radioValues(); track radio) {
          <nb-radio [value]="radio">{{ radio }}</nb-radio>
        }
      }
    </nb-radio-group>
  `,
    imports: [NbRadioModule, ReactiveFormsModule]
})
export class NbRadioWithDynamicValuesTestComponent {
    readonly radioValues = signal<number[]>([])
    readonly showRadios = signal<boolean>(false)
    readonly groupValue = signal<any>(undefined)
    readonly groupName = signal<string | undefined>(undefined)
    readonly groupDisabled = signal<boolean | undefined>(undefined)
    readonly groupStatus = signal('basic')

    readonly radioGroupComponent = viewChild.required(NbRadioGroupComponent)
    readonly radioComponents = viewChildren(NbRadioComponent)
}

@Component({
    template: `
    <nb-radio-group #firstGroup name="1">
      <nb-radio checked value="1" />
    </nb-radio-group>
    <nb-radio-group #secondGroup name="2">
      <nb-radio checked value="2" />
    </nb-radio-group>
  `,
    imports: [NbRadioModule, ReactiveFormsModule]
})
export class NbTwoRadioGroupsComponent {
    readonly firstGroup = viewChild.required('firstGroup', { read: NbRadioGroupComponent })
    readonly secondGroup = viewChild.required('secondGroup', { read: NbRadioGroupComponent })
    readonly radios = viewChildren(NbRadioComponent, { read: ElementRef })
}

@Component({
    template: `
    <nb-radio-group name="1" [formControl]="control">
      <nb-radio value="1" />
      <nb-radio value="2" />
    </nb-radio-group>
  `,
    imports: [NbRadioModule, ReactiveFormsModule]
})
export class NbFormsIntegrationComponent {
    readonly radioGroup = viewChild.required(NbRadioGroupComponent)
    control = new FormControl({ value: '1', disabled: true })
}

describe('radio', () => {
    let fixture: ComponentFixture<NbRadioTestComponent>
    let comp: NbRadioTestComponent

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbRadioModule, NbRadioTestComponent],
            providers: [{ provide: NB_DOCUMENT, useValue: document }]
        })

        fixture = TestBed.createComponent(NbRadioTestComponent)
        comp = fixture.componentInstance
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()
    })

    it('should render radios', () => {
        const radios: DebugElement[] = fixture.debugElement.queryAll(By.directive(NbRadioComponent))
        expect(radios.length).toBe(3)
    })

    it('should fire value when selected', () => new Promise<void>((done) => {
        const secondRadio: DebugElement = fixture.debugElement.queryAll(By.directive(NbRadioComponent))[1]
        comp.valueChange.subscribe((value) => {
            expect(value).toEqual(secondRadio.componentInstance.value())
            done()
        })
        const radioInput = secondRadio.query(By.css('input'))
        radioInput.nativeElement.click()
    }))
})

describe('NbRadioGroupComponent', () => {
    let fixture: ComponentFixture<NbRadioWithDynamicValuesTestComponent>
    let radioTestComponent: NbRadioWithDynamicValuesTestComponent

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                NbThemeModule.forRoot(),
                NbRadioModule,
                ReactiveFormsModule,
                NbRadioWithDynamicValuesTestComponent,
                NbTwoRadioGroupsComponent,
                NbFormsIntegrationComponent
            ],
            providers: [{ provide: NB_DOCUMENT, useValue: document }]
        })

        fixture = TestBed.createComponent(NbRadioWithDynamicValuesTestComponent)
        radioTestComponent = fixture.componentInstance
        fixture.detectChanges()
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios'
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'
    })

    it('should update radio value when radios added after radio group initialization', async () => {
        radioTestComponent.radioValues.set([1, 2, 3])
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupValue.set(1)
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        expect(radioTestComponent.radioComponents()[0].isChecked()).toEqual(true)
        const otherRadios = radioTestComponent.radioComponents().slice(1)
        for (const radio of otherRadios) {
            expect(radio.isChecked()).toEqual(false)
        }
    })

    it('should update radio name when radios added after radio group initialization', async () => {
        const groupName = 'my-radio-group-name'
        radioTestComponent.radioValues.set([1, 2, 3])
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupName.set(groupName)
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        for (const radio of radioTestComponent.radioComponents()) {
            expect(radio.resolvedName()).toEqual(groupName)
        }
    })

    it('should update radio disabled state when radios added after radio group initialization', async () => {
        radioTestComponent.radioValues.set([1, 2, 3])
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupDisabled.set(true)
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        for (const radio of radioTestComponent.radioComponents()) {
            expect(radio.isDisabled()).toEqual(true)
        }
    })

    it('should update radio status when radios added after radio group initialization', async () => {
        radioTestComponent.radioValues.set([1, 2, 3])
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupStatus.set('info')
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        for (const radio of radioTestComponent.radioComponents()) {
            expect(radio.resolvedStatus()).toEqual('info')
        }
    })

    it('should emit the value of a radio added after radio group initialization', async () => {
        const radioValue = 333
        radioTestComponent.radioValues.set([radioValue])
        radioTestComponent.showRadios.set(true)
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        const valueChangeSpy = vi.fn()
        radioTestComponent.radioGroupComponent().valueChange.subscribe(valueChangeSpy);
        // The radios sit in nested blocks, which the group shows all the same.
        (fixture.nativeElement.querySelector('nb-radio input') as HTMLInputElement).click()

        await fixture.whenStable()

        expect(valueChangeSpy).toHaveBeenCalledTimes(1)
        expect(valueChangeSpy).toHaveBeenCalledWith(radioValue)
    })

    it('should update radio value when radios change', async () => {
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupValue.set(1)
        fixture.detectChanges()

        radioTestComponent.radioValues.set([1, 2, 3])
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        expect(radioTestComponent.radioComponents()[0].isChecked()).toEqual(true)
        const otherRadios = radioTestComponent.radioComponents().slice(1)
        for (const radio of otherRadios) {
            expect(radio.isChecked()).toBeFalsy()
        }
    })

    it('should update radio name when radios change', async () => {
        const groupName = 'my-radio-group-name'
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupName.set(groupName)
        fixture.detectChanges()

        radioTestComponent.radioValues.set([1, 2, 3])
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        for (const radio of radioTestComponent.radioComponents()) {
            expect(radio.resolvedName()).toEqual(groupName)
        }
    })

    it('should update radio disabled state when radios change', async () => {
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupDisabled.set(true)
        fixture.detectChanges()

        radioTestComponent.radioValues.set([1, 2, 3])
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        for (const radio of radioTestComponent.radioComponents()) {
            expect(radio.isDisabled()).toEqual(true)
        }
    })

    it('should update radio status when radios change', async () => {
        radioTestComponent.showRadios.set(true)
        radioTestComponent.groupStatus.set('info')
        fixture.detectChanges()

        radioTestComponent.radioValues.set([1, 2, 3])
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges() // detect changes made during 'updateAndSubscribeToRadios'

        for (const radio of radioTestComponent.radioComponents()) {
            expect(radio.resolvedStatus()).toEqual('info')
        }
    })

    it('should emit the value of a radio added when radios change', async () => {
        const valueChangeSpy = vi.fn()
        radioTestComponent.radioGroupComponent().valueChange.subscribe(valueChangeSpy)
        radioTestComponent.showRadios.set(true)
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()

        const radioValue = 333
        radioTestComponent.radioValues.set([radioValue])
        fixture.detectChanges() // adds radios
        await fixture.whenStable() // promise with 'updateAndSubscribeToRadios' in NbRadioGroup.radios.changes
        fixture.detectChanges(); // detect changes made during 'updateAndSubscribeToRadios'

        // The radios sit in nested blocks, which the group shows all the same.
        (fixture.nativeElement.querySelector('nb-radio input') as HTMLInputElement).click()
        await fixture.whenStable()

        expect(valueChangeSpy).toHaveBeenCalledTimes(1)
        expect(valueChangeSpy).toHaveBeenCalledWith(radioValue)
    })

    it('should set options name right away so it won\'t overlap with options from another groups', () => {
        const radioFixture = TestBed.createComponent(NbTwoRadioGroupsComponent)
        radioFixture.detectChanges()

        const { firstGroup, secondGroup, radios } = radioFixture.componentInstance
        const radioFromFirstGroup = radios()[0].nativeElement.querySelector('input')
        const lastRadio = radios().at(-1)
        assert(lastRadio)
        const radioFromSecondGroup = lastRadio.nativeElement.querySelector('input')

        expect(firstGroup().radios()[0].isChecked()).toEqual(true)
        expect(radioFromFirstGroup.checked).toEqual(true)
        expect(secondGroup().radios()[0].isChecked()).toEqual(true)
        expect(radioFromSecondGroup.checked).toEqual(true)
    })

    it('should disable radio group if form control is disabled', async () => {
        vi.useFakeTimers()
        const radioFixture = TestBed.createComponent(NbFormsIntegrationComponent)
        radioFixture.detectChanges()

        const { radioGroup } = radioFixture.componentInstance
        await vi.advanceTimersByTimeAsync(0)

        expect(radioGroup().radios()[0].isDisabled()).toEqual(true)
    })
})

@Component({
    template: `
    <nb-radio-group name="named" value="1">
      @for (option of options; track option) {
        <nb-radio [value]="option">{{ option }}</nb-radio>
      }
    </nb-radio-group>
  `,
    imports: [NbRadioGroupComponent, NbRadioComponent]
})
class NbRadioGroupLoopTestComponent {
    options = ['1', '2']
}

describe('NbRadioGroupComponent with radios rendered in a loop', () => {
    it('should render the group name in its radios from the first change detection', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const fixture = TestBed.createComponent(NbRadioGroupLoopTestComponent)
        fixture.detectChanges()
        // The group applies its value to the radios in a microtask, which schedules the next render.
        await Promise.resolve()
        await fixture.whenStable()

        const inputs: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('input'))
        expect(inputs.map((element) => element.name)).toEqual(['named', 'named'])
        expect(inputs.map((element) => element.checked)).toEqual([true, false])
    })
})

// One template shown in two places, e.g. filters in a sidebar and in a sheet, both bound to the same value.
@Component({
    template: `
    @for (place of ['side', 'sheet']; track place) {
      <nb-radio-group [value]="sort()" (valueChange)="sort.set($event)">
        <nb-radio value="popular">Most popular</nb-radio>
        <nb-radio value="rating">Highest rated</nb-radio>
      </nb-radio-group>
    }
  `,
    imports: [NbRadioGroupComponent, NbRadioComponent]
})
class NbRadioGroupTwiceTestComponent {
    readonly sort = signal('popular')
}

describe('NbRadioGroupComponent without a name', () => {
    it('should give its radios a name of its own, so a copy of it checks its radios too', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const fixture = TestBed.createComponent(NbRadioGroupTwiceTestComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()

        const groups = [...fixture.nativeElement.querySelectorAll('nb-radio-group')] as HTMLElement[]
        const inputs = groups.map((group) => [...group.querySelectorAll('input')] as HTMLInputElement[])
        expect(inputs[0][0].name).toMatch(/^nb-radio-group-\d+$/)
        expect(inputs[0][0].name).toBe(inputs[0][1].name)
        expect(inputs[0][0].name).not.toBe(inputs[1][0].name)

        inputs[0][1].click()
        fixture.detectChanges()
        await fixture.whenStable()
        expect(fixture.componentInstance.sort()).toBe('rating')
        expect(inputs.map((group) => group.map((field) => field.checked))).toEqual([
            [false, true],
            [false, true]
        ])
        fixture.destroy()
    })
})

// A radio's own checked state, bound both ways, as a checkbox's is; the group gives the value.
@Component({
    template: `
    <nb-radio-group>
      <nb-radio value="monthly" [(checked)]="monthly">Monthly</nb-radio>
      <nb-radio value="yearly" (checkedChange)="yearly.push($event)">Yearly</nb-radio>
    </nb-radio-group>
  `,
    imports: [NbRadioGroupComponent, NbRadioComponent]
})
class NbRadioCheckedTestComponent {
    readonly monthly = signal(true)
    readonly yearly = new Array<boolean>()
}

describe('NbRadioComponent checkedChange', () => {
    it('should tell when it is checked, and when another radio of its group unchecks it', async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        const fixture = TestBed.createComponent(NbRadioCheckedTestComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
        const inputs = [...fixture.nativeElement.querySelectorAll('input')] as HTMLInputElement[]
        expect(inputs.map((field) => field.checked)).toEqual([true, false])

        inputs[1].click()
        fixture.detectChanges()
        await fixture.whenStable()
        expect(fixture.componentInstance.yearly).toEqual([true])
        expect(fixture.componentInstance.monthly()).toBe(false)
        fixture.destroy()
    })
})
