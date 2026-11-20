import { Routes } from '@angular/router';

export const WITH_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./playground-layout.component').then((m) => m.PlaygroundLayoutComponent),
    children: [
      {
        path: 'accordion',
        loadChildren: () => import('./accordion/accordion.routes').then((m) => m.ACCORDION_ROUTES),
      },
      {
        path: 'action',
        loadChildren: () => import('./action/action.routes').then((m) => m.ACTION_ROUTES),
      },
      {
        path: 'alert',
        loadChildren: () => import('./alert/alert.routes').then((m) => m.ALERT_ROUTES),
      },
      {
        path: 'autocomplete',
        loadChildren: () => import('./autocomplete/autocomplete.routes').then((m) => m.AUTOCOMPLETE_ROUTES),
      },
      {
        path: 'badge',
        loadChildren: () => import('./badge/badge.routes').then((m) => m.BADGE_ROUTES),
      },
      {
        path: 'button',
        loadChildren: () => import('./button/button.routes').then((m) => m.BUTTON_ROUTES),
      },
      {
        path: 'button-group',
        loadChildren: () => import('./button-group/button-group.routes').then((m) => m.BUTTON_GROUP_ROUTES),
      },
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.routes').then((m) => m.CALENDAR_ROUTES),
      },
      {
        path: 'calendar-kit',
        loadChildren: () => import('./calendar-kit/calendar-kit.routes').then((m) => m.CALENDAR_KIT_ROUTES),
      },
      {
        path: 'card',
        loadChildren: () => import('./card/card.routes').then((m) => m.CARD_ROUTES),
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.routes').then((m) => m.CHAT_ROUTES),
      },
      {
        path: 'checkbox',
        loadChildren: () => import('./checkbox/checkbox.routes').then((m) => m.CHECKBOX_ROUTES),
      },
      {
        path: 'datepicker',
        loadChildren: () => import('./datepicker/datepicker.routes').then((m) => m.DATEPICKER_ROUTES),
      },
      {
        path: 'datepicker-with-format',
        loadChildren: () =>
          import('./datepicker-with-format/datepicker-with-format.routes').then((m) => m.DATEPICKER_WITH_FORMAT_ROUTES),
      },
      {
        path: 'timepicker',
        loadChildren: () => import('./timepicker/timepicker.routes').then((m) => m.TIMEPICKER_ROUTES),
      },
      {
        path: 'dialog',
        loadChildren: () => import('./dialog/dialog.routes').then((m) => m.DIALOG_ROUTES),
      },
      {
        path: 'flip-card',
        loadChildren: () => import('./flip-card/flip-card.routes').then((m) => m.FLIP_CARD_ROUTES),
      },
      {
        path: 'infinite-list',
        loadChildren: () => import('./infinite-list/infinite-list.routes').then((m) => m.INFINITE_LIST_ROUTES),
      },
      {
        path: 'input',
        loadChildren: () => import('./input/input.routes').then((m) => m.INPUT_ROUTES),
      },
      {
        path: 'list',
        loadChildren: () => import('./list/list.routes').then((m) => m.LIST_ROUTES),
      },
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.routes').then((m) => m.MENU_ROUTES),
      },
      {
        path: 'overlay',
        loadChildren: () => import('./overlay/overlay.routes').then((m) => m.OVERLAY_ROUTES),
      },
      {
        path: 'popover',
        loadChildren: () => import('./popover/popover.routes').then((m) => m.POPOVER_ROUTES),
      },
      {
        path: 'progress-bar',
        loadChildren: () => import('./progress-bar/progress-bar.routes').then((m) => m.PROGRESS_BAR_ROUTES),
      },
      {
        path: 'radio',
        loadChildren: () => import('./radio/radio.routes').then((m) => m.RADIO_ROUTES),
      },
      {
        path: 'reveal-card',
        loadChildren: () => import('./reveal-card/reveal-card.routes').then((m) => m.REVEAL_CARD_ROUTES),
      },
      {
        path: 'select',
        loadChildren: () => import('./select/select.routes').then((m) => m.SELECT_ROUTES),
      },
      {
        path: 'spinner',
        loadChildren: () => import('./spinner/spinner.routes').then((m) => m.SPINNER_ROUTES),
      },
      {
        path: 'stepper',
        loadChildren: () => import('./stepper/stepper.routes').then((m) => m.STEPPER_ROUTES),
      },
      {
        path: 'tag',
        loadChildren: () => import('./tag/tag.routes').then((m) => m.TAG_ROUTES),
      },
      {
        path: 'tabset',
        loadChildren: () => import('./tabset/tabset.routes').then((m) => m.TABSET_ROUTES),
      },
      {
        path: 'toastr',
        loadChildren: () => import('./toastr/toastr.routes').then((m) => m.TOASTR_ROUTES),
      },
      {
        path: 'tooltip',
        loadChildren: () => import('./tooltip/tooltip.routes').then((m) => m.TOOLTIP_ROUTES),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'window',
        loadChildren: () => import('./window/window.routes').then((m) => m.WINDOW_ROUTES),
      },
      {
        path: 'oauth2',
        loadChildren: () => import('./oauth2/oauth2.routes').then((m) => m.OAUTH2_ROUTES),
      },
      {
        path: 'oauth2-password',
        loadChildren: () => import('./oauth2-password/oauth2-password.routes').then((m) => m.OAUTH2_PASSWORD_ROUTES),
      },
      {
        path: 'tree-grid',
        loadChildren: () => import('./tree-grid/tree-grid.routes').then((m) => m.TREE_GRID_ROUTES),
      },
      {
        path: 'icon',
        loadChildren: () => import('./icon/icon.routes').then((m) => m.ICON_ROUTES),
      },
      {
        path: 'toggle',
        loadChildren: () => import('./toggle/toggle.routes').then((m) => m.TOGGLE_ROUTES),
      },
      {
        path: 'form-field',
        loadChildren: () => import('./form-field/form-field.routes').then((m) => m.FORM_FIELD_ROUTES),
      },
      {
        path: 'input-group',
        loadChildren: () => import('./input-group/input-group.routes').then((m) => m.INPUT_GROUP_ROUTES),
      },
      {
        path: 'validation',
        loadChildren: () => import('./validation/validation.routes').then((m) => m.VALIDATION_ROUTES),
      },
      {
        path: 'file-drop',
        loadChildren: () => import('./file-drop/file-drop.routes').then((m) => m.FILE_DROP_ROUTES),
      },
      {
        path: 'pagination',
        loadChildren: () => import('./pagination/pagination.routes').then((m) => m.PAGINATION_ROUTES),
      },
      {
        path: 'breadcrumbs',
        loadChildren: () => import('./breadcrumbs/breadcrumbs.routes').then((m) => m.BREADCRUMBS_ROUTES),
      },
      {
        path: 'toc',
        loadChildren: () => import('./toc/toc.routes').then((m) => m.TOC_ROUTES),
      },
      {
        path: 'qr-code',
        loadChildren: () => import('./qr-code/qr-code.routes').then((m) => m.QR_CODE_ROUTES),
      },
      {
        path: 'media',
        loadChildren: () => import('./media/media.routes').then((m) => m.MEDIA_ROUTES),
      },
      {
        path: 'markdown',
        loadChildren: () => import('./markdown/markdown.routes').then((m) => m.MARKDOWN_ROUTES),
      },
      {
        path: 'phone-input',
        loadChildren: () => import('./phone-input/phone-input.routes').then((m) => m.PHONE_INPUT_ROUTES),
      },
      {
        path: 'mask',
        loadChildren: () => import('./mask/mask.routes').then((m) => m.MASK_ROUTES),
      },
      {
        path: 'color-picker',
        loadChildren: () => import('./color-picker/color-picker.routes').then((m) => m.COLOR_PICKER_ROUTES),
      },
      {
        path: 'chart',
        loadChildren: () => import('./chart/chart.routes').then((m) => m.CHART_ROUTES),
      },
      {
        path: 'theme-select',
        loadChildren: () => import('./theme-select/theme-select.routes').then((m) => m.THEME_SELECT_ROUTES),
      },
      {
        path: 'theme-editor',
        loadChildren: () => import('./theme-editor/theme-editor.routes').then((m) => m.THEME_EDITOR_ROUTES),
      },
      {
        path: 'divider',
        loadChildren: () => import('./divider/divider.routes').then((m) => m.DIVIDER_ROUTES),
      },
      {
        path: 'slider',
        loadChildren: () => import('./slider/slider.routes').then((m) => m.SLIDER_ROUTES),
      },
      {
        path: 'skeleton',
        loadChildren: () => import('./skeleton/skeleton.routes').then((m) => m.SKELETON_ROUTES),
      },
      {
        path: 'page-indicator',
        loadChildren: () => import('./page-indicator/page-indicator.routes').then((m) => m.PAGE_INDICATOR_ROUTES),
      },
      {
        path: 'table',
        loadChildren: () => import('./table/table.routes').then((m) => m.TABLE_ROUTES),
      },
    ],
  },
];
