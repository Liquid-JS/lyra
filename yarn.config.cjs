// @ts-check
/**
 * Dependency rules for the workspace, checked by `yarn constraints` (and fixed by `yarn constraints --fix`).
 *
 * - Every package is declared with the same range wherever it appears, so the workspace installs a single
 *   version of each tool and library.
 * - The root manifest only has devDependencies: the toolchain and the libraries the packages build against.
 * - Published packages only declare peerDependencies.
 * - Private workspaces (apps) declare what they run on as dependencies and may only keep devDependencies
 *   that no other workspace declares.
 * - Everything a workspace declares must also install at a single version, including copies that tools pull
 *   in transitively. The constraints engine can't see installed packages, so scripts/check-versions.ts checks
 *   that part; align any duplicates with `resolutions` in the root manifest.
 *
 * Yarn loads this file as CommonJS and reads `module.exports`.
 */

/** @param {import('@yarnpkg/types').Yarn.Constraints.Context} context */
function sameRangeEverywhere({ Yarn }) {
  for (const dependency of Yarn.dependencies()) {
    if (dependency.type === 'peerDependencies' || dependency.range.startsWith('workspace:')) {
      continue;
    }
    for (const other of Yarn.dependencies({ ident: dependency.ident })) {
      if (other.type !== 'peerDependencies' && !other.range.startsWith('workspace:')) {
        dependency.update(other.range);
      }
    }
  }
}

/** @param {import('@yarnpkg/types').Yarn.Constraints.Context} context */
function manifestRoles({ Yarn }) {
  for (const workspace of Yarn.workspaces()) {
    const isRoot = workspace.cwd === '.';
    const isPublished = !workspace.manifest.private;
    for (const dependency of Yarn.dependencies({ workspace })) {
      if (isRoot && dependency.type !== 'devDependencies') {
        dependency.error(`The root manifest only declares devDependencies (found ${dependency.ident} in ${dependency.type}).`);
      }
      if (!isRoot && isPublished && dependency.type !== 'peerDependencies') {
        dependency.error(`Published packages declare ${dependency.ident} as a peer dependency, not in ${dependency.type}.`);
      }
      if (!isRoot && !isPublished && dependency.type === 'devDependencies') {
        const elsewhere = Yarn.dependencies({ ident: dependency.ident }).some((other) => other.workspace !== workspace);
        if (elsewhere) {
          dependency.error(`${dependency.ident} is shared with another workspace, so it belongs in the root devDependencies.`);
        }
      }
    }
  }
}

module.exports = {
  /** @param {import('@yarnpkg/types').Yarn.Constraints.Context} context */
  async constraints(context) {
    sameRangeEverywhere(context);
    manifestRoles(context);
  },
};
