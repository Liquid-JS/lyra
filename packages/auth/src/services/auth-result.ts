import { NbAuthToken } from './token/token';

/** What an `NbAuthResult` holds, for `NbAuthResult.from`. */
export interface NbAuthResultOptions<R = unknown> {
  success: boolean;
  /** What the backend answered, or the error the action failed with. */
  response?: R;
  /** Where to go next; `null`, as the strategies' options use for a redirect they don't want, is none. */
  redirect?: string | null;
  errors?: string[];
  messages?: string[];
  token?: NbAuthToken;
}

/**
 * The outcome of a strategy's action. `R` is the strategy's response: what its backend answered, or the error it failed
 * with.
 */
export class NbAuthResult<R = unknown> {

  protected token?: NbAuthToken;
  protected redirect?: string;
  protected errors = new Array<string>();
  protected messages = new Array<string>();

  /**
   * A result from named options, which reads better than the constructor's positional ones:
   *
   * ```ts
   * NbAuthResult.from({ success: true, response, redirect: '/dashboard', messages: ['Signed in.'], token });
   * ```
   */
  static from<R>(options: NbAuthResultOptions<R>): NbAuthResult<R> {
    const { success, response, redirect, errors, messages, token } = options;
    return new NbAuthResult(success, response, redirect, errors, messages, token);
  }

  /**
   * @param redirect where to go next; `null`, as the strategies' options use for a redirect they don't want, is none
   */
  constructor(protected success: boolean,
    protected response?: R,
    redirect?: string | null,
    errors?: string[],
    messages?: string[],
    token?: NbAuthToken) {

    this.redirect = redirect ?? undefined;
    this.errors = errors ?? [];
    this.messages = messages ?? [];
    this.token = token;
  }

  getResponse(): R | undefined {
    return this.response;
  }

  getToken(): NbAuthToken | undefined {
    return this.token;
  }

  getRedirect(): string | undefined {
    return this.redirect;
  }

  getErrors(): string[] {
    return this.errors.filter((val) => !!val);
  }

  getMessages(): string[] {
    return this.messages.filter((val) => !!val);
  }

  isSuccess(): boolean {
    return this.success;
  }

  isFailure(): boolean {
    return !this.success;
  }
}
