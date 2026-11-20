import {
  FormatWidth,
  FormStyle,
  getLocaleDateFormat,
  getLocaleDayNames,
  getLocaleDayPeriods,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';

/* eslint-disable @typescript-eslint/no-deprecated -- Angular's bundled locale data, as the native date service uses */

// Angular's named date formats, as the locale writes them.
const NAMED_FORMATS: Record<string, FormatWidth> = {
  shortDate: FormatWidth.Short,
  mediumDate: FormatWidth.Medium,
  longDate: FormatWidth.Long,
  fullDate: FormatWidth.Full,
};

/** What a date's text says, read part by part. */
interface NbDateParts {
  year?: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  pm?: boolean;
}

/**
 * Reads a date written in an Angular date format, as `DatePipe` writes it: years (`y`), months as numbers or names
 * (`M`, `L`), days (`d`), weekday names (`E`, read and ignored), hours (`H`, `h`), minutes (`m`), seconds (`s`), the
 * day period (`a`) and quoted text, or a named date format such as `mediumDate`. Names are the locale's, and a format
 * without the year reads this year's dates. It gives `undefined` for a format with other parts, which it can't read,
 * `null` for text that doesn't follow the format, and an invalid date for a day that doesn't exist, e.g. 30 February.
 *
 * @internal
 */
export function nbParseDateFormat(
  text: string,
  format: string,
  locale: string,
  createDate: (year: number, month: number, day: number) => Date,
): Date | null | undefined {
  const named = NAMED_FORMATS[format];
  const pattern = named === undefined ? format : getLocaleDateFormat(locale, named);
  const tokens = pattern.match(/'(?:[^']|'')*'|([a-zA-Z])\1*|[^a-zA-Z']+/g) ?? [];
  // A format with parts it can't read is left to the caller.
  if (tokens.some((token) => /^[a-zA-Z]/.test(token) && !/^(y+|[ML]{1,4}|d{1,2}|E{1,4}|[Hh]{1,2}|m{1,2}|s{1,2}|a+)$/.test(token))) {
    return undefined;
  }
  const parts: NbDateParts = { month: 0, day: 1, hours: 0, minutes: 0, seconds: 0 };
  let rest = text.trim();

  // Reads up to `max` digits, at least `min`; undefined without them.
  const digits = (min: number, max: number) => {
    const match = new RegExp(`^\\d{${min},${max}}`).exec(rest);
    if (!match) {
      return undefined;
    }
    rest = rest.slice(match[0].length);
    return Number(match[0]);
  };
  // Reads the longest of the names the text starts with, by its index; undefined without one.
  const name = (names: readonly string[]) => {
    const lower = rest.toLocaleLowerCase(locale);
    const found = names
      .map((item, index) => ({ item: item.toLocaleLowerCase(locale), index }))
      .filter(({ item }) => item && lower.startsWith(item))
      .sort((a, b) => b.item.length - a.item.length)[0];
    if (!found) {
      return undefined;
    }
    rest = rest.slice(found.item.length);
    return found.index;
  };
  const monthNames = (width: TranslationWidth) => [
    ...getLocaleMonthNames(locale, FormStyle.Format, width),
    ...getLocaleMonthNames(locale, FormStyle.Standalone, width),
  ];

  for (const token of tokens) {
    if (token.startsWith("'")) {
      // Quoted text, '' being a quote.
      const literal = token.length > 2 ? token.slice(1, -1).replace(/''/g, "'") : "'";
      if (!rest.startsWith(literal)) {
        return null;
      }
      rest = rest.slice(literal.length);
      continue;
    }
    if (!/^[a-zA-Z]/.test(token)) {
      // Other text, e.g. separators, with spaces that may be more or fewer.
      const literal = token.trim();
      rest = rest.trimStart();
      if (literal && !rest.startsWith(literal)) {
        return null;
      }
      rest = rest.slice(literal.length).trimStart();
      continue;
    }
    const length = token.length;
    let value: number | undefined;
    switch (token[0]) {
      case 'y':
        value = length === 2 ? digits(2, 2) : digits(1, 4);
        if (value !== undefined) {
          parts.year = length === 2 ? 2000 + value : value;
        }
        break;
      case 'M':
      case 'L':
        if (length <= 2) {
          value = digits(1, 2);
          parts.month = (value ?? 0) - 1;
        } else if (length <= 4) {
          value = name(monthNames(length === 3 ? TranslationWidth.Abbreviated : TranslationWidth.Wide));
          parts.month = (value ?? 0) % 12;
        } else {
          return undefined;
        }
        break;
      case 'd':
        value = digits(1, 2);
        parts.day = value ?? 1;
        break;
      case 'E': {
        const width = length === 4 ? TranslationWidth.Wide : TranslationWidth.Abbreviated;
        value = name([
          ...getLocaleDayNames(locale, FormStyle.Format, width),
          ...getLocaleDayNames(locale, FormStyle.Format, TranslationWidth.Short),
        ]);
        break;
      }
      case 'H':
      case 'h':
        value = digits(1, 2);
        parts.hours = value ?? 0;
        break;
      case 'm':
        value = digits(1, 2);
        parts.minutes = value ?? 0;
        break;
      case 's':
        value = digits(1, 2);
        parts.seconds = value ?? 0;
        break;
      case 'a':
        value = name(getLocaleDayPeriods(locale, FormStyle.Format, TranslationWidth.Abbreviated));
        parts.pm = value === 1;
        break;
      default:
        // A part it can't read.
        return undefined;
    }
    if (value === undefined) {
      return null;
    }
  }

  if (rest.trim()) {
    return null;
  }
  // A format without the year, e.g. `MMM d`, writes this year's dates.
  const date = createDate(parts.year ?? new Date().getFullYear(), parts.month, parts.day);
  // Not a day that exists, e.g. 30 February.
  if (date.getMonth() !== parts.month || date.getDate() !== parts.day) {
    return new Date(NaN);
  }
  const hours = parts.pm === undefined ? parts.hours : (parts.hours % 12) + (parts.pm ? 12 : 0);
  date.setHours(hours, parts.minutes, parts.seconds);
  return date;
}
/* eslint-enable @typescript-eslint/no-deprecated */
