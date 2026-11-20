import { NgModule } from '@angular/core';

import { NbFileDropComponent, NbFileDropPreviewDirective } from './file-drop.component';

const COMPONENTS = [NbFileDropComponent, NbFileDropPreviewDirective];

@NgModule({
  imports: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class NbFileDropModule {}
