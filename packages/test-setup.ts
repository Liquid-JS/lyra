import { NgModule, provideCheckNoChangesConfig, provideZonelessChangeDetection } from '@angular/core'
import { ComponentFixture, getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

/**
 * Specs run with zoneless change detection, so they only pass when components update without zone.js, and the
 * no-changes check covers every view, so a view that changed without being marked dirty fails the spec.
 * zone.js isn't loaded at all; specs that control time use Vitest fake timers instead of `fakeAsync`.
 */
@NgModule({ providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })] })
class NbZonelessTestingModule {}

// With zone.js, fixture.detectChanges() refreshed the fixture's root view, and specs assign the root component's
// fields relying on that. Zoneless ticks only refresh views marked dirty, so mark the root view first; every view
// below it still has to be marked by the components themselves.
const detectChanges = ComponentFixture.prototype.detectChanges
ComponentFixture.prototype.detectChanges = function (this: ComponentFixture<unknown>, checkNoChanges?: boolean) {
    this.changeDetectorRef.markForCheck()
    detectChanges.call(this, checkNoChanges)
}

// The test builder initializes TestBed with its defaults; the specs also fail on unknown elements and properties.
getTestBed().resetTestEnvironment()
getTestBed().initTestEnvironment([BrowserTestingModule, NbZonelessTestingModule], platformBrowserTesting(), {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true
})

// Specs fake timers with vi.useFakeTimers(); restoreMocks doesn't cover timers, so restore them after every test.
afterEach(() => {
    vi.useRealTimers()
})
