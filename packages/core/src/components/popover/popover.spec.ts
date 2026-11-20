import {
  Component,
  ElementRef,
  NgModule,
  TemplateRef,
  Type,
  viewChild,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import {
  NbThemeModule,
  NbLayoutModule,
  NbAdjustment,
  NbPosition,
  NbDynamicOverlayHandler,
  NbOverlayContent,
  NbRenderableContainer,
  NbTrigger,
  NbPopoverDirective,
  NbPopoverComponent,
  NbPopoverModule,
  NbTooltipDirective,
  NbTooltipModule,
  NbOverlayConfig,
} from '@liquid-js/lyr-core';
import { RouterModule } from '@angular/router';
import { NbLayoutComponent, NbLayoutColumnComponent } from '../layout/layout.component';
import { NbTooltipDirective as NbTooltipDirective_1 } from '../tooltip/tooltip.directive';
import { NbPopoverDirective as NbPopoverDirective_1 } from './popover.directive';

@Component({
  selector: 'nb-popover-component-content-test',
  template: 'test, {{ text }}',
  imports: [RouterModule],
})
export class NbPopoverComponentContentTestComponent {
  text?: string;
}

@Component({
  selector: 'nb-popover-default-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button #button nbPopover="test" [nbPopoverClass]="popoverClass()">show popover</button>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbPopoverDirective_1, RouterModule],
})
export class NbPopoverDefaultTestComponent {
  readonly button = viewChild<ElementRef>('button');
  readonly popover = viewChild.required(NbPopoverDirective);

  readonly popoverClass = signal('');
}

@Component({
  selector: 'nb-popover-bindings-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button
          #button
          [nbPopover]="content()"
          [nbPopoverTrigger]="trigger()"
          [nbPopoverPlacement]="position()"
          [nbPopoverAdjustment]="adjustment()"
          [nbPopoverContext]="context()"
          [nbPopoverDisabled]="disabled()"
        ></button>
      </nb-layout-column>
    </nb-layout>

    <ng-template let-data>Some Template {{ data.text }}</ng-template>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbPopoverDirective_1, RouterModule],
})
export class NbPopoverBindingsTestComponent {
  readonly popover = viewChild.required(NbPopoverDirective);
  readonly button = viewChild<ElementRef>('button');
  readonly template = viewChild(TemplateRef);
  readonly content = signal<any>('');
  readonly context = signal<any>({ text: 'hello world' });
  readonly trigger = signal(NbTrigger.CLICK);
  readonly position = signal(NbPosition.TOP);
  readonly adjustment = signal(NbAdjustment.CLOCKWISE);
  readonly disabled = signal(false);
}

@Component({
  selector: 'nb-popover-legacy-disabled-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button nbPopover="test" [nbTooltipDisabled]="disabled()"></button>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbPopoverDirective_1, RouterModule],
})
export class NbPopoverLegacyDisabledTestComponent {
  readonly popover = viewChild.required(NbPopoverDirective);
  readonly disabled = signal(false);
}

@Component({
  selector: 'nb-popover-instance-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button #button
          [nbPopover]="content()"
          [nbPopoverContext]="context()"
          [nbPopoverPlacement]="position()"
          [nbPopoverAdjustment]="adjustment()"
          [nbPopoverTrigger]="trigger()"></button>
      </nb-layout-column>
    </nb-layout>

    <ng-template>Some Template</ng-template>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbPopoverDirective_1, RouterModule],
})
export class NbPopoverInstanceTestComponent {
  readonly content = signal<any>('test');
  readonly context = signal<object>({});
  readonly position = signal(NbPosition.TOP);
  readonly adjustment = signal(NbAdjustment.CLOCKWISE);
  readonly trigger = signal(NbTrigger.CLICK);
  readonly popover = viewChild.required(NbPopoverDirective);
  readonly button = viewChild<ElementRef>('button');
  readonly template = viewChild(TemplateRef);
}

const dynamicOverlayIsShow$ = new Subject();
const dynamicOverlay = {
  show() {},
  hide() {},
  toggle() {},
  destroy() {},
  isShown: dynamicOverlayIsShow$,
};

