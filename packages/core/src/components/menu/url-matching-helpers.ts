export function isUrlPathEqual(path: string, link?: string) {
  // Location.path() reports the root as '' while menu links use '/'; trailing slashes don't change the page.
  if (link === undefined) {
    return false;
  }
  const withoutTrailingSlash = (url: string) => url.replace(/\/+$/, '');
  return withoutTrailingSlash(link) === withoutTrailingSlash(getPathPartOfUrl(path));
}

export function isUrlPathContain(path: string, link?: string) {
  if (link === undefined) {
    return false;
  }
  const locationPath = getPathPartOfUrl(path);
  const endOfUrlSegmentRegExp = /\/|^$/;
  return locationPath.startsWith(link) &&
    locationPath.slice(link.length).charAt(0).search(endOfUrlSegmentRegExp) !== -1;
}

export function getPathPartOfUrl(url: string): string {
  return url.match(/.*?(?=[?;#]|$)/)?.[0] ?? '';
}

export function getFragmentPartOfUrl(url: string): string {
  const matched = url.match(/#(.+)/);
  return matched ? matched[1] : '';
}

export function isFragmentEqual(path: string, fragment: string): boolean {
  return getFragmentPartOfUrl(path) === fragment;
}

export function isFragmentContain(path: string, fragment: string): boolean {
  return getFragmentPartOfUrl(path).includes(fragment);
}

/**
 * Checks that the URL has the query params of a menu item: all of them (`exact` false), or only them (`exact` true).
 * Values are compared as strings, an array value as a repeated param.
 */
export function isQueryParamsMatch(url: string, queryParams: Record<string, unknown>, exact = false): boolean {
  const actual = new URLSearchParams(url.match(/\?([^#]*)/)?.[1] ?? '');
  const expected = Object.entries(queryParams).filter(([, value]) => value != null);

  const hasAll = expected.every(([key, value]) => {
    const values = (Array.isArray(value) ? value : [value]).map(String);
    const actualValues = actual.getAll(key);
    return values.length === actualValues.length && values.every((v, i) => v === actualValues[i]);
  });
  return hasAll && (!exact || new Set(actual.keys()).size === expected.length);
}
