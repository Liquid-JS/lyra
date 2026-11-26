import { Routes } from '@angular/router'
import { NbDateService, provideNbDatepicker, provideNbDialog, provideNbTimepicker, provideNbToastr, provideNbWindow } from '@liquid-js/lyr-core'

import { NB_BAR_CHART_PARTS, NB_LINE_CHART_PARTS, NB_PIE_CHART_PARTS, provideNbCharts } from '@liquid-js/lyr-extras/chart'

import { DesignKitShellComponent } from './design-kit-shell.component'
import { FixedTodayDateService } from './specimen'

/** The design kit's specimen pages, one per component, at `/design-kit/<component>`. */
export const DESIGN_KIT_ROUTES: Routes = [
    // A layout is the whole page, so its specimen isn't in the shell's.
    { path: 'layout', loadComponent: () => import('./layout.specimen').then((m) => m.LayoutSpecimenComponent) },
    { path: 'layout-header', loadComponent: () => import('./layout.specimen').then((m) => m.LayoutSpecimenComponent) },
    { path: 'sidebar', loadComponent: () => import('./layout.specimen').then((m) => m.LayoutSpecimenComponent) },
    { path: 'layout-footer', loadComponent: () => import('./layout.specimen').then((m) => m.LayoutSpecimenComponent) },
    {
        path: '',
        component: DesignKitShellComponent,
        children: [
            { path: 'button', loadComponent: () => import('./button.specimen').then((m) => m.ButtonSpecimenComponent) },
            { path: 'icon-button', loadComponent: () => import('./button.specimen').then((m) => m.ButtonSpecimenComponent) },
            { path: 'input', loadComponent: () => import('./input.specimen').then((m) => m.InputSpecimenComponent) },
            { path: 'textarea', loadComponent: () => import('./textarea.specimen').then((m) => m.TextareaSpecimenComponent) },
            { path: 'checkbox', loadComponent: () => import('./checkbox.specimen').then((m) => m.CheckboxSpecimenComponent) },
            { path: 'radio', loadComponent: () => import('./radio.specimen').then((m) => m.RadioSpecimenComponent) },
            { path: 'toggle', loadComponent: () => import('./toggle.specimen').then((m) => m.ToggleSpecimenComponent) },
            { path: 'calendar', loadComponent: () => import('./calendar.specimen').then((m) => m.CalendarSpecimenComponent) },
            { path: 'calendar-cell', loadComponent: () => import('./calendar-cell.specimen').then((m) => m.CalendarCellSpecimenComponent) },
            {
                path: 'picker',
                // Overlays are made outside the page's injector, so the fixed today is the route's.
                providers: [provideNbDatepicker(), provideNbTimepicker(), { provide: NbDateService, useClass: FixedTodayDateService }],
                loadComponent: () => import('./picker.specimen').then((m) => m.PickerSpecimenComponent)
            },
            { path: 'color-picker', loadComponent: () => import('./color-picker.specimen').then((m) => m.ColorPickerSpecimenComponent) },
            { path: 'phone-input', loadComponent: () => import('./phone-input.specimen').then((m) => m.PhoneInputSpecimenComponent) },
            { path: 'breadcrumbs', loadComponent: () => import('./breadcrumbs.specimen').then((m) => m.BreadcrumbsSpecimenComponent) },
            { path: 'pagination', loadComponent: () => import('./pagination.specimen').then((m) => m.PaginationSpecimenComponent) },
            { path: 'page-indicator', loadComponent: () => import('./page-indicator.specimen').then((m) => m.PageIndicatorSpecimenComponent) },
            { path: 'tabset', loadComponent: () => import('./tabset.specimen').then((m) => m.TabsetSpecimenComponent) },
            { path: 'actions', loadComponent: () => import('./actions.specimen').then((m) => m.ActionsSpecimenComponent) },
            { path: 'action', loadComponent: () => import('./actions.specimen').then((m) => m.ActionsSpecimenComponent) },
            { path: 'stepper', loadComponent: () => import('./stepper.specimen').then((m) => m.StepperSpecimenComponent) },
            { path: 'stepper-step', loadComponent: () => import('./stepper-step.specimen').then((m) => m.StepperStepSpecimenComponent) },
            { path: 'menu', loadComponent: () => import('./menu.specimen').then((m) => m.MenuSpecimenComponent) },
            { path: 'context-menu', loadComponent: () => import('./menu.specimen').then((m) => m.MenuSpecimenComponent) },
            { path: 'route-tabset', loadComponent: () => import('./route-tabset.specimen').then((m) => m.RouteTabsetSpecimenComponent) },
            { path: 'toc', loadComponent: () => import('./toc.specimen').then((m) => m.TocSpecimenComponent) },
            { path: 'progress-bar', loadComponent: () => import('./progress-bar.specimen').then((m) => m.ProgressBarSpecimenComponent) },
            { path: 'spinner', loadComponent: () => import('./spinner.specimen').then((m) => m.SpinnerSpecimenComponent) },
            { path: 'skeleton', loadComponent: () => import('./skeleton.specimen').then((m) => m.SkeletonSpecimenComponent) },
            { path: 'list', loadComponent: () => import('./list.specimen').then((m) => m.ListSpecimenComponent) },
            // The parts larger components are made of, all on one page.
            { path: 'menu-item', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'tab', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'table-header-cell', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'table-cell', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'list-item', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'card-header', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'card-body', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'card-footer', loadComponent: () => import('./parts.specimen').then((m) => m.PartsSpecimenComponent) },
            { path: 'accordion', loadComponent: () => import('./accordion.specimen').then((m) => m.AccordionSpecimenComponent) },
            { path: 'user', loadComponent: () => import('./user.specimen').then((m) => m.UserSpecimenComponent) },
            { path: 'divider', loadComponent: () => import('./divider.specimen').then((m) => m.DividerSpecimenComponent) },
            { path: 'tooltip', loadComponent: () => import('./tooltip.specimen').then((m) => m.TooltipSpecimenComponent) },
            { path: 'popover', loadComponent: () => import('./tooltip.specimen').then((m) => m.TooltipSpecimenComponent) },
            ...['toast', 'dialog', 'window'].map((path) => ({
                path,
                providers: [provideNbToastr(), provideNbDialog(), provideNbWindow()],
                loadComponent: () => import('./notification.specimen').then((m) => m.NotificationSpecimenComponent)
            })),
            ...['table', 'tree-grid', 'chat'].map((path) => ({ path, loadComponent: () => import('./data.specimen').then((m) => m.DataSpecimenComponent) })),
            ...['markdown-viewer', 'markdown-editor', 'qr-code', 'chart', 'audio', 'video'].map((path) => ({
                path,
                // The chart types the chart showcase draws.
                providers: [provideNbCharts(...NB_LINE_CHART_PARTS, ...NB_BAR_CHART_PARTS, ...NB_PIE_CHART_PARTS)],
                loadComponent: () => import('./extras.specimen').then((m) => m.ExtrasSpecimenComponent)
            })),
            { path: 'select', loadComponent: () => import('./select.specimen').then((m) => m.SelectSpecimenComponent) },
            { path: 'form-field', loadComponent: () => import('./form-field.specimen').then((m) => m.FormFieldSpecimenComponent) },
            { path: 'field', loadComponent: () => import('./field.specimen').then((m) => m.FieldSpecimenComponent) },
            { path: 'alert', loadComponent: () => import('./alert.specimen').then((m) => m.AlertSpecimenComponent) },
            { path: 'badge', loadComponent: () => import('./badge.specimen').then((m) => m.BadgeSpecimenComponent) },
            { path: 'card', loadComponent: () => import('./card.specimen').then((m) => m.CardSpecimenComponent) },
            { path: 'tag', loadComponent: () => import('./tag.specimen').then((m) => m.TagSpecimenComponent) },
            { path: 'button-group', loadComponent: () => import('./button-group.specimen').then((m) => m.ButtonGroupSpecimenComponent) },
            { path: 'slider', loadComponent: () => import('./slider.specimen').then((m) => m.SliderSpecimenComponent) },
            { path: 'file-drop', loadComponent: () => import('./file-drop.specimen').then((m) => m.FileDropSpecimenComponent) }
        ]
    }
]
