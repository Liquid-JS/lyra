import { assert } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { NbIconLibraries, NbThemeModule, provideNbSvgIcons, provideNbTheme } from '@liquid-js/lyr-core'

import { NbIconsModule, NbAnimatedSvgIcon, provideNbIconSet, provideNbIcons } from './icons.module'
import { NB_ICON_KEYWORDS, NB_ICONS, nbIconStar } from './generated/icons'

describe('NbIconsModule', () => {
    let iconLibraries: NbIconLibraries

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), NbIconsModule] })
        TestBed.inject(NbIconsModule)
        iconLibraries = TestBed.inject(NbIconLibraries)
    })

    it('registers the icons pack as the default pack', () => {
        expect(iconLibraries.getPack('icons')).toBeTruthy()
        expect(iconLibraries.getSvgIcon('star')?.name).toBe('star')
    })

    it('renders an icon with the pack\'s classes and the requested size', () => {
        const star = iconLibraries.getSvgIcon('star', 'icons')
        assert(star)
        const markup = star.icon.getContent()
        expect(markup).toContain('class="nb-icons nb-icons-star"')
        expect(markup).toContain('width="100%"')
        expect(markup).toContain('fill="currentColor"')
        expect(markup.startsWith('<svg ')).toBe(true)
    })
})

describe('provideNbIcons', () => {
    it('registers the icons pack as the default pack without the module', () => {
        TestBed.configureTestingModule({ providers: [provideNbTheme(), provideNbIcons()] })
        const iconLibraries = TestBed.inject(NbIconLibraries)

        expect(iconLibraries.getSvgIcon('star')?.name).toBe('star')
    })
})

describe('NbAnimatedSvgIcon', () => {
    const icon = new NbAnimatedSvgIcon('star', '<path d="M0 0"/>')

    it('wraps hover animations in a hover element', () => {
        const markup = icon.getContent({ animation: { type: 'zoom', hover: true, infinite: false } })
        expect(markup).toBe(
            '<i class="nb-icons-hover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" ' +
        'class="nb-icons nb-icons-star nb-icons-animation nb-icons-animate-hover-zoom" fill="currentColor"><path d="M0 0"/>' +
        '</svg></i>'
        )
    })

    it('adds infinite animation classes without the hover wrapper', () => {
        const markup = icon.getContent({ animation: { type: 'pulse', hover: false, infinite: true } })
        expect(markup).toContain('class="nb-icons nb-icons-star nb-icons-animation nb-icons-infinite nb-icons-animate-pulse"')
        expect(markup.startsWith('<svg ')).toBe(true)
    })
})

describe('An app\'s own icons in the pack', () => {
    const vegan = '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 1"/></svg>\n'
    const wide = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16"><rect width="32" height="16"/></svg>'

    it('adds an app\'s icons, as whole files, rendered like the pack\'s own', () => {
        TestBed.configureTestingModule({ providers: [provideNbTheme(), provideNbIcons({ extra: { vegan, wide } })] })
        const iconLibraries = TestBed.inject(NbIconLibraries)

        const icon = iconLibraries.getSvgIcon('vegan')
        assert(icon)
        expect(icon.icon).toBeInstanceOf(NbAnimatedSvgIcon)
        expect(icon.icon.getContent()).toBe(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="nb-icons nb-icons-vegan" ' +
        'fill="currentColor"><path d="M1 1"/></svg>'
        )
        // A file drawn on another grid keeps it.
        expect(iconLibraries.getSvgIcon('wide')?.icon.getContent()).toContain('viewBox="0 0 32 16"')
        expect(iconLibraries.getSvgIcon('star')).toBeTruthy()
    })

    it('adds icons to the pack later on', () => {
        TestBed.configureTestingModule({
            providers: [provideNbTheme(), provideNbIcons(), provideNbSvgIcons('icons', { vegan })]
        })
        TestBed.inject(NbIconLibraries)

        expect(TestBed.inject(NbIconLibraries).getSvgIcon('vegan')?.icon).toBeInstanceOf(NbAnimatedSvgIcon)
    })

    it('registers only a chosen set of icons', () => {
        TestBed.configureTestingModule({ providers: [provideNbTheme(), provideNbIconSet({ star: nbIconStar })] })
        const iconLibraries = TestBed.inject(NbIconLibraries)

        expect(iconLibraries.getSvgIcon('star')?.icon.getContent()).toContain('class="nb-icons nb-icons-star"')
        expect(iconLibraries.getSvgIcon('heart')).toBeUndefined()
    })

    it('adds the animation styles to the page once', () => {
        TestBed.configureTestingModule({ providers: [provideNbTheme(), provideNbIcons()] })
        TestBed.inject(NbIconLibraries)
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({ providers: [provideNbTheme(), provideNbIcons()] })
        TestBed.inject(NbIconLibraries)

        const styles = document.head.querySelectorAll('style[data-nb-icons]')
        expect(styles.length).toBe(1)
        expect(styles[0].textContent).toContain('@keyframes nb-icons-pulse')
    })
})

describe('NB_ICONS', () => {
    it('holds the icons by name', () => {
        expect(NB_ICONS['star']).toBe(nbIconStar)
        expect(NB_ICONS['star-outline']).toContain('<path')
    })

    it('has one name per drawing: line icons only an outline name, solid ones a fill name', () => {
        const drawings = Object.values(NB_ICONS)
        expect(new Set(drawings).size).toBe(drawings.length)
        expect(NB_ICONS['menu']).toBeUndefined()
        expect(NB_ICONS['menu-outline']).toBeTruthy()
        expect(NB_ICONS['qr-code-outline']).toBeUndefined()
        expect(NB_ICONS['qr-code']).toBeTruthy()
    })

    it('names icons for what they show', () => {
    // The upstream car drew a truck; it's the truck now, and the car is a drawing of one.
        expect(NB_ICONS['truck']).toBeTruthy()
        expect(NB_ICON_KEYWORDS['truck']).toContain('car')
        expect(NB_ICONS['car']).not.toEqual(NB_ICONS['truck'])
    })
})

describe('The pack', () => {
    it('has the newer icons in both styles, and keywords for every icon', () => {
        for (const name of ['terminal-outline', 'table-remove-outline', 'square']) {
            expect(NB_ICONS[name]).toContain('<')
        }
        for (const name of ['coffee', 'utensils', 'car', 'rocket', 'flame']) {
            expect(NB_ICONS[name]).toContain('<')
            expect(NB_ICONS[`${name}-outline`]).toContain('<')
        }
        for (const name of Object.keys(NB_ICONS)) {
            expect(NB_ICON_KEYWORDS[name.replace(/-outline$/, '')]?.length).toBeGreaterThan(0)
        }
    })
})
