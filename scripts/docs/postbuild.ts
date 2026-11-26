import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { docsPages } from '../../packages/docs/src/pages.ts'
import { structure } from '../../packages/docs/src/structure.ts'

/**
 * Runs after `ng build docs`, which prerenders the home page and every docs page into its own index.html:
 * - a route without one that only leads to a page below it, such as an area's own path, gets a redirect to that page,
 *   as Angular prerenders a route's redirect, so one read without a browser, e.g. by an agent, isn't empty;
 * - any other route without one gets the app as the browser renders it, so deep links work on GitHub Pages;
 * - 404.html is that app too, for the routes that are never prerendered, such as the live examples;
 * - sitemap.xml lists the prerendered pages, at the URLs their canonical links name; the paths that only redirect,
 *   e.g. to a component's first tab, are left out.
 */

const root = resolve(import.meta.dirname, '..', '..')
const dist = join(root, 'dist', 'docs')
const siteUrl = 'https://liquid-js.github.io/lyra/'
const shell = join(dist, 'index.csr.html')

const pages = docsPages(structure)
const areas = structure.map((area) => area.path)
const base = /<base href="([^"]*)"/.exec(readFileSync(shell, 'utf8'))?.[1] ?? '/'
const shellPaths = new Set<string>()
let shells = 0
for (const path of [...areas, ...pages]) {
    const index = join(dist, path, 'index.html')
    if (!existsSync(index)) {
        mkdirSync(join(dist, path), { recursive: true })
        const target = pages.find((page) => page.startsWith(`${path}/`) && existsSync(join(dist, page, 'index.html')))
        if (target) {
            writeFileSync(index, redirect(`${base}${target}`))
        } else {
            copyFileSync(shell, index)
            shellPaths.add(path)
            shells++
        }
    }
}
copyFileSync(shell, join(dist, '404.html'))

const prerendered = pages.filter((page) => existsSync(join(dist, page, 'index.html')) && isPrerendered(page))
writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
  </url>
${prerendered.map((page) => `  <url>\n    <loc>${siteUrl}${page}/</loc>\n  </url>`).join('\n')}
</urlset>
`
)
console.log(`${pages.length - shells} pages prerendered, ${shells} routes given the app, a sitemap with ${prerendered.length + 1} pages`)

/** A page that sends its reader on to another, as Angular prerenders a route's redirect. */
function redirect(url: string): string {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting</title>
    <meta http-equiv="refresh" content="0; url=${url}">
  </head>
  <body>
    <pre>Redirecting to <a href="${url}">${url}</a></pre>
  </body>
</html>
`
}

/** Whether a page's index.html is its own prerendered page: not the app copied in above, nor a redirect. */
function isPrerendered(page: string): boolean {
    return !shellPaths.has(page) && !/http-equiv="refresh"/.test(readFileSync(join(dist, page, 'index.html'), 'utf8'))
}
