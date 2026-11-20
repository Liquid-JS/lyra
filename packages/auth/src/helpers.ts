/** Whether the value is an object (or a function) whose properties can be read and set. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return (typeof value === 'object' && value !== null) || typeof value === 'function';
}

/**
 * Merges the sources into the target, deep for plain objects: arrays, dates and regexps are cloned, and instances of
 * other classes (e.g. `HttpHeaders`) are kept whole. Returns the target, or `false` when it isn't an object. To merge
 * without changing any source, give a new object as the target: `deepExtend({}, defaults, options)`.
 *
 * Typed as the target and the sources together, which holds while the sources have (parts of) the target's shape.
 */
export function deepExtend<T extends object>(target: T): T;
export function deepExtend<T extends object, A>(target: T, a: A): T & A;
export function deepExtend<T extends object, A, B>(target: T, a: A, b: B): T & A & B;
export function deepExtend<T extends object, A, B, C>(target: T, a: A, b: B, c: C): T & A & B & C;
export function deepExtend(target: object, ...sources: unknown[]): object;
export function deepExtend(...objects: unknown[]): unknown {
  const target = objects[0];
  if (objects.length < 1 || typeof target !== 'object' || !isRecord(target)) {
    return false;
  }

  if (objects.length < 2) {
    return target;
  }

  // cut off target object
  const args = objects.slice(1);

  args.forEach((obj) => {
    // skip argument if it is array or isn't object
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return;
    }

    Object.entries(obj).forEach(([key, val]: [string, unknown]) => {
      const src = target[key]; // source value

      // recursion prevention
      if (val === target) {
        return;

        // a primitive replaces the value
      } else if (typeof val !== 'object' || val === null) {
        target[key] = val;

        return;

        // just clone arrays (and recursive clone objects inside)
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val);

        return;

        // custom cloning and overwrite for specific objects
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val);

        return;

        // instances of other classes (e.g. HttpHeaders) are kept whole, so they stay what they are
      } else if (!isPlainObject(val)) {
        target[key] = val;

        return;

        // overwrite by new value if source isn't object or array
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = deepExtend({}, val);

        return;

        // source value and new value is objects both, extending...
      } else {
        target[key] = deepExtend(src, val);

        return;
      }
    });
  });

  return target;
}

/** Whether the value is an object literal (or has no prototype), rather than an instance of some class. */
function isPlainObject(val: object): boolean {
  const prototype: unknown = Object.getPrototypeOf(val);
  return prototype === Object.prototype || prototype === null;
}

function isSpecificValue(val: unknown): val is Date | RegExp {
  return val instanceof Date || val instanceof RegExp;
}

function cloneSpecificValue(val: Date | RegExp): Date | RegExp {
  if (val instanceof Date) {
    return new Date(val.getTime());
  } else {
    return new RegExp(val);
  }
}

/** Clones an array, and the arrays and plain objects in it, as `deepExtend` does. */
function deepCloneArray(arr: readonly unknown[]): unknown[] {
  const clone = new Array<unknown>();
  arr.forEach((item, index) => {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else if (!isPlainObject(item)) {
        clone[index] = item;
      } else {
        clone[index] = deepExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });

  return clone;
}

/** Values a dotted path doesn't go into: arrays, functions and classes. */
type NbPathLeaf = readonly unknown[] | ((...args: never) => unknown) | (abstract new (...args: never) => unknown);

/**
 * T with every property optional, all the way down; arrays, functions and classes are given whole.
 */
export type NbAuthDeepPartial<T> = { [K in keyof T]?: NbAuthDeepPartialValue<T[K]> };

/** A value of `NbAuthDeepPartial`, each type of a union on its own. */
type NbAuthDeepPartialValue<V> = V extends NbPathLeaf ? V : V extends object ? NbAuthDeepPartial<V> : V;

/**
 * The dotted paths `getDeepFromObject` can follow into T, such as `'login'` and `'login.redirect.success'`. Arrays,
 * functions and classes end a path; optional and union properties are followed into their object types.
 */
export type NbPath<T> = T extends NbPathLeaf
  ? never
  : T extends object
    ? { [K in keyof T & string]-?: K | `${K}.${NbPath<T[K]>}` }[keyof T & string]
    : never;

/**
 * The value at the dotted path P into T, as `getDeepFromObject` reads it: `undefined` where a step on the way may be
 * missing or isn't an object.
 */
export type NbPathValue<T, P extends string> = T extends NbPathLeaf
  ? undefined
  : T extends object
    ? P extends `${infer K}.${infer Rest}`
      ? K extends keyof T
        ? NbPathValue<T[K], Rest>
        : undefined
      : P extends keyof T
        ? T[P]
        : undefined
    : undefined;

/**
 * Reads the value at a dotted path, from a copy of the object, or the default where there's none.
 *
 * getDeepFromObject({result: {data: 1}}, 'result.data', 2); // returns 1
 */
export function getDeepFromObject<T, P extends NbPath<T>>(object: T, name: P): NbPathValue<T, P>;
export function getDeepFromObject(object: unknown, name: string, defaultValue?: unknown): unknown;
export function getDeepFromObject(object: unknown = {}, name: string, defaultValue?: unknown): unknown {
  const keys = name.split('.');
  // clone the object
  let level: unknown = deepExtend({}, object || {});
  keys.forEach((k) => {
    level = isRecord(level) ? level[k] : undefined;
  });

  return typeof level === 'undefined' ? defaultValue : level;
}

/** The messages (or errors) in a value read from a response: a message, or a list of them; anything else isn't one. */
export function nbAuthMessages(value: unknown): string[] {
  const messages: unknown[] = Array.isArray(value) ? value : [value];
  return messages.filter((message) => typeof message === 'string');
}

export function urlBase64Decode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: { break; }
    case 2: { output += '=='; break; }
    case 3: { output += '='; break; }
    default: {
      throw new Error('Illegal base64url string!');
    }
  }
  return b64DecodeUnicode(output);
}

export function b64decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';

  str = String(str).replace(/=+$/, '');

  if (str.length % 4 === 1) {
    throw new Error(`'atob' failed: The string to be decoded is not correctly encoded.`);
  }

  // bc counts the characters, bs stores their bits
  let bc = 0;
  let bs = 0;
  for (const char of str) {
    // try to find character in table (0-63, not found => -1)
    const value = chars.indexOf(char);
    if (value === -1) {
      continue;
    }
    // add the character's bits to the storage,
    bs = bc % 4 ? bs * 64 + value : value;
    // and if not first of each 4 characters, convert the first 8 bits to one ascii character
    if (bc++ % 4) {
      output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
  }
  return output;
}

// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(Array.from(b64decode(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
