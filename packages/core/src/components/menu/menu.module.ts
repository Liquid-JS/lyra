import { NgModule, ModuleWithProviders, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NbMenuComponent, NbMenuItemComponent } from './menu.component';
import { NbMenuService, NbMenuInternalService } from './menu.service';
import { NbIconModule } from '@liquid-js/lyr-core/icon';
import { NbBadgeModule } from '@liquid-js/lyr-core/badge';

const nbMenuComponents = [NbMenuComponent, NbMenuItemComponent];

/**
 * Provides the menu services, in place of `NbMenuModule.forRoot()`.
 */
export function provideNbMenu(): EnvironmentProviders {
  return makeEnvironmentProviders([NbMenuService, NbMenuInternalService]);
}

@NgModule({
  imports: [NbIconModule, NbBadgeModule, ...nbMenuComponents],
  exports: [...nbMenuComponents],
})
export class NbMenuModule {
  static forRoot(): ModuleWithProviders<NbMenuModule> {
    return { ngModule: NbMenuModule, providers: [provideNbMenu()] };
  }
}
