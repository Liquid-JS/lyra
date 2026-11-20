import { Component, OnInit, OnDestroy, computed, input, linkedSignal } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { takeUntil, skip, distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { NbCardComponent, NbCardBodyComponent, NbInputDirective, NbIconComponent } from '@liquid-js/lyr-core'
import { RouterLink } from '@angular/router'
import { NgdColorSwatchDirective } from '../../../@theme/components/color-swatch/color-swatch.directive'
import { NgdThemeBlock } from '../../../docs.model'

@Component({
    selector: 'ngd-theme-block',
    styleUrls: ['./theme-block.component.scss'],
    templateUrl: './theme-block.component.html',
    imports: [
        NbCardComponent,
        NbCardBodyComponent,
        NbInputDirective,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        NgdColorSwatchDirective,
        NbIconComponent
    ]
})
export class NgdThemeComponent implements OnInit, OnDestroy {
    searchControl = new FormControl()

    private destroy$ = new Subject<void>()

    readonly block = input.required<NgdThemeBlock>()

    readonly themeName = computed(() => this.block().source.name)
    readonly parentThemeName = computed(() => this.block().source.parent)
    readonly properties = computed(() => Object.entries(this.block().source.data)
        .map(([key, data]) => {
            const propertyValue = data.value
            return {
                name: key,
                value: Array.isArray(propertyValue) ? propertyValue.join(' ') : propertyValue,
                parents: data.parents
            }
        }))
    readonly filtered = linkedSignal(() => this.properties())

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(skip(1), distinctUntilChanged(), debounceTime(300), takeUntil(this.destroy$))
            .subscribe((value: string) => {
                this.filtered.set(this.properties()
                    .filter(({ name }) => name.toLowerCase().includes(value.toLowerCase())))
            })
    }

    ngOnDestroy() {
        this.destroy$.next()
        this.destroy$.complete()
    }
}
