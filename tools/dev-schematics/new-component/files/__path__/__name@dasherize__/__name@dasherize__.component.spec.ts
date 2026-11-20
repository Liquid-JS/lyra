import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing'

import { <%= classify(className) %>Component } from './<%= dasherize(name) %>.component'

describe('<%= classify(className) %>Component', () => {
    let component: <%= classify(className) %>Component
    let fixture: ComponentFixture<<%= classify(className) %>Component>

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [ <%= classify(className) %>Component ]
        })
        .compileComponents()

        fixture = TestBed.createComponent(<%= classify(className) %>Component)
        component = fixture.componentInstance
        fixture.detectChanges()
    }))

    it('should compile', () => {
        expect(component).toBeTruthy()
    })
})
