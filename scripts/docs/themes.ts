import * as sass from 'sass';

/**
 * Compiles the docs theme export stylesheet with a custom `export()` Sass function
 * that captures the registered themes and the theme mapping, and turns them into the
 * `themes` / `completeThemes` structures the theme tables in the docs render.
 */

export interface ThemeProp {
  name: string;
  value: unknown;
  parents: PropLink[];
  childs: PropLink[];
}

export interface PropLink {
  theme: string;
  prop: string;
}

export interface ThemeExport {
  name: string;
  parent: string | null;
  data: Record<string, ThemeProp>;
}

interface RawTheme {
  parent: string | null;
  data: Record<string, unknown>;
}

export interface ThemesExport {
  themes: Record<string, ThemeExport>;
  completeThemes: Record<string, ThemeExport>;
  /** Each theme's resolved values, with the variable each follows: what the theme editor loads for a base theme. */
  themeValues: Record<string, ThemeValues>;
}

export interface ThemeValue {
  value: unknown;
  /** The variable it follows, if any. */
  parent?: string;
}

export interface ThemeValues {
  name: string;
  parent: string | null;
  data: Record<string, ThemeValue>;
}

/** The themes' values and parents alone, without the links between the themes. */
function slim(themes: Record<string, ThemeExport>): Record<string, ThemeValues> {
  return Object.fromEntries(
    Object.entries(themes).map(([name, theme]) => [
      name,
      {
        name: theme.name,
        parent: theme.parent,
        data: Object.fromEntries(
          Object.entries(theme.data).map(([key, prop]) => {
            // A theme's parents also list the one it inherits from under the same name.
            const parent = prop.parents.find((link) => link.prop !== key)?.prop;
            return [key, { value: prop.value, ...(parent ? { parent } : {}) }];
          }),
        ),
      },
    ]),
  );
}

export function exportThemes(stylesheet: string): ThemesExport {
  let result: ThemesExport | undefined;

  sass.compile(stylesheet, {
    loadPaths: ['node_modules'],
    quietDeps: true,
    logger: sass.Logger.silent,
    functions: {
      'export($file, $themes, $mapping)': (args) => {
        const themes = toJs(args[1]) as Record<string, RawTheme>;
        const mapping = toJs(args[2]) as Record<string, unknown>;
        const completeThemes: Record<string, RawTheme> = {};
        for (const [name, theme] of Object.entries(themes)) {
          // The mapping under the theme: a theme's own component values, e.g. Material's corners, win.
          completeThemes[name] = { ...theme, data: { ...mapping, ...theme.data } };
        }
        const complete = parseThemes(completeThemes);
        result = { themes: parseThemes(themes), completeThemes: complete, themeValues: slim(complete) };
        return args[1];
      },
    },
  });

  if (!result) {
    throw new Error(`${stylesheet} did not call export()`);
  }
  return result;
}

