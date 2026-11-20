import { injectNbTexts, NbLocalize } from '@liquid-js/lyr-core'

/** @internal */
declare const $localize: NbLocalize

/**
 * The texts of the authentication pages. `provideNbTexts({ auth: { ... } })` changes them, and they're translated
 * with Angular's i18n, as `$localize` messages with ids like `@@nb.auth.loginTitle`.
 */
export interface NbAuthTexts {
    /** Label of the link back from the authentication pages. */
    back: string
    /** Shown while logging out. */
    loggingOut: string
    /** Heads the errors of a request. */
    errorTitle: string
    /** Heads the messages of a successful request. */
    successTitle: string
    /** Names the links to sign in with other services. */
    socialLabel: string
    /** Before the links to sign in with other services. */
    socialPrompt: string

    emailLabel: string
    emailPlaceholder: string
    emailRequired: string
    emailInvalid: string
    passwordLabel: string
    passwordPlaceholder: string
    passwordRequired: string
    /** Given the shortest and the longest password. */
    passwordLength: (min: number, max: number) => string
    fullNameLabel: string
    fullNamePlaceholder: string
    fullNameRequired: string
    /** Given the shortest and the longest name. */
    fullNameLength: (min: number, max: number) => string
    confirmPasswordPlaceholder: string
    confirmPasswordRequired: string
    passwordMismatch: string

    loginTitle: string
    loginSubtitle: string
    forgotPassword: string
    rememberMe: string
    loginSubmit: string
    /** Before the link to the registration page. */
    noAccount: string
    /** The link to the registration page. */
    registerLink: string

    registerTitle: string
    /** Label of the password confirmation on the registration page. */
    repeatPasswordLabel: string
    /** Before the link to the terms. */
    agreeTo: string
    terms: string
    registerSubmit: string
    /** Before the link to the login page. */
    haveAccount: string
    /** The link to the login page. */
    loginLink: string
    /** Names the links to the login page. */
    signInLabel: string

    requestPasswordTitle: string
    requestPasswordSubtitle: string
    requestPasswordEmailLabel: string
    requestPasswordSubmit: string
    /** The link back to the login page. */
    backToLogin: string
    /** Names the links to the login and registration pages. */
    signInOrUpLabel: string

    resetPasswordTitle: string
    resetPasswordSubtitle: string
    newPasswordLabel: string
    newPasswordPlaceholder: string
    /** Label of the password confirmation when the password is changed. */
    confirmPasswordLabel: string
    resetPasswordSubmit: string
}

/**
 * The messages of authentication strategies, shown on the authentication pages. Options given to a strategy's
 * `setup`, e.g. `login.defaultErrors`, are used over them.
 */
export interface NbAuthStrategyTexts {
    /** When logging in fails. */
    loginError: string
    /** When a request fails. */
    error: string
    /** When a request fails and there's nothing more to tell. */
    unknownError: string
    /** When a token from the backend isn't valid. */
    invalidToken: string
    /** When a sign-in redirect comes back without the state this browser sent, e.g. one it didn't start. */
    invalidState: string
    loginSuccess: string
    registerSuccess: string
    requestPasswordSuccess: string
    resetPasswordSuccess: string
    logoutSuccess: string
    refreshTokenSuccess: string
    authenticateSuccess: string
}

declare module '@liquid-js/lyr-core' {
    interface NbTexts {
        auth: NbAuthTexts
        authStrategy: NbAuthStrategyTexts
    }
}

