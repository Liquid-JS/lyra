import { assert } from 'vitest'
import {
    Component,
    signal,
    Type,
    viewChildren,
    WritableSignal
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
    FormControl,
    FormGroup,
    FormsModule,
    NgModel,
    ReactiveFormsModule
} from '@angular/forms'
import { disabled, form, FormField } from '@angular/forms/signals'
import {
    NbAutocompleteComponent,
    NbAutocompleteDirective,
    NbCheckboxComponent,
    NbDatepickerComponent,
    NbDatepickerDirective,
    NbDateService,
    NbInputDirective,
    NbLayoutColumnComponent,
    NbLayoutComponent,
    NbNumberInputDirective,
    NbOptionComponent,
    NbRadioComponent,
    NbRadioGroupComponent,
    NbSelectComponent,
    NbTimePickerComponent,
    NbTimePickerDirective,
    NbToggleComponent,
    provideNbDatepicker,
    provideNbTheme,
    provideNbTimepicker
} from '@liquid-js/lyr-core'

// Every form control, bound through each Angular forms API: template-driven (`ngModel`), reactive
// (`formControlName`) and signal forms (`[formField]`). The hosts' templates (forms-*.spec.html) differ only in the binding.
const imports = [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbCheckboxComponent,
    NbToggleComponent,
    NbRadioGroupComponent,
    NbRadioComponent,
    NbSelectComponent,
    NbOptionComponent,
    NbInputDirective,
    NbNumberInputDirective,
    NbAutocompleteDirective,
    NbAutocompleteComponent,
    NbDatepickerDirective,
    NbDatepickerComponent,
    NbTimePickerDirective,
    NbTimePickerComponent
]

interface Values {
    checkbox: boolean
    toggle: boolean
    radio: string
    select: string
    autocomplete: string
    datepicker: Date
    timepicker: Date
    input: string
    number: number
    textarea: string
}
type ControlName = keyof Values

const initialValues = (): Values => ({
    checkbox: false,
    toggle: false,
    radio: 'a',
    select: 'a',
    autocomplete: 'a',
    datepicker: new Date(2026, 0, 15),
    timepicker: new Date(2026, 0, 15, 10, 30),
    input: 'a',
    number: 0.5,
    textarea: 'a'
})

/** What a spec needs from a host, whichever forms API it binds the controls with. */
interface FormsHost {
    value(name: ControlName): unknown
    setValue<K extends ControlName>(name: K, value: Values[K]): void
    setDisabled(isDisabled: boolean): void
    touched(name: ControlName): boolean
}

@Component({
    templateUrl: './forms-template-driven.spec.html',
    imports: [...imports, FormsModule]
})
class NbTemplateDrivenHostComponent implements FormsHost {
    readonly values = Object.fromEntries(
        Object.entries(initialValues()).map(([name, value]) => [
            name,
            signal(value)
        ])
    ) as { [K in ControlName]: WritableSignal<Values[K]> }
    readonly disabled = signal(false)
    readonly models = viewChildren(NgModel)

    value(name: ControlName) {
        return this.values[name]()
    }

    setValue<K extends ControlName>(name: K, value: Values[K]) {
        this.values[name].set(value)
    }

    setDisabled(isDisabled: boolean) {
        this.disabled.set(isDisabled)
    }

    touched(name: ControlName) {
        const model = this.models().find((m) => m.name === name)
        assert(model, `no ngModel named ${name}`)
        return model.control.touched
    }
}

@Component({
    templateUrl: './forms-reactive.spec.html',
    imports: [...imports, ReactiveFormsModule]
})
class NbReactiveHostComponent implements FormsHost {
    readonly form = new FormGroup(
        Object.fromEntries(
            Object.entries(initialValues()).map(([name, value]) => [
                name,
                new FormControl(value)
            ])
        ) as {
            [K in ControlName]: FormControl<Values[K]>;
        }
    )

    value(name: ControlName) {
        return this.form.controls[name].value
    }

