import { Platform } from '@angular/cdk/platform'
import { Injectable } from '@angular/core'

// Aliases a CDK service, so it stays on @Injectable: a @Service factory can't type the inherited CDK statics.
@Injectable({
    providedIn: 'root',
    useClass: Platform
})
export class NbPlatform extends Platform {}
