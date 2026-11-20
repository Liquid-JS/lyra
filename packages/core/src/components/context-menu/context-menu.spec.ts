import { Component, ElementRef, NgModule, Type, viewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NbThemeModule,
  NbLayoutModule,
  NbAdjustment,
  NbPosition,
  NbDynamicOverlayHandler,
  NbOverlayContent,
  NbRenderableContainer,
  NbTrigger,
  NbMenuModule,
  NbContextMenuDirective,
  NbContextMenuComponent,
  NbContextMenuModule,
  NbOverlayConfig,
} from '@liquid-js/lyr-core';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { NbLayoutComponent, NbLayoutColumnComponent } from '../layout/layout.component';
import { NbContextMenuDirective as NbContextMenuDirective_1 } from './context-menu.directive';

@Component({
  selector: 'nb-context-menu-default-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button #button [nbContextMenu]="items()" [nbContextMenuClass]="contextMenuClass()">show context menu</button>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbContextMenuDirective_1, RouterModule, NbMenuModule],
})
export class NbContextMenuDefaultTestComponent {
  readonly button = viewChild<ElementRef>('button');
  readonly contextMenu = viewChild.required(NbContextMenuDirective);

  readonly items = signal([{ title: 'User' }, { title: 'Log Out' }]);
  readonly contextMenuClass = signal('');
}

@Component({
  selector: 'nb-context-menu-bindings-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button
          #button
          [nbContextMenu]="items()"
          [nbContextMenuTrigger]="trigger()"
          [nbContextMenuPlacement]="position()"
          [nbContextMenuAdjustment]="adjustment()"
          [nbContextMenuTag]="tag()"
        ></button>
      </nb-layout-column>
    </nb-layout>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbContextMenuDirective_1, RouterModule, NbMenuModule],
})
export class NbContextMenuBindingsTestComponent {
  readonly contextMenu = viewChild.required(NbContextMenuDirective);
  readonly button = viewChild<ElementRef>('button');
  readonly trigger = signal(NbTrigger.CLICK);
  readonly position = signal(NbPosition.TOP);
  readonly adjustment = signal(NbAdjustment.CLOCKWISE);
  readonly tag = signal('');
  readonly items = signal([{ title: 'User' }, { title: 'Log Out' }]);
}

@Component({
  selector: 'nb-context-menu-instance-test',
  template: `
    <nb-layout>
      <nb-layout-column>
        <button #button
          [nbContextMenu]="items()"
          [nbContextMenuTag]="tag()"
          [nbContextMenuPlacement]="position()"
          [nbContextMenuAdjustment]="adjustment()"
          [nbContextMenuTrigger]="trigger()">show context menu</button>
      </nb-layout-column>
    </nb-layout>

    <ng-template>Some Template</ng-template>
  `,
  imports: [NbLayoutComponent, NbLayoutColumnComponent, NbContextMenuDirective_1, RouterModule, NbMenuModule],
})
export class NbContextMenuInstanceTestComponent {
  readonly contextMenu = viewChild.required(NbContextMenuDirective);
  readonly button = viewChild<ElementRef>('button');

  readonly items = signal([{ title: 'User' }, { title: 'Log Out' }]);
  readonly tag = signal<string | undefined>(undefined);
  readonly position = signal(NbPosition.BOTTOM);
  readonly adjustment = signal(NbAdjustment.CLOCKWISE);
  readonly trigger = signal(NbTrigger.CLICK);
}

const dynamicOverlay = {
  show() {},
  hide() {},
  toggle() {},
  destroy() {},
  isShown: of(false),
};

export class NbDynamicOverlayHandlerMock {
  _componentType?: Type<NbRenderableContainer>;
  _host?: ElementRef;
  _context: object = {};
  _content?: NbOverlayContent;
  _trigger: NbTrigger = NbTrigger.NOOP;
  _position: NbPosition = NbPosition.TOP;
  _adjustment: NbAdjustment = NbAdjustment.NOOP;
  _offset?: number;
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

  offset(offset: number) {
    this._offset = offset;
    return this;
  }

  disabled(disabled: boolean) {
    this._disabled = disabled;
    return this;
  }

