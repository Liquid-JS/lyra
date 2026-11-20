export class NbUser {

  constructor(public id?: number,
    public email?: string,
    public password?: string,
    public rememberMe?: boolean,
    public terms?: boolean,
    public confirmPassword?: string,
    public fullName?: string) {
  }
}

/**
 * What the auth forms send to their strategy, each form its own fields: the login form the email, password and
 * "remember me", the register form all but "remember me", the request password form the email, and the reset password
 * form the password and its confirmation.
 */
export interface NbAuthCredentials {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  rememberMe?: boolean;
  terms?: boolean;
}
