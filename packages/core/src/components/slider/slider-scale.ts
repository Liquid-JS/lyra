/** How far an open end reaches at most past the values on the track, in steps. */
const OPEN_END_STEPS = 2;
/** How close to an open end the pointer gets: the end itself is infinitely far. */
const OPEN_END_MARGIN = 1e-5;

/** The spread of the `log` transform: how much more room the low end gets. */
const LOG_SPREAD = 400;

const decimals = (value: number) => (String(value).split('.')[1] ?? '').length;

/**
 * How positions along a slider's track are drawn: `linear`, `sqrt` and `log` give the low end more room, or a
 * function that maps 0..1 to 0..1 and increases.
 */
export type NbSliderTransform = 'linear' | 'sqrt' | 'log' | ((position: number) => number);

interface NbSliderCurve {
  forward: (position: number) => number;
  inverse: (drawn: number) => number;
}

/** @internal */
export function nbSliderCurve(transform: NbSliderTransform = 'linear'): NbSliderCurve {
  if (transform === 'linear') {
    return { forward: (position) => position, inverse: (drawn) => drawn };
  }
  if (transform === 'sqrt') {
    return { forward: (position) => Math.sqrt(Math.max(0, position)), inverse: (drawn) => drawn * drawn };
  }
  if (transform === 'log') {
    const base = Math.log(LOG_SPREAD + 1);
    return {
      forward: (position) => Math.log(Math.max(0, position) * LOG_SPREAD + 1) / base,
      inverse: (drawn) => (Math.exp(drawn * base) - 1) / LOG_SPREAD,
    };
  }
  // Any increasing function, made to run from 0 to 1, and turned back by bisection.
  const start = transform(0);
  const span = transform(1) - start || 1;
  const forward = (position: number) => (transform(Math.min(1, Math.max(0, position))) - start) / span;
  return {
    forward,
    inverse: (drawn) => {
      let low = 0;
      let high = 1;
      for (let i = 0; i < 50; i++) {
        const middle = (low + high) / 2;
        if (forward(middle) < drawn) {
          low = middle;
        } else {
          high = middle;
        }
      }
      return (low + high) / 2;
    },
  };
}

/**
 * Where values sit on a slider's track, from 0 at its start to 1 at its end.
 *
 * Between a `min` and a `max` the track is linear. An end without a limit is open: the track reaches a little past
 * the values on it (the extension: at most two steps, and no further than the center is from the other limit), so
 * moving a thumb towards an open end takes the end along, and any value can be reached while small values get most
 * of the track. A transform then draws those positions closer together towards the end, e.g. `sqrt`.
 *
 * @internal
 */
export class NbSliderScale {
  /** Where the fill starts, and the value when there's none: the given center, or 0 with no limits at all. */
  readonly center?: number;
  /** How far an open end reaches past the values on the track. */
  readonly extension: number;
  protected readonly curve: NbSliderCurve;

  constructor(
    readonly min?: number,
    readonly max?: number,
    center?: number,
    readonly step?: number,
    transform?: NbSliderTransform,
  ) {
    this.curve = nbSliderCurve(transform);
    if (min !== undefined && max !== undefined && max < min) {
      this.max = min;
    }
    const start = center ?? (min === undefined && max === undefined ? 0 : undefined);
    this.center = start === undefined ? undefined : this.clamp(start);

    const reaches = new Array<number>();
    const c = this.center;
    if (c !== undefined && this.max !== undefined && this.max !== c) {
      reaches.push(this.max - c);
    }
    if (c !== undefined && this.min !== undefined && this.min !== c) {
      reaches.push(c - this.min);
    }
    if (step) {
      reaches.push(OPEN_END_STEPS * step);
    }
    this.extension = reaches.length ? Math.min(...reaches) : OPEN_END_STEPS;
  }

  get bounded() {
    return this.min !== undefined && this.max !== undefined;
  }

  clamp(value: number) {
    if (this.min !== undefined) {
      value = Math.max(this.min, value);
    }
    if (this.max !== undefined) {
      value = Math.min(this.max, value);
    }
    return value;
  }

  /**
   * The value on the step grid, which starts at `min`, then `max`, then the center, then 0, and within limits: the
   * nearest step, or with `down` the step it has reached.
   */
  snap(value: number, down = false) {
    const step = this.step;
    if (!step) {
      return this.clamp(value);
    }
    const base = this.min ?? this.max ?? this.center ?? 0;
    const steps = (value - base) / step;
    // A little leeway, so a value on a step stays there despite float noise.
    const snapped = base + (down ? Math.floor(steps + 1e-9) : Math.round(steps)) * step;
    // Without the float noise of the multiplication, e.g. 0.30000000000000004.
    return this.clamp(Number(snapped.toFixed(Math.max(decimals(step), decimals(base)))));
  }

  /** The value without one: the center, or a limit. */
  defaultValue() {
    return this.center ?? this.min ?? this.max ?? 0;
  }

  /** The values at the track's start and end, with these values on it. */
  ends(values: readonly number[]): [number, number] {
    const known = this.center === undefined ? [...values] : [...values, this.center];
    if (!known.length) {
      known.push(this.defaultValue());
    }
    const start = this.min ?? Math.min(...known) - this.extension;
    const end = this.max ?? Math.max(...known) + this.extension;
    return [start, end];
  }

  /** Where a value is drawn on the track, with these values on it. */
  toRelative(value: number, values: readonly number[]) {
    return this.curve.forward(this.linearPosition(value, values));
  }

  /** Where a value sits along the track before the transform. */
  protected linearPosition(value: number, values: readonly number[]) {
    const [start, end] = this.ends(values);
    return end === start ? 0 : (value - start) / (end - start);
  }

  /**
   * The value for the thumb at `index` that sits at `relative` on the track, while the other values stay. With an
   * open end the track depends on the value, so it's found by bisection: a value further along always sits further
   * along.
   */
  fromRelative(relative: number, values: readonly number[], index: number) {
    const min = this.min;
    const max = this.max;
    relative = this.curve.inverse(Math.min(1, Math.max(0, relative)));
    if (min !== undefined && max !== undefined) {
      return min + relative * (max - min);
    }
    const target = Math.min(
      max === undefined ? 1 - OPEN_END_MARGIN : 1,
      Math.max(min === undefined ? OPEN_END_MARGIN : 0, relative),
    );
    const at = (value: number) => {
      const next = [...values];
      next[index] = value;
      return this.linearPosition(value, next);
    };
    const current = values[index] ?? this.defaultValue();

    let low = min ?? current - this.extension;
    for (let reach = this.extension; min === undefined && at(low) > target && reach < Number.MAX_VALUE; reach *= 2) {
      low -= reach;
    }
    let high = max ?? current + this.extension;
    for (let reach = this.extension; max === undefined && at(high) < target && reach < Number.MAX_VALUE; reach *= 2) {
      high += reach;
    }
    for (let i = 0; i < 64; i++) {
      const middle = (low + high) / 2;
      if (at(middle) < target) {
        low = middle;
      } else {
        high = middle;
      }
    }
    return (low + high) / 2;
  }

  /** The values of the ticks on a track with both limits and a step, every `every` steps; none if too many. */
  ticks(every: number) {
    const { min, max, step } = this;
    if (min === undefined || max === undefined || !step || every < 1) {
      return [];
    }
    const count = Math.floor((max - min) / step / every + 1e-9) + 1;
    if (count > 200) {
      return [];
    }
    return Array.from({ length: count }, (_, index) => this.snap(min + index * every * step));
  }
}
