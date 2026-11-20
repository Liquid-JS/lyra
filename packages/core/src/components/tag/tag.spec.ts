import { Component, viewChild, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import {
    NbAutocompleteDirective,
    NbAutocompleteModule,
    NbIconComponent,
    NbIconLibraries,
    NbLayoutModule,
    NbTagComponent,
    NbTagModule,
    NbThemeModule
} from '@liquid-js/lyr-core'

@Component({
    selector: 'nb-tag-test',
    template: `<nb-tag [text]="'test-tag'"
    [removable]="isRemovable()"
    [selected]="selected()"
    [removeIcon]="removeIcon()"
    [removeIconPack]="removeIconPack()"
   />`,
    imports: [NbTagModule, RouterModule]
})
export class NbTagTestComponent {
    readonly nbTag = viewChild.required(NbTagComponent)
    readonly isRemovable = signal<boolean>(true)
    readonly selected = signal<boolean>(false)
    readonly removeIcon = signal<string>('close-outline')
    readonly removeIconPack = signal<string>('essentials')
}

describe('Component: NbTagComponent', () => {
    let tag: NbTagComponent
    let fixture: ComponentFixture<NbTagComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbTagModule, NbTagTestComponent]
        })

        fixture = TestBed.createComponent(NbTagComponent)
        tag = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(tag).toBeTruthy()
    })

    it('should return default selected property', () => {
        expect(fixture.nativeElement.classList).not.toContain('selected')
    })

    it('should return toggled selection value', () => {
        tag._toggleSelection()
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('selected')
    })

    it('should be inactive by default', () => {
        expect(fixture.nativeElement.classList).not.toContain('active')
    })

    it('should be active', () => {
        tag.setActiveStyles()
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).toContain('active')
    })

    it('should return applied inactive state', () => {
        tag.setInactiveStyles()
        fixture.detectChanges()
        expect(fixture.nativeElement.classList).not.toContain('active')
    })
})

describe('Component: NbTagComponent bindings', () => {
    let fixture: ComponentFixture<NbTagTestComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbTagModule, NbTagTestComponent]
        })
        fixture = TestBed.createComponent(NbTagTestComponent)
        fixture.detectChanges()
    })

    it('should be created', () => {
        const tagEl = fixture.nativeElement.querySelector('nb-tag')
        expect(tagEl).toBeTruthy()
    })

    // On its own, a tag isn't an option, and its remove button is reached and named for the keyboard.
    it('should have a named remove button on its own, not an option', () => {
        const tagEl: HTMLElement = fixture.nativeElement.querySelector('nb-tag')
        const removeSpy = vi.fn()
        fixture.componentInstance.nbTag().remove.subscribe(removeSpy)
        const button = tagEl.querySelector('button.nb-tag-remove') as HTMLButtonElement

        expect(tagEl.hasAttribute('role')).toBe(false)
        expect(tagEl.hasAttribute('aria-selected')).toBe(false)
        expect(button.getAttribute('aria-label')).toBe('Remove test-tag')
        expect(button.tabIndex).toBe(0)
        button.click()
        expect(removeSpy).toHaveBeenCalled()
    })

    // The text takes its own direction, without changing how the tag lays out its content.
    it('should isolate the direction of the text', () => {
        const tagEl: HTMLElement = fixture.nativeElement.querySelector('nb-tag')
        expect(tagEl.hasAttribute('dir')).toBe(false)
        expect(tagEl.querySelector('[dir="auto"]')?.textContent).toEqual('test-tag')
    })

    it('should emit remove event on delete keydown', () => {
        const removeSpy = vi.fn()
        const tagEl = fixture.nativeElement.querySelector('nb-tag')
        fixture.componentInstance.nbTag().remove.subscribe(removeSpy)
        tagEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'delete' }))
        expect(removeSpy).toHaveBeenCalled()
    })

    it('should not emit remove event on delete keydown', () => {
        const removeSpy = vi.fn()
        const tagEl = fixture.nativeElement.querySelector('nb-tag')
        fixture.componentInstance.nbTag().remove.subscribe(removeSpy)
        fixture.componentInstance.isRemovable.set(false)
        fixture.detectChanges()
        tagEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'delete' }))
        expect(removeSpy).not.toHaveBeenCalled()
    })

    it('should emit remove event on backspace keydown', () => {
        const removeSpy = vi.fn()
        const tagEl = fixture.nativeElement.querySelector('nb-tag')
        fixture.componentInstance.nbTag().remove.subscribe(removeSpy)
        tagEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'backspace' }))
        expect(removeSpy).toHaveBeenCalled()
    })

    it('should not emit remove event on backspace keydown', () => {
        const removeSpy = vi.fn()
        const tagEl = fixture.nativeElement.querySelector('nb-tag')
        fixture.componentInstance.nbTag().remove.subscribe(removeSpy)
        fixture.componentInstance.isRemovable.set(false)
        fixture.detectChanges()
        tagEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'backspace' }))
        expect(removeSpy).not.toHaveBeenCalled()
    })

    it('should emit selected change event', () => {
        const selectedSpy = vi.fn()
        const tag = fixture.componentInstance.nbTag()
        tag.selectedChange.subscribe(selectedSpy)
        tag.setSelected(true)
        fixture.detectChanges()
        expect(selectedSpy).toHaveBeenCalledWith({ tag, selected: true })
        expect(fixture.nativeElement.querySelector('nb-tag').classList).toContain('selected')
    })

    it('should not emit selected change event when the selected input changes', () => {
        const selectedSpy = vi.fn()
        fixture.componentInstance.nbTag().selectedChange.subscribe(selectedSpy)
        fixture.componentInstance.selected.set(true)
        fixture.detectChanges()
        expect(selectedSpy).not.toHaveBeenCalled()
    })

    it('should render custom remove icon pack', () => {
        const iconLibraries: NbIconLibraries = TestBed.inject(NbIconLibraries)
        iconLibraries.registerSvgPack('custom-pack', { 'plus-outline': '<svg></svg>' })

        fixture.componentInstance.removeIcon.set('plus-outline')
        fixture.componentInstance.removeIconPack.set('custom-pack')
        fixture.detectChanges()

        const icon: NbIconComponent = fixture.debugElement.query(By.directive(NbIconComponent)).componentInstance
        expect(icon).toBeTruthy()
        expect(icon.icon()).toBe('plus-outline')
        expect(icon.pack()).toBe('custom-pack')
    })
})

