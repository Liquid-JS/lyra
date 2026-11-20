import { assert } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NbLayoutModule,
  NbSearchComponent,
  NbSearchFieldComponent,
  NbSearchModule,
  NbSearchService,
  NbThemeModule,
  NbLayoutComponent,
} from '@liquid-js/lyr-core';
import { RouterModule } from '@angular/router';

describe('NbSearchFieldComponent', () => {
  let fixture: ComponentFixture<NbSearchFieldComponent>;
  let searchFieldComponent: NbSearchFieldComponent;

  const inputElement = () => {
    const input = searchFieldComponent.inputElement();
    assert(input, 'search input not rendered');
    return input.nativeElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbSearchModule,
      ],
    });

    fixture = TestBed.createComponent(NbSearchFieldComponent);
    searchFieldComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be named by its placeholder and described by its hint', () => {
    fixture.componentRef.setInput('placeholder', 'Search orders');
    fixture.componentRef.setInput('hint', 'Hit enter to search');
    fixture.detectChanges();
    const input = inputElement();
    expect(input.getAttribute('aria-label')).toBe('Search orders');
    const hint = fixture.nativeElement.querySelector(`#${input.getAttribute('aria-describedby')}`) as HTMLElement;
    expect(hint.textContent?.trim()).toBe('Hit enter to search');
  });

  it('should emit input event when typing in input', async () => {
    vi.useFakeTimers();
    const inputSpy = vi.fn();
    searchFieldComponent.searchInput.subscribe(inputSpy);

    const input = inputElement();
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);

    expect(inputSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit input event with input value', async () => {
    vi.useFakeTimers();
    const inputValue = 'input text';
    const inputSpy = vi.fn();
    searchFieldComponent.searchInput.subscribe(inputSpy);

    const input = inputElement();
    input.value = inputValue;
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);

    expect(inputSpy).toHaveBeenCalledWith(inputValue);
  });

  // The term takes its own direction; the empty field keeps the page's, for the placeholder.
  it('should take the direction of the term', () => {
    const input = inputElement();
    expect(input.hasAttribute('dir')).toBe(false);

    input.value = 'input text';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.getAttribute('dir')).toBe('auto');

    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.hasAttribute('dir')).toBe(false);
  });
});

describe('NbSearchComponent', () => {
  let fixture: ComponentFixture<NbSearchComponent>;
  let searchComponent: NbSearchComponent;

  function getSearchFieldComponent(): NbSearchFieldComponent {
    return fixture.debugElement.query(By.directive(NbSearchFieldComponent)).componentInstance;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbLayoutModule,
        NbSearchModule,
      ],
    });

    TestBed.createComponent(NbLayoutComponent);

    fixture = TestBed.createComponent(NbSearchComponent);
    searchComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should listen to search field input event', async () => {
    vi.useFakeTimers();
    searchComponent.openSearch();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);

    const inputSpy = vi.spyOn(searchComponent, 'emitInput').mockImplementation(() => undefined);
    const searchFieldComponent: NbSearchFieldComponent = getSearchFieldComponent();

    searchFieldComponent.searchInput.emit('');
    await vi.advanceTimersByTimeAsync(0);
    expect(inputSpy).toHaveBeenCalledTimes(1);
  });

  it(`should propagate search event to search service`, async () => {
    vi.useFakeTimers();
    searchComponent.openSearch();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);
    const searchFieldComponent: NbSearchFieldComponent = getSearchFieldComponent();

    const searchService = TestBed.inject(NbSearchService);
    const searchInput = vi.spyOn(searchService, 'searchInput');
    const searchTerm = 'search term';

    searchFieldComponent.searchInput.emit(searchTerm);
    await vi.advanceTimersByTimeAsync(0);

    expect(searchInput).toHaveBeenCalledTimes(1);
    expect(searchInput).toHaveBeenCalledWith(searchTerm, undefined);
  });
});
