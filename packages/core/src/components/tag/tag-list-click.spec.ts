import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { assert } from 'vitest';

import { NbTagModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  template: `
    <nb-tag-list>
      @for (item of items; track item) {
        <nb-tag removable [text]="item" (selectedChange)="changes.push($event.selected)" (remove)="removed.set(item)" />
      }
    </nb-tag-list>
  `,
  imports: [NbTagModule],
})
class TagClickTestComponent {
  readonly items = ['Bags', 'Shoes'];
  readonly changes = new Array<boolean>();
  readonly removed = signal<string | undefined>(undefined);
}

describe('NbTagListComponent clicks', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot(), TagClickTestComponent] });
    const fixture = TestBed.createComponent(TagClickTestComponent);
    fixture.detectChanges();
    const tag: HTMLElement | null = fixture.nativeElement.querySelector('nb-tag');
    assert(tag, 'tag not rendered');
    return { fixture, tag };
  }

  it('should select a tag clicked on its text', () => {
    const { fixture, tag } = render();
    const text = tag.querySelector('span');
    assert(text, 'tag text not rendered');
    text.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changes).toEqual([true]);
    expect(tag.classList).toContain('selected');
  });

  it('should select a tag clicked on its edge', () => {
    const { fixture, tag } = render();
    tag.click();
    fixture.detectChanges();
    expect(tag.classList).toContain('selected');
  });

  it('should remove a tag without selecting it when its remove button is clicked', () => {
    const { fixture, tag } = render();
    const remove: HTMLElement | null = tag.querySelector('.nb-tag-remove');
    assert(remove, 'remove button not rendered');
    remove.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.removed()).toBe('Bags');
    expect(fixture.componentInstance.changes).toEqual([]);
  });
});
