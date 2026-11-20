import { animateExpand, expandDuration } from './expand-animation';

describe('expandDuration', () => {
  it('should take longer for taller content, but less than in proportion', () => {
    const [short, medium, tall] = [50, 200, 600].map(expandDuration);
    expect(short).toBeGreaterThan(150);
    expect(medium).toBeGreaterThan(short);
    expect(tall).toBeGreaterThan(medium);
    // Twelve times the height, not twelve times the time.
    expect(tall / short).toBeLessThan(2.5);
    expect(expandDuration(5000)).toBe(600);
    expect(expandDuration(0)).toBe(0);
  });
});

describe('animateExpand', () => {
  const element = (height: number) => {
    const container = document.createElement('div');
    container.style.overflow = 'hidden';
    container.innerHTML = `<div style="height: ${height}px"></div>`;
    document.body.appendChild(container);
    return container;
  };

  afterEach(() => document.body.replaceChildren());

  it('should time an expansion by the height it covers', () => {
    const short = element(40);
    const tall = element(800);
    animateExpand(short, true);
    animateExpand(tall, true);

    const duration = (target: HTMLElement) => Number(target.getAnimations()[0].effect?.getTiming().duration);
    expect(duration(short)).toBe(expandDuration(40));
    expect(duration(tall)).toBe(expandDuration(800));
  });

  it('should keep a duration it is given', () => {
    const target = element(800);
    animateExpand(target, true, { duration: 120 });
    expect(target.getAnimations()[0].effect?.getTiming().duration).toBe(120);
  });
});
