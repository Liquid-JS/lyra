import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NbComponentSize, NbTagModule, NbThemeModule } from '@liquid-js/lyr-core';

const sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];

@Component({
  template: `
    <nb-tag-list size="small" class="plain">
      <nb-tag text="Follows" />
      <nb-tag text="Own" size="large" />
    </nb-tag-list>
    <nb-tag-list size="small" class="with-input">
      <nb-tag text="Follows the input" />
      <input nbTagInput fieldSize="giant" aria-label="Tags" />
    </nb-tag-list>
    <nb-tag text="Alone" class="alone" />
  `,
  imports: [NbTagModule],
})
class TagSizesHostComponent {}

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default">
      @for (size of sizes; track size) {
        <nb-tag-list [attr.data-size]="size">
          <nb-tag text="Design" removable />
          <input nbTagInput [fieldSize]="size" placeholder="Add" aria-label="Tags" />
        </nb-tag-list>
      }
    </div>
  `,
  styleUrl: './tag-list-size.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbTagModule],
})
class TagRowHostComponent {
  readonly sizes = sizes;
}

describe('NbTagListComponent sizes', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }));

  it("should give the tags placed in it its size, or its input's, unless they set one", async () => {
    const fixture = TestBed.createComponent(TagSizesHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const tag = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLElement;

    expect(tag('.plain nb-tag:first-child').classList).toContain('size-small');
    expect(tag('.plain nb-tag:last-child').classList).toContain('size-large');
    expect(tag('.with-input nb-tag').classList).toContain('size-giant');
    expect(tag('nb-tag.alone').classList).toContain('size-medium');
  });

  it("should keep a tag and the input on one row at every size, as tall as the size's input", async () => {
    const fixture = TestBed.createComponent(TagRowHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();

    for (const list of Array.from(fixture.nativeElement.querySelectorAll('nb-tag-list')) as HTMLElement[]) {
      const tag = (list.querySelector('nb-tag') as HTMLElement).getBoundingClientRect();
      const input = (list.querySelector('input') as HTMLElement).getBoundingClientRect();
      expect(Math.abs(tag.top + tag.height / 2 - (input.top + input.height / 2)), list.dataset['size']).toBeLessThan(2);
    }
    fixture.destroy();
  });
});
