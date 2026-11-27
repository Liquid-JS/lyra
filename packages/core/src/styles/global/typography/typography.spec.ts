import { Component, ViewEncapsulation } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { NbThemeModule } from '@liquid-js/lyr-core'

@Component({
    // The theme applies in an element with its class.
    template: `
    <div class="nb-theme-default">
      <p>Run <code>yarn build</code> first.</p>
      <pre>const answer = 42</pre>
    </div>
  `,
    styleUrl: './typography.spec.scss',
    encapsulation: ViewEncapsulation.None
})
class CodeHostComponent {}

describe('Code', () => {
    it('should be in the theme\'s code font: inline in its text\'s size, a block in the code typography', async () => {
        const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(CodeHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()
        const element = fixture.nativeElement as HTMLElement
        const style = (selector: string) => getComputedStyle(element.querySelector(selector) as HTMLElement)
        const theme = getComputedStyle(element.querySelector('.nb-theme-default') as HTMLElement)
        const mono = theme.getPropertyValue('--font-family-mono').trim()
        expect(mono).toContain('monospace')
        expect(style('code').fontFamily.replace(/\s/g, '')).toBe(mono.replace(/\s/g, ''))
        expect(style('code').fontSize).toBe(style('p').fontSize)
        expect(style('pre').fontFamily.replace(/\s/g, '')).toBe(mono.replace(/\s/g, ''))
        expect(style('pre').fontSize).toBe('14px')
        expect(style('pre').lineHeight).toBe('20px')
    })
})