export class NbDynamicOverlayHandlerMock {
  _componentType?: Type<NbRenderableContainer>;
  _host?: ElementRef;
  _context: object = {};
  _content?: NbOverlayContent;
  _trigger: NbTrigger = NbTrigger.NOOP;
  _position: NbPosition = NbPosition.TOP;
  _adjustment: NbAdjustment = NbAdjustment.NOOP;
  _offset = 15;
  _overlayConfig: NbOverlayConfig = {};
  _disabled = false;

  constructor() {}

  host(host: ElementRef) {
    this._host = host;
    return this;
  }

  trigger(trigger: NbTrigger) {
    this._trigger = trigger;
    return this;
  }

  position(position: NbPosition) {
    this._position = position;
    return this;
  }

  offset(offset: number) {
    this._offset = offset;
    return this;
  }

  adjustment(adjustment: NbAdjustment) {
    this._adjustment = adjustment;
    return this;
  }

  componentType(componentType: Type<NbRenderableContainer>) {
    this._componentType = componentType;
    return this;
  }

  content(content: NbOverlayContent) {
    this._content = content;
    return this;
  }

  context(context: object) {
    this._context = context;
    return this;
  }

  overlayConfig(overlayConfig: NbOverlayConfig) {
    this._overlayConfig = overlayConfig;
    return this;
  }

  disabled(disabled: boolean) {
    this._disabled = disabled;
    return this;
  }

  build() {
    return dynamicOverlay;
  }

  rebuild() {
    return dynamicOverlay;
  }

  connect() {}

  disconnect() {}

  destroy() {}
}

@Component({
  selector: 'nb-popover-with-tooltip-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button nbTooltip="tip" nbPopover="pop"></button>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbTooltipDirective_1, NbPopoverDirective_1, RouterModule],
})
export class NbPopoverWithTooltipTestComponent {
  readonly popover = viewChild.required(NbPopoverDirective);
  readonly tooltip = viewChild(NbTooltipDirective);
}

const TEST_COMPONENTS = [
  NbPopoverWithTooltipTestComponent,
  NbPopoverDefaultTestComponent,
  NbPopoverBindingsTestComponent,
  NbPopoverLegacyDisabledTestComponent,
  NbPopoverInstanceTestComponent,
  NbPopoverComponentContentTestComponent,
];

@NgModule({
  imports: [NbLayoutModule, NbPopoverModule, NbTooltipModule, ...TEST_COMPONENTS],
  exports: [...TEST_COMPONENTS],
})
class PopoverTestModule {}

