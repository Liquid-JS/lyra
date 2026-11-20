import { Component, computed, inject, input, signal } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { NB_WINDOW, NbButtonComponent, NbIconComponent } from '@liquid-js/lyr-core'
import { catchError, forkJoin, map, of, switchMap } from 'rxjs'

import { NgdCodeLoaderService } from '../../../@theme/services'
import { NgdCodeBlockComponent } from '../code-block/code-block.component'

const REPOSITORY = 'https://github.com/Liquid-JS/lyra/tree/master/packages/playground/src/playground'

/**
 * An example screen's code: its files and the app's it uses in a list, and the chosen one's code with a button that
 * copies it; in a window over the screen.
 */
@Component({
    selector: 'ngd-example-code',
    template: `
    <nav class="files" aria-label="Files">
      @for (group of groups(); track group.name) {
        @if (group.files.length) {
          <h3 class="group">{{ group.name }}</h3>
          @for (path of group.files; track path) {
            <button
              type="button"
              class="file"
              [class.selected]="path === shown()"
              [attr.aria-current]="path === shown() ? 'true' : null"
              (click)="selected.set(path)">
              {{ name(path) }}
            </button>
          }
        }
      }
    </nav>
    <div class="code">
      <button
        nbButton
        ghost
        size="small"
        type="button"
        class="copy"
        [attr.aria-label]="'Copy ' + name(shown())"
        (click)="copy()">
        <nb-icon [icon]="copied() ? 'checkmark-outline' : 'copy-outline'" />
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
      <ngd-code-block [path]="shown()" [code]="code()" />
    </div>
    @if (folder(); as folder) {
      <p class="source"><a [href]="folder" target="_blank" rel="noopener">See the whole example on GitHub</a></p>
    }
  `,
    styles: `
    :host {
      display: grid;
      grid-template-columns: 16rem minmax(0, 1fr);
      gap: 1rem 1.5rem;
      width: min(64rem, calc(100vw - 4rem));
    }

    .files {
      display: flex;
      flex-direction: column;
      max-height: 65vh;
      overflow: auto;
    }

    .group {
      margin: 0.75rem 0 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-hint-color);

      &:first-child {
        margin-top: 0;
      }
    }

    .file {
      padding: 0.375rem 0.75rem;
      border: 0;
      border-radius: var(--border-radius);
      background: none;
      color: var(--text-basic-color);
      font: inherit;
      font-size: 0.875rem;
      text-align: start;
      overflow-wrap: anywhere;
      cursor: pointer;

      &:hover {
        background: var(--background-basic-color-2);
      }

      &:focus-visible {
        outline: 0.125rem solid var(--color-primary-default);
        outline-offset: -0.125rem;
      }

      &.selected {
        background: var(--color-primary-transparent-100);
        color: var(--text-primary-color);
        font-weight: 600;
      }
    }

    .code {
      position: relative;
      max-height: 65vh;
      overflow: auto;
      border-radius: 0.5rem;
    }

    .copy {
      position: absolute;
      inset-block-start: 0.5rem;
      inset-inline-end: 0.5rem;
      z-index: 1;
      color: #ffffff;
    }

    .source {
      grid-column: 1 / -1;
      margin: 0;
    }

    @media (max-width: 47.99rem) {
      :host {
        grid-template-columns: minmax(0, 1fr);
      }

      .files {
        max-height: 10rem;
      }
    }
  `,
    imports: [NbButtonComponent, NbIconComponent, NgdCodeBlockComponent]
})
export class NgdExampleCodeComponent {
    protected readonly codeLoader = inject(NgdCodeLoaderService)
    protected readonly window = inject(NB_WINDOW)

    /** The screen's files, as paths under the playground's examples. */
    readonly files = input.required<string[]>()
    /** Files the app's screens share, e.g. its frame. */
    readonly shared = input<string[]>([])

    protected readonly groups = computed(() => [
        { name: 'This screen', files: this.files() },
        { name: 'The app', files: this.shared() }
    ])

    protected readonly selected = signal<string | undefined>(undefined)
    /** The file shown: the one chosen, or the screen's first. */
    protected readonly shown = computed(() => this.selected() ?? this.files()[0] ?? '')

    protected readonly loaded = toSignal(
        toObservable(computed(() => [...this.files(), ...this.shared()])).pipe(
            switchMap((files) =>
                forkJoin(files.map((path) => this.codeLoader.load(path).pipe(catchError(() => of(''))))).pipe(
                    map((codes) => new Map(files.map((path, index) => [path, codes[index]])))
                )
            )
        ),
        { initialValue: new Map<string, string>() }
    )
    protected readonly code = computed(() => this.loaded().get(this.shown()) ?? '')

    /** The folder of the example on GitHub. */
    protected readonly folder = computed(() => {
        const [first] = this.files()
        if (!first) {
            return undefined
        }
        const folder = first.split('/').slice(0, -1).join('/')
        return `${REPOSITORY}/${first.startsWith('showcase/') ? 'without-layout' : 'with-layout'}/${folder}`
    })

    /** Whether the shown file was just copied, which its button says for a moment. */
    protected readonly copied = signal(false)
    protected copyTimer?: ReturnType<typeof setTimeout>

    protected name(path: string) {
        return path.split('/').pop() ?? path
    }

    protected async copy() {
        await this.window?.navigator.clipboard.writeText(this.code())
        this.copied.set(true)
        clearTimeout(this.copyTimer)
        this.copyTimer = setTimeout(() => this.copied.set(false), 2000)
    }
}
