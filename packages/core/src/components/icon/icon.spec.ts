import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
    NbIconModule,
    NbIconComponent,
    NbIconConfig,
    NbIconLibraries,
    NbThemeModule,
    NbFontIcon,
    NbSvgIcon
} from '@liquid-js/lyr-core'

describe('icon', () => {
    let fontIcon: NbFontIcon
    let svgIcon: NbSvgIcon

    it('font icon renders', () => {

        fontIcon = new NbFontIcon('home', 'custom', {
            packClass: 'custom-pack',
            iconClassPrefix: 'cp'
        })

        expect(fontIcon.getContent()).toEqual('custom')
    })

    it('font icon getClasses return classes', () => {

        fontIcon = new NbFontIcon('home', '', {
            packClass: 'custom-pack'
        })

        expect(fontIcon.getClasses()).toEqual(['custom-pack', 'home'])
    })

    it('font icon getClasses return class with prefix', () => {

        fontIcon = new NbFontIcon('home', '', {
            packClass: 'custom-pack',
            iconClassPrefix: 'cp'
        })

        expect(fontIcon.getClasses()).toEqual(['custom-pack', 'cp-home'])
    })

    it('font icon getClasses return class with name only', () => {

        fontIcon = new NbFontIcon('home', '')

        expect(fontIcon.getClasses()).toEqual(['home'])
    })

    it('svg icon renders', () => {

        svgIcon = new NbSvgIcon('home', 'content', {
            packClass: 'custom-pack'
        })

        expect(svgIcon.getContent()).toEqual('content')
    })

    it('svg icon getClasses return class', () => {

        svgIcon = new NbSvgIcon('home', '', {
            packClass: 'custom-pack'
        })

        expect(svgIcon.getClasses()).toEqual(['custom-pack'])
    })

    it('svg icon getClasses return class without name', () => {

        svgIcon = new NbSvgIcon('home', '')

        expect(svgIcon.getClasses()).toEqual([])
    })
})

describe('NbIconComponent', () => {
    let fixture: ComponentFixture<NbIconComponent>
    let element: HTMLElement

    const render = (inputs: { [name: string]: unknown }) => {
        for (const [name, value] of Object.entries(inputs)) {
            fixture.componentRef.setInput(name, value)
        }
        fixture.detectChanges()
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbIconModule]
        })
        const libraries = TestBed.inject(NbIconLibraries)
        libraries.registerSvgPack('svg-pack', { 'svg-icon': '<svg class="svg-content"></svg>' })
        libraries.registerFontPack('font-pack', { packClass: 'font-pack-class', iconClassPrefix: 'fp' })
        libraries.setDefaultPack('svg-pack')
        fixture = TestBed.createComponent(NbIconComponent)
        element = fixture.nativeElement
    })

    it('should render the icon named by a string config', () => {
        render({ config: 'svg-icon' })

        expect(element.querySelector('.svg-content')).not.toBeNull()
    })

    it('should render the icon and pack of an object config', () => {
        render({ config: { icon: 'home', pack: 'font-pack' } as NbIconConfig })

        expect(element.classList).toContain('font-pack-class')
        expect(element.classList).toContain('fp-home')
    })

    it('should add the status class of an object config', () => {
        render({ config: { icon: 'svg-icon', status: 'danger' } as NbIconConfig })

        expect(element.classList).toContain('status-danger')
    })

    it('should prefer the config to the separate inputs', () => {
        render({ icon: 'other', pack: 'font-pack', config: { icon: 'svg-icon' } as NbIconConfig })

        expect(element.querySelector('.svg-content')).not.toBeNull()
        expect(element.classList).not.toContain('font-pack-class')
    })

    it('should render the separate inputs without a config', () => {
        render({ icon: 'home', pack: 'font-pack', status: 'primary' })

        expect(element.classList).toContain('fp-home')
        expect(element.classList).toContain('status-primary')
    })

    it('should render nothing for an icon missing from the pack', () => {
        render({ config: { icon: 'test-not-existing-icon' } as NbIconConfig })

        expect(element.innerHTML).toBe('')
    })
})