describe('Directive: NbPopoverDirective', () => {
  const overlayHandler = new NbDynamicOverlayHandlerMock();

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), PopoverTestModule],
      providers: [],
    });
  });

  describe('smoke ', () => {
    let fixture: ComponentFixture<any>;

    afterEach(() => {
      fixture.destroy();
    });

    it('should work together with a tooltip on the same element', () => {
      fixture = TestBed.createComponent(NbPopoverWithTooltipTestComponent);
      fixture.detectChanges();

      fixture.componentInstance.popover().show();
      fixture.componentInstance.tooltip().show();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('nb-popover')?.textContent).toContain('pop');
      expect(fixture.nativeElement.querySelector('nb-tooltip')?.textContent).toContain('tip');
    });

    it('should render string', () => {
      fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);

      fixture.detectChanges();

      fixture.componentInstance.popover().show();
      fixture.detectChanges();
      const primitiveOverlay = fixture.nativeElement.querySelector('.primitive-overlay');
      expect(primitiveOverlay.textContent).toContain('test');
      // The app's text takes its own direction.
      expect(primitiveOverlay.querySelector('span[dir="auto"]')?.textContent).toBe('test');
    });

    it('should hide', () => {
      fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);

      fixture.detectChanges();

      fixture.componentInstance.popover().show();
      fixture.detectChanges();

      const openedOverlay = fixture.nativeElement.querySelector('.primitive-overlay');
      expect(openedOverlay.textContent).toContain('test');

      fixture.componentInstance.popover().hide();
      fixture.detectChanges();

      const noOverlay = fixture.nativeElement.querySelector('.primitive-overlay');
      expect(noOverlay).toBeNull();
    });

    it('should render different content type', () => {
      fixture = TestBed.createComponent(NbPopoverBindingsTestComponent);
      fixture.detectChanges();

      fixture.componentInstance.popover().show();
      fixture.detectChanges();

      fixture.componentInstance.content.set('new string');
      fixture.detectChanges();
      const stringPopover = fixture.nativeElement.querySelector('nb-popover');
      expect(stringPopover.textContent).toContain('new string');

      fixture.componentInstance.content.set(NbPopoverComponentContentTestComponent);
      fixture.detectChanges();
      const componentPopover = fixture.nativeElement.querySelector('nb-popover-component-content-test');
      expect(componentPopover.textContent).toContain('hello world');

      fixture.componentInstance.content.set(fixture.componentInstance.template());
      fixture.detectChanges();
      const templatePopover = fixture.nativeElement.querySelector('nb-popover');
      expect(templatePopover.textContent).toContain('hello world');
    });

    it('should emit show state change event when shows up', () => {
      fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
      fixture.detectChanges();
      const popover: NbPopoverDirective = fixture.componentInstance.popover();

      const stateChangeSpy = vi.fn();
      popover.nbPopoverShowStateChange.subscribe(stateChangeSpy);

      popover.show();
      fixture.detectChanges();

      expect(stateChangeSpy).toHaveBeenCalledTimes(1);
      expect(stateChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ isShown: true }));
    });

    it('should emit show state change event when hides', () => {
      fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
      fixture.detectChanges();
      const popover: NbPopoverDirective = fixture.componentInstance.popover();
      popover.show();
      fixture.detectChanges();

      const stateChangeSpy = vi.fn();
      popover.nbPopoverShowStateChange.subscribe(stateChangeSpy);

      popover.hide();
      fixture.detectChanges();

      expect(stateChangeSpy).toHaveBeenCalledTimes(1);
      expect(stateChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ isShown: false }));
    });

    it('should set isShown to false when hidden', () => {
      fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
      fixture.detectChanges();
      const popover: NbPopoverDirective = fixture.componentInstance.popover();

      expect(popover.isShown).toEqual(false);
    });

    it('should set isShown to true when shown', () => {
      fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
      fixture.detectChanges();
      const popover: NbPopoverDirective = fixture.componentInstance.popover();
      popover.show();
      fixture.detectChanges();

      expect(popover.isShown).toEqual(true);
    });
  });

  describe('mocked services', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), PopoverTestModule],
      }).overrideDirective(NbPopoverDirective, {
        set: {
          providers: [{ provide: NbDynamicOverlayHandler, useValue: overlayHandler }],
        },
      });
    });
    describe('default popover', () => {
      let fixture: ComponentFixture<NbPopoverDefaultTestComponent>;

      afterEach(() => {
        fixture.destroy();
      });

      it('should build', () => {
        const componentSpy = vi.spyOn(overlayHandler, 'componentType');
        const hostSpy = vi.spyOn(overlayHandler, 'host');
        const positionSpy = vi.spyOn(overlayHandler, 'position');
        const triggerSpy = vi.spyOn(overlayHandler, 'trigger');
        const adjustmentSpy = vi.spyOn(overlayHandler, 'adjustment');
        const contentSpy = vi.spyOn(overlayHandler, 'content');
        const contextSpy = vi.spyOn(overlayHandler, 'context');
        const buildSpy = vi.spyOn(overlayHandler, 'build');
        const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild');

        fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
        fixture.detectChanges();

        expect(componentSpy).toHaveBeenCalledTimes(1);
        expect(componentSpy).toHaveBeenCalledWith(NbPopoverComponent);
        expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button());
        expect(hostSpy).toHaveBeenCalledTimes(1);
        expect(positionSpy).toHaveBeenCalledTimes(2);
        expect(positionSpy).toHaveBeenCalledWith(NbPosition.TOP);
        expect(triggerSpy).toHaveBeenCalledTimes(2);
        expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.CLICK);
        expect(adjustmentSpy).toHaveBeenCalledTimes(2);
        expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.CLOCKWISE);
        expect(contentSpy).toHaveBeenCalledTimes(2);
        expect(contentSpy).toHaveBeenCalledWith('test');
        expect(contextSpy).toHaveBeenCalledTimes(2);
        expect(contextSpy).toHaveBeenCalledWith({});
        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(rebuildSpy).toHaveBeenCalledTimes(1);
      });

      it('should show/hide/toggle', () => {
        fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
        fixture.detectChanges();
        const showSpy = vi.spyOn(dynamicOverlay, 'show');
        const hideSpy = vi.spyOn(dynamicOverlay, 'hide');
        const toggleSpy = vi.spyOn(dynamicOverlay, 'toggle');

        fixture.componentInstance.popover().show();
        fixture.detectChanges();

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(hideSpy).toHaveBeenCalledTimes(0);
        expect(toggleSpy).toHaveBeenCalledTimes(0);

        fixture.componentInstance.popover().hide();
        fixture.detectChanges();

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(hideSpy).toHaveBeenCalledTimes(1);
        expect(toggleSpy).toHaveBeenCalledTimes(0);

        fixture.componentInstance.popover().toggle();
        fixture.detectChanges();

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(hideSpy).toHaveBeenCalledTimes(1);
        expect(toggleSpy).toHaveBeenCalledTimes(1);
      });

      it('should set overlay config', () => {
        const popoverClass = 'custom-popover-class';
        const overlayConfigSpy = vi.spyOn(overlayHandler, 'overlayConfig');

        fixture = TestBed.createComponent(NbPopoverDefaultTestComponent);
        fixture.componentInstance.popoverClass.set(popoverClass);
        fixture.detectChanges();

        expect(overlayConfigSpy).toHaveBeenCalledWith(expect.objectContaining({ panelClass: popoverClass }));
      });
    });

    describe('binding popover', () => {
      let fixture: ComponentFixture<NbPopoverBindingsTestComponent>;

      afterEach(() => {
        fixture.destroy();
      });

      it('should rebuild', () => {
        const componentSpy = vi.spyOn(overlayHandler, 'componentType');
        const hostSpy = vi.spyOn(overlayHandler, 'host');
        const positionSpy = vi.spyOn(overlayHandler, 'position');
        const triggerSpy = vi.spyOn(overlayHandler, 'trigger');
        const adjustmentSpy = vi.spyOn(overlayHandler, 'adjustment');
        const contentSpy = vi.spyOn(overlayHandler, 'content');
        const contextSpy = vi.spyOn(overlayHandler, 'context');
        const buildSpy = vi.spyOn(overlayHandler, 'build');
        const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild');

        fixture = TestBed.createComponent(NbPopoverBindingsTestComponent);
        fixture.detectChanges();

        fixture.componentInstance.adjustment.set(NbAdjustment.HORIZONTAL);
        fixture.componentInstance.trigger.set(NbTrigger.HINT);
        fixture.componentInstance.content.set('new string');
        fixture.componentInstance.context.set({ context: 'new' });
        fixture.componentInstance.position.set(NbPosition.LEFT);

        fixture.detectChanges();

        expect(componentSpy).toHaveBeenCalledTimes(1);
        expect(componentSpy).toHaveBeenCalledWith(NbPopoverComponent);
        expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button());
        expect(hostSpy).toHaveBeenCalledTimes(1);
        expect(positionSpy).toHaveBeenCalledTimes(3);
        expect(positionSpy).toHaveBeenCalledWith(NbPosition.LEFT);
        expect(triggerSpy).toHaveBeenCalledTimes(3);
        expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.HINT);
        expect(adjustmentSpy).toHaveBeenCalledTimes(3);
        expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.HORIZONTAL);
        expect(contentSpy).toHaveBeenCalledTimes(3);
        expect(contentSpy).toHaveBeenCalledWith('new string');
        expect(contextSpy).toHaveBeenCalledTimes(3);
        expect(contextSpy).toHaveBeenCalledWith({ context: 'new' });
        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(rebuildSpy).toHaveBeenCalledTimes(2);
      });

      it('should pass nbPopoverDisabled to the overlay', () => {
        const disabledSpy = vi.spyOn(overlayHandler, 'disabled');

        fixture = TestBed.createComponent(NbPopoverBindingsTestComponent);
        fixture.detectChanges();
        fixture.componentInstance.disabled.set(true);
        fixture.detectChanges();

        expect(fixture.componentInstance.popover().isDisabled()).toBe(true);
        expect(disabledSpy).toHaveBeenCalledWith(true);
      });

      it('should still accept the deprecated nbTooltipDisabled binding', () => {
        const legacy = TestBed.createComponent(NbPopoverLegacyDisabledTestComponent);
        legacy.detectChanges();
        legacy.componentInstance.disabled.set(true);
        legacy.detectChanges();

        expect(legacy.componentInstance.popover().isDisabled()).toBe(true);
        legacy.destroy();
      });

      it('should accept different content type', () => {
        const contentSpy = vi.spyOn(overlayHandler, 'content');

        fixture = TestBed.createComponent(NbPopoverBindingsTestComponent);
        fixture.detectChanges();

        fixture.componentInstance.content.set('new string');
        fixture.detectChanges();
        expect(contentSpy).toHaveBeenCalledTimes(3);
        expect(contentSpy).toHaveBeenCalledWith('new string');

        fixture.componentInstance.content.set(NbPopoverComponentContentTestComponent);
        fixture.detectChanges();

        expect(contentSpy).toHaveBeenCalledTimes(4);
        expect(contentSpy).toHaveBeenCalledWith(NbPopoverComponentContentTestComponent);

        fixture.componentInstance.content.set(fixture.componentInstance.template());
        fixture.detectChanges();

        expect(contentSpy).toHaveBeenCalledTimes(5);
        expect(contentSpy).toHaveBeenCalledWith(fixture.componentInstance.template());
      });
    });

    describe('instance popover', () => {
      let fixture: ComponentFixture<NbPopoverInstanceTestComponent>;

      afterEach(() => {
        fixture.destroy();
      });

      it('should rebuild', () => {
        const componentSpy = vi.spyOn(overlayHandler, 'componentType');
        const hostSpy = vi.spyOn(overlayHandler, 'host');
        const positionSpy = vi.spyOn(overlayHandler, 'position');
        const triggerSpy = vi.spyOn(overlayHandler, 'trigger');
        const adjustmentSpy = vi.spyOn(overlayHandler, 'adjustment');
        const contentSpy = vi.spyOn(overlayHandler, 'content');
        const contextSpy = vi.spyOn(overlayHandler, 'context');
        const buildSpy = vi.spyOn(overlayHandler, 'build');
        const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild');

        fixture = TestBed.createComponent(NbPopoverInstanceTestComponent);
        fixture.detectChanges();

        fixture.componentInstance.adjustment.set(NbAdjustment.HORIZONTAL);
        fixture.componentInstance.trigger.set(NbTrigger.HINT);
        fixture.componentInstance.content.set('new string');
        fixture.componentInstance.context.set({ context: 'new' });
        fixture.componentInstance.position.set(NbPosition.LEFT);

        fixture.detectChanges();

        expect(componentSpy).toHaveBeenCalledTimes(1);
        expect(componentSpy).toHaveBeenCalledWith(NbPopoverComponent);
        expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button());
        expect(hostSpy).toHaveBeenCalledTimes(1);
        expect(positionSpy).toHaveBeenCalledTimes(3);
        expect(positionSpy).toHaveBeenCalledWith(NbPosition.LEFT);
        expect(triggerSpy).toHaveBeenCalledTimes(3);
        expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.HINT);
        expect(adjustmentSpy).toHaveBeenCalledTimes(3);
        expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.HORIZONTAL);
        expect(contentSpy).toHaveBeenCalledTimes(3);
        expect(contentSpy).toHaveBeenCalledWith('new string');
        expect(contextSpy).toHaveBeenCalledTimes(3);
        expect(contextSpy).toHaveBeenCalledWith({ context: 'new' });
        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(rebuildSpy).toHaveBeenCalledTimes(2);
      });

      it('should accept different content type', () => {
        const contentSpy = vi.spyOn(overlayHandler, 'content');

        fixture = TestBed.createComponent(NbPopoverInstanceTestComponent);
        fixture.detectChanges();

        fixture.componentInstance.content.set('new string');
        fixture.detectChanges();

        expect(contentSpy).toHaveBeenCalledTimes(3);
        expect(contentSpy).toHaveBeenCalledWith('new string');

        fixture.componentInstance.content.set(NbPopoverComponentContentTestComponent);
        fixture.detectChanges();

        expect(contentSpy).toHaveBeenCalledTimes(4);
        expect(contentSpy).toHaveBeenCalledWith(NbPopoverComponentContentTestComponent);

        fixture.componentInstance.content.set(fixture.componentInstance.template());
        fixture.detectChanges();

        expect(contentSpy).toHaveBeenCalledTimes(5);
        expect(contentSpy).toHaveBeenCalledWith(fixture.componentInstance.template());
      });
    });
  });
});
