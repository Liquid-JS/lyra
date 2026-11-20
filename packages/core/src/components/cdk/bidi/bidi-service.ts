import { Injectable } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';

// Aliases a CDK service, so it stays on @Injectable: a @Service factory can't type the inherited CDK statics.
@Injectable({ providedIn: 'root', useExisting: Directionality })
export class NbDirectionality extends Directionality {}
