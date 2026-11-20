import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { NgdCodeLoaderService } from '../../../@theme/services';
import { NgdCodeBlockComponent } from '../code-block/code-block.component';
import { NgdExampleContent } from '../../../docs.model';

@Component({
  selector: 'ngd-example-block',
  templateUrl: './example-block.component.html',
  imports: [NgdCodeBlockComponent],
})
export class NgdExampleBlockComponent {
  private readonly codeLoader = inject(NgdCodeLoaderService);

  readonly content = input.required<NgdExampleContent>();

  readonly example = toSignal(toObservable(this.content).pipe(
    switchMap((content) => this.codeLoader.load(content.files[0]).pipe(
      map((code: string) => ({
        code,
        firstLine: content.firstLine || 1,
        lastLine: content.lastLine || code.split('\n').length,
      })),
    )),
  ));
}