@Component({
    template: `
    <nb-layout>
      <nb-layout-column>
        <nb-tag-list>
          <input nbTagInput (tagAdd)="added.push($event.value)" [nbAutocomplete]="auto" />
        </nb-tag-list>
        <nb-autocomplete #auto (selectedChange)="added.push($event)">
          <nb-option value="Apple">Apple</nb-option>
          <nb-option value="Apricot">Apricot</nb-option>
        </nb-autocomplete>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, NbTagModule, NbAutocompleteModule, RouterModule]
})
class NbTagInputWithAutocompleteTestComponent {
    added = new Array<string>()
}

describe('Directive: NbTagInputDirective with autocomplete', () => {
    function keydown(target: EventTarget, key: string, keyCode: number) {
        const event = new KeyboardEvent('keydown', { key, bubbles: true })
        Object.defineProperty(event, 'keyCode', { value: keyCode })
        target.dispatchEvent(event)
    }

    it('should add a tag once when Enter selects an autocomplete option', () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbTagModule,
                NbAutocompleteModule,
                NbTagInputWithAutocompleteTestComponent
            ]
        })
        const fixture = TestBed.createComponent(NbTagInputWithAutocompleteTestComponent)
        fixture.detectChanges()

        const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement
        input.value = 'Ap'
        input.focus()
        fixture.debugElement.query(By.directive(NbAutocompleteDirective)).injector.get(NbAutocompleteDirective).show()
        fixture.detectChanges()

        keydown(input, 'ArrowDown', 40)
        keydown(input, 'Enter', 13)
        fixture.detectChanges()

        expect(fixture.componentInstance.added).toEqual(['Apple'])
    })

    it('should add the typed text when no autocomplete option is active', () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbTagModule,
                NbAutocompleteModule,
                NbTagInputWithAutocompleteTestComponent
            ]
        })
        const fixture = TestBed.createComponent(NbTagInputWithAutocompleteTestComponent)
        fixture.detectChanges()

        const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement
        input.value = 'Banana'
        keydown(input, 'Enter', 13)

        expect(fixture.componentInstance.added).toEqual(['Banana'])
    })
})
