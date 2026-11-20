import { Component, input } from '@angular/core';
import { ComponentLink } from '../playground-components';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { ComponentLinkDirective } from '../components-link.directive';

export function convertToBoolProperty(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();

    return val === 'true' || val === '';
  }

  return !!val;
}

@Component({
  selector: 'npg-components-list',
  styleUrls: ['./components-list.component.scss'],
  templateUrl: './components-list.component.html',
  host: { '[class.column]': 'vertical()' },
  imports: [RouterLinkActive, RouterLink, ComponentLinkDirective],
})
export class ComponentsListComponent {
  readonly components = input<ComponentLink[]>([]);

  readonly vertical = input<boolean, boolean | string | null | undefined>(false, {
    transform: convertToBoolProperty,
  });
}
