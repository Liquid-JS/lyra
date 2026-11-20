import { inject } from '@angular/core';
import { RedirectFunction, Route, Router } from '@angular/router';

import { NGD_AREA } from '../app.options';
import { NgdAreaEntry } from '../docs.model';
import { NgdMenuService } from '../@theme/services/menu.service';
import { NgdStructureService } from '../@theme/services/structure.service';
import { createSlag } from '../@theme/services/text.service';

/** The area's first page, at its top or in its first section, which `/<area>` opens. */
export const firstPageRedirect: RedirectFunction = () => {
  const area = inject(NGD_AREA);
  const [first] = inject(NgdMenuService).getPreparedMenu(area);
  return first?.link ?? first?.children?.[0]?.link ?? '/';
};

/** The first tab of the component page the URL names, if it names a component page without a tab. */
function firstTab(segments: string[]): string | undefined {
  const resolved = inject(NgdStructureService).resolvePage(inject(NGD_AREA), segments);
  if (resolved?.page.type !== 'tabs' || resolved.tab) {
    return undefined;
  }
  return Object.entries(resolved.page.tabs).find(([, shown]) => shown)?.[0];
}

/** Opens the component page on its first tab, e.g. `overview`, before anything renders. */
const firstTabRedirect: RedirectFunction = ({ url, queryParams, fragment }) => {
  const segments = url.map((segment) => segment.path);
  return inject(Router).createUrlTree(['/', inject(NGD_AREA), ...segments, firstTab(segments) ?? ''], {
    queryParams,
    fragment: fragment ?? undefined,
  });
};

/**
 * A redirect for each component page's own path, e.g. `forms/button`, which matches it without a tab and opens it on
 * its first tab.
 */
export function firstTabRedirects(area: NgdAreaEntry): Route[] {
  const paths = area.children.flatMap((child) => {
    if (child.type === 'tabs') {
      return [createSlag(child.name)];
    }
    if (child.type === 'section') {
      return child.children
        .filter((page) => page.type === 'tabs')
        .map((page) => `${createSlag(child.name)}/${createSlag(page.name)}`);
    }
    return [];
  });
  return paths.map((path) => ({ path, pathMatch: 'full', redirectTo: firstTabRedirect }));
}
