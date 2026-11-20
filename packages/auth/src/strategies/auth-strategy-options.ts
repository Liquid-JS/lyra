import { HttpHeaders } from '@angular/common/http'
import { NbAuthTokenClass } from '../services/token/token'

export interface NbStrategyToken {
    class?: NbAuthTokenClass
    [key: string]: unknown
}

export class NbAuthStrategyOptions {
    name = ''
    token?: NbStrategyToken
    headers?: HttpHeaders | { [header: string]: string | string[] }
}
