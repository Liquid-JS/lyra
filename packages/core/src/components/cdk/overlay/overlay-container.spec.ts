import { Component, NgModule, OnInit, viewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NbComponentPortal, NbOverlayContainerComponent, NbOverlayModule } from '@liquid-js/lyr-core'
import { NbOverlayContainerComponent as NbOverlayContainerComponent_1 } from './overlay-container'

@Component({
    template: ' <nb-overlay-container /> ',
    imports: [NbOverlayContainerComponent_1, NbOverlayModule]
})
export class NbOverlayContainerTestComponent {
    readonly overlayContainer = viewChild.required(NbOverlayContainerComponent)
}

@Component({
    template: '{{ contextProperty }}',
    imports: [NbOverlayModule]
})
export class NbOverlayTestComponent implements OnInit {
    contextProperty?: string

    isFirstOnChangesCall = true
    contextPropertyValueOnFirstCdRun?: string
    ngOnInit() {
        if (this.isFirstOnChangesCall) {
            this.contextPropertyValueOnFirstCdRun = this.contextProperty
            this.isFirstOnChangesCall = false
        }
    }
}

// Has to define test module since there is no way to specify entry components
// in 'TestBed.configureTestingModule'.
@NgModule({
    imports: [NbOverlayModule.forRoot(), NbOverlayContainerTestComponent, NbOverlayTestComponent]
})
export class NbOverlayTestModule {}

describe('NbOverlayContainerComponent', () => {
    let fixture: ComponentFixture<NbOverlayContainerTestComponent>
    let overlayContainer: NbOverlayContainerComponent

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NbOverlayTestModule] })

        fixture = TestBed.createComponent(NbOverlayContainerTestComponent)
        fixture.detectChanges()
        overlayContainer = fixture.componentInstance.overlayContainer()
    })

    it('should set context before change detection run', () => {
        const context = { contextProperty: 'contextProperty' }
        const portal: NbComponentPortal<NbOverlayTestComponent> = new NbComponentPortal(NbOverlayTestComponent)
        const portalRef = overlayContainer.attachComponentPortal(portal, context)

        expect(portalRef.instance.contextPropertyValueOnFirstCdRun).toEqual(context.contextProperty)
    })
})
