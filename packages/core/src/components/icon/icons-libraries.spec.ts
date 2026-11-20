import { assert } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NbIconLibraries, NbSvgIcon } from '@liquid-js/lyr-core';

describe('icons-library', () => {
  let iconsLibrary: NbIconLibraries;

  beforeEach(() => {
    TestBed.resetTestingModule();
    const bed = TestBed.configureTestingModule({
      providers: [NbIconLibraries],
    });
    iconsLibrary = bed.inject(NbIconLibraries);
  });

  it('should register raw svg icon', () => {
    iconsLibrary.registerSvgPack('super-pack', { home: '<svg><rect></rect></svg>', gear: '<svg></svg>' });
    iconsLibrary.setDefaultPack('super-pack');

    const icon = iconsLibrary.getSvgIcon('home');

    assert(icon);

    expect(icon.icon.getContent()).toEqual('<svg><rect></rect></svg>');
    expect(icon.name).toEqual('home');
    expect(icon.pack).toEqual('super-pack');
    expect(icon.type).toEqual('svg');
  });

  it('should register NbSvgIcon svg icon', () => {
    iconsLibrary.registerSvgPack('super-pack', {
      home: new NbSvgIcon('home', '<svg><rect></rect></svg>', { packClass: 'sp' }),
    });
    iconsLibrary.setDefaultPack('super-pack');

    const icon = iconsLibrary.getSvgIcon('home');

    assert(icon);

    expect(icon.icon.getContent()).toEqual('<svg><rect></rect></svg>');
    expect(icon.icon.getClasses()).toEqual(['sp']);
    expect(icon.name).toEqual('home');
    expect(icon.pack).toEqual('super-pack');
    expect(icon.type).toEqual('svg');
  });

  it('should register custom svg icon', () => {
    class CustomSvgIcon extends NbSvgIcon {
      override getContent() {
        return 'custom';
      }
    }

    iconsLibrary.registerSvgPack('super-pack', {
      home: new CustomSvgIcon('home', '<svg><rect></rect></svg>', { packClass: 'sp' }),
    });
    iconsLibrary.setDefaultPack('super-pack');

    const icon = iconsLibrary.getSvgIcon('home');

    assert(icon);

    expect(icon.icon.getContent()).toEqual('custom');
    expect(icon.icon.getClasses()).toEqual(['sp']);
    expect(icon.name).toEqual('home');
    expect(icon.pack).toEqual('super-pack');
    expect(icon.type).toEqual('svg');
  });

  it('should return undefined for unknown svg icon', () => {
    iconsLibrary.registerSvgPack('super-pack', { home: '<svg><rect></rect></svg>', gear: '<svg></svg>' });
    iconsLibrary.setDefaultPack('super-pack');

    expect(iconsLibrary.getSvgIcon('unknown')).toBeUndefined();
  });

  it('should throw for no default pack', () => {
    expect(() => iconsLibrary.getSvgIcon('unknown')).toThrow('Default pack is not registered.');
  });

  it('should throw for wrong pack type', () => {
    iconsLibrary.registerSvgPack('super-pack', { home: '<svg><rect></rect></svg>', gear: '<svg></svg>' });
    iconsLibrary.registerFontPack('font-pack');
    iconsLibrary.setDefaultPack('font-pack');

    expect(() => iconsLibrary.getSvgIcon('unknown')).toThrow(
      `Pack 'font-pack' is not an 'SVG' Pack and its type is 'font'`,
    );
  });

  it('should return undefined for wrong pack', () => {
    iconsLibrary.registerSvgPack('super-pack', { home: '<svg><rect></rect></svg>', gear: '<svg></svg>' });
    iconsLibrary.registerFontPack('font-pack');
    iconsLibrary.setDefaultPack('super-pack');

    expect(iconsLibrary.getSvgIcon('unknown')).toBeUndefined();
  });

  it('should throw for wrong pack when setting default', () => {
    iconsLibrary.registerFontPack('font-pack');

    expect(() => iconsLibrary.setDefaultPack('super-pack')).toThrow(`Icon Pack 'super-pack' is not registered`);
  });

  it('should register font icon', () => {
    iconsLibrary.registerFontPack('font-pack', { packClass: 'font', iconClassPrefix: 'fp' });
    iconsLibrary.setDefaultPack('font-pack');

    const icon = iconsLibrary.getFontIcon('home');

    expect(icon.icon.getContent()).toEqual('');
    expect(icon.icon.getClasses()).toEqual(['font', 'fp-home']);
    expect(icon.name).toEqual('home');
    expect(icon.pack).toEqual('font-pack');
    expect(icon.type).toEqual('font');
  });

  it('should return ligature icon', () => {
    iconsLibrary.registerFontPack('font-pack', { ligature: true, packClass: 'font', iconClassPrefix: 'fp' });
    iconsLibrary.setDefaultPack('font-pack');

    const icon = iconsLibrary.getFontIcon('home');

    expect(icon.icon.getContent()).toEqual('home');
    expect(icon.icon.getClasses()).toEqual(['font', 'fp-home']);
    expect(icon.name).toEqual('home');
    expect(icon.pack).toEqual('font-pack');
    expect(icon.type).toEqual('font');
  });

  it('should return icon', () => {
    iconsLibrary.registerSvgPack('super-pack', { home: '<svg><rect></rect></svg>', gear: '<svg></svg>' });
    iconsLibrary.registerFontPack('font-pack', { packClass: 'font', iconClassPrefix: 'fp' });
    iconsLibrary.setDefaultPack('font-pack');

    const icon = iconsLibrary.getIcon('home');

    assert(icon);
    const svgIcon = iconsLibrary.getIcon('home', 'super-pack');
    assert(svgIcon);

    expect(icon.icon.getContent()).toEqual('');
    expect(icon.icon.getClasses()).toEqual(['font', 'fp-home']);
    expect(icon.icon.getClasses()).toEqual(['font', 'fp-home']);
    expect(icon.name).toEqual('home');
    expect(icon.pack).toEqual('font-pack');
    expect(icon.type).toEqual('font');

    expect(svgIcon.icon.getContent()).toEqual('<svg><rect></rect></svg>');
    expect(svgIcon.name).toEqual('home');
    expect(svgIcon.pack).toEqual('super-pack');
    expect(svgIcon.type).toEqual('svg');
  });

  it('should add icons to a registered svg pack', () => {
    iconsLibrary.registerSvgPack('super-pack', { home: '<svg><rect></rect></svg>' });
    iconsLibrary.registerSvgIcons('super-pack', { gear: '<svg><circle></circle></svg>', home: '<svg></svg>' });

    expect(iconsLibrary.getSvgIcon('gear', 'super-pack')?.icon.getContent()).toEqual('<svg><circle></circle></svg>');
    expect(iconsLibrary.getSvgIcon('home', 'super-pack')?.icon.getContent()).toEqual('<svg></svg>');
  });

  it('should make icons of markup with the pack\'s own createIcon', () => {
    const createIcon = vi.fn((name: string, content: string) => new NbSvgIcon(name, `<svg class="own">${content}</svg>`));
    iconsLibrary.registerSvgPack('own-pack', { home: '<rect></rect>' }, { createIcon });
    iconsLibrary.registerSvgIcons('own-pack', { gear: '<circle></circle>' });

    expect(iconsLibrary.getSvgIcon('home', 'own-pack')?.icon.getContent()).toEqual('<svg class="own"><rect></rect></svg>');
    expect(iconsLibrary.getSvgIcon('gear', 'own-pack')?.icon.getContent()).toEqual('<svg class="own"><circle></circle></svg>');
    expect(createIcon).toHaveBeenCalledWith('gear', '<circle></circle>', expect.objectContaining({ createIcon }));
  });

  it('should only add svg icons to a registered svg pack', () => {
    iconsLibrary.registerFontPack('font-pack');

    expect(() => iconsLibrary.registerSvgIcons('font-pack', { home: '<svg></svg>' })).toThrow(
      "Pack 'font-pack' is not an 'SVG' Pack and its type is 'font'",
    );
    expect(() => iconsLibrary.registerSvgIcons('unknown-pack', { home: '<svg></svg>' })).toThrow(
      "Icon Pack 'unknown-pack' is not registered",
    );
  });
});
