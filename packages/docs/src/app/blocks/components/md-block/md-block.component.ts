import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NgdMdSection } from '../../../@theme/services/text.service';
import { NgdLastViewedSectionService } from '../../../@theme/services';
import { NbSpinnerDirective, NbCardComponent, NbCardBodyComponent } from '@liquid-js/lyr-core';
import { NgdFragmentTargetDirective } from '../../../@theme/components/fragment-target/fragment-target.directive';
import { NgdMarkdownComponent } from '../../../@theme/components/markdown/markdown.component';

@Component({
  selector: 'ngd-md-block',
  templateUrl: './md-block.component.html',
  imports: [
    NgdMarkdownComponent,
    NbSpinnerDirective,
    NbCardComponent,
    NgdFragmentTargetDirective,
    NbCardBodyComponent,
  ],
})
export class NgdMdBLockComponent {
  private readonly lastViewedSectionService = inject(NgdLastViewedSectionService);

  readonly loading = signal(true);

  readonly sections$ = input.required<Observable<NgdMdSection[]>>();

  readonly sections = toSignal(this.lastViewedSectionService.getSections());

  constructor() {
    toObservable(this.sections$).pipe(
      switchMap((sections$) => sections$),
      takeUntilDestroyed(),
    ).subscribe((sections) => {
      this.loading.set(false);
      this.lastViewedSectionService.setSection(sections);
    });
  }
}
