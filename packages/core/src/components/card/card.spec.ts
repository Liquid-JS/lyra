import { assert } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NbCardModule, NbThemeModule } from '@liquid-js/lyr-core';

@Component({
  template: `
    <nb-reveal-card id="outer-reveal" [revealed]="true" [showToggleButton]="false">
      <nb-card-front><nb-card>Front</nb-card></nb-card-front>
      <nb-card-back>
        <nb-card>
          <nb-reveal-card id="inner-reveal" [revealed]="false">
            <nb-card-front><nb-card>Inner front</nb-card></nb-card-front>
            <nb-card-back><nb-card>Inner back</nb-card></nb-card-back>
          </nb-reveal-card>
        </nb-card>
      </nb-card-back>
    </nb-reveal-card>

    <nb-flip-card id="outer-flip" [flipped]="true" [showToggleButton]="false">
      <nb-card-front><nb-card>Front</nb-card></nb-card-front>
      <nb-card-back>
        <nb-card>
          <nb-flip-card id="inner-flip" [flipped]="false">
            <nb-card-front><nb-card>Inner front</nb-card></nb-card-front>
            <nb-card-back><nb-card>Inner back</nb-card></nb-card-back>
          </nb-flip-card>
        </nb-card>
      </nb-card-back>
    </nb-flip-card>
  `,
  imports: [NbCardModule],
})
class NbNestedCardsTestComponent {}

describe('nested reveal and flip cards', () => {
  let element: HTMLElement;

  const query = (selector: string) => {
    const el = element.querySelector(selector);
    assert(el, `${selector} not rendered`);
    return el;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbThemeModule.forRoot(), NbCardModule, NbNestedCardsTestComponent],
    });
    const fixture = TestBed.createComponent(NbNestedCardsTestComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should keep a nested reveal card hidden while its parent is revealed', () => {
    const innerContainer = query('#inner-reveal .second-card-container');
    const innerButton = query('#inner-reveal .reveal-button');

    // The container sits below the card (`top: 100%`) until the card is revealed.
    expect(getComputedStyle(innerContainer).top).not.toBe('0px');
    expect(getComputedStyle(innerButton).transform).not.toBe('none');
  });

  it('should keep a nested flip card unflipped while its parent is flipped', () => {
    expect(getComputedStyle(query('#outer-flip > .flipcard-body')).transform).not.toBe('none');
    expect(getComputedStyle(query('#inner-flip > .flipcard-body')).transform).toBe('none');
  });

  it('should name the toggle buttons and make them focusable', () => {
    const revealButton = query('#inner-reveal .reveal-button');
    expect(revealButton.getAttribute('role')).toBe('button');
    expect(revealButton.getAttribute('aria-label')).toBe('Reveal card');
    expect(revealButton.getAttribute('aria-expanded')).toBe('false');
    expect(revealButton.getAttribute('tabindex')).toBe('0');

    const [frontButton, backButton] = Array.from(element.querySelectorAll('#inner-flip .flip-button'));
    expect(frontButton.getAttribute('aria-label')).toBe('Flip card');
    expect(frontButton.getAttribute('tabindex')).toBe('0');
    expect(backButton.getAttribute('tabindex')).toBe('-1');
  });
});
