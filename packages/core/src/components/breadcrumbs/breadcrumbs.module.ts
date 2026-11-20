import { NgModule } from '@angular/core';

import {
  NbBreadcrumbComponent,
  NbBreadcrumbsComponent,
  NbBreadcrumbSeparatorDirective,
} from './breadcrumbs.component';

const COMPONENTS = [NbBreadcrumbsComponent, NbBreadcrumbComponent, NbBreadcrumbSeparatorDirective];

@NgModule({
  imports: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class NbBreadcrumbsModule {}
