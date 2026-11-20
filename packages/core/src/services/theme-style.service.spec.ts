import { TestBed } from '@angular/core/testing';

import { NbThemeStyleChanges } from '@liquid-js/lyr-core';

describe('NbThemeStyleChanges', () => {
  afterEach(() => document.body.style.removeProperty('--test-color'));

  it('should count changes to the page\'s variables and classes, once a frame', async () => {
    const changes = TestBed.inject(NbThemeStyleChanges).changes;
    const before = changes();

    document.body.style.setProperty('--test-color', 'red');
    document.body.style.setProperty('--test-color', 'blue');
    await expect.poll(changes).toBe(before + 1);

    document.documentElement.classList.add('test-theme');
    document.documentElement.classList.remove('test-theme');
    await expect.poll(changes).toBe(before + 2);
  });
});
