import { Component, ElementRef, input } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { NbThemeModule, NbIconModule, NbIconLibraries, NbIconComponent } from '@liquid-js/lyr-core'

@Component({
    template: ' <nb-icon #iconEl [icon]="icon()" /> ',
    imports: [NbIconModule]
})
class IconTestComponent {
    readonly icon = input(undefined)
}

describe('Component: NbIcon', () => {
    let fixture: ComponentFixture<IconTestComponent>
    let iconElement: ElementRef
    let iconsLibrary: NbIconLibraries

    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbIconModule, IconTestComponent],
            providers: [NbIconLibraries]
        })

        fixture = bed.createComponent(IconTestComponent)
        iconsLibrary = bed.inject(NbIconLibraries)

        iconsLibrary.registerSvgPack('svg-pack', { home: '<svg><rect></rect></svg>' }, { packClass: 'custom-pack' })
        iconsLibrary.setDefaultPack('svg-pack')

        iconElement = fixture.debugElement.query(By.directive(NbIconComponent))
    })

    it('should add pack classes that contain several names', () => {
        iconsLibrary.registerSvgPack('multi-class-pack', { home: '<svg></svg>' }, { packClass: 'pack-a pack-b' })
        iconsLibrary.setDefaultPack('multi-class-pack')
        fixture.componentRef.setInput('icon', 'home')
        expect(() => fixture.detectChanges()).not.toThrow()

        expect(iconElement.nativeElement.classList.contains('pack-a')).toBe(true)
        expect(iconElement.nativeElement.classList.contains('pack-b')).toBe(true)
    })

    it('should render icon', () => {
        fixture.componentRef.setInput('icon', 'home')
        fixture.detectChanges()

        const svg = iconElement.nativeElement.querySelector('svg')

        expect(iconElement.nativeElement.classList.contains('custom-pack')).toBeTruthy()
        expect(svg.innerHTML).toContain('<rect></rect>')
    })
})
