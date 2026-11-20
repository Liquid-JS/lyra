import { NgModule } from '@angular/core';
import { <%= classify(className) %>Component } from './<%= dasherize(name) %>.component';

@NgModule({
  imports: [ <%= classify(className) %>Component ],
  exports: [ <%= classify(className) %>Component ],
})
export class <%= classify(className) %>Module { }
