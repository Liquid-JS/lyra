import { Component, signal } from '@angular/core'
import { TestBed, ComponentFixture } from '@angular/core/testing'
import {
    NbLayoutComponent,
    NbLayoutScrollService,
    NbLayoutModule,
    NbThemeModule,
    NbLayoutDirectionService,
    NbLayoutDirection,
    NbOverlayService,
    NbThemeService
} from '@liquid-js/lyr-core'
import { By } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { Subject } from 'rxjs'

@Component({
    template: `
    <nb-layout withScroll>
      <nb-layout-column>
        <div [style.height]="contentHeight" style="background: lightcoral;"></div>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule]
})
export class LayoutWithScrollModeComponent {
    contentHeight = '200vh'
}

describe('NbLayoutComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, LayoutWithScrollModeComponent]
        })
    })

    describe('withScroll mode - scroll block', () => {
        let fixture: ComponentFixture<LayoutWithScrollModeComponent>
        let layoutComponent: NbLayoutComponent
        let scrollService: NbLayoutScrollService

        beforeEach(() => {
            fixture = TestBed.createComponent(LayoutWithScrollModeComponent)
            fixture.detectChanges()

            layoutComponent = fixture.debugElement.query(By.directive(NbLayoutComponent)).componentInstance
            scrollService = TestBed.inject(NbLayoutScrollService)
        })

        it('should hide overflow when scroll blocked', async () => {
            scrollService.scrollable(false)
            await fixture.whenStable()
            fixture.detectChanges()

            expect(layoutComponent.scrollableContainerRef().nativeElement.style.overflow).toEqual('hidden')
        })

        it('should restore previous overflow value when enabling scroll', async () => {
            layoutComponent.scrollableContainerRef().nativeElement.style.overflow = 'auto'

            scrollService.scrollable(false)
            await fixture.whenStable()
            fixture.detectChanges()
            scrollService.scrollable(true)
            await fixture.whenStable()
            fixture.detectChanges()

            expect(layoutComponent.scrollableContainerRef().nativeElement.style.overflow).toEqual('auto')
        })

        it('should restore previous padding left value when enabling scroll in LTR mode', async () => {
            layoutComponent.layoutContainerRef().nativeElement.style.paddingLeft = '1px'

            scrollService.scrollable(false)
            await fixture.whenStable()
            fixture.detectChanges()
            scrollService.scrollable(true)
            await fixture.whenStable()
            fixture.detectChanges()

            expect(layoutComponent.layoutContainerRef().nativeElement.style.paddingLeft).toEqual('1px')
        })

        it('should restore previous padding right value when enabling scroll in RTL mode', async () => {
            const layoutDirectionService: NbLayoutDirectionService = TestBed.inject(NbLayoutDirectionService)
            layoutDirectionService.setDirection(NbLayoutDirection.RTL)
            await fixture.whenStable()
            fixture.detectChanges()
            layoutComponent.layoutContainerRef().nativeElement.style.paddingRight = '1px'

            scrollService.scrollable(false)
            await fixture.whenStable()
            fixture.detectChanges()
            scrollService.scrollable(true)
            await fixture.whenStable()
            fixture.detectChanges()

            expect(layoutComponent.layoutContainerRef().nativeElement.style.paddingRight).toEqual('1px')
        })
    })
})

@Component({
    template: `
    <nb-layout>
      <nb-layout-header fixed [subheader]="subheader()">Header</nb-layout-header>
      <nb-layout-column>Content</nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule]
})
class LayoutHeaderSubheaderComponent {
    readonly subheader = signal(true)
}

describe('nb-layout-header', () => {
    it('should be fixed again when subheader is turned off', () => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, LayoutHeaderSubheaderComponent]
        })
        const fixture = TestBed.createComponent(LayoutHeaderSubheaderComponent)
        fixture.detectChanges()
        const header: HTMLElement = fixture.nativeElement.querySelector('nb-layout-header')
        expect(header.classList.contains('fixed')).toBe(false)

        fixture.componentInstance.subheader.set(false)
        fixture.detectChanges()
        expect(header.classList.contains('fixed')).toBe(true)
    })
})

@Component({
    template: `@if (shown()) {
    <nb-layout><nb-layout-column></nb-layout-column></nb-layout>
  }`,
    imports: [NbLayoutModule, RouterModule]
})
class LayoutShownComponent {
    readonly shown = signal(true)
}

describe('nb-layout theme', () => {
    it('should leave only the current theme on the body, after changes while no layout was shown', () => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                NbThemeModule.forRoot({ name: 'default' }),
                NbLayoutModule,
                LayoutShownComponent
            ]
        })
        const fixture = TestBed.createComponent(LayoutShownComponent)
        fixture.detectChanges()
        const themes = TestBed.inject(NbThemeService)
        const body = document.body
        themes.changeTheme('dark')
        expect(body.classList).toContain('nb-theme-dark')

        // One page's layout goes, the theme changes twice, and the next page's layout comes.
        fixture.componentInstance.shown.set(false)
        fixture.detectChanges()
        themes.changeTheme('default')
        themes.changeTheme('cosmic')
        fixture.componentInstance.shown.set(true)
        fixture.detectChanges()

        expect(Array.from(body.classList).filter((name) => name.startsWith('nb-theme-'))).toEqual(['nb-theme-cosmic'])
        fixture.destroy()
        body.classList.remove('nb-theme-cosmic')
    })
})

@Component({
    template: `
    <nb-layout>
      <nb-layout-column>
        <p class="page">Text in the page's direction</p>
        <p class="own" dir="rtl">نص باتجاهه الخاص</p>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutModule, RouterModule]
})
class LayoutTextComponent {}

describe('nb-layout text', () => {
    it('should align text to the start of its own direction', () => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, LayoutTextComponent]
        })
        const fixture = TestBed.createComponent(LayoutTextComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        const own: HTMLElement = fixture.nativeElement.querySelector('.own')
        const page: HTMLElement = fixture.nativeElement.querySelector('.page')

        // Right to left text in a left to right page starts on the right, which a side inherited from the layout would stop.
        expect(getComputedStyle(own).textAlign).toBe('start')
        const text = document.createRange()
        text.selectNodeContents(own)
        expect(text.getBoundingClientRect().right).toBeCloseTo(own.getBoundingClientRect().right, 0)
        expect(getComputedStyle(page).direction).toBe('ltr')
        fixture.destroy()
    })
})

describe('NbOverlayService', () => {
    it('should stop following the layout direction once an overlay is disposed', () => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), NbLayoutModule, LayoutWithScrollModeComponent]
        })
        // The overlay container lives in a layout.
        TestBed.createComponent(LayoutWithScrollModeComponent).detectChanges()
        const directionChange = new Subject<NbLayoutDirection>()
        vi.spyOn(TestBed.inject(NbLayoutDirectionService), 'onDirectionChange').mockReturnValue(directionChange)
        const overlayRef = TestBed.inject(NbOverlayService).create()
        expect(directionChange.observed).toBe(true)

        overlayRef.dispose()

        // Released right away, not only at the next direction change.
        expect(directionChange.observed).toBe(false)
    })
})
