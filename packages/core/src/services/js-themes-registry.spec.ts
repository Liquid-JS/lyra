import { assert } from 'vitest';
import { TestBed, inject } from '@angular/core/testing';

import {
  NbJSThemeOptions,
  BUILT_IN_THEMES,
  NbJSThemesRegistry,
  NB_BUILT_IN_JS_THEMES,
  NB_JS_THEMES,
} from '@liquid-js/lyr-core';

describe('js-themes-registry-service', () => {
  let jsThemesRegistry: NbJSThemesRegistry;

  const variables = (themeName: string) => {
    const themeVariables = jsThemesRegistry.get(themeName).variables;
    assert(themeVariables, `${themeName} theme has no variables`);
    return themeVariables;
  };
  const customThemes: NbJSThemeOptions[] = [
    {
      name: 'default',
      base: 'default',
      variables: {
        someNewValue: 'black',
        colorBg: 'yellow',
      },
    },
    {
      name: 'cosmic',
      base: 'default',
      variables: {
        someNewValueForCosmic: 'red',
      },
    },
    {
      name: 'corporate',
      base: 'default',
      variables: {
        someNewValueForCorporate: 'green',
      },
    },
    {
      name: 'super-new-theme',
      variables: {
        someNewValueForCosmic: 'blue',
      },
    },
  ];
  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        { provide: NB_JS_THEMES, useValue: customThemes },
        { provide: NB_BUILT_IN_JS_THEMES, useValue: BUILT_IN_THEMES },
        NbJSThemesRegistry,
      ],
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach(
    inject([NbJSThemesRegistry], (_jsThemesRegistry: NbJSThemesRegistry) => {
      jsThemesRegistry = _jsThemesRegistry;
    }),
  );

  it('has built in themes', () => {
    expect(jsThemesRegistry.get('default')).not.toBeUndefined();
    expect(jsThemesRegistry.get('cosmic')).not.toBeUndefined();
    expect(jsThemesRegistry.get('corporate')).not.toBeUndefined();

    expect(jsThemesRegistry.has('default')).toBeTruthy();
    expect(jsThemesRegistry.has('cosmic')).toBeTruthy();
    expect(jsThemesRegistry.has('corporate')).toBeTruthy();
  });

  it('has built in themes with inherited font', () => {
    expect(variables('default')['fontMain']).toEqual('Inter, sans-serif');
    expect(variables('cosmic')['fontMain']).toEqual('Inter, sans-serif');
    expect(variables('corporate')['fontMain']).toEqual('Inter, sans-serif');
  });

  it('has also new themes', () => {
    expect(jsThemesRegistry.get('super-new-theme')).not.toBeUndefined();
    expect(jsThemesRegistry.has('super-new-theme')).toBeTruthy();
    expect(variables('super-new-theme')['someNewValueForCosmic']).toEqual('blue');
  });

  it('has changes from custom settings', () => {
    expect(variables('default')['colorBg']).toEqual('yellow');
  });

  it('has new values from custom settings', () => {
    expect(variables('cosmic')['someNewValueForCosmic']).toEqual('red');
    expect(variables('default')['someNewValue']).toEqual('black');
    expect(variables('corporate')['someNewValueForCorporate']).toEqual('green');
  });
});
