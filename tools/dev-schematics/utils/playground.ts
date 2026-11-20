import { basename, dirname, fragment, join, normalize, Path, PathFragment, strings } from '@angular-devkit/core'
import { DirEntry, Tree } from '@angular-devkit/schematics'

export const ROUTES_EXT = '.routes.ts'
export const PLAYGROUND_PATH: Path = normalize('/packages/playground/src/playground/')
export const PLAYGROUND_ROUTES_PATH: Path = join(PLAYGROUND_PATH, generateRoutesFileName(basename(PLAYGROUND_PATH)))

export const LAYOUT_DIR_NAME = 'with-layout'
export const LAYOUT_DIR_PATH = join(PLAYGROUND_PATH, LAYOUT_DIR_NAME)
export const LAYOUT_ROUTES_PATH = join(LAYOUT_DIR_PATH, generateRoutesFileName(LAYOUT_DIR_NAME))
export const LAYOUT_COMPONENT_CLASS = 'PlaygroundLayoutComponent'
export const LAYOUT_COMPONENT_IMPORT = './playground-layout.component'

export const NO_LAYOUT_DIR_NAME = 'without-layout'
export const NO_LAYOUT_DIR_PATH = join(PLAYGROUND_PATH, NO_LAYOUT_DIR_NAME)
export const NO_LAYOUT_ROUTES_PATH = join(NO_LAYOUT_DIR_PATH, generateRoutesFileName(NO_LAYOUT_DIR_NAME))
export const NO_LAYOUT_COMPONENT_CLASS = 'PlaygroundBaseComponent'
export const NO_LAYOUT_COMPONENT_IMPORT = './playground-base.component'

export const INCLUDE_DIRS: string[] = [LAYOUT_DIR_PATH, NO_LAYOUT_DIR_PATH]

/**
 * Returns root playground directory.
 * Don't use it to iterate through all playground directories,
 * since some directories should be ignored. To get all allowed directories
 * use `getPlaygroundDirs` instead.
 *
 * @param tree
 */
export function getPlaygroundRootDir(tree: Tree): DirEntry {
    return tree.getDir(PLAYGROUND_PATH)
}

/**
 * Returns DirEntries of root playground directories excluding ignored.
 *
 * @param tree
 */
export function getPlaygroundDirs(tree: Tree): DirEntry[] {
    const pgDir = getPlaygroundRootDir(tree)

    return pgDir.subdirs
        .filter((dirName: PathFragment) => INCLUDE_DIRS.includes(join(pgDir.path, dirName)))
        .map((path) => pgDir.dir(path))
}

/**
 * Returns the dirs that get a routes file of their own: the included dirs and their direct children.
 *
 * @param tree
 */
export function getRoutesDirs(tree: Tree): DirEntry[] {
    const baseDirs = getPlaygroundDirs(tree)
    const baseDirectChildren = baseDirs.reduce((dirs: DirEntry[], dir: DirEntry) => dirs.concat(dir.subdirs.map((subDir) => dir.dir(subDir))), [])
    return baseDirs.concat(baseDirectChildren)
}

export function isRootPlaygroundDir(dir: Path): boolean {
    return dir === PLAYGROUND_PATH
}

export function isBasePlaygroundDir(dir: Path): boolean {
    return dir === LAYOUT_DIR_PATH || dir === NO_LAYOUT_DIR_PATH
}

/**
 * Returns dashed routes file name.
 */
export function generateRoutesFileName(dirName: string): PathFragment {
    return fragment(strings.dasherize(dirName) + ROUTES_EXT)
}

/**
 * Returns the name of the routes constant, e.g. `BUTTON_GROUP_ROUTES` for `button-group`.
 */
export function generateRoutesConstName(dirName: string): string {
    return `${strings.underscore(dirName).toUpperCase()}_ROUTES`
}

export function isLayoutPath(path: Path): boolean {
    return path.startsWith(LAYOUT_DIR_PATH)
}

export function isComponent(fileName: PathFragment): boolean {
    return fileName.endsWith('.component.ts')
}

export function isRoutesFile(fileName: PathFragment): boolean {
    return fileName.endsWith(ROUTES_EXT)
}

export function getComponentsFromDir(dir: DirEntry): Path[] {
    return dir.subfiles.filter(isComponent).map((fileName) => join(dir.path, fileName))
}

export function getRoutesFileFromDir(dir: DirEntry): Path | null {
    const routesFileName = dir.subfiles.find(isRoutesFile)
    return routesFileName ? join(dir.path, routesFileName) : null
}

export function hasRoutesFileInDir(dir: DirEntry): boolean {
    return dir.subfiles.some(isRoutesFile)
}

export function hasComponentsInDir(dir: DirEntry): boolean {
    return dir.subfiles.some(isComponent)
}

function isOutsidePlayground(path: Path): boolean {
    return !path.startsWith(PLAYGROUND_PATH)
}

/**
 * Returns the routes file in the given dir or the closest one above it.
 */
export function findRoutesFile(tree: Tree, path: Path): Path | undefined {
    if (isOutsidePlayground(path)) {
        return undefined
    }

    const routesFile = tree.getDir(path).subfiles.find(isRoutesFile)
    return routesFile ? join(path, routesFile) : findRoutesFile(tree, dirname(path))
}

export function isInPlaygroundRoot(filePath: Path): boolean {
    return dirname(filePath) === PLAYGROUND_PATH
}
