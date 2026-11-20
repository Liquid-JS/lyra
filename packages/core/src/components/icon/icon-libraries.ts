import { Service } from '@angular/core';

import type { NbIconStyle } from '@liquid-js/lyr-core/base';
import { NbFontIconPackParams, NbIconPack, NbIconPackParams, NbIconPackType, NbIcons } from './icon-pack';
import { NbFontIcon, NbIcon, NbSvgIcon } from './icon';
import { NB_ESSENTIAL_ICONS, NB_ESSENTIAL_ICONS_PACK } from './essential-icons';

export interface NbIconDefinition {
  name: string;
  type: string;
  pack: string;
  icon: NbIcon;
}

function throwPackNotFoundError(name: string): never {
  throw Error(`Icon Pack '${name}' is not registered`);
}

function throwNoDefaultPackError(): never {
  throw Error('Default pack is not registered.');
}

function throwWrongPackTypeError(name: string, type: string, desiredType: string): never {
  throw Error(`Pack '${name}' is not an '${desiredType}' Pack and its type is '${type}'`);
}

/**
 * Registers icon packs for `nb-icon`, and looks icons up in them.
 *
 * The `essentials` pack, with the icons Lyra's components use, is registered from the start; an app's own packs need
 * registering, and `setDefaultPack` names the one `nb-icon` uses when `pack` is unset.
 */
@Service()
export class NbIconLibraries {
  protected packs = new Map<string, NbIconPack>();
  protected defaultPack?: NbIconPack;

  constructor() {
    // The icons Lyra components use themselves, so they render wherever NbIconComponent is imported.
    this.registerSvgPack(NB_ESSENTIAL_ICONS_PACK, NB_ESSENTIAL_ICONS);
  }

  /** Registers an SVG pack, or replaces the one of that name; `icons` maps names to `NbIcon`s or markup. */
  registerSvgPack(name: string, icons: NbIcons, params: NbIconPackParams = {}) {
    this.packs.set(name, {
      name,
      icons: new Map(Object.entries(icons)),
      params,
      type: NbIconPackType.SVG,
    });
  }

  /**
   * Adds icons to a registered SVG pack, or replaces ones of the same name: `NbIcon`s, or markup the pack makes icons
   * of (whole SVG files, unless the pack says otherwise with `createIcon`). An SVG file can be imported as text with
   * `import vegan from './vegan.svg' with { loader: 'text' };`.
   *
   * ```ts
   * iconLibraries.registerSvgIcons('icons', { vegan, 'gluten-free': glutenFree });
   * ```
   */
  registerSvgIcons(name: string, icons: NbIcons) {
    const pack = this.getPackOrThrow(name);
    if (pack.type !== NbIconPackType.SVG) {
      throwWrongPackTypeError(pack.name, pack.type, 'SVG');
    }
    for (const [iconName, icon] of Object.entries(icons)) {
      pack.icons.set(iconName, icon);
    }
  }

  /**
   * Registers a font pack, or replaces the one of that name. A font icon is drawn by its classes (`packClass` and the
   * name, with `iconClassPrefix`), with the name as its content when the font uses ligatures.
   */
  registerFontPack(name: string, params: NbFontIconPackParams = {}) {
    this.packs.set(name, {
      name,
      params,
      icons: new Map(),
      type: NbIconPackType.FONT,
    });
  }

  getPack(name: string): NbIconPack | undefined {
    return this.packs.get(name);
  }

  /** Makes a registered pack the one icons are taken from when no pack is named; throws when it isn't registered. */
  setDefaultPack(name: string) {
    this.defaultPack = this.getPackOrThrow(name);
  }

  /**
   * An icon of an SVG pack (the default one when `pack` is unset), or `undefined` when the pack doesn't have it. Throws
   * when the pack isn't registered or isn't an SVG pack.
   */
  getSvgIcon(name: string, pack?: string): NbIconDefinition | undefined {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== NbIconPackType.SVG) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'SVG');
    }

    const icon = this.getIconFromPack(name, iconsPack);

    if (!icon) {
      return undefined;
    }

    return {
      name,
      pack: iconsPack.name,
      type: NbIconPackType.SVG,
      icon: this.createSvgIcon(name, icon, iconsPack.params),
    };
  }

  /**
   * An icon of a font pack (the default one when `pack` is unset). A font pack holds no icons, so any name gives one.
   * Throws when the pack isn't registered or isn't a font pack.
   */
  getFontIcon(name: string, pack?: string): NbIconDefinition {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== NbIconPackType.FONT) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'Font');
    }

    const icon = this.getIconFromPack(name, iconsPack) ?? '';
    const params: NbFontIconPackParams = iconsPack.params;
    const iconContent = params.ligature ? name : icon;

    return {
      name,
      pack: iconsPack.name,
      type: NbIconPackType.FONT,
      icon: this.createFontIcon(name, iconContent, iconsPack.params),
    };
  }

  /**
   * An icon of a pack of either type, as `getSvgIcon` and `getFontIcon` give it.
   * @param style the style to use where the pack has the icon in both, see `NbComponentDefaults.iconStyle`
   */
  getIcon(name: string, pack?: string, style?: NbIconStyle): NbIconDefinition | undefined {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();
    const styled = style && this.styledName(name, style);
    const resolvedName = styled && iconsPack.icons.has(styled) ? styled : name;

    if (iconsPack.type === NbIconPackType.SVG) {
      return this.getSvgIcon(resolvedName, pack);
    }

    return this.getFontIcon(resolvedName, pack);
  }

  /**
   * The name of an icon in the other style: `star-outline` for `star` in the outline style, `star` for `star-outline`
   * in the filled one. `getIcon` uses it where the pack has it.
   */
  protected styledName(name: string, style: NbIconStyle): string {
    const outline = name.endsWith('-outline');
    if (style === 'filled') {
      return outline ? name.slice(0, -'-outline'.length) : name;
    }
    return outline ? name : `${name}-outline`;
  }

  // A pack's icon is markup, which the pack may make icons of itself, or an icon of its own.
  protected createSvgIcon(name: string, content: NbIcon | string, params: NbIconPackParams): NbIcon {
    if (typeof content !== 'string') {
      return content;
    }
    return params.createIcon ? params.createIcon(name, content, params) : new NbSvgIcon(name, content, params);
  }

  // A pack's icon is a character or ligature, or an icon of its own.
  protected createFontIcon(name: string, content: NbIcon | string, params: NbFontIconPackParams): NbIcon {
    return typeof content === 'string' ? new NbFontIcon(name, content, params) : content;
  }

  protected getPackOrThrow(name: string): NbIconPack {
    const pack = this.packs.get(name);
    if (!pack) {
      throwPackNotFoundError(name);
    }
    return pack;
  }

  protected getDefaultPackOrThrow(): NbIconPack {
    if (!this.defaultPack) {
      throwNoDefaultPackError();
    }
    return this.defaultPack;
  }

  protected getIconFromPack(name: string, pack: NbIconPack): NbIcon | string | undefined {
    return pack.icons.get(name);
  }
}
