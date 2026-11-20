import { urlBase64Decode } from '../../helpers';

export abstract class NbAuthToken {

  protected payload?: unknown;

  abstract getValue(): string;
  abstract isValid(): boolean;
  /** The name of the strategy that got the token, which is the one that refreshes it. */
  abstract getOwnerStrategyName(): string;
  abstract getCreatedAt(): Date;
  abstract toString(): string;

  getName(): string {
    return (this.constructor as NbAuthTokenClass).NAME;
  }

  getPayload(): unknown {
    return this.payload;
  }
}

/**
 * The claims of a JWT: the registered ones (RFC 7519, 4.1) and any others the issuer adds.
 */
export interface NbAuthJWTPayload {
  /** Expiration time, in seconds since the epoch. */
  exp?: number;
  /** Issued at, in seconds since the epoch. */
  iat?: number;
  /** Not before, in seconds since the epoch. */
  nbf?: number;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  jti?: string;
  [claim: string]: unknown;
}

/**
 * An OAuth2 token response (RFC 6749, 5.1), and any other fields the server adds.
 */
export interface NbAuthOAuth2TokenData {
  access_token?: string;
  token_type?: string;
  /** The lifetime of the access token, in seconds. */
  expires_in?: number | string;
  refresh_token?: string;
  scope?: string;
  [field: string]: unknown;
}

export class NbAuthTokenNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NbAuthIllegalTokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NbAuthEmptyTokenError extends NbAuthIllegalTokenError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NbAuthIllegalJWTTokenError extends NbAuthIllegalTokenError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface NbAuthRefreshableToken {
  getRefreshToken(): string;
  setRefreshToken(refreshToken: string): void;
}

export interface NbAuthTokenClass<T = NbAuthToken> {
  NAME: string;
  new (raw: unknown, strategyName: string, expDate?: Date): T;
}

export function nbAuthCreateToken<T extends NbAuthToken>(tokenClass: NbAuthTokenClass<T>,
  token: unknown,
  ownerStrategyName: string,
  createdAt?: Date) {
  return new tokenClass(token, ownerStrategyName, createdAt);
}

export function decodeJwtPayload(payload: string): NbAuthJWTPayload {

  if (payload.length === 0) {
    throw new NbAuthEmptyTokenError('Cannot extract from an empty payload.');
  }

  const parts = payload.split('.');

  if (parts.length !== 3) {
    throw new NbAuthIllegalJWTTokenError(
      `The payload ${payload} is not valid JWT payload and must consist of three parts.`);
  }

  let decoded;
  try {
    decoded = urlBase64Decode(parts[1]);
  } catch {
    throw new NbAuthIllegalJWTTokenError(
      `The payload ${payload} is not valid JWT payload and cannot be parsed.`);
  }

  if (!decoded) {
    throw new NbAuthIllegalJWTTokenError(
      `The payload ${payload} is not valid JWT payload and cannot be decoded.`);
  }
  return JSON.parse(decoded) as NbAuthJWTPayload;
}

/** A token that is a plain string; valid while it isn't empty. */
export class NbAuthSimpleToken extends NbAuthToken {

  static NAME = 'nb:auth:simple:token';

  protected createdAt: Date;

  constructor(protected readonly token: unknown,
    protected readonly ownerStrategyName: string,
    createdAt?: Date) {
    super();
    // Set before parsing, as the constructor parameter property did, so subclasses can read it in parsePayload().
    if (createdAt) {
      this.createdAt = createdAt;
    }
    try {
      this.parsePayload();
    } catch (err) {
      if (!(err instanceof NbAuthTokenNotFoundError)) {
        // token is present but has got a problem, including illegal
        throw err;
      }
    }
    this.createdAt = this.prepareCreatedAt(createdAt);
  }

  protected parsePayload(): void {
    this.payload = undefined;
  }

  protected prepareCreatedAt(date?: Date): Date {
    return date ? date : new Date();
  }

  /** When the token was made, or when the storage says it was. */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /** The token's text; empty when it isn't a string. */
  getValue(): string {
    return typeof this.token === 'string' ? this.token : '';
  }

  getOwnerStrategyName(): string {
    return this.ownerStrategyName;
  }

  /** Whether the token isn't empty. */
  isValid(): boolean {
    return !!this.getValue();
  }

  /** The token as text, for the storage; empty without one. */
  toString(): string {
    return this.token ? String(this.token) : '';
  }
}

/** A JWT: its payload is decoded, it's created at its `iat` claim, and it's valid until its `exp` claim. */
export class NbAuthJWTToken extends NbAuthSimpleToken {

  static override NAME = 'nb:auth:jwt:token';

  protected declare payload?: NbAuthJWTPayload;

  /** The `iat` claim, when there is one. */
  protected override prepareCreatedAt(date?: Date): Date {
    const decoded = this.getPayload();
    return decoded && decoded.iat ? new Date(Number(decoded.iat) * 1000) : super.prepareCreatedAt(date);
  }

  /**
   * Decodes the payload; throws `NbAuthTokenNotFoundError` without a token, and `NbAuthIllegalJWTTokenError` for one
   * that isn't a JWT.
   */
  protected override parsePayload() {
    if (!this.token) {
      throw new NbAuthTokenNotFoundError('Token not found. ');
    }
    if (typeof this.token !== 'string') {
      throw new NbAuthIllegalJWTTokenError('The JWT token is not a string.');
    }
    this.payload = decodeJwtPayload(this.token);
  }

