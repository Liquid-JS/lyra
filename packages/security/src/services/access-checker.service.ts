import { inject, Service } from '@angular/core';
import { NbRoleProvider } from './role.provider';
import { NbAclService } from './acl.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Checks what the current user may do: their roles, from the `NbRoleProvider` the app provides, against the ACL
 * (`NbAclService`).
 */
@Service({ autoProvided: false })
export class NbAccessChecker {
  protected readonly roleProvider = inject(NbRoleProvider);
  protected readonly acl = inject(NbAclService);

  /** Whether any of the user's roles has the permission on the resource, now and as the roles change. */
  isGranted(permission: string, resource: string): Observable<boolean> {
    return this.roleProvider.getRole()
      .pipe(
        map((role: string | string[]) => Array.isArray(role) ? role : [role]),
        map((roles: string[]) => {
          return roles.some((role) => this.acl.can(role, permission, resource));
        }),
      );
  }
}
