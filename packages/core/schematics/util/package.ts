import { JsonObject } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { readJSON, writeJSON } from './file.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const packageJsonName = 'package.json';

interface PackageJson extends JsonObject {
  version: string;
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
  peerDependencies: { [key: string]: string };
}

/** The project's `package.json`; its shape isn't checked. */
function readPackageJson(tree: Tree): PackageJson {
  return readJSON(tree, packageJsonName) as PackageJson;
}

/** The version of the installed `@liquid-js/lyr-core`, which the other Lyra packages share. */
export function getLyraVersion(): string {
  return getLyraPackageJson().version;
}

/** The version range `@liquid-js/lyr-core` asks of a peer dependency; throws when it has no such peer. */
export function getLyraPeerDependencyVersion(packageName: string): string {
  const packageJson: PackageJson = getLyraPackageJson();

  if (noInfoAboutPeerDependency(packageJson, packageName)) {
    throwNoPackageInfoInPackageJson(packageName);
  }

  return packageJson.peerDependencies[packageName];
}

/** The version of a dependency in the project's `package.json`; throws when there's no such dependency. */
export function getDependencyVersionFromPackageJson(tree: Tree, packageName: string): string {
  if (!tree.exists(packageJsonName)) {
    throwNoPackageJsonError();
  }

  const packageJson = readPackageJson(tree);

  if (noInfoAboutDependency(packageJson, packageName)) {
    throwNoPackageInfoInPackageJson(packageName);
  }

  return packageJson.dependencies[packageName];
}

/** Adds a dependency, keeping the dependencies sorted; an existing one is kept unless `force` is set. */
export function addDependencyToPackageJson(tree: Tree, packageName: string, packageVersion: string, force = false) {
  if (!tree.exists(packageJsonName)) {
    throwNoPackageJsonError();
  }

  const packageJson = readPackageJson(tree);

  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }

  if (!packageJson.dependencies[packageName] || force) {
    packageJson.dependencies[packageName] = packageVersion;
    packageJson.dependencies = sortObjectByKeys(packageJson.dependencies);
  }

  writeJSON(tree, packageJsonName, packageJson);
}

/** The version of a dev dependency in the project's `package.json`; throws when there's no such dependency. */
export function getDevDependencyVersionFromPackageJson(tree: Tree, packageName: string): string {
  if (!tree.exists(packageJsonName)) {
    throwNoPackageJsonError();
  }

  const packageJson = readPackageJson(tree);

  if (noInfoAboutDevDependency(packageJson, packageName)) {
    throwNoPackageInfoInPackageJson(packageName);
  }

  return packageJson.devDependencies[packageName];
}

/** Adds a dev dependency, keeping them sorted; an existing one is kept. */
export function addDevDependencyToPackageJson(tree: Tree, packageName: string, packageVersion: string) {
  if (!tree.exists(packageJsonName)) {
    throwNoPackageJsonError();
  }

  const packageJson = readPackageJson(tree);

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  if (!packageJson.devDependencies[packageName]) {
    packageJson.devDependencies[packageName] = packageVersion;
    packageJson.devDependencies = sortObjectByKeys(packageJson.devDependencies);
  }

  writeJSON(tree, packageJsonName, packageJson);
}

function throwNoPackageJsonError() {
  throw new Error('No package.json found in the tree.');
}

function throwNoPackageInfoInPackageJson(packageName: string) {
  throw new Error(`No info found in package.json for ${packageName}`);
}

function noInfoAboutDependency(packageJson: PackageJson, packageName: string): boolean {
  return !dependencyAlreadyExists(packageJson, packageName);
}

function noInfoAboutDevDependency(packageJson: PackageJson, packageName: string): boolean {
  return !devDependencyAlreadyExists(packageJson, packageName);
}

function noInfoAboutPeerDependency(packageJson: PackageJson, packageName: string): boolean {
  return !peerDependencyAlreadyExists(packageJson, packageName);
}

// The `*AlreadyExists` checks are false without the section too; `package.json` may lack it.
function dependencyAlreadyExists(packageJson: PackageJson, packageName: string): boolean {
  return !!(packageJson.dependencies && packageJson.dependencies[packageName]);
}

function devDependencyAlreadyExists(packageJson: PackageJson, packageName: string): boolean {
  return !!(packageJson.devDependencies && packageJson.devDependencies[packageName]);
}

function peerDependencyAlreadyExists(packageJson: PackageJson, packageName: string): boolean {
  return !!(packageJson.peerDependencies && packageJson.peerDependencies[packageName]);
}

/** A new object with the keys in sorted order. */
function sortObjectByKeys(obj: { [key: string]: string }): { [key: string]: string } {
  return Object.keys(obj)
    .sort()
    .reduce<{ [key: string]: string }>((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

function getLyraPackageJson(): PackageJson {
  return require('../../package.json');
}
