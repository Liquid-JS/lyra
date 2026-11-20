import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbBreadcrumbsModule, NbCardBodyComponent, NbCardComponent, NbIconComponent } from '@liquid-js/lyr-core';

@Component({
  selector: 'nb-breadcrumbs-separator',
  templateUrl: './breadcrumbs-separator.component.html',
  styleUrls: ['./breadcrumbs-separator.component.scss'],
  imports: [NbBreadcrumbsModule, NbCardComponent, NbCardBodyComponent, NbIconComponent, RouterLink],
})
export class BreadcrumbsSeparatorComponent {}
