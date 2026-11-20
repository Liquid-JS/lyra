import { Component } from '@angular/core'
import { NbCardBodyComponent, NbCardComponent, NbCardHeaderComponent } from '@liquid-js/lyr-core'
import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer'

@Component({
    selector: 'nb-markdown-viewer-showcase',
    templateUrl: './markdown-viewer-showcase.component.html',
    imports: [NbCardComponent, NbCardHeaderComponent, NbCardBodyComponent, NbMarkdownViewerComponent]
})
export class MarkdownViewerShowcaseComponent {
    readonly markdown = [
        '## Getting started',
        '',
        'Install the packages, then import the components you use. Links like https://liquid-js.github.io/lyra/ and',
        '`inline code` take the theme\'s colours.',
        '',
        '> The markdown renders on the server too.[^server]',
        '',
        // With `autoDirection`, a paragraph in Arabic reads right to left.
        'ثبّت الحزم، ثم استورد المكونات التي تستخدمها.',
        '',
        '1. Install',
        '2. Import',
        '3. Use',
        '',
        '- [x] Parse the markdown',
        '- [ ] Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save',
        '',
        '| Option | Default |',
        '| ------ | ------: |',
        '| `markdown` | `\'\'` |',
        '',
        '```ts',
        "import { NbMarkdownViewerComponent } from '@liquid-js/lyr-extras/markdown-viewer';",
        '```',
        '',
        '[^server]: With code highlighted, when the app provides highlight.js.'
    ].join('\n')
}
