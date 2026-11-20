import { RenderMode, ServerRoute } from '@angular/ssr'

import { docsPages } from '../pages'
import { structure } from '../structure'

const pages = docsPages(structure)

/** The docs pages under an area at a depth, e.g. `components/:page/:subPage/:tab`, with each one's segments. */
function area(path: string, depth: number): ServerRoute {
    const names = ['page', 'subPage', 'tab'].slice(0, depth)
    return {
        path: [path, ...names.map((name) => `:${name}`)].join('/'),
        renderMode: RenderMode.Prerender,
        getPrerenderParams: async () =>
            pages
                .filter((page) => page.startsWith(`${path}/`) && page.split('/').length === depth + 1)
                .map((page) => Object.fromEntries(page.split('/').slice(1).map((segment, i) => [names[i], segment])))
    }
}

/**
 * The home page and every docs page are prerendered, so each has its own content and metadata for search engines and
 * link previews. The live examples, which the docs show in frames, render in the browser.
 */
export const serverRoutes: ServerRoute[] = [
    { path: '', renderMode: RenderMode.Prerender },
    ...structure.flatMap(({ path }) => [1, 2, 3].map((depth) => area(path, depth))),
    { path: '**', renderMode: RenderMode.Client }
]
