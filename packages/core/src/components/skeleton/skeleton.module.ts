import { NgModule } from '@angular/core'
import { NbSkeletonDirective } from './skeleton.directive'

@NgModule({
    imports: [NbSkeletonDirective],
    exports: [NbSkeletonDirective]
})
export class NbSkeletonModule {}
