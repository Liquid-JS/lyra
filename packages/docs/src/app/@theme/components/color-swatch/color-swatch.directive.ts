import { Directive, ElementRef, AfterViewInit, inject } from '@angular/core'

@Directive({ selector: '[ngdColorSwatch]' })
export class NgdColorSwatchDirective implements AfterViewInit {
    private readonly el = inject(ElementRef)

    ngAfterViewInit() {
        this.el.nativeElement.innerHTML = this.el.nativeElement.innerHTML
            .replace(/(#[a-f0-9]{6}|rgba.*?\))/ig, '$&<span class="color-swatch" style="background: $&"></span>')
        this.el.nativeElement.innerHTML = this.el.nativeElement.innerHTML.replace(/,/g, ', ')
    }
}
