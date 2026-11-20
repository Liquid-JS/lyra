import {
    getDeepFromObject,
    nbAuthMessages,
    NbPasswordStrategyMessage,
    NbPasswordStrategyModule,
    NbAuthJWTToken,
    NbAuthStrategyOptions,
    NbStrategyToken
} from '@liquid-js/lyr-auth'

export class NbFirebaseIdentityProviderStrategyOptions extends NbAuthStrategyOptions {
    override token?: NbStrategyToken = {
        class: NbAuthJWTToken
    }
    logout?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: '/',
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['You have been successfully logged out.']
    }
    authenticate?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: '/',
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['You have been successfully authenticated.']
    }
    refreshToken?: boolean | NbPasswordStrategyModule = {
        redirect: {
            success: null,
            failure: null
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['Your token has been successfully refreshed.']
    }
    errors?: NbPasswordStrategyMessage = {
        key: 'message',
        getter: (module: string, _res: unknown, options: NbFirebaseIdentityProviderStrategyOptions) =>
            nbAuthMessages(getDeepFromObject(options, `${module}.defaultErrors`))
    }
    messages?: NbPasswordStrategyMessage = {
        key: 'message',
        getter: (module: string, _res: unknown, options: NbFirebaseIdentityProviderStrategyOptions) =>
            nbAuthMessages(getDeepFromObject(options, `${module}.defaultMessages`))
    }
    scopes?: string[] = []
    customParameters?: { [key: string]: string } = {}
};
