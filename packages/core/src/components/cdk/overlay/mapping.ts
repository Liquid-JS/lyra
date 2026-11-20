import { Directive, ModuleWithProviders, NgModule, TemplateRef, ViewContainerRef, Service } from '@angular/core';
import {
  CdkPortal,
  CdkPortalOutlet,
  ComponentPortal,
  Portal,
  PortalModule,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  ComponentType,
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayModule,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { NbScrollStrategyOptions } from '../adapter/block-scroll-strategy-adapter';

@Directive({ selector: '[nbPortal]' })
export class NbPortalDirective extends CdkPortal {}

@Directive({ selector: '[nbPortalOutlet]' })
export class NbPortalOutletDirective extends CdkPortalOutlet {}

export class NbComponentPortal<T = unknown> extends ComponentPortal<T> {}

@Service()
export class NbOverlay extends Overlay {
  declare scrollStrategies: NbScrollStrategyOptions;
}

@Service()
export class NbOverlayPositionBuilder extends OverlayPositionBuilder {}

export class NbTemplatePortal<T = unknown> extends TemplatePortal<T> {
  constructor(template: TemplateRef<T>, viewContainerRef?: ViewContainerRef, context?: T) {
    // The CDK types it as required, but the overlay containers' portal outlets stamp the template into their own
    // view container when there's none.
    super(template, viewContainerRef as ViewContainerRef, context);
  }
}

@Service({ autoProvided: false })
export class NbOverlayContainer extends OverlayContainer {}

export class NbFlexibleConnectedPositionStrategy extends FlexibleConnectedPositionStrategy {}

export type NbPortal<T = unknown> = Portal<T>;
export type NbOverlayRef = OverlayRef;
export type NbComponentType<T = unknown> = ComponentType<T>;
export type NbPositionStrategy = PositionStrategy;
export type NbConnectedPosition = ConnectedPosition;
export type NbConnectedOverlayPositionChange = ConnectedOverlayPositionChange;
export type NbConnectionPositionPair = ConnectionPositionPair;
export type NbOverlayConfig = OverlayConfig;
export type NbScrollStrategy = ScrollStrategy;

const CDK_MODULES = [OverlayModule, PortalModule];

/**
 * The CDK's overlay and portal modules under Lyra's names, so the rest of the library doesn't import `@angular/cdk`
 * directly.
 */
@NgModule({
  imports: [...CDK_MODULES, NbPortalDirective, NbPortalOutletDirective],
  exports: [...CDK_MODULES, NbPortalDirective, NbPortalOutletDirective],
})
export class NbCdkMappingModule {
  static forRoot(): Required<ModuleWithProviders<NbCdkMappingModule>> {
    return {
      ngModule: NbCdkMappingModule,
      providers: [NbOverlay, NbOverlayPositionBuilder],
    };
  }
}