    setValue<K extends ControlName>(name: K, value: Values[K]) {
        this.form.controls[name].setValue(value)
    }

    setDisabled(isDisabled: boolean) {
        if (isDisabled) {
            this.form.disable()
        } else {
            this.form.enable()
        }
    }

    touched(name: ControlName) {
        return this.form.controls[name].touched
    }
}

@Component({
    templateUrl: './forms-signal.spec.html',
    imports: [...imports, FormField]
})
class NbSignalFormsHostComponent implements FormsHost {
    readonly values = signal(initialValues())
    readonly disabled = signal(false)
    readonly form = form(this.values, (path) =>
        disabled(path, { when: () => this.disabled() })
    )

    value(name: ControlName) {
        return this.values()[name]
    }

    setValue<K extends ControlName>(name: K, value: Values[K]) {
        this.values.update((values) => ({ ...values, [name]: value }))
    }

    setDisabled(isDisabled: boolean) {
        this.disabled.set(isDisabled)
    }

    touched(name: ControlName) {
        return this.form[name]().touched()
    }
}

/** How a spec reads, changes, disables and blurs one control through its DOM. */
interface ControlDriver<V = unknown> {
    /** The value the spec writes into the form. */
    written: V
    /** What the control shows for the written value. */
    shows(element: HTMLElement): unknown
    shown: unknown
    /** Changes the value as a user would, and returns the value the form should hold then. */
    change(
        element: HTMLElement,
        fixture: ComponentFixture<FormsHost>,
    ): Promise<V> | V
    disabled(element: HTMLElement): boolean
    /** The element a user leaves, marking the control touched; absent when the control has no blur of its own. */
    blurs?(element: HTMLElement): HTMLElement
}

const query = <T extends Element>(root: ParentNode, selector: string) => {
    const el = root.querySelector<T>(selector)
    assert(el, `${selector} not rendered`)
    return el
}

const nativeInput = (element: ParentNode) => query<HTMLInputElement>(element, 'input')

const type = (input: HTMLInputElement | HTMLTextAreaElement, text: string) => {
    input.value = text
    input.dispatchEvent(new Event('input'))
}

const pickOption = async (
    element: HTMLElement,
    fixture: ComponentFixture<FormsHost>,
    text: string
) => {
    query<HTMLButtonElement>(element, 'button.select-button').click()
    await fixture.whenStable()
    const options = Array.from(
        document.querySelectorAll<HTMLElement>('.cdk-overlay-container nb-option')
    )
    const option = options.find((o) => o.textContent.trim() === text)
    assert(option, `no option ${text}`)
    option.click()
    await fixture.whenStable()
}

const toggleDriver: ControlDriver<boolean> = {
    written: true,
    shows: (element) => nativeInput(element).checked,
    shown: true,
    change: (element) => {
        nativeInput(element).click()
        return true
    },
    disabled: (element) => nativeInput(element).disabled,
    blurs: nativeInput
}

const selectDriver: ControlDriver<string> = {
    written: 'b',
    shows: (element) =>
        query(element, 'button.select-button').textContent.trim(),
    shown: 'B',
    change: async (element, fixture) => {
        await pickOption(element, fixture, 'C')
        return 'c'
    },
    disabled: (element) =>
        query<HTMLButtonElement>(element, 'button.select-button').disabled
}

const textDriver: ControlDriver<string> = {
    written: 'b',
    shows: (element: HTMLInputElement) => element.value,
    shown: 'b',
    change: (element: HTMLInputElement) => {
        type(element, 'c')
        return 'c'
    },
    disabled: (element: HTMLInputElement) => element.disabled,
    blurs: (element) => element
}

