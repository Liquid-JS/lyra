import { Component, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RemarkModule } from 'ngx-remark'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'

import { NbThemeModule } from '@liquid-js/lyr-core'
import { NbMarkdownProcessor, NbMarkdownRendererComponent } from '@liquid-js/lyr-extras/markdown-renderer'

const withTables: NbMarkdownProcessor = remark().use(remarkGfm).freeze()
const plain: NbMarkdownProcessor = remark().freeze()

@Component({
    template: `
    <div class="nb-theme-default" dir="ltr">
      <nb-markdown-renderer [markdown]="markdown" [processor]="processor()">
        <a *remarkTemplate="'link'; let node" class="custom" [href]="node.url"><strong [remarkNode]="node"></strong></a>
      </nb-markdown-renderer>
    </div>
  `,
    styleUrl: '../../styles/spec-theme.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NbMarkdownRendererComponent, RemarkModule]
})
class RendererHostComponent {
    readonly markdown = ["It's a [link](https://example.com) -- not a dash.", '', '| a | b |', '| - | - |', '| 1 | 2 |'].join('\n')
    readonly processor = signal(withTables)
}

const render = async (fixture: ComponentFixture<unknown>) => {
    fixture.detectChanges()
    await fixture.whenStable()
}

describe('NbMarkdownRendererComponent', () => {
    let fixture: ComponentFixture<RendererHostComponent>
    let element: HTMLElement

    const setup = async (platform: string) => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [{ provide: PLATFORM_ID, useValue: platform }]
        })
        fixture = TestBed.createComponent(RendererHostComponent)
        element = fixture.nativeElement.querySelector('nb-markdown-renderer')
        await render(fixture)
    }

    afterEach(() => fixture.destroy());

    ['browser', 'server'].forEach((platform) => {
        it(`should render with the app's processor and templates, unstyled, in the ${platform}`, async () => {
            await setup(platform)

            // The app's processor: GitHub's tables, and the text's plain characters as they are.
            expect(element.querySelector('.uf-contents > table td')?.textContent).toBe('1')
            expect(element.querySelector('.uf-contents > p')?.textContent).toBe("It's a link -- not a dash.")
            // The app's template, with the node's content in an element of its own.
            const link = element.querySelector<HTMLAnchorElement>('a.custom')
            expect(link?.getAttribute('href')).toBe('https://example.com')
            expect(link?.querySelector('strong')?.textContent).toBe('link')
            // None of the viewer's styling.
            expect(element.classList).not.toContain('nb-markdown')
        })
    })

    it('should parse again with another processor', async () => {
        await setup('browser')
        expect(element.querySelector('table')).not.toBeNull()

        fixture.componentInstance.processor.set(plain)
        await render(fixture)

        // Without remark-gfm, the table is a paragraph of text.
        expect(element.querySelector('table')).toBeNull()
        expect(element.querySelector('.uf-contents')?.textContent).toContain('| a | b |')
    })
})