  overlayConfig(overlayConfig: NbOverlayConfig) {
    this._overlayConfig = overlayConfig;
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

const TEST_COMPONENTS = [
  NbContextMenuDefaultTestComponent,
  NbContextMenuBindingsTestComponent,
  NbContextMenuInstanceTestComponent,
];

@NgModule({
  imports: [NbLayoutModule, NbContextMenuModule, ...TEST_COMPONENTS],
  exports: [...TEST_COMPONENTS],
})
class ContextMenuTestModule {}

describe('Directive: NbContextMenuDirective', () => {
  const overlayHandler = new NbDynamicOverlayHandlerMock();

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NbThemeModule.forRoot(),
        NbMenuModule.forRoot(),
        ContextMenuTestModule,
      ],
    });
  });

  describe('smoke ', () => {
    let fixture: ComponentFixture<any>;

    afterEach(() => {
      fixture.destroy();
    });

    it('should render string', () => {
      fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.contextMenu().show();
      fixture.detectChanges();

      const textContainer = fixture.nativeElement.querySelector('nb-menu');
      expect(textContainer.textContent).toContain('Log Out');
    });

    it('should hide', async () => {
      fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
      fixture.detectChanges();
      fixture.componentInstance.contextMenu().show();
      fixture.detectChanges();

      const textContainer = fixture.nativeElement.querySelector('nb-menu');
      expect(textContainer.textContent).toContain('UserLog Out');
      fixture.componentInstance.contextMenu().hide();
      fixture.detectChanges();

      await fixture.whenStable(); // we need this tick for animations
      const contextMenu = fixture.nativeElement.querySelector('nb-menu');
      expect(contextMenu).toBeNull();
    });

    it('should take the focus to the first item when the keyboard opens it, and back on Escape', async () => {
      fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.componentInstance.button()?.nativeElement;
      button.focus();
      // Enter or Space on a button clicks it with no mouse button presses.
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }));
      fixture.detectChanges();
      await fixture.whenStable();

      const menu: HTMLElement = fixture.nativeElement.querySelector('nb-menu');
      expect(menu.contains(document.activeElement)).toBe(true);
      expect(document.activeElement?.textContent).toContain('User');

      document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('nb-menu')).toBeNull();
      expect(document.activeElement).toBe(button);
    });

    it('should leave the focus where it is when a mouse opens it', async () => {
      fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.componentInstance.button()?.nativeElement;
      button.focus();
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('nb-menu')).not.toBeNull();
      expect(document.activeElement).toBe(button);
    });

    it('should stay closed without items and open once items are set', () => {
      fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
      fixture.componentInstance.items.set([]);
      expect(() => fixture.detectChanges()).not.toThrow();

      fixture.componentInstance.contextMenu().show();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('nb-menu')).toBeNull();

      fixture.componentInstance.items.set([{ title: 'Hello' }]);
      fixture.detectChanges();
      fixture.componentInstance.contextMenu().show();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('nb-menu').textContent).toContain('Hello');
    });

    it('should render different items', () => {
      fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
      fixture.detectChanges();

      fixture.componentInstance.contextMenu().show();
      fixture.detectChanges();

      fixture.componentInstance.items.set([{ title: 'Hello' }]);
      fixture.detectChanges();
      const textContainer = fixture.nativeElement.querySelector('nb-menu');
      expect(textContainer.textContent).toContain('Hello');
    });
  });

  describe('mocked services', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          RouterModule.forRoot([]),
          NbThemeModule.forRoot(),
          NbMenuModule.forRoot(),
          ContextMenuTestModule,
        ],
      }).overrideDirective(NbContextMenuDirective, {
        set: {
          providers: [{ provide: NbDynamicOverlayHandler, useValue: overlayHandler }],
        },
      });
    });
    describe('default context-menu', () => {
      let fixture: ComponentFixture<NbContextMenuDefaultTestComponent>;

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
        const offsetSpy = vi.spyOn(overlayHandler, 'offset');
        const buildSpy = vi.spyOn(overlayHandler, 'build');
        const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild');

        fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
        fixture.detectChanges();

        expect(componentSpy).toHaveBeenCalledTimes(1);
        expect(componentSpy).toHaveBeenCalledWith(NbContextMenuComponent);
        expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button());
        expect(hostSpy).toHaveBeenCalledTimes(1);
        expect(offsetSpy).toHaveBeenCalledTimes(2);
        expect(offsetSpy).toHaveBeenCalledWith(15);
        expect(positionSpy).toHaveBeenCalledTimes(2);
        expect(positionSpy).toHaveBeenCalledWith(NbPosition.BOTTOM);
        expect(triggerSpy).toHaveBeenCalledTimes(2);
        expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.CLICK);
        expect(adjustmentSpy).toHaveBeenCalledTimes(2);
        expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.CLOCKWISE);
        expect(contentSpy).toHaveBeenCalledTimes(0);
        expect(contextSpy).toHaveBeenCalledTimes(2);
        expect(contextSpy).toHaveBeenCalledWith({
          position: NbPosition.BOTTOM,
          items: [{ title: 'User' }, { title: 'Log Out' }],
          tag: undefined,
        });
        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(rebuildSpy).toHaveBeenCalledTimes(1);
      });

      it('should show/hide/toggle', () => {
        fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
        fixture.detectChanges();
        const showSpy = vi.spyOn(dynamicOverlay, 'show');
        const hideSpy = vi.spyOn(dynamicOverlay, 'hide');
        const toggleSpy = vi.spyOn(dynamicOverlay, 'toggle');

        fixture.componentInstance.contextMenu().show();
        fixture.detectChanges();

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(hideSpy).toHaveBeenCalledTimes(0);
        expect(toggleSpy).toHaveBeenCalledTimes(0);

        fixture.componentInstance.contextMenu().hide();
        fixture.detectChanges();

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(hideSpy).toHaveBeenCalledTimes(1);
        expect(toggleSpy).toHaveBeenCalledTimes(0);

        fixture.componentInstance.contextMenu().toggle();
        fixture.detectChanges();

        expect(showSpy).toHaveBeenCalledTimes(1);
        expect(hideSpy).toHaveBeenCalledTimes(1);
        expect(toggleSpy).toHaveBeenCalledTimes(1);
      });

      it('should set overlay config', () => {
        const contextMenuClass = 'custom-context-menu-class';
        const overlayConfigSpy = vi.spyOn(overlayHandler, 'overlayConfig');

        fixture = TestBed.createComponent(NbContextMenuDefaultTestComponent);
        fixture.componentInstance.contextMenuClass.set(contextMenuClass);
        fixture.detectChanges();

        expect(overlayConfigSpy).toHaveBeenCalledWith(expect.objectContaining({ panelClass: contextMenuClass }));
      });
    });

    describe('binding contextMenu', () => {
      let fixture: ComponentFixture<NbContextMenuBindingsTestComponent>;

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
        const offsetSpy = vi.spyOn(overlayHandler, 'offset');
        const buildSpy = vi.spyOn(overlayHandler, 'build');
        const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild');

        fixture = TestBed.createComponent(NbContextMenuBindingsTestComponent);
        fixture.detectChanges();

        fixture.componentInstance.adjustment.set(NbAdjustment.HORIZONTAL);
        fixture.componentInstance.trigger.set(NbTrigger.HOVER);
        fixture.componentInstance.items.set([{ title: 'New' }]);
        fixture.componentInstance.tag.set('new');
        fixture.componentInstance.position.set(NbPosition.LEFT);

        fixture.detectChanges();

        expect(componentSpy).toHaveBeenCalledTimes(1);
        expect(componentSpy).toHaveBeenCalledWith(NbContextMenuComponent);
        expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button());
        expect(hostSpy).toHaveBeenCalledTimes(1);
        expect(offsetSpy).toHaveBeenCalledTimes(3);
        expect(offsetSpy).toHaveBeenCalledWith(15);
        expect(positionSpy).toHaveBeenCalledTimes(3);
        expect(positionSpy).toHaveBeenCalledWith(NbPosition.LEFT);
        expect(triggerSpy).toHaveBeenCalledTimes(3);
        expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.HOVER);
        expect(adjustmentSpy).toHaveBeenCalledTimes(3);
        expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.HORIZONTAL);
        expect(contentSpy).toHaveBeenCalledTimes(0);
        expect(contextSpy).toHaveBeenCalledTimes(3);
        expect(contextSpy).toHaveBeenCalledWith({
          position: NbPosition.LEFT,
          items: [{ title: 'New' }],
          tag: 'new',
        });
        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(rebuildSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe('instance context-menu', () => {
      let fixture: ComponentFixture<NbContextMenuInstanceTestComponent>;

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
        const offsetSpy = vi.spyOn(overlayHandler, 'offset');
        const buildSpy = vi.spyOn(overlayHandler, 'build');
        const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild');

        fixture = TestBed.createComponent(NbContextMenuInstanceTestComponent);
        fixture.detectChanges();

        fixture.componentInstance.adjustment.set(NbAdjustment.HORIZONTAL);
        fixture.componentInstance.trigger.set(NbTrigger.HOVER);
        fixture.componentInstance.items.set([{ title: 'New' }]);
        fixture.componentInstance.tag.set('new');
        fixture.componentInstance.position.set(NbPosition.LEFT);

        fixture.detectChanges();

        expect(componentSpy).toHaveBeenCalledTimes(1);
        expect(componentSpy).toHaveBeenCalledWith(NbContextMenuComponent);
        expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button());
        expect(hostSpy).toHaveBeenCalledTimes(1);
        expect(positionSpy).toHaveBeenCalledTimes(3);
        expect(positionSpy).toHaveBeenCalledWith(NbPosition.LEFT);
        expect(triggerSpy).toHaveBeenCalledTimes(3);
        expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.HOVER);
        expect(offsetSpy).toHaveBeenCalledTimes(3);
        expect(offsetSpy).toHaveBeenCalledWith(15);
        expect(adjustmentSpy).toHaveBeenCalledTimes(3);
        expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.HORIZONTAL);
        expect(contentSpy).toHaveBeenCalledTimes(0);
        expect(contextSpy).toHaveBeenCalledTimes(3);
        expect(contextSpy).toHaveBeenCalledWith({
          position: NbPosition.LEFT,
          items: [{ title: 'New' }],
          tag: 'new',
        });
        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(rebuildSpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
