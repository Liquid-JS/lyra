import type { NgdAreaEntry } from './app/docs.model';

/** A route under an area, and the routes under it. */
interface RouteNode {
  path: string;
  children: RouteNode[];
}

interface StructureEntry {
  type: string;
  name: string;
  children?: StructureEntry[];
}

/** A component's tabs, each a page of its own. */
const TABS = ['overview', 'api', 'theme', 'examples'];

/**
 * Every page of the docs, as a path such as `components/forms/button/overview`: what the sitemap lists and the build
 * prerenders. A section's or a component's own path, which redirects to its first page, is listed too.
 */
export function docsPages(structure: NgdAreaEntry[]): string[] {
  return structure.flatMap((area) => leafs(area.path, routesTree(area.children as StructureEntry[])));
}

function routesTree(entries: StructureEntry[]): RouteNode[] {
  return entries
    .filter((entry) => ['section', 'page', 'tabs'].includes(entry.type))
    .map((entry) => {
      const children = entry.type === 'tabs' ? TABS.map((name) => ({ name, type: 'page' })) : entry.children;
      return { path: slug(entry.name), children: children ? routesTree(children) : [] };
    });
}

function all(prefix: string, nodes: RouteNode[]): string[] {
  return nodes.flatMap((node) => {
    const path = `${prefix}/${node.path}`;
    return [path, ...all(path, node.children)];
  });
}

function leafs(prefix: string, nodes: RouteNode[]): string[] {
  return nodes.flatMap((node) => {
    const path = `${prefix}/${node.path}`;
    return node.children.length ? all(path, node.children) : [path];
  });
}

/** As the docs app's `NgdTextService.createSlag`. */
export function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
