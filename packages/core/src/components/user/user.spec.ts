import { assert } from 'vitest'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
    NbComponentSize,
    NbLayoutDirectionService,
    NbThemeModule,
    NbUserComponent,
    NbUserModule
} from '@liquid-js/lyr-core'

const NAME_SELECTOR = '.user-name'
const TITLE_SELECTOR = '.user-title'
const INITIALS_SELECTOR = '.user-picture.initials'
const PICTURE_SELECTOR = '.user-picture.image'
const BADGE_SELECTOR = 'nb-badge'
const COMPONENT_SIZES: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant']

describe('NbUserComponent', () => {
    let fixture: ComponentFixture<NbUserComponent>
    let userComponent: NbUserComponent
    let userElement: HTMLElement

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot(), NbUserModule],
            providers: [NbLayoutDirectionService]
        })

        fixture = TestBed.createComponent(NbUserComponent)
        userComponent = fixture.componentInstance
        userElement = fixture.nativeElement
        fixture.detectChanges()
    })

    it('should leave out the container of the name and title with only the picture', () => {
        fixture.componentRef.setInput('name', 'Jane Doe')
        fixture.componentRef.setInput('title', 'Head of design')
        fixture.detectChanges()
        expect(userElement.querySelector('.info-container')).not.toBeNull()

        fixture.componentRef.setInput('onlyPicture', true)
        fixture.detectChanges()
        expect(userElement.querySelector('.info-container')).toBeNull()
    })

    it('should render name if set', () => {
        const name = 'SomeName'
        fixture.componentRef.setInput('name', name)
        fixture.detectChanges()

        const nameElement = userElement.querySelector(NAME_SELECTOR)

        assert(nameElement)
        expect(nameElement).not.toEqual(null)
        expect(nameElement.textContent).toEqual(name)
        // The name takes its own direction, without changing how it's aligned.
        expect(nameElement.hasAttribute('dir')).toBe(false)
        expect(nameElement.querySelector('[dir="auto"]')?.textContent).toEqual(name)
    })

    it('should not render name if showName set to false', () => {
        const name = 'SomeName'
        fixture.componentRef.setInput('name', name)
        fixture.componentRef.setInput('showName', false)
        fixture.detectChanges()

        const nameElement = userElement.querySelector(NAME_SELECTOR)
        expect(nameElement).toEqual(null)
    })

    it('should not render name if set to empty string', () => {
        fixture.componentRef.setInput('name', '')
        fixture.detectChanges()

        const nameElement = userElement.querySelector(NAME_SELECTOR)
        expect(nameElement).toEqual(null)
    })

    it('should render title if set', () => {
        const title = 'SomeTitle'
        fixture.componentRef.setInput('title', title)
        fixture.detectChanges()

        const titleElement = userElement.querySelector(TITLE_SELECTOR)

        assert(titleElement)
        expect(titleElement).not.toEqual(null)
        expect(titleElement.textContent).toEqual(title)
        expect(titleElement.hasAttribute('dir')).toBe(false)
        expect(titleElement.querySelector('[dir="auto"]')?.textContent).toEqual(title)
    })

    it('should not render title if showTitle set to false', () => {
        const title = 'SomeName'
        fixture.componentRef.setInput('title', title)
        fixture.componentRef.setInput('showTitle', false)
        fixture.detectChanges()

        const titleElement = userElement.querySelector(TITLE_SELECTOR)
        expect(titleElement).toEqual(null)
    })

    it('should not render title if set to empty string', () => {
        const title = ''
        fixture.componentRef.setInput('title', title)
        fixture.detectChanges()

        const titleElement = userElement.querySelector(TITLE_SELECTOR)
        expect(titleElement).toEqual(null)
    })

    it('should show initials if picture isn\'t set', () => {
        const name = 'Name Name'
        fixture.componentRef.setInput('name', name)
        fixture.detectChanges()

        const initialsElement = userElement.querySelector(INITIALS_SELECTOR)

        assert(initialsElement)
        expect(initialsElement.textContent.trim()).toEqual('NN')
    })

    it('should show a name that\'s initials as it is', () => {
        fixture.componentRef.setInput('name', 'PS')
        fixture.detectChanges()
        expect(userElement.querySelector(INITIALS_SELECTOR)?.textContent?.trim()).toEqual('PS')

        fixture.componentRef.setInput('name', 'Priya')
        fixture.detectChanges()
        expect(userElement.querySelector(INITIALS_SELECTOR)?.textContent?.trim()).toEqual('P')
    })

    it('should not show initials if picture is set', () => {
        fixture.componentRef.setInput('name', 'Name')
        fixture.componentRef.setInput('title', 'Title')
        fixture.componentRef.setInput('picture', '/')
        fixture.detectChanges()

        expect(userElement.querySelector(INITIALS_SELECTOR)).toEqual(null)
    })

    it('should set color of initials if set color property is set', () => {
        const color = 'red'
        fixture.componentRef.setInput('color', color)
        fixture.detectChanges()

        const initialsStyle = (userElement.querySelector(INITIALS_SELECTOR) as HTMLElement).style
        expect(initialsStyle.backgroundColor).toEqual(color)
    })

    describe('onlyPicture', () => {
        it('should not show title and name if onlyPicture is set to true', () => {
            fixture.componentRef.setInput('name', 'Name')
            fixture.componentRef.setInput('title', 'Title')
            fixture.componentRef.setInput('onlyPicture', true)
            fixture.detectChanges()

            expect(userElement.querySelector(NAME_SELECTOR)).toEqual(null)
            expect(userElement.querySelector(TITLE_SELECTOR)).toEqual(null)
        })

        it('should hide the name and title even if showName and showTitle are set', () => {
            fixture.componentRef.setInput('name', 'Name')
            fixture.componentRef.setInput('title', 'Title')
            fixture.componentRef.setInput('showName', true)
            fixture.componentRef.setInput('showTitle', true)
            fixture.componentRef.setInput('onlyPicture', true)
            fixture.detectChanges()

            expect(userElement.querySelector(NAME_SELECTOR)).toEqual(null)
            expect(userElement.querySelector(TITLE_SELECTOR)).toEqual(null)
        })

        it('should show the name and title again when unset', () => {
            fixture.componentRef.setInput('name', 'Name')
            fixture.componentRef.setInput('title', 'Title')
            fixture.componentRef.setInput('onlyPicture', true)
            fixture.detectChanges()
            fixture.componentRef.setInput('onlyPicture', false)
            fixture.detectChanges()

            expect(userElement.querySelector(NAME_SELECTOR)).not.toEqual(null)
            expect(userElement.querySelector(TITLE_SELECTOR)).not.toEqual(null)
        })
    })

    describe('getInitials', () => {
        it('should return empty string if name isn\'t set', () => {
            fixture.componentRef.setInput('name', '')
            expect(userComponent.getInitials()).toEqual('')
        })

        it('should return one letter for one word name', () => {
            fixture.componentRef.setInput('name', 'Name')
            expect(userComponent.getInitials()).toEqual('N')
        })

        it('should return two letters for two word name', () => {
            fixture.componentRef.setInput('name', 'Name Name')
            expect(userComponent.getInitials()).toEqual('NN')
        })

        it('should return two letters for two first words letters if name set to more then two words', () => {
            fixture.componentRef.setInput('name', 'Name Name Name')
            expect(userComponent.getInitials()).toEqual('NN')

            fixture.componentRef.setInput('name', 'Name Name Name Name Name Name Name Name Name')
            expect(userComponent.getInitials()).toEqual('NN')
        })
    })

    it('should show badge with initials', () => {
        fixture.componentRef.setInput('badgeText', 'badge text')
        fixture.detectChanges()

        const badges = userElement.querySelectorAll(BADGE_SELECTOR)
        expect(badges.length).toEqual(1)
    })

    it('should show badge with picture', () => {
        fixture.componentRef.setInput('badgeText', 'badge text')
        fixture.componentRef.setInput('picture', '/')
        fixture.detectChanges()

        const badges = userElement.querySelectorAll(BADGE_SELECTOR)
        expect(badges.length).toEqual(1)
    })

    it('should show badge with if showInitials is false', () => {
        fixture.componentRef.setInput('badgeText', 'badge text')
        fixture.componentRef.setInput('showInitials', false)
        fixture.detectChanges()

        const badges = userElement.querySelectorAll(BADGE_SELECTOR)
        expect(badges.length).toEqual(1)
    })

    it('should show picture if set', () => {
        fixture.componentRef.setInput('picture', '/')
        fixture.detectChanges()

        expect(userElement.querySelector(PICTURE_SELECTOR)).not.toEqual(null)
    })

    it('should not set picture if falsy value was passed', () => {
        for (const picture of ['', null, undefined]) {
            fixture.componentRef.setInput('picture', picture)
            fixture.detectChanges()

            expect(userElement.querySelector(PICTURE_SELECTOR)).toEqual(null)
        }
    })

    it('should show the picture as an image, named when the name is hidden', () => {
        fixture.componentRef.setInput('picture', '/picture.png')
        fixture.componentRef.setInput('name', 'Jane Doe')
        fixture.detectChanges()

        const image = userElement.querySelector('img.user-image') as HTMLImageElement
        expect(image.getAttribute('src')).toBe('/picture.png')
        expect(image.getAttribute('alt')).toBe('')

        fixture.componentRef.setInput('onlyPicture', true)
        fixture.detectChanges()
        expect(image.getAttribute('alt')).toBe('Jane Doe')
    })

    it('should show the initials when the picture fails to load, and try a new picture', () => {
        fixture.componentRef.setInput('picture', '/missing.png')
        fixture.componentRef.setInput('name', 'Jane Doe')
        fixture.detectChanges()

        userElement.querySelector('img.user-image')?.dispatchEvent(new Event('error'))
        fixture.detectChanges()
        expect(userElement.querySelector('img.user-image')).toBeNull()
        expect(userElement.querySelector('.initials')?.textContent?.trim()).toBe('JD')

        fixture.componentRef.setInput('picture', '/other.png')
        fixture.detectChanges()
        expect(userElement.querySelector('img.user-image')).not.toBeNull()
    })

    it('should colour the initials with a status', () => {
        fixture.componentRef.setInput('status', 'primary')
        fixture.detectChanges()
        expect(userElement.classList).toContain('status-primary')
    })

    it('should take whole characters for the initials', () => {
        fixture.componentRef.setInput('name', '🦊 Émile  zoë')
        fixture.detectChanges()
        expect(userElement.querySelector('.initials')?.textContent?.trim()).toBe('🦊É')

        fixture.componentRef.setInput('name', 'e\u0301lise Martin')
        fixture.detectChanges()
        expect(userElement.querySelector('.initials')?.textContent?.trim()).toBe('E\u0301M')
    })

    it('should be medium sized by default', () => {
        expect(userComponent.size()).toEqual('medium')
    })

    it('should only have the class of the current size', () => {
        const currentSize: NbComponentSize = 'tiny'
        const otherSizes = COMPONENT_SIZES.filter((s) => s !== currentSize)

        fixture.componentRef.setInput('size', currentSize)
        fixture.detectChanges()

        expect(userElement.classList).toContain(`size-${currentSize}`)
        for (const size of otherSizes) {
            expect(userElement.classList).not.toContain(`size-${size}`)
        }
    })

    it('should be round shaped by default', () => {
        expect(userComponent.shape()).toEqual('round')
    })

    it('should only have the class of the current shape', () => {
        fixture.componentRef.setInput('shape', 'semi-round')
        fixture.detectChanges()

        expect(userElement.classList).toContain('shape-semi-round')
        expect(userElement.classList).not.toContain('shape-rectangle')
        expect(userElement.classList).not.toContain('shape-round')
    })
})
