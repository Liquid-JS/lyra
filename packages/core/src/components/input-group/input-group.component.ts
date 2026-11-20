import { Component } from '@angular/core';

/**
 * Joins adjacent controls into one, as `nb-button-group` does for buttons. Inputs, selects, tag lists, form fields
 * and buttons can be in a group, or elements that hold them.
 * @stacked-example(Showcase, input-group/input-group-showcase.component)
 *
 * Controls keep their size, status and shape; give the controls in a group the same size. The group is as wide as
 * its controls, unless one of them is `fullWidth`: then the group fills its container, and the `fullWidth` controls
 * share the space the others leave.
 * @stacked-example(Full width, input-group/input-group-full-width.component)
 *
 * The group has the `group` role; label it with `aria-label` or `aria-labelledby`.
 */
@Component({
  selector: 'nb-input-group',
  template: '<ng-content />',
  host: {
    role: 'group',
  },
})
export class NbInputGroupComponent {}
