import { Component, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { userEvent } from 'vitest/browser'

import { NbTagModule, NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default" style="width: 12rem">
      <nb-tag-list [wrap]="wrap()" aria-label="Filters">
        @for (tag of tags; track tag) {
        <nb-tag [text]="tag" />
        }
      </nb-tag-list>
    </div>
  `,
    styleUrl: './tag-list-size.spec.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbTagModule]
})
class TagWrapHostComponent {
    readonly wrap = signal(false)
    readonly tags = ['All', 'Dobsonians', 'Refractors', 'Binoculars', 'Astrographs', 'Solar']
}

describe('nb-tag-list wrap', () => {
    let fixture: ComponentFixture<TagWrapHostComponent>

    const list = () => fixture.nativeElement.querySelector('nb-tag-list') as HTMLElement
    const wrapper = () => fixture.nativeElement.querySelector('.nb-tag-list-tags-wrapper') as HTMLElement
    const tags = () => Array.from(fixture.nativeElement.querySelectorAll('nb-tag')) as HTMLElement[]

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(TagWrapHostComponent)
        document.body.appendChild(fixture.nativeElement)
        fixture.detectChanges()
        await fixture.whenStable()
    })

    afterEach(() => fixture.destroy())

    it('keeps its tags on one line that scrolls sideways', () => {
        const tops = new Set(tags().map((tag) => Math.round(tag.getBoundingClientRect().top)))
        expect(tops.size).toBe(1)
        expect(wrapper().scrollWidth).toBeGreaterThan(wrapper().clientWidth)
        expect(list().getBoundingClientRect().width).toBeLessThanOrEqual(192.5)
    })

    it('scrolls the active tag into view', async () => {
        list().focus()
        await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}')
        await expect.poll(() => wrapper().scrollLeft).toBeGreaterThan(0)
        const active = document.getElementById(list().getAttribute('aria-activedescendant') ?? '')?.getBoundingClientRect()
        const box = wrapper().getBoundingClientRect()
        expect(active && active.left).toBeGreaterThanOrEqual(box.left - 1)
        expect(active && active.right).toBeLessThanOrEqual(box.right + 1)
    })

    it('wraps them onto more lines by default', async () => {
        fixture.componentInstance.wrap.set(true)
        fixture.detectChanges()
        await fixture.whenStable()
        const tops = new Set(tags().map((tag) => Math.round(tag.getBoundingClientRect().top)))
        expect(tops.size).toBeGreaterThan(1)
    })
})