  /** The token's claims, or `undefined` without a token. */
  override getPayload(): NbAuthJWTPayload | undefined {
    return this.payload;
  }

  /** The `exp` claim as a date, or `undefined` without one. */
  getTokenExpDate(): Date | undefined {
    const decoded = this.getPayload();
    if (decoded && !decoded.hasOwnProperty('exp')) {
      return undefined;
    }
    const date = new Date(0);
    date.setUTCSeconds(Number(decoded?.exp)); // JWT times are in seconds
    return date;
  }

  /** Whether the token isn't empty and hasn't expired. */
  override isValid(): boolean {
    if (!super.isValid()) {
      return false;
    }
    const expDate = this.getTokenExpDate();
    return !expDate || new Date() < expDate;
  }
}

const prepareOAuth2Token = (data: unknown): unknown => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {}
  }
  return data;
};

/** Whether the raw token is an object, which an OAuth2 token reads as a token response. */
function isOAuth2TokenData(token: unknown): token is NbAuthOAuth2TokenData {
  return typeof token === 'object' && token !== null;
}

/**
 * An OAuth2 token response: its `access_token` is the value, and it expires `expires_in` seconds after it was created.
 */
export class NbAuthOAuth2Token extends NbAuthSimpleToken {

  static override NAME = 'nb:auth:oauth2:token';

  /**
   * @param data the token response, or its JSON (as the storage gives it)
   */
  constructor(data: unknown = {},
    ownerStrategyName: string,
    createdAt?: Date) {

    // we may get it as string when retrieving from a storage
    super(prepareOAuth2Token(data), ownerStrategyName, createdAt);
  }

  /** The token response; empty when the raw token isn't one. */
  protected get data(): NbAuthOAuth2TokenData {
    return isOAuth2TokenData(this.token) ? this.token : {};
  }

  /** The `access_token`; empty without one. */
  override getValue(): string {
    return this.data.access_token ?? '';
  }

  /** The `refresh_token`; empty without one. */
  getRefreshToken(): string {
    return this.data.refresh_token ?? '';
  }

  /** Sets the `refresh_token`, e.g. the previous token's after a refresh whose response has none. */
  setRefreshToken(refreshToken: string) {
    this.data.refresh_token = refreshToken;
  }

  /** The payload is the response itself; throws without a token, or with an empty one. */
  protected override parsePayload() {
    if (!this.token) {
      throw new NbAuthTokenNotFoundError('Token not found.');
    } else {
      if (!Object.keys(this.token).length) {
        throw new NbAuthEmptyTokenError('Cannot extract payload from an empty token.');
      }
    }
    this.payload = this.token;
  }

  /** The `token_type`, e.g. `Bearer`; empty without one. */
  getType(): string {
    return this.data.token_type ?? '';
  }

  /** Whether the token has an `access_token` and hasn't expired. */
  override isValid(): boolean {
    if (!super.isValid()) {
      return false;
    }
    const expDate = this.getTokenExpDate();
    return !expDate || new Date() < expDate;
  }

  /** When the token expires, `expires_in` seconds after it was created; `undefined` without `expires_in`. */
  getTokenExpDate(): Date | undefined {
    const data = this.data;
    if (!data.hasOwnProperty('expires_in')) {
      return undefined;
    }
    return new Date(this.createdAt.getTime() + Number(data.expires_in) * 1000);
  }

  /** The response as JSON, for the storage. */
  override toString(): string {
    return JSON.stringify(this.token);
  }
}

/**
 * An OAuth2 token whose `access_token` is a JWT: its claims say when the token was created and expires, over the
 * response's `expires_in`.
 */
export class NbAuthOAuth2JWTToken extends NbAuthOAuth2Token {

  static override NAME = 'nb:auth:oauth2:jwt:token';

  protected accessTokenPayload?: NbAuthJWTPayload;

  protected override parsePayload() {
    super.parsePayload();
    this.parseAccessTokenPayload();
  }

  protected parseAccessTokenPayload(): void {
    const accessToken = this.getValue();
    if (!accessToken) {
      throw new NbAuthTokenNotFoundError('access_token key not found.');
    }
    this.accessTokenPayload = decodeJwtPayload(accessToken);
  }

  /** The access token's claims; `undefined` when it has none. */
  getAccessTokenPayload(): NbAuthJWTPayload | undefined {
    return this.accessTokenPayload;
  }

  /** The access token's `iat` claim, when there is one. */
  protected override prepareCreatedAt(date?: Date): Date {
    const payload = this.accessTokenPayload;
    return payload && payload.iat ? new Date(Number(payload.iat) * 1000) : super.prepareCreatedAt(date);
  }

  /** Whether the access token has claims, and the token is valid. */
  override isValid(): boolean {
    return !!this.accessTokenPayload && super.isValid();
  }

  /** The access token's `exp` claim as a date, or the response's `expires_in` without one. */
  override getTokenExpDate(): Date | undefined {
    if (this.accessTokenPayload && this.accessTokenPayload.hasOwnProperty('exp')) {
      const date = new Date(0);
      date.setUTCSeconds(Number(this.accessTokenPayload.exp));
      return date;
    } else {
      return super.getTokenExpDate();
    }
  }
}
