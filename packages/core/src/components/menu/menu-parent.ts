import { InjectionToken } from '@angular/core';

import type { NbMenuItem } from './menu.service';

/** A component around a menu that has a say in its submenus opening and closing, e.g. the sidebar. */
export interface NbMenuParent {
  /** Called as a submenu is about to open or close, by click or key; `false` keeps it as it is. */
  submenuToggle(item: NbMenuItem): boolean;
}

export const NB_MENU_PARENT = new InjectionToken<NbMenuParent>('NB_MENU_PARENT');
