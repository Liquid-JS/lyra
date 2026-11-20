import { NbSliderScale } from './slider-scale';

describe('NbSliderScale', () => {
  it('should be linear between two limits, and find a value back from its position', () => {
    const scale = new NbSliderScale(0, 200, undefined, undefined);
    expect(scale.toRelative(50, [50])).toBe(0.25);
    expect(scale.fromRelative(0.25, [0], 0)).toBe(50);
    expect(scale.fromRelative(1.5, [0], 0)).toBe(200);
  });

  it('should snap to steps from min, without float noise, within the limits', () => {
    const scale = new NbSliderScale(0.1, 1, undefined, 0.1);
    expect(scale.snap(0.34)).toBe(0.3);
    expect(scale.snap(0.36)).toBe(0.4);
    expect(scale.snap(5)).toBe(1);
    expect(new NbSliderScale(1, 10, undefined, 3).snap(5.4)).toBe(4);
  });

  it('should stretch an open end past the value, so small values get most of the track', () => {
    // From 1 seat, with steps of 1: the end reaches two steps past the value.
    const scale = new NbSliderScale(1, undefined, undefined, 1);
    expect(scale.extension).toBe(2);
    expect(scale.toRelative(5, [5])).toBeCloseTo(4 / 6);
    expect(scale.toRelative(3, [3])).toBeCloseTo(0.5);

    // The position finds the value back, and further along is always more.
    expect(scale.fromRelative(4 / 6, [1], 0)).toBeCloseTo(5);
    const along = [0.1, 0.5, 0.9, 0.99, 0.999].map((position) => scale.fromRelative(position, [1], 0));
    along.reduce((previous, value) => {
      expect(value).toBeGreaterThan(previous);
      return value;
    });
    // The very end reaches far: any value can be picked.
    expect(scale.fromRelative(1, [1], 0)).toBeGreaterThan(100000);
  });

  it('should keep a center in the middle with no limits, and stretch both ways', () => {
    const scale = new NbSliderScale(undefined, undefined, undefined, 1);
    expect(scale.center).toBe(0);
    expect(scale.defaultValue()).toBe(0);
    expect(scale.toRelative(0, [0])).toBe(0.5);
    expect(scale.fromRelative(0.75, [0], 0)).toBeCloseTo(4);
    expect(scale.fromRelative(0.25, [0], 0)).toBeCloseTo(-4);
  });

  it('should reach no further past a center than the center is from the other limit', () => {
    const scale = new NbSliderScale(0, undefined, 1, 5);
    expect(scale.extension).toBe(1);
    // Up to the center the track is linear, as it ends past the center.
    expect(scale.toRelative(0.5, [0.5])).toBeCloseTo(0.25);
  });

  it('should let a range\'s thumbs share the track', () => {
    const scale = new NbSliderScale(1, undefined, undefined, 1);
    const values = [3, 12];
    expect(scale.ends(values)).toEqual([1, 14]);
    expect(scale.fromRelative(scale.toRelative(3, values), values, 0)).toBeCloseTo(3);
    expect(scale.fromRelative(scale.toRelative(12, values), values, 1)).toBeCloseTo(12);
  });

  it('should snap down to the step reached, despite float noise', () => {
    const scale = new NbSliderScale(0, 100, undefined, 10);
    expect(scale.snap(79, true)).toBe(70);
    expect(scale.snap(79.99999999999, true)).toBe(80);
    expect(scale.snap(-5, true)).toBe(0);
  });

  it('should draw positions through a transform and turn them back', () => {
    const sqrt = new NbSliderScale(0, 100, undefined, undefined, 'sqrt');
    expect(sqrt.toRelative(25, [25])).toBeCloseTo(0.5);
    expect(sqrt.fromRelative(0.5, [25], 0)).toBeCloseTo(25);

    // As in log(x * 400 + 1) / log(401).
    const log = new NbSliderScale(0, 100, undefined, undefined, 'log');
    expect(log.toRelative(1, [1])).toBeCloseTo(Math.log(5) / Math.log(401));
    expect(log.fromRelative(log.toRelative(1, [1]), [1], 0)).toBeCloseTo(1);

    // Any increasing function, even one that doesn't run from 0 to 1.
    const custom = new NbSliderScale(0, 100, undefined, undefined, (position) => 2 + position ** 3);
    expect(custom.toRelative(50, [50])).toBeCloseTo(0.125);
    expect(custom.fromRelative(0.125, [50], 0)).toBeCloseTo(50);

    // With an open end, too.
    const open = new NbSliderScale(1, undefined, undefined, 1, 'sqrt');
    expect(open.toRelative(5, [5])).toBeCloseTo(Math.sqrt(4 / 6));
    expect(open.fromRelative(Math.sqrt(4 / 6), [1], 0)).toBeCloseTo(5);
  });

  it('should have ticks on a bounded track with a step, every n-th, but not too many', () => {
    expect(new NbSliderScale(0, 10, undefined, 2).ticks(1)).toEqual([0, 2, 4, 6, 8, 10]);
    expect(new NbSliderScale(0, 10, undefined, 1).ticks(5)).toEqual([0, 5, 10]);
    expect(new NbSliderScale(0, 10, undefined, 1).ticks(0)).toEqual([]);
    expect(new NbSliderScale(0, undefined, undefined, 1).ticks(1)).toEqual([]);
    expect(new NbSliderScale(0, 10000, undefined, 1).ticks(1)).toEqual([]);
  });
});