function toJs(value: sass.Value): unknown {
  if (value instanceof sass.SassMap) {
    const out: Record<string, unknown> = {};
    value.contents.forEach((entry, key) => {
      out[String(toJs(key))] = toJs(entry);
    });
    return out;
  }
  if (value instanceof sass.SassList) {
    return value.asList.toArray().map(toJs);
  }
  if (value instanceof sass.SassColor) {
    const rgb = value.toSpace('rgb');
    const channels: sass.ChannelName[] = ['red', 'green', 'blue'];
    const [red, green, blue] = channels.map((channel) => Math.round(rgb.channel(channel)));
    const alpha = rgb.channel('alpha');
    if (alpha === 1) {
      return '#' + [red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('');
    }
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  if (value instanceof sass.SassNumber) {
    const unit = value.numeratorUnits.size ? value.numeratorUnits.get(0) : '';
    return unit ? `${value.value}${unit}` : value.value;
  }
  if (value instanceof sass.SassString) {
    return value.text;
  }
  if (value instanceof sass.SassBoolean) {
    return value.value;
  }
  if (value === sass.sassNull) {
    return null;
  }
  return value.toString();
}

function parseThemes(themes: Record<string, RawTheme>): Record<string, ThemeExport> {
  const result: Record<string, ThemeExport> = {};
  const ensure = (theme: string, prop: string): ThemeProp => {
    result[theme] ??= { name: theme, parent: themes[theme]?.parent ?? null, data: {} };
    result[theme].data[prop] ??= { name: prop, value: null, parents: [], childs: [] };
    return result[theme].data[prop];
  };
  const link = (parentTheme: string, parentProp: string, childTheme: string, childProp: string) => {
    ensure(parentTheme, parentProp).childs.push({ theme: childTheme, prop: childProp });
    ensure(childTheme, childProp).parents.push({ theme: parentTheme, prop: parentProp });
  };
  // A value as the theme resolves it: following references, multiplying a scaled one, and adding up a sum's terms.
  const termOf = (term: unknown, theme: string): unknown => {
    if (isScaled(term)) {
      return scale(valueOf(term['nb-scale'], theme), term.factor);
    }
    return typeof term === 'string' && term in themes[theme].data ? valueOf(term, theme) : term;
  };
  const valueOf = (prop: string, theme: string): unknown => {
    const value = themes[theme].data[prop];
    if (isSum(value)) {
      return sum(value['nb-sum'].map((term) => termOf(term, theme)));
    }
    return termOf(value, theme);
  };
  const resolve = (prop: string, scopedTheme: string, resultTheme: string, resultProp: string) => {
    const scoped = themes[scopedTheme];
    const value = scoped.data[prop];
    const target = ensure(resultTheme, resultProp);
    if (isScaled(value)) {
      target.value = valueOf(prop, scopedTheme);
      link(scopedTheme, value['nb-scale'], resultTheme, resultProp);
      return;
    }
    if (isSum(value)) {
      target.value = valueOf(prop, scopedTheme);
      for (const term of value['nb-sum']) {
        const name = isScaled(term) ? term['nb-scale'] : term;
        if (typeof name === 'string' && name in scoped.data) {
          link(scopedTheme, name, resultTheme, resultProp);
        }
      }
      return;
    }
    if (typeof value === 'string' && value in scoped.data) {
      if (target.parents.length === 0) {
        link(scopedTheme, value, resultTheme, resultProp);
      } else {
        target.parents.push({ theme: scopedTheme, prop: value });
      }
      resolve(value, scopedTheme, resultTheme, resultProp);
      return;
    }
    target.value = value;
    if (scoped.parent && themes[scoped.parent].data[prop] === value) {
      if (target.parents.length === 0) {
        link(scoped.parent, prop, resultTheme, prop);
      } else {
        target.parents.push({ theme: scoped.parent, prop });
      }
    }
  };

  for (const [themeName, theme] of Object.entries(themes)) {
    result[themeName] ??= { name: themeName, parent: theme.parent, data: {} };
    for (const prop of Object.keys(theme.data)) {
      ensure(themeName, prop);
      resolve(prop, themeName, themeName, prop);
    }
  }
  return result;
}

/** A theme value `nb-scale()` made: another value times a factor. */
interface ScaledValue {
  'nb-scale': string;
  factor: number;
}

function isScaled(value: unknown): value is ScaledValue {
  return typeof value === 'object' && value !== null && 'nb-scale' in value;
}

/** A theme value `nb-sum()` made: other values added up. */
interface SumValue {
  'nb-sum': unknown[];
}

function isSum(value: unknown): value is SumValue {
  return typeof value === 'object' && value !== null && 'nb-sum' in value;
}

// `1.5rem` + `0.875rem` + `2px` is `calc(2.375rem + 2px)`: lengths of one unit added, the rest left to a calc().
function sum(terms: unknown[]): string {
  const totals = new Map<string, number>();
  const rest: string[] = [];
  for (const term of terms) {
    const match = typeof term === 'string' ? /^(-?[\d.]+)([a-z%]*)$/.exec(term) : null;
    if (match) {
      totals.set(match[2], (totals.get(match[2]) ?? 0) + Number(match[1]));
    } else {
      rest.push(String(term));
    }
  }
  const parts = [...[...totals].map(([unit, total]) => `${Math.round(total * 10000) / 10000}${unit}`), ...rest];
  // A negative term is taken off: `calc(0.875rem - 1px)`.
  const [first, ...others] = parts;
  return others.length
    ? `calc(${others.reduce((css, part) => (part.startsWith('-') ? `${css} - ${part.slice(1)}` : `${css} + ${part}`), first)})`
    : first;
}

// `0.25rem` times 3 is `0.75rem`; a value that isn't a number stays a calc().
function scale(value: unknown, factor: number): string {
  const match = typeof value === 'string' ? /^(-?[\d.]+)([a-z%]*)$/.exec(value) : null;
  if (!match) {
    return `calc(${String(value)} * ${factor})`;
  }
  return `${Math.round(Number(match[1]) * factor * 10000) / 10000}${match[2]}`;
}
