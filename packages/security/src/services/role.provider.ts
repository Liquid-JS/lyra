import { Observable } from 'rxjs';

/** Tells the access checker the current user's roles; the app provides it, e.g. reading them from the auth token. */
export abstract class NbRoleProvider {

  /** The current user's role, or roles, now and as they change. */
  abstract getRole(): Observable<string | string[]>;
}
