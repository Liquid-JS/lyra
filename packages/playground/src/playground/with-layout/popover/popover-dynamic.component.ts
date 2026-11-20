import { AfterViewInit, Component, OnDestroy, TemplateRef, signal, viewChild } from '@angular/core';
import {
  NbPopoverDirective,
  NbPosition,
  NbTrigger,
  NbOverlayContent,
  NbButtonComponent,
  NbPopoverDirective as NbPopoverDirective_1,
  NbCardComponent,
  NbCardHeaderComponent,
  NbCardBodyComponent,
  NbTabsetComponent,
  NbTabComponent,
  NbListComponent,
  NbListItemComponent,
} from '@liquid-js/lyr-core';

import { PopoverListComponent, PopoverTabsComponent } from './components/dynamic.components';

@Component({
  selector: 'nb-popover-dynamic',
  templateUrl: './popover-dynamic.component.html',
  styleUrls: ['./popover-dynamic.scss'],
  imports: [
    NbButtonComponent,
    NbPopoverDirective_1,
    NbCardComponent,
    NbCardHeaderComponent,
    NbTabsetComponent,
    NbTabComponent,
    NbCardBodyComponent,
    NbListComponent,
    NbListItemComponent,
  ],
})
export class PopoverDynamicComponent implements OnDestroy, AfterViewInit {
  readonly popover = viewChild.required(NbPopoverDirective);
  readonly templateTabs = viewChild.required('tabs', { read: TemplateRef });
  readonly templateList = viewChild.required('list', { read: TemplateRef });

  componentList = PopoverListComponent;
  componentTabs = PopoverTabsComponent;
  textContent = 'Hello World';
  readonly component = signal<NbOverlayContent>(this.componentList);
  readonly trigger = signal<NbTrigger | `${NbTrigger}`>(NbTrigger.CLICK);
  readonly position = signal<NbPosition | `${NbPosition}`>(NbPosition.BOTTOM);
  items = new Array<NbOverlayContent>();
  interval?: ReturnType<typeof setInterval>;

  stopRuntimeChange() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  changeComponent(component: NbOverlayContent) {
    this.component.set(component);
  }

  changeTrigger(trigger: NbTrigger | `${NbTrigger}`) {
    this.trigger.set(trigger);
  }

  changePlacement(placement: NbPosition | `${NbPosition}`) {
    this.position.set(placement);
  }

  startRuntimeChange() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        const random = this.items[Math.floor(Math.random() * this.items.length)];
        this.changeComponent(random);
      }, 2000);
    }
  }

  ngAfterViewInit() {
    this.items = [this.componentList, this.componentTabs, this.templateList(), this.templateTabs(), this.textContent];
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
