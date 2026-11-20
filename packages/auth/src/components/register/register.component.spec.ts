import { assert } from 'vitest'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { NbLayoutModule, NbThemeModule } from '@liquid-js/lyr-core'
import { NbAuthModule, NbDummyAuthStrategy, NbRegisterComponent } from '@liquid-js/lyr-auth'

describe('NbRegisterComponent', () => {
    let fixture: ComponentFixture<NbRegisterComponent>
    let element: HTMLElement

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbAuthModule.forRoot({ strategies: [NbDummyAuthStrategy.setup({ name: 'email' })] })
            ],
            providers: [provideHttpClient()]
        })
        fixture = TestBed.createComponent(NbRegisterComponent)
        element = fixture.nativeElement
        fixture.detectChanges()
        // ngModel registers its controls asynchronously.
        await fixture.whenStable()
    })

    const query = <T extends Element>(selector: string) => {
        const el = element.querySelector<T>(selector)
        assert(el, `${selector} not rendered`)
        return el
    }

    const fill = async (id: string, value: string) => {
        const input = query<HTMLInputElement>(`#${id}`)
        input.value = value
        input.dispatchEvent(new Event('input'))
        input.dispatchEvent(new Event('blur'))
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()
    }

    const fillValidForm = async (confirmPassword: string) => {
        await fill('input-name', 'Jane Doe')
        await fill('input-email', 'jane@example.com')
        await fill('input-password', 'secret123')
        await fill('input-re-password', confirmPassword)
        const terms = element.querySelector<HTMLInputElement>('nb-checkbox input')
        if (terms && !terms.checked) {
            terms.click()
            fixture.detectChanges()
            await fixture.whenStable()
            fixture.detectChanges()
        }
    }

    const submitButton = () => query<HTMLButtonElement>('button[nbButton]')

    it('should show the mismatch message and keep submit disabled when the passwords differ', async () => {
        await fillValidForm('different')

        expect(element.textContent).toContain('Password does not match the confirm password.')
        expect(submitButton().disabled).toBe(true)
    })

    it('should enable submit when the passwords match', async () => {
        await fillValidForm('secret123')

        expect(element.textContent).not.toContain('Password does not match the confirm password.')
        expect(submitButton().disabled).toBe(false)
    })

    it('should reject an email without a dot in the domain', async () => {
        await fill('input-email', 'jane@example')

        expect(query('#input-email').getAttribute('aria-invalid')).toBe('true')
    })
})
