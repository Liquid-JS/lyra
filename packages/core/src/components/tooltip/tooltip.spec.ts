import { Component, ElementRef, NgModule, Type, viewChild, viewChildren, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Subject } from 'rxjs'
import {
    NbThemeModule,
    NbLayoutModule,
    NbAdjustment,
    NbPosition,
    NbDynamicOverlayHandler,
    NbOverlayContent,
    NbRenderableContainer,
    NbTrigger,
    NbTooltipDirective,
    NbTooltipModule,
    NbTooltipComponent,
    NbIconLibraries,
    NbOverlayConfig,
    NbValidationModule
} from '@liquid-js/lyr-core'
import { RouterModule } from '@angular/router'
import { NbLayoutComponent, NbLayoutColumnComponent } from '../layout/layout.component'
import { NbTooltipDirective as NbTooltipDirective_1 } from './tooltip.directive'

@Component({
    selector: 'nb-tooltip-default-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <button #button nbTooltip="test">show tooltip</button>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, NbTooltipDirective_1, RouterModule]
})
export class NbTooltipDefaultTestComponent {
    readonly button = viewChild<ElementRef>('button')
    readonly tooltip = viewChild.required(NbTooltipDirective)
}

@Component({
    selector: 'nb-tooltip-bindings-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <button aria-label="Test"
          #button
          [nbTooltip]="content()"
          [nbTooltipTrigger]="trigger()"
          [nbTooltipPlacement]="position()"
          [nbTooltipAdjustment]="adjustment()"
          [nbTooltipStatus]="status()"
          [nbTooltipIcon]="icon()"
          [nbTooltipClass]="tooltipClass()"
        ></button>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, NbTooltipDirective_1, RouterModule]
})
export class NbTooltipBindingsTestComponent {
    readonly tooltip = viewChild.required(NbTooltipDirective)
    readonly button = viewChild<ElementRef>('button')
    readonly content = signal<any>('')
    readonly status = signal('primary')
    readonly icon = signal('')
    readonly trigger = signal(NbTrigger.CLICK)
    readonly position = signal(NbPosition.TOP)
    readonly adjustment = signal(NbAdjustment.CLOCKWISE)
    readonly tooltipClass = signal('')
}

@Component({
    selector: 'nb-tooltip-template-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <button [nbTooltip]="shortcut" [nbTooltipContext]="key()" nbTooltipIcon="some-icon">Save</button>
        <ng-template #shortcut let-key>Save the draft <kbd>Ctrl+{{ key }}</kbd></ng-template>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, NbTooltipDirective_1, RouterModule]
})
export class NbTooltipTemplateTestComponent {
    readonly tooltip = viewChild.required(NbTooltipDirective)
    readonly key = signal('S')
}

@Component({
    selector: 'nb-tooltip-described-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <button class="plain" nbTooltip="Saves the draft" aria-describedby="own-hint">Save</button>
        <span id="own-hint">Own hint</span>
        <input class="validated" [formControl]="name" nbValidation nbTooltip="Your full name" />
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [
        NbLayoutComponent,
        NbLayoutColumnComponent,
        NbTooltipDirective_1,
        RouterModule,
        ReactiveFormsModule,
        NbValidationModule
    ]
})
export class NbTooltipDescribedTestComponent {
    readonly tooltips = viewChildren(NbTooltipDirective)
    readonly name = new FormControl('')
}

