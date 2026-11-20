import { booleanAttribute, Component, computed, inject, input, signal } from '@angular/core';
import { NbButtonComponent, NbIconComponent, NbToastrService } from '@liquid-js/lyr-core';
import { HighlightDirective } from 'nxt-highlightjs';

/** highlight.js languages by file extension. */
const languages: Record<string, string> = {
  ts: 'typescript',
  js: 'typescript',
  html: 'xml',
  scss: 'scss',
  css: 'css',
  json: 'json',
  sh: 'bash',
};

@Component({
  selector: 'ngd-code-block',
  styleUrls: ['./code-block.component.scss'],
  templateUrl: './code-block.component.html',
  imports: [HighlightDirective, NbButtonComponent, NbIconComponent],
})
export class NgdCodeBlockComponent {
  private readonly toastr = inject(NbToastrService);

  readonly path = input('');
  readonly firstLine = input<number>();
  readonly lastLine = input<number>();

  readonly code = input<string>('');
  /** Whether the block has a button that copies the code shown; it has by default. */
  readonly copy = input(true, { transform: booleanAttribute });

  /** Whether the code was just copied, while the button says so. */
  protected readonly copied = signal(false);

  readonly visible = computed(() => this.getVisible(this.code()));
  readonly lines = computed(() => this.createLines(this.visible()));
  readonly language = computed(() => languages[this.path().split('.').pop() ?? ''] ?? 'typescript');

  getVisible(code: string): string {
    return code
      .split('\n')
      .slice((this.firstLine() ?? 1) - 1, this.lastLine())
      .join('\n');
  }

  protected async copyCode() {
    try {
      await navigator.clipboard.writeText(this.visible());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      this.toastr.danger("The browser didn't allow it. Select the code and copy it.", "Couldn't copy");
    }
  }

  createLines(code: string): number[] {
    const length = code.split('\n').length;
    return Array(length).fill(0).map((_, i) => i + (this.firstLine() || 1));
  }
}
