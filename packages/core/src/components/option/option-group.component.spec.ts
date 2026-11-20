import { Component, viewChild, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import {
    NbLayoutModule,
    NbOptionComponent,
    NbOptionGroupComponent,
    NbSelectModule,
    NbSelectComponent,
    NbThemeModule
} from '@liquid-js/lyr-core'
import { RouterModule } from '@angular/router'

@Component({
    template: `
    <nb-layout>
      <nb-layout-column>
        <nb-select [disabled]="selectDisabled()">
          <nb-option-group [disabled]="optionGroupDisabled()" [title]="optionGroupTitle()">
            @if (showOption()) {
              <nb-option [value]="1" [disabled]="optionDisabled()">1</nb-option>
            }
          </nb-option-group>
        </nb-select>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, NbSelectModule, RouterModule]
})
export class NbOptionGroupTestComponent {
    readonly selectDisabled = signal(false)
    readonly optionGroupDisabled = signal(false)
    readonly optionDisabled = signal(false)
    readonly showOption = signal(true)
    readonly optionGroupTitle = signal('')

    readonly selectComponent = viewChild.required(NbSelectComponent)
    readonly optionGroupComponent = viewChild.required(NbOptionGroupComponent)
    readonly optionComponent = viewChild.required(NbOptionComponent)
}

describe('NbOptionGroupComponent', () => {
    let fixture: ComponentFixture<NbOptionGroupTestComponent>
    let testComponent: NbOptionGroupTestComponent
    let selectComponent: NbSelectComponent
    let optionComponent: NbOptionComponent<number>

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbSelectModule,
                NbOptionGroupTestComponent
            ]
        })

        fixture = TestBed.createComponent(NbOptionGroupTestComponent)
        testComponent = fixture.componentInstance
        fixture.detectChanges()
        await fixture.whenStable()

        selectComponent = testComponent.selectComponent()
        optionComponent = testComponent.optionComponent()
    })

    it('should contain passed title', () => {
        const title = 'random option group title'
        selectComponent.show()
        testComponent.optionGroupTitle.set(title)
        fixture.detectChanges()

        const groupTitle = fixture.debugElement
            .query(By.directive(NbOptionGroupComponent))
            .query(By.css('.option-group-title'))

        expect(groupTitle.nativeElement.textContent).toEqual(title)
        // The title takes its own direction, without changing how it's aligned in the list.
        expect(groupTitle.nativeElement.hasAttribute('dir')).toBe(false)
        expect(groupTitle.nativeElement.querySelector('[dir="auto"]')?.textContent).toEqual(title)
    })

    it('should have disabled attribute if disabled', () => {
        selectComponent.show()
        testComponent.optionGroupDisabled.set(true)
        fixture.detectChanges()

        const optionGroup = fixture.debugElement.query(By.directive(NbOptionGroupComponent))
        expect(optionGroup.attributes['disabled']).toEqual('')
    })

    it('should remove disabled attribute if disabled set to false', () => {
        selectComponent.show()
        testComponent.optionGroupDisabled.set(true)
        fixture.detectChanges()

        testComponent.optionGroupDisabled.set(false)
        fixture.detectChanges()

        const optionGroup = fixture.debugElement.query(By.directive(NbOptionGroupComponent))
        expect(optionGroup.attributes['disabled']).not.toBeDefined()
    })

    it('should disable group options if group disabled', () => {
        testComponent.optionGroupDisabled.set(true)
        fixture.detectChanges()

        expect(optionComponent.disabled).toEqual(true)
    })

    it('should enable group options if group enabled', () => {
        testComponent.optionGroupDisabled.set(true)
        fixture.detectChanges()
        testComponent.optionGroupDisabled.set(false)
        fixture.detectChanges()

        expect(optionComponent.disabled).toEqual(false)
    })

    it('should keep an option disabled by itself when its group is enabled', () => {
        testComponent.optionDisabled.set(true)
        fixture.detectChanges()

        expect(optionComponent.disabled).toEqual(true)
    })

    it('should disable options added to a disabled group', async () => {
        testComponent.optionGroupDisabled.set(true)
        testComponent.showOption.set(false)
        fixture.detectChanges()
        await fixture.whenStable()

        testComponent.showOption.set(true)
        fixture.detectChanges()
        await fixture.whenStable()
        fixture.detectChanges()

        expect(testComponent.optionComponent().disabled).toEqual(true)
    })

    it('should disable options of a group disabled from the start', async () => {
        fixture = TestBed.createComponent(NbOptionGroupTestComponent)
        testComponent = fixture.componentInstance
        testComponent.optionGroupDisabled.set(true)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(testComponent.optionComponent().disabled).toEqual(true)
    })
})
