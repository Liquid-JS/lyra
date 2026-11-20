import {
    getDeepFromObject,
    nbAuthMessages,
    NbAuthJWTToken,
    NbAuthStrategyOptions,
    NbPasswordStrategyMessage,
    NbPasswordStrategyModule,
    NbPasswordStrategyReset,
    NbStrategyToken
} from '@liquid-js/lyr-auth'

/**
 * The options a getter is called with: the defaults merged with the configured ones, so the getter's key is set.
 */
type NbFirebasePasswordStrategyOptionsWithKey<K extends 'errors' | 'messages'> = NbFirebasePasswordStrategyOptions
    & Record<K, { key: string }>

export class NbFirebasePasswordStrategyOptions extends NbAuthStrategyOptions {
    override token?: NbStrategyToken = {
        class: NbAuthJWTToken
    }
    register?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: '/',
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['You have been successfully registered.']
    }
    login?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: '/',
            failure: null
        },
        defaultErrors: ['Login/Email combination is not correct, please try again.'],
        defaultMessages: ['You have been successfully logged in.']
    }
    logout?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: '/',
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['You have been successfully logged out.']
    }
    refreshToken?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: null,
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['Your token has been successfully refreshed.']
    }
    requestPassword?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: '/',
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['Reset password instructions have been sent to your email.']
    }
    resetPassword?: boolean | NbPasswordStrategyReset = {
        redirect: {
            success: '/',
            failure: null
        },
        // The query parameter of the reset link that holds Firebase's code.
        resetPasswordTokenKey: 'oobCode',
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['Your password has been successfully changed.']
    }
    errors?: NbPasswordStrategyMessage = {
        key: 'message',
        getter: (module: string, res: unknown, options: NbFirebasePasswordStrategyOptionsWithKey<'errors'>) =>
            nbAuthMessages(getDeepFromObject(res, options.errors.key, getDeepFromObject(options, `${module}.defaultErrors`)))
    }
    messages?: NbPasswordStrategyMessage = {
        key: 'messages',
        // Firebase's sign-in calls answer with a `UserCredential`, which holds no messages: these are the module's
        // defaults.
        getter: (module: string, _res: unknown, options: NbFirebasePasswordStrategyOptionsWithKey<'messages'>) =>
            nbAuthMessages(getDeepFromObject(options, `${module}.defaultMessages`))
    }
}

export const firebasePasswordStrategyOptions: NbFirebasePasswordStrategyOptions =
    new NbFirebasePasswordStrategyOptions()