/** The texts of the authentication pages. @internal */
export function injectNbAuthTexts() {
    return injectNbTexts('auth', () => ({
        back: $localize`:@@nb.auth.back:Back`,
        loggingOut: $localize`:@@nb.auth.loggingOut:Logging out, please wait...`,
        errorTitle: $localize`:@@nb.auth.errorTitle:Oh snap!`,
        successTitle: $localize`:@@nb.auth.successTitle:Hooray!`,
        socialLabel: $localize`:@@nb.auth.socialLabel:Social sign in`,
        socialPrompt: $localize`:@@nb.auth.socialPrompt:or enter with:`,

        emailLabel: $localize`:@@nb.auth.emailLabel:Email address:`,
        emailPlaceholder: $localize`:@@nb.auth.emailPlaceholder:Email address`,
        emailRequired: $localize`:@@nb.auth.emailRequired:Email is required!`,
        emailInvalid: $localize`:@@nb.auth.emailInvalid:Email should be the real one!`,
        passwordLabel: $localize`:@@nb.auth.passwordLabel:Password:`,
        passwordPlaceholder: $localize`:@@nb.auth.passwordPlaceholder:Password`,
        passwordRequired: $localize`:@@nb.auth.passwordRequired:Password is required!`,
        passwordLength: (min, max) =>
            $localize`:@@nb.auth.passwordLength:Password should contain from ${min}:min: to ${max}:max: characters`,
        fullNameLabel: $localize`:@@nb.auth.fullNameLabel:Full name:`,
        fullNamePlaceholder: $localize`:@@nb.auth.fullNamePlaceholder:Full name`,
        fullNameRequired: $localize`:@@nb.auth.fullNameRequired:Full name is required!`,
        fullNameLength: (min, max) =>
            $localize`:@@nb.auth.fullNameLength:Full name should contain from ${min}:min: to ${max}:max: characters`,
        confirmPasswordPlaceholder: $localize`:@@nb.auth.confirmPasswordPlaceholder:Confirm Password`,
        confirmPasswordRequired: $localize`:@@nb.auth.confirmPasswordRequired:Password confirmation is required!`,
        passwordMismatch: $localize`:@@nb.auth.passwordMismatch:Password does not match the confirm password.`,

        loginTitle: $localize`:@@nb.auth.loginTitle:Login`,
        loginSubtitle: $localize`:@@nb.auth.loginSubtitle:Hello! Log in with your email.`,
        forgotPassword: $localize`:@@nb.auth.forgotPassword:Forgot Password?`,
        rememberMe: $localize`:@@nb.auth.rememberMe:Remember me`,
        loginSubmit: $localize`:@@nb.auth.loginSubmit:Log In`,
        noAccount: $localize`:@@nb.auth.noAccount:Don't have an account?`,
        registerLink: $localize`:@@nb.auth.registerLink:Register`,

        registerTitle: $localize`:@@nb.auth.registerTitle:Register`,
        repeatPasswordLabel: $localize`:@@nb.auth.repeatPasswordLabel:Repeat password:`,
        agreeTo: $localize`:@@nb.auth.agreeTo:Agree to`,
        terms: $localize`:@@nb.auth.terms:Terms & Conditions`,
        registerSubmit: $localize`:@@nb.auth.registerSubmit:Register`,
        haveAccount: $localize`:@@nb.auth.haveAccount:Already have an account?`,
        loginLink: $localize`:@@nb.auth.loginLink:Log in`,
        signInLabel: $localize`:@@nb.auth.signInLabel:Sign in`,

        requestPasswordTitle: $localize`:@@nb.auth.requestPasswordTitle:Forgot Password`,
        requestPasswordSubtitle: $localize`:@@nb.auth.requestPasswordSubtitle:Enter your email address and we’ll send a link to reset your password`,
        requestPasswordEmailLabel: $localize`:@@nb.auth.requestPasswordEmailLabel:Enter your email address:`,
        requestPasswordSubmit: $localize`:@@nb.auth.requestPasswordSubmit:Request password`,
        backToLogin: $localize`:@@nb.auth.backToLogin:Back to Log In`,
        signInOrUpLabel: $localize`:@@nb.auth.signInOrUpLabel:Sign in or sign up`,

        resetPasswordTitle: $localize`:@@nb.auth.resetPasswordTitle:Change password`,
        resetPasswordSubtitle: $localize`:@@nb.auth.resetPasswordSubtitle:Please set a new password`,
        newPasswordLabel: $localize`:@@nb.auth.newPasswordLabel:New Password:`,
        newPasswordPlaceholder: $localize`:@@nb.auth.newPasswordPlaceholder:New Password`,
        confirmPasswordLabel: $localize`:@@nb.auth.confirmPasswordLabel:Confirm Password:`,
        resetPasswordSubmit: $localize`:@@nb.auth.resetPasswordSubmit:Change password`
    }))
}

/** The messages of authentication strategies. @internal */
export function injectNbAuthStrategyTexts() {
    return injectNbTexts('authStrategy', () => ({
        loginError: $localize`:@@nb.authStrategy.loginError:Login/Email combination is not correct, please try again.`,
        error: $localize`:@@nb.authStrategy.error:Something went wrong, please try again.`,
        unknownError: $localize`:@@nb.authStrategy.unknownError:Something went wrong.`,
        invalidToken: $localize`:@@nb.authStrategy.invalidToken:Token is empty or invalid.`,
        invalidState: $localize`:@@nb.authStrategy.invalidState:This sign-in couldn't be verified, please try again.`,
        loginSuccess: $localize`:@@nb.authStrategy.loginSuccess:You have been successfully logged in.`,
        registerSuccess: $localize`:@@nb.authStrategy.registerSuccess:You have been successfully registered.`,
        requestPasswordSuccess: $localize`:@@nb.authStrategy.requestPasswordSuccess:Reset password instructions have been sent to your email.`,
        resetPasswordSuccess: $localize`:@@nb.authStrategy.resetPasswordSuccess:Your password has been successfully changed.`,
        logoutSuccess: $localize`:@@nb.authStrategy.logoutSuccess:You have been successfully logged out.`,
        refreshTokenSuccess: $localize`:@@nb.authStrategy.refreshTokenSuccess:Your token has been successfully refreshed.`,
        authenticateSuccess: $localize`:@@nb.authStrategy.authenticateSuccess:You have been successfully authenticated.`
    }))
}
