import { ModuleWithProviders, NgModule, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NB_SECURITY_OPTIONS_TOKEN, NbAclOptions } from './security.options';
import { NbAclService } from './services/acl.service';
import { NbAccessChecker } from './services/access-checker.service';
import { NbIsGrantedDirective } from './directives/is-granted.directive';

/**
 * Provides the ACL and the access checker, in place of `NbSecurityModule.forRoot()`.
 */
export function provideNbSecurity(nbSecurityOptions?: NbAclOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NB_SECURITY_OPTIONS_TOKEN, useValue: nbSecurityOptions },
    NbAclService,
    NbAccessChecker,
  ]);
}

@NgModule({
  imports: [NbIsGrantedDirective],
  exports: [NbIsGrantedDirective],
})
export class NbSecurityModule {
  static forRoot(nbSecurityOptions?: NbAclOptions): ModuleWithProviders<NbSecurityModule> {
    return { ngModule: NbSecurityModule, providers: [provideNbSecurity(nbSecurityOptions)] };
  }
}