const drivers: { [K in ControlName]: ControlDriver<Values[K]> } = {
    checkbox: toggleDriver,
    toggle: toggleDriver,
    radio: {
        written: 'b',
        shows: (element) =>
            Array.from(element.querySelectorAll('nb-radio'))
                .find((radio) => nativeInput(radio as HTMLElement).checked)
                ?.textContent.trim(),
        shown: 'B',
        change: (element) => {
            nativeInput(query(element, 'nb-radio')).click()
            return 'a'
        },
        disabled: (element) =>
            Array.from(element.querySelectorAll('input')).every(
                (input) => input.disabled
            )
    },
    select: selectDriver,
    autocomplete: textDriver,
    datepicker: {
        written: new Date(2026, 1, 20),
        shows: (element: HTMLInputElement) => element.value,
        shown: 'Feb 20, 2026',
        change: (element: HTMLInputElement) => {
            type(element, 'Mar 5, 2026')
            return new Date(2026, 2, 5)
        },
        disabled: (element: HTMLInputElement) => element.disabled,
        blurs: (element) => element
    },
    timepicker: {
        written: new Date(2026, 0, 15, 14, 45),
        shows: (element: HTMLInputElement) => element.value,
        shown: '14:45',
        change: (element: HTMLInputElement) => {
            type(element, '08:15')
            const date = TestBed.inject(NbDateService<Date>).today()
            date.setHours(8, 15, 0, 0)
            return date
        },
        disabled: (element: HTMLInputElement) => element.disabled,
        blurs: (element) => element
    },
    input: textDriver,
    // Shown as a percent.
    number: {
        written: 0.25,
        shows: (element: HTMLInputElement) => element.value,
        shown: '25',
        change: (element: HTMLInputElement) => {
            type(element, '75')
            return 0.75
        },
        disabled: (element: HTMLInputElement) => element.disabled,
        blurs: (element) => element
    },
    textarea: textDriver
}

const hosts: Array<[string, Type<FormsHost>]> = [
    ['template-driven forms', NbTemplateDrivenHostComponent],
    ['reactive forms', NbReactiveHostComponent],
    ['signal forms', NbSignalFormsHostComponent]
]

const sameValue = (actual: unknown, expected: unknown) =>
    expected instanceof Date
        ? expect((actual as Date)?.getTime()).toBe(expected.getTime())
        : expect(actual).toEqual(expected)

for (const [api, host] of hosts) {
    describe(`form controls with ${api}`, () => {
        let fixture: ComponentFixture<FormsHost>

        const element = (name: ControlName) =>
            fixture.nativeElement.querySelector(
                `[data-control="${name}"]`
            ) as HTMLElement

        // ngModel writes to its control in a microtask after change detection, and the control then marks itself for
        // the next render, so let that microtask run before waiting for the app to settle.
        const render = async () => {
            fixture.detectChanges()
            await Promise.resolve()
            await fixture.whenStable()
        }

        beforeEach(async () => {
            TestBed.configureTestingModule({
                providers: [
                    provideNbTheme(),
                    provideNbDatepicker(),
                    provideNbTimepicker()
                ]
            })
            fixture = TestBed.createComponent(host)
            await render()
        })

        for (const name of Object.keys(drivers) as ControlName[]) {
            const driver = drivers[name] as ControlDriver<Values[ControlName]>

            describe(name, () => {
                it('should show the value written to the form', async () => {
                    fixture.componentInstance.setValue(name, driver.written)
                    await render()

                    expect(driver.shows(element(name))).toEqual(driver.shown)
                })

                it('should write the value a user enters to the form', async () => {
                    const expected = await driver.change(element(name), fixture)
                    await render()

                    sameValue(fixture.componentInstance.value(name), expected)
                })

                it('should follow the disabled state of the form', async () => {
                    fixture.componentInstance.setDisabled(true)
                    await render()
                    expect(driver.disabled(element(name))).toBe(true)

                    fixture.componentInstance.setDisabled(false)
                    await render()
                    expect(driver.disabled(element(name))).toBe(false)
                })

                const { blurs } = driver
                if (blurs) {
                    it('should mark the form control touched on blur', async () => {
                        expect(fixture.componentInstance.touched(name)).toBe(false)

                        blurs(element(name)).dispatchEvent(new Event('blur'))
                        await render()

                        expect(fixture.componentInstance.touched(name)).toBe(true)
                    })
                }
            })
        }
    })
}
