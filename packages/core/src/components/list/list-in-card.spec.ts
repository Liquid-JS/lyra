import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NbCardModule, NbListModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  // The theme applies in an element with its class.
  template: `
    <div class="nb-theme-default" dir="ltr" style="width: 30rem">
      <nb-list class="alone">
        <nb-list-item>One</nb-list-item>
        <nb-list-item>Two</nb-list-item>
        <nb-list-item>Three</nb-list-item>
      </nb-list>
      <nb-card>
        <nb-card-header>Fruit</nb-card-header>
        <nb-list class="in-card">
          <nb-list-item>One</nb-list-item>
          <nb-list-item>Two</nb-list-item>
          <nb-list-item>Three</nb-list-item>
        </nb-list>
      </nb-card>
    </div>
  `,
  styleUrl: './list-item-layout.spec.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NbCardModule, NbListModule],
})
class ListInCardHostComponent {}

describe('nb-list in a card', () => {
  async function borders(list: string) {
    const fixture = TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] }).createComponent(
      ListInCardHostComponent,
    );
    fixture.detectChanges();
    await fixture.whenStable();
    const items = [...(fixture.nativeElement as HTMLElement).querySelectorAll(`.${list} nb-list-item`)];
    return items.map((item) => {
      const style = getComputedStyle(item);
      return [style.borderTopWidth, style.borderBottomWidth];
    });
  }

  it('should divide its items, with the card\'s border and header around it', async () => {
    expect(await borders('in-card')).toEqual([
      ['0px', '1px'],
      ['0px', '1px'],
      ['0px', '0px'],
    ]);
  });

  it('should keep its own lines above and under it elsewhere', async () => {
    expect(await borders('alone')).toEqual([
      ['1px', '1px'],
      ['0px', '1px'],
      ['0px', '1px'],
    ]);
  });
});
