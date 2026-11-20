import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NbSkeletonModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" style="width: 20rem">
      <div class="avatar" [nbSkeleton]="loading()" nbSkeletonShape="circle">JD</div>
      <h3 class="name" [nbSkeleton]="loading()"><a href="#profile">Jane Doe</a></h3>
      <p>
        <span class="bio" [nbSkeleton]="loading()">
          Designs the onboarding and billing pages, and looks after the design system and its documentation.
        </span>
      </p>
      <div class="empty" [nbSkeleton]="loading()" nbSkeletonWidth="8rem"></div>
    </div>
  `,
    styleUrl: './skeleton.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbSkeletonModule]
})
class SkeletonHostComponent {
    readonly loading = signal(true)
}

describe('nbSkeleton', () => {
    let fixture: ComponentFixture<SkeletonHostComponent>

    const element = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement
    const style = (selector: string) => getComputedStyle(element(selector))

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(SkeletonHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    afterEach(() => fixture.destroy())

    it('should hide the content and paint the element, over its own background', () => {
        expect(element('.name').classList).toContain('nb-skeleton')
        expect(style('.name').color).toBe('rgba(0, 0, 0, 0)')
        expect(style('.name a').visibility).toBe('hidden')
        expect(style('.name').backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
        expect(style('.avatar').backgroundColor).not.toBe('rgb(51, 102, 255)')
        expect(style('.avatar').borderRadius).toBe('50%')
        // The shimmer's waves, over the element's own background shorthand.
        expect(style('.avatar').backgroundSize).toBe(style('.name').backgroundSize)
    })

    it('should keep its content out of reach while loading', () => {
        expect(element('.name').hasAttribute('inert')).toBe(true)
        expect(style('.name').pointerEvents).toBe('none')
        // Loading, as what a spinner covers.
        expect(element('.name').getAttribute('aria-busy')).toBe('true')
    })

    it('should make each line of an inline element its own bar', () => {
        const lines = element('.bio').getClientRects()
        expect(lines.length).toBeGreaterThan(1)
        expect(style('.bio').getPropertyValue('box-decoration-break') || style('.bio').getPropertyValue('-webkit-box-decoration-break')).toBe(
            'clone'
        )
    })

    it('should size an element with no content yet', () => {
        const rect = element('.empty').getBoundingClientRect()
        expect(rect.width).toBeCloseTo(parseFloat(getComputedStyle(document.documentElement).fontSize) * 8, 0)
        expect(rect.height).toBeGreaterThan(0)
    })

    it('should move one set of waves across all placeholders, each showing its part of them', async () => {
    // The observer reports in a frame after the first layout.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        fixture.detectChanges()
        await fixture.whenStable()
        for (const selector of ['.avatar', '.name', '.empty']) {
            const placeholder = element(selector)
            expect(Number(placeholder.style.getPropertyValue('--nb-skeleton-left'))).toBe(
                Math.round(placeholder.getBoundingClientRect().left)
            )
            expect(Number(placeholder.style.getPropertyValue('--nb-skeleton-clock'))).toBeGreaterThan(0)
        }
        // One pace for all, whatever their widths.
        expect(style('.empty').animationDuration).toBe(style('.avatar').animationDuration)
    })

    it('should show the content again once it has loaded', async () => {
        fixture.componentInstance.loading.set(false)
        fixture.detectChanges()
        await fixture.whenStable()
        expect(element('.name').classList).not.toContain('nb-skeleton')
        expect(element('.name').hasAttribute('inert')).toBe(false)
        expect(element('.name').hasAttribute('aria-busy')).toBe(false)
        expect(style('.name a').visibility).toBe('visible')
        expect(style('.avatar').backgroundColor).toBe('rgb(51, 102, 255)')
        expect(element('.empty').style.getPropertyValue('--nb-skeleton-width')).toBe('')
        expect(element('.empty').style.getPropertyValue('--nb-skeleton-left')).toBe('')
        expect(element('.empty').style.getPropertyValue('--nb-skeleton-clock')).toBe('')
    })
})