@Component({
    selector: 'nb-tooltip-instance-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <button aria-label="Test" #button
          [nbTooltip]="content()"
          [nbTooltipPlacement]="position()"
          [nbTooltipAdjustment]="adjustment()"
          [nbTooltipTrigger]="trigger()"
          [nbTooltipStatus]="status()"
          [nbTooltipIcon]="icon()"></button>
      </nb-layout-column>
    </nb-layout>

    <ng-template>Some Template</ng-template>
  `,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, NbTooltipDirective_1, RouterModule]
})
export class NbTooltipInstanceTestComponent {
    readonly content = signal('test')
    readonly position = signal(NbPosition.TOP)
    readonly adjustment = signal(NbAdjustment.CLOCKWISE)
    readonly trigger = signal(NbTrigger.HINT)
    readonly status = signal<string | undefined>(undefined)
    readonly icon = signal<string | undefined>(undefined)
    readonly tooltip = viewChild.required(NbTooltipDirective)
    readonly button = viewChild<ElementRef>('button')
}

const dynamicOverlayIsShow$ = new Subject()
const dynamicOverlay = {
    show: () => {},
    hide: () => {},
    toggle: () => {},
    destroy: () => {},
    isShown: dynamicOverlayIsShow$
}

export class NbDynamicOverlayHandlerMock {
    _componentType?: Type<NbRenderableContainer>
    _host?: ElementRef
    _context: object = {}
    _content?: NbOverlayContent
    _trigger: NbTrigger = NbTrigger.NOOP
    _position: NbPosition = NbPosition.TOP
    _adjustment: NbAdjustment = NbAdjustment.NOOP
    _offset?: number
    _overlayConfig: NbOverlayConfig = {}
    _disabled = false

    constructor() {}

    host(host: ElementRef) {
        this._host = host
        return this
    }

    trigger(trigger: NbTrigger) {
        this._trigger = trigger
        return this
    }

    position(position: NbPosition) {
        this._position = position
        return this
    }

    adjustment(adjustment: NbAdjustment) {
        this._adjustment = adjustment
        return this
    }

    componentType(componentType: Type<NbRenderableContainer>) {
        this._componentType = componentType
        return this
    }

    content(content: NbOverlayContent) {
        this._content = content
        return this
    }

    context(context: object) {
        this._context = context
        return this
    }

    offset(offset: number) {
        this._offset = offset
        return this
    }

    overlayConfig(overlayConfig: NbOverlayConfig) {
        this._overlayConfig = overlayConfig
        return this
    }

    build() {
        return dynamicOverlay
    }

    rebuild() {
        return dynamicOverlay
    }

    disabled(disabled: boolean) {
        this._disabled = disabled
        return this
    }

    connect() {}

    disconnect() {}

    destroy() {}
}

@Component({
    selector: 'nb-tooltip-content-test',
    template: `
    <nb-layout>
      <nb-layout-column>
        <button [nbTooltip]="content()">show tooltip</button>
      </nb-layout-column>
    </nb-layout>
  `,
    imports: [NbLayoutComponent, NbLayoutColumnComponent, NbTooltipDirective_1, RouterModule]
})
export class NbTooltipContentTestComponent {
    readonly tooltip = viewChild.required(NbTooltipDirective)
    readonly content = signal('')
}

const TEST_COMPONENTS = [
    NbTooltipDefaultTestComponent,
    NbTooltipBindingsTestComponent,
    NbTooltipInstanceTestComponent,
    NbTooltipContentTestComponent
]

@NgModule({
    imports: [NbLayoutModule, NbTooltipModule, ...TEST_COMPONENTS],
    exports: [...TEST_COMPONENTS]
})
class PopoverTestModule {}

describe('Directive: NbTooltipDirective', () => {
    const overlayHandler = new NbDynamicOverlayHandlerMock()

    beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), PopoverTestModule]
        })

        const iconLibs: NbIconLibraries = TestBed.inject(NbIconLibraries)
        iconLibs.registerSvgPack('test', { 'some-icon': '<svg>some-icon</svg>' })
        iconLibs.setDefaultPack('test')
    })

    describe('smoke ', () => {
        let fixture: ComponentFixture<any>

        afterEach(() => {
            fixture.destroy()
        })

        it('should render string', () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()

            const textContainer = fixture.nativeElement.querySelector('nb-tooltip .content span')
            expect(textContainer.textContent).toContain('test')
            // The text takes its own direction.
            expect(textContainer.getAttribute('dir')).toBe('auto')
        })

        it('should not show without content', () => {
            fixture = TestBed.createComponent(NbTooltipContentTestComponent)
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()
            expect(fixture.nativeElement.querySelector('nb-tooltip')).toBeNull()

            fixture.componentInstance.content.set('now with content')
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()
            expect(fixture.nativeElement.querySelector('nb-tooltip').textContent).toContain('now with content')
        })

        it('should describe its host while it shows, keeping the host\'s own description', async () => {
            fixture = TestBed.createComponent(NbTooltipDescribedTestComponent)
            fixture.detectChanges()
            await fixture.whenStable()
            const [plainTooltip, validatedTooltip] = fixture.componentInstance.tooltips()
            const plain = fixture.nativeElement.querySelector('.plain') as HTMLElement
            const validated = fixture.nativeElement.querySelector('.validated') as HTMLElement

            plainTooltip.show()
            fixture.detectChanges()
            const tooltip = fixture.nativeElement.querySelector('nb-tooltip') as HTMLElement
            expect(tooltip.getAttribute('role')).toBe('tooltip')
            expect(tooltip.id).toBeTruthy()
            expect(plain.getAttribute('aria-describedby')?.split(' ')).toEqual(['own-hint', tooltip.id])

            plainTooltip.hide()
            fixture.detectChanges()
            await fixture.whenStable()
            expect(plain.getAttribute('aria-describedby')).toBe('own-hint')

            // With nbValidation, the tooltip joins the validation's descriptions.
            validatedTooltip.show()
            fixture.detectChanges()
            await fixture.whenStable()
            const validatedId = (fixture.nativeElement.querySelector('nb-tooltip') as HTMLElement).id
            expect(validated.getAttribute('aria-describedby')).toBe(validatedId)
            validatedTooltip.hide()
            fixture.detectChanges()
            await fixture.whenStable()
            expect(validated.hasAttribute('aria-describedby')).toBe(false)
        })

        it('should hide', async () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()

            const textContainer = fixture.nativeElement.querySelector('nb-tooltip .content span')
            expect(textContainer.textContent).toContain('test')
            fixture.componentInstance.tooltip().hide()
            fixture.detectChanges()

            await fixture.whenStable() // we need this tick for animations
            const tooltip = fixture.nativeElement.querySelector('nb-tooltip')
            expect(tooltip).toBeNull()
        })

        it('should render different content', () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()

            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()

            fixture.componentInstance.content = 'new string'
            fixture.detectChanges()
            const textContainer = fixture.nativeElement.querySelector('nb-tooltip .content span')
            expect(textContainer.textContent).toContain('test')
        })

        it('should display icon', () => {
            fixture = TestBed.createComponent(NbTooltipBindingsTestComponent)
            fixture.detectChanges()

            fixture.componentInstance.icon.set('some-icon')
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()

            const iconContainer = fixture.nativeElement.querySelector('nb-tooltip .content nb-icon')
            expect(iconContainer.textContent).toContain('some-icon')
        })

        it('should render a template with its context, next to the icon', async () => {
            fixture = TestBed.createComponent(NbTooltipTemplateTestComponent)
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()

            const content = fixture.nativeElement.querySelector('nb-tooltip .content') as HTMLElement
            expect(content.querySelector('nb-icon')).not.toBeNull()
            expect(content.querySelector('kbd')?.textContent).toBe('Ctrl+S')
            expect(content.textContent).toContain('Save the draft')

            fixture.componentInstance.key.set('D')
            fixture.detectChanges()
            await fixture.whenStable()
            fixture.detectChanges()
            expect(fixture.nativeElement.querySelector('nb-tooltip kbd')?.textContent).toBe('Ctrl+D')
        })

        it('should display status', () => {
            fixture = TestBed.createComponent(NbTooltipBindingsTestComponent)
            fixture.detectChanges()

            fixture.componentInstance.content.set('status tooltip')
            fixture.componentInstance.status.set('danger')
            fixture.detectChanges()
            fixture.componentInstance.tooltip().show()
            fixture.detectChanges()

            const iconContainer = fixture.nativeElement.querySelector('nb-tooltip')
            expect(iconContainer.className).toContain('status-danger')
        })

        it('should emit show state change event when shows up', () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()
            const tooltip: NbTooltipDirective = fixture.componentInstance.tooltip()

            const stateChangeSpy = vi.fn()
            tooltip.nbTooltipShowStateChange.subscribe(stateChangeSpy)

            tooltip.show()
            fixture.detectChanges()

            expect(stateChangeSpy).toHaveBeenCalledTimes(1)
            expect(stateChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ isShown: true }))
        })

        it('should emit show state change event when hides', () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()
            const tooltip: NbTooltipDirective = fixture.componentInstance.tooltip()
            tooltip.show()
            fixture.detectChanges()

            const stateChangeSpy = vi.fn()
            tooltip.nbTooltipShowStateChange.subscribe(stateChangeSpy)

            tooltip.hide()
            fixture.detectChanges()

            expect(stateChangeSpy).toHaveBeenCalledTimes(1)
            expect(stateChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ isShown: false }))
        })

        it('should set isShown to false when hidden', () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()
            const tooltip: NbTooltipDirective = fixture.componentInstance.tooltip()

            expect(tooltip.isShown).toEqual(false)
        })

        it('should set isShown to true when shown', () => {
            fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
            fixture.detectChanges()
            const tooltip: NbTooltipDirective = fixture.componentInstance.tooltip()
            tooltip.show()
            fixture.detectChanges()

            expect(tooltip.isShown).toEqual(true)
        })
    })

    describe('mocked services', () => {
        beforeEach(() => {
            TestBed.resetTestingModule()
            TestBed.configureTestingModule({
                imports: [RouterModule.forRoot([]), NbThemeModule.forRoot(), PopoverTestModule]
            }).overrideDirective(NbTooltipDirective, {
                set: {
                    providers: [{ provide: NbDynamicOverlayHandler, useValue: overlayHandler }]
                }
            })
        })
        describe('default tooltip', () => {
            let fixture: ComponentFixture<NbTooltipDefaultTestComponent>

            afterEach(() => {
                fixture.destroy()
            })

            it('should build', () => {
                const componentSpy = vi.spyOn(overlayHandler, 'componentType')
                const hostSpy = vi.spyOn(overlayHandler, 'host')
                const positionSpy = vi.spyOn(overlayHandler, 'position')
                const triggerSpy = vi.spyOn(overlayHandler, 'trigger')
                const adjustmentSpy = vi.spyOn(overlayHandler, 'adjustment')
                const contentSpy = vi.spyOn(overlayHandler, 'content')
                const contextSpy = vi.spyOn(overlayHandler, 'context')
                const offsetSpy = vi.spyOn(overlayHandler, 'offset')
                const buildSpy = vi.spyOn(overlayHandler, 'build')
                const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild')

                fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
                fixture.detectChanges()

                expect(componentSpy).toHaveBeenCalledTimes(1)
                expect(componentSpy).toHaveBeenCalledWith(NbTooltipComponent)
                expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button())
                expect(hostSpy).toHaveBeenCalledTimes(1)
                expect(offsetSpy).toHaveBeenCalledTimes(1)
                expect(offsetSpy).toHaveBeenCalledWith(8)
                expect(positionSpy).toHaveBeenCalledTimes(2)
                expect(positionSpy).toHaveBeenCalledWith(NbPosition.TOP)
                expect(triggerSpy).toHaveBeenCalledTimes(2)
                expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.HINT)
                expect(adjustmentSpy).toHaveBeenCalledTimes(2)
                expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.CLOCKWISE)
                expect(contentSpy).toHaveBeenCalledTimes(2)
                expect(contentSpy).toHaveBeenCalledWith('test')
                expect(contextSpy).toHaveBeenCalledTimes(2)
                expect(contextSpy).toHaveBeenCalledWith({ id: expect.any(String) })
                expect(buildSpy).toHaveBeenCalledTimes(1)
                expect(rebuildSpy).toHaveBeenCalledTimes(1)
            })

            it('should show/hide/toggle', () => {
                fixture = TestBed.createComponent(NbTooltipDefaultTestComponent)
                fixture.detectChanges()
                const showSpy = vi.spyOn(dynamicOverlay, 'show')
                const hideSpy = vi.spyOn(dynamicOverlay, 'hide')
                const toggleSpy = vi.spyOn(dynamicOverlay, 'toggle')

                fixture.componentInstance.tooltip().show()
                fixture.detectChanges()

                expect(showSpy).toHaveBeenCalledTimes(1)
                expect(hideSpy).toHaveBeenCalledTimes(0)
                expect(toggleSpy).toHaveBeenCalledTimes(0)

                fixture.componentInstance.tooltip().hide()
                fixture.detectChanges()

                expect(showSpy).toHaveBeenCalledTimes(1)
                expect(hideSpy).toHaveBeenCalledTimes(1)
                expect(toggleSpy).toHaveBeenCalledTimes(0)

                fixture.componentInstance.tooltip().toggle()
                fixture.detectChanges()

                expect(showSpy).toHaveBeenCalledTimes(1)
                expect(hideSpy).toHaveBeenCalledTimes(1)
                expect(toggleSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('binding tooltip', () => {
            let fixture: ComponentFixture<NbTooltipBindingsTestComponent>

            afterEach(() => {
                fixture.destroy()
            })

            it('should rebuild', () => {
                const componentSpy = vi.spyOn(overlayHandler, 'componentType')
                const hostSpy = vi.spyOn(overlayHandler, 'host')
                const positionSpy = vi.spyOn(overlayHandler, 'position')
                const triggerSpy = vi.spyOn(overlayHandler, 'trigger')
                const adjustmentSpy = vi.spyOn(overlayHandler, 'adjustment')
                const contentSpy = vi.spyOn(overlayHandler, 'content')
                const contextSpy = vi.spyOn(overlayHandler, 'context')
                const offsetSpy = vi.spyOn(overlayHandler, 'offset')
                const buildSpy = vi.spyOn(overlayHandler, 'build')
                const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild')

                fixture = TestBed.createComponent(NbTooltipBindingsTestComponent)
                fixture.detectChanges()

                fixture.componentInstance.adjustment.set(NbAdjustment.HORIZONTAL)
                fixture.componentInstance.trigger.set(NbTrigger.CLICK)
                fixture.componentInstance.content.set('new string')
                fixture.componentInstance.status.set('success')
                fixture.componentInstance.icon.set('home')
                fixture.componentInstance.position.set(NbPosition.LEFT)

                fixture.detectChanges()

                expect(componentSpy).toHaveBeenCalledTimes(1)
                expect(componentSpy).toHaveBeenCalledWith(NbTooltipComponent)
                expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button())
                expect(hostSpy).toHaveBeenCalledTimes(1)
                expect(offsetSpy).toHaveBeenCalledTimes(1)
                expect(offsetSpy).toHaveBeenCalledWith(8)
                expect(positionSpy).toHaveBeenCalledTimes(3)
                expect(positionSpy).toHaveBeenCalledWith(NbPosition.LEFT)
                expect(triggerSpy).toHaveBeenCalledTimes(3)
                expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.CLICK)
                expect(adjustmentSpy).toHaveBeenCalledTimes(3)
                expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.HORIZONTAL)
                expect(contentSpy).toHaveBeenCalledTimes(3)
                expect(contentSpy).toHaveBeenCalledWith('new string')
                expect(contextSpy).toHaveBeenCalledTimes(3)
                expect(contextSpy).toHaveBeenCalledWith({ id: expect.any(String), status: 'success', icon: 'home' })
                expect(buildSpy).toHaveBeenCalledTimes(1)
                expect(rebuildSpy).toHaveBeenCalledTimes(2)
            })

            it('should accept different content', () => {
                const contentSpy = vi.spyOn(overlayHandler, 'content')

                fixture = TestBed.createComponent(NbTooltipBindingsTestComponent)
                fixture.detectChanges()

                fixture.componentInstance.content.set('new string')
                fixture.detectChanges()
                expect(contentSpy).toHaveBeenCalledTimes(3)
                expect(contentSpy).toHaveBeenCalledWith('new string')
            })

            it('should set overlay config', () => {
                const tooltipClass = 'custom-popover-class'
                const overlayConfigSpy = vi.spyOn(overlayHandler, 'overlayConfig')

                fixture = TestBed.createComponent(NbTooltipBindingsTestComponent)
                fixture.componentInstance.tooltipClass.set(tooltipClass)
                fixture.detectChanges()

                expect(overlayConfigSpy).toHaveBeenCalledWith(expect.objectContaining({ panelClass: tooltipClass }))
            })
        })

        describe('instance tooltip', () => {
            let fixture: ComponentFixture<NbTooltipInstanceTestComponent>

            afterEach(() => {
                fixture.destroy()
            })

            it('should rebuild', () => {
                const componentSpy = vi.spyOn(overlayHandler, 'componentType')
                const hostSpy = vi.spyOn(overlayHandler, 'host')
                const positionSpy = vi.spyOn(overlayHandler, 'position')
                const triggerSpy = vi.spyOn(overlayHandler, 'trigger')
                const adjustmentSpy = vi.spyOn(overlayHandler, 'adjustment')
                const contentSpy = vi.spyOn(overlayHandler, 'content')
                const contextSpy = vi.spyOn(overlayHandler, 'context')
                const offsetSpy = vi.spyOn(overlayHandler, 'offset')
                const buildSpy = vi.spyOn(overlayHandler, 'build')
                const rebuildSpy = vi.spyOn(overlayHandler, 'rebuild')

                fixture = TestBed.createComponent(NbTooltipInstanceTestComponent)
                fixture.detectChanges()

                fixture.componentInstance.adjustment.set(NbAdjustment.HORIZONTAL)
                fixture.componentInstance.trigger.set(NbTrigger.CLICK)
                fixture.componentInstance.content.set('new string')
                fixture.componentInstance.status.set('success')
                fixture.componentInstance.icon.set('home')
                fixture.componentInstance.position.set(NbPosition.LEFT)

                fixture.detectChanges()

                expect(componentSpy).toHaveBeenCalledTimes(1)
                expect(componentSpy).toHaveBeenCalledWith(NbTooltipComponent)
                expect(hostSpy).toHaveBeenCalledWith(fixture.componentInstance.button())
                expect(hostSpy).toHaveBeenCalledTimes(1)
                expect(positionSpy).toHaveBeenCalledTimes(3)
                expect(positionSpy).toHaveBeenCalledWith(NbPosition.LEFT)
                expect(triggerSpy).toHaveBeenCalledTimes(3)
                expect(triggerSpy).toHaveBeenCalledWith(NbTrigger.CLICK)
                expect(offsetSpy).toHaveBeenCalledTimes(1)
                expect(offsetSpy).toHaveBeenCalledWith(8)
                expect(adjustmentSpy).toHaveBeenCalledTimes(3)
                expect(adjustmentSpy).toHaveBeenCalledWith(NbAdjustment.HORIZONTAL)
                expect(contentSpy).toHaveBeenCalledTimes(3)
                expect(contentSpy).toHaveBeenCalledWith('new string')
                expect(contextSpy).toHaveBeenCalledTimes(3)
                expect(contextSpy).toHaveBeenCalledWith({ id: expect.any(String), status: 'success', icon: 'home' })
                expect(buildSpy).toHaveBeenCalledTimes(1)
                expect(rebuildSpy).toHaveBeenCalledTimes(2)
            })
        })
    })
})
