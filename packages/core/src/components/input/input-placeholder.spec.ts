import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NbComponentSize, NbInputModule, NbThemeModule } from '@liquid-js/lyr-core';

const sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default">
      @for (size of sizes; track size) {
        <input nbInput placeholder="Name" [fieldSize]="size" [class]="size" />
      }
    </div>
  `,
  styleUrl: './input-direction.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbInputModule],
})
class InputPlaceholderHostComponent {
  readonly sizes = sizes;
}

describe('NbInputDirective placeholder', () => {
  it('should be the size of the field\'s text, in every size', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), InputPlaceholderHostComponent],
    }).createComponent(InputPlaceholderHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    for (const size of sizes) {
      const input: HTMLElement = fixture.nativeElement.querySelector(`input.${size}`);
      expect(getComputedStyle(input, '::placeholder').fontSize, size).toBe(getComputedStyle(input).fontSize);
    }
    fixture.nativeElement.remove();
  });
});
