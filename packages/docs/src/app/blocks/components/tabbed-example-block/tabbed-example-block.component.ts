import {
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { forkJoin, of as observableOf, Observable } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, switchMap } from 'rxjs/operators';
import { NgdCodeLoaderService } from '../../../@theme/services';
import { NgdExampleView } from '../../enum.example-view';
import { NbIconComponent, NbTabsetComponent, NbTabComponent } from '@liquid-js/lyr-core';
import { NgdCodeBlockComponent } from '../code-block/code-block.component';

interface NgdLoadedExample {
  code: string;
  path: string;
  extension?: string;
  active?: boolean;
}

@Component({
  selector: 'ngd-tabbed-example-block',
  styleUrls: ['./tabbed-example-block.component.scss'],
  templateUrl: './tabbed-example-block.component.html',
  imports: [NbIconComponent, NbTabsetComponent, NbTabComponent, NgdCodeBlockComponent],
})
export class NgdTabbedExampleBlockComponent {
  private readonly codeLoader = inject(NgdCodeLoaderService);

  readonly hasViewSwitch = input(false);
  readonly changeView = output<NgdExampleView>();
  readonly content = input.required<{ files: string[] }>();

  readonly examples = toSignal(toObservable(this.content).pipe(
    switchMap(({ files }) => forkJoin(files.map((file) => this.load(file)))),
    map((loaded) => {
      loaded[0].active = true;
      return loaded;
    }),
  ), { initialValue: [] });

  switchToLiveView() {
    this.changeView.emit(NgdExampleView.LIVE);
  }

  private load(path: string): Observable<NgdLoadedExample> {
    const extension = path.split('.').pop();
    return this.codeLoader.load(path)
      .pipe(
        map((code) => ({ code, path, extension })),
        catchError(() => observableOf({ code: '', path, extension })),
      );
  }
}
