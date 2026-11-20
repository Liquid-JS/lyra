import type { NgdAreaEntry } from './app/docs.model';

export const structure: NgdAreaEntry[] = [
  {
    type: 'area',
    name: 'Docs',
    path: 'docs',
    children: [
      {
        type: 'section',
        name: 'Getting Started',
        children: [
          {
            type: 'page',
            name: 'What is Lyra?',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'getting-started/what-is-lyra.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Where to start?',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'getting-started/where-to-start.md',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Guides',
        children: [
          {
            type: 'page',
            name: 'Install Lyra',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'guides/install.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Create Lyra Page',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'guides/create-page.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Backend integration',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'guides/backend-integration.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Stored State',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'guides/stored-state.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Localization',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'guides/localization.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Server deployment',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'guides/server-deployment.md',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Migration',
        children: [
          {
            type: 'page',
            name: 'General Instructions',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'migration/instructions.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Migrating from Nebular',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'migration/from-nebular.md',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Usability',
        children: [
          {
            type: 'page',
            name: 'Right-to-left (RTL)',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'usability/rtl.md',
              },
              {
                type: 'block',
                block: 'component',
                source: 'NbLayoutDirectionService',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'area',
    name: 'Components',
    path: 'components',
    children: [
      {
        type: 'page',
        name: 'All Components',
        description:
          'Every Lyra component, grouped as the menu groups them, each with its overview, API, theme and examples.',
        children: [
          {
            type: 'block',
            block: 'components-overview',
          },
        ],
      },
      {
        type: 'section',
        name: 'Global',
        children: [
          {
            type: 'tabs',
            name: 'Layout',
            icon: 'layout.svg',
            source: [
              'NbLayoutComponent',
              'NbLayoutHeaderComponent',
              'NbLayoutColumnComponent',
              'NbLayoutFooterComponent',
              'NbLtrDirective',
              'NbRtlDirective',
            ],
          },
          {
            type: 'tabs',
            name: 'Card',
            icon: 'card.svg',
            source: [
              'NbCardComponent',
              'NbCardHeaderComponent',
              'NbCardBodyComponent',
              'NbCardFooterComponent',
              'NbCardActionsComponent',
              'NbCardLinkDirective',
            ],
          },
          {
            type: 'tabs',
            name: 'Flip Card',
            icon: 'flip.svg',
            source: ['NbFlipCardComponent', 'NbCardFrontComponent', 'NbCardBackComponent'],
          },
          {
            type: 'tabs',
            name: 'Reveal Card',
            icon: 'reveal.svg',
            source: ['NbRevealCardComponent', 'NbCardFrontComponent', 'NbCardBackComponent'],
          },
          {
            type: 'tabs',
            name: 'Stepper',
            icon: 'stepper.svg',
            source: ['NbStepperComponent', 'NbStepComponent', 'NbStepperNextDirective', 'NbStepperPreviousDirective'],
          },
          {
            type: 'tabs',
            name: 'Accordion',
            icon: 'accordion.svg',
            source: [
              'NbAccordionComponent',
              'NbAccordionItemComponent',
              'NbAccordionItemHeaderComponent',
              'NbAccordionItemBodyComponent',
            ],
          },
          {
            type: 'tabs',
            name: 'List',
            icon: 'list.svg',
            source: [
              'NbListComponent',
              'NbListItemComponent',
              'NbListItemTitleComponent',
              'NbListItemDescriptionComponent',
              'NbListItemActionsComponent',
              'NbListItemLinkDirective',
            ],
          },
          {
            type: 'tabs',
            name: 'Infinite List',
            icon: 'infinite-scroll.svg',
            source: ['NbInfiniteListDirective', 'NbListPageTrackerDirective'],
          },
        ],
      },
      {
        type: 'section',
        name: 'Navigation',
        children: [
          {
            type: 'tabs',
            name: 'Sidebar',
            icon: 'sidebar.svg',
            source: ['NbSidebarComponent', 'NbSidebarHeaderComponent', 'NbSidebarFooterComponent', 'NbSidebarService'],
          },
          {
            type: 'tabs',
            name: 'Menu',
            icon: 'menu.svg',
            source: ['NbMenuComponent', 'NbMenuItem', 'NbMenuService'],
          },
          {
            type: 'tabs',
            name: 'Tabs',
            icon: 'tab.svg',
            source: [
              'NbTabsetComponent',
              'NbTabComponent',
              'NbTabTitleDirective',
              'NbTabContentDirective',
              'NbRouteTabsetComponent',
            ],
          },
          {
            type: 'tabs',
            name: 'Actions',
            icon: 'actions.svg',
            source: ['NbActionsComponent', 'NbActionComponent'],
          },
          {
            type: 'tabs',
            name: 'Breadcrumbs',
            icon: 'breadcrumbs.svg',
            source: ['NbBreadcrumbsComponent', 'NbBreadcrumbComponent', 'NbBreadcrumbSeparatorDirective'],
          },
          {
            type: 'tabs',
            name: 'Table of Contents',
            icon: 'table-of-contents.svg',
            source: ['NbTocComponent'],
          },
        ],
      },
      {
        type: 'section',
        name: 'Forms',
        children: [
          {
            type: 'tabs',
            name: 'Input',
            icon: 'input.svg',
            source: ['NbInputDirective', 'NbNumberInputDirective', 'NbFormFieldComponent', 'NbPrefixDirective', 'NbSuffixDirective'],
          },
          {
            type: 'tabs',
            name: 'Input Group',
            icon: 'input-group.svg',
            source: ['NbInputGroupComponent'],
          },
          {
            type: 'tabs',
            name: 'Validation',
            icon: 'validation.svg',
            source: [
              'NbValidationErrorsComponent',
              'NbValidationDirective',
              'NbLabelComponent',
              'NbValidationErrorDirective',
              'NbValidationErrorsPipe',
              'NbValidationMessagePipe',
            ],
          },
          {
            type: 'tabs',
            name: 'File Drop',
            icon: 'file-drop.svg',
            source: ['NbFileDropComponent', 'NbFileDropPreviewDirective'],
          },
          {
            type: 'tabs',
            name: 'Button',
            icon: 'button.svg',
            source: ['NbButtonComponent'],
          },
          {
            type: 'tabs',
            name: 'Button Group',
            icon: 'button-group.svg',
            source: ['NbButtonGroupComponent', 'NbButtonToggleDirective'],
          },
          {
            type: 'tabs',
            name: 'Checkbox',
            icon: 'checkbox.svg',
            source: ['NbCheckboxComponent'],
          },
          {
            type: 'tabs',
            name: 'Toggle',
            icon: 'toggle.svg',
            source: ['NbToggleComponent'],
          },
          {
            type: 'tabs',
            name: 'Radio',
            icon: 'radio.svg',
            source: ['NbRadioComponent', 'NbRadioGroupComponent'],
          },
          {
            type: 'tabs',
            name: 'Select',
            icon: 'select.svg',
            source: [
              'NbSelectComponent',
              'NbOptionComponent',
              'NbOptionListComponent',
              'NbOptionGroupComponent',
              'NbOptionNestedComponent',
            ],
          },
          {
            type: 'tabs',
            name: 'Autocomplete',
            icon: 'autocomplete.svg',
            source: [
              'NbAutocompleteDirective',
              'NbAutocompleteComponent',
              'NbOptionComponent',
              'NbOptionListComponent',
              'NbOptionGroupComponent',
            ],
          },
          {
            type: 'tabs',
            name: 'Datepicker',
            icon: 'datepicker.svg',
            source: [
              'NbDatepickerDirective',
              'NbDatepickerComponent',
              'NbRangepickerComponent',
              'NbDateTimePickerComponent',
            ],
          },
          {
            type: 'tabs',
            name: 'Timepicker',
            icon: 'timepicker.svg',
            source: ['NbTimePickerDirective', 'NbTimePickerComponent'],
          },
          {
            type: 'tabs',
            name: 'Tag',
            icon: 'tag.svg',
            source: ['NbTagListComponent', 'NbTagInputDirective', 'NbTagComponent'],
          },
        ],
      },
      {
        type: 'section',
        name: 'Modals & Overlays',
        children: [
          {
            type: 'tabs',
            name: 'Popover',
            icon: 'popover.svg',
            source: ['NbPopoverDirective', 'NbPopoverComponent'],
          },
          {
            type: 'tabs',
            name: 'Context Menu',
            icon: 'context-menu.svg',
            source: ['NbContextMenuDirective'],
          },
          {
            type: 'tabs',
            name: 'Dialog',
            icon: 'dialog.svg',
            source: ['NbDialogService', 'NbDialogRef', 'NbDialogConfig'],
          },
          {
            type: 'tabs',
            name: 'Toastr',
            icon: 'toastr.svg',
            source: ['NbToastrService', 'NbToastComponent', 'NbToastrConfig'],
          },
          {
            type: 'tabs',
            name: 'Tooltip',
            icon: 'tooltip.svg',
            source: ['NbTooltipDirective', 'NbTooltipComponent'],
          },
          {
            type: 'tabs',
            name: 'Window',
            icon: 'collapsable.svg',
            source: ['NbWindowService', 'NbWindowRef', 'NbWindowConfig'],
          },
          {
            type: 'tabs',
            name: 'Overlay Host',
            icon: 'overlay-host.svg',
            source: ['NbOverlayHostDirective'],
          },
        ],
      },
      {
        type: 'section',
        name: 'More',
        children: [
          {
            type: 'tabs',
            name: 'Global Search',
            icon: 'search.svg',
            source: ['NbSearchComponent', 'NbSearchService'],
          },
          {
            type: 'tabs',
            name: 'User (Avatar)',
            icon: 'user.svg',
            source: ['NbUserComponent'],
          },
          {
            type: 'tabs',
            name: 'Theme Select',
            icon: 'theme-select.svg',
            source: ['NbThemeSelectComponent', 'NbContentSizeSwitcherComponent', 'NbThemeService'],
          },
          {
            type: 'tabs',
            name: 'Alert',
            icon: 'alert.svg',
            source: ['NbAlertComponent'],
          },
          {
            type: 'tabs',
            name: 'Icon',
            icon: 'icon.svg',
            source: ['NbIconComponent', 'NbIconLibraries'],
          },
          {
            type: 'tabs',
            name: 'Spinner',
            icon: 'spinner.svg',
            source: ['NbSpinnerDirective', 'NbSpinnerComponent'],
          },
          {
            type: 'tabs',
            name: 'Progress Bar',
            icon: 'progress-bar.svg',
            source: ['NbProgressBarComponent'],
          },
          {
            type: 'tabs',
            name: 'Badge',
            icon: 'badge.svg',
            source: ['NbBadgeComponent'],
          },
          {
            type: 'tabs',
            name: 'Divider',
            icon: 'divider.svg',
            source: ['NbDividerComponent'],
          },
          {
            type: 'tabs',
            name: 'Slider',
            icon: 'slider.svg',
            source: ['NbSliderComponent'],
          },
          {
            type: 'tabs',
            name: 'Skeleton',
            icon: 'skeleton.svg',
            source: ['NbSkeletonDirective'],
          },
          {
            type: 'tabs',
            name: 'Page Indicator',
            icon: 'page-indicator.svg',
            source: ['NbPageIndicatorComponent'],
          },
          {
            type: 'tabs',
            name: 'Chat UI',
            icon: 'chat-ui.svg',
            source: [
              'NbChatComponent',
              'NbChatMessageComponent',
              'NbChatFormComponent',
              'NbChatCustomMessageDirective',
              'NbChatTitleDirective',
            ],
          },
          {
            type: 'tabs',
            name: 'Calendar',
            icon: 'calendar.svg',
            source: ['NbCalendarComponent'],
          },
          {
            type: 'tabs',
            name: 'Calendar Range',
            icon: 'calendar-range.svg',
            source: ['NbCalendarRangeComponent'],
          },
        ],
      },
      {
        type: 'section',
        name: 'CDK',
        children: [
          {
            type: 'tabs',
            name: 'Calendar Kit',
            icon: 'calendar-kit.svg',
            source: ['NbCalendarKitModule'],
          },
        ],
      },
      {
        type: 'section',
        name: 'Data',
        children: [
          {
            type: 'tabs',
            name: 'Table',
            icon: 'table.svg',
            source: [
              'NbTableComponent',
              'NbTableDataSource',
              'NbSelectColumnComponent',
              'NbDetailRowDefDirective',
              'NbExpandRowDirective',
              'NbNoDataRowDirective',
            ],
          },
          {
            type: 'tabs',
            name: 'Tree Grid',
            icon: 'tree-grid.svg',
            source: [
              'NbTreeGridComponent',
              'NbTreeGridPresentationNode',
              'NbTreeGridSortService',
              'NbTreeGridFilterService',
              'NbTreeGridColumnDefDirective',
              'NbTreeGridRowDefDirective',
              'NbTreeGridRowComponent',
              'NbSortDirective',
              'NbSortHeaderComponent',
              'NbSortHeaderIconDirective',
              'NbFilterInputDirective',
              'NbTreeGridRowToggleDirective',
            ],
          },
          {
            type: 'tabs',
            name: 'Pagination',
            icon: 'pagination.svg',
            source: ['NbPaginationComponent'],
          },
        ],
      },
      {
        type: 'section',
        name: 'Services',
        children: [
          {
            type: 'page',
            name: 'LayoutScrollService',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbLayoutScrollService',
              },
              {
                type: 'block',
                block: 'component',
                source: 'NbScrollPosition',
              },
            ],
          },
          {
            type: 'page',
            name: 'LayoutRulerService',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbLayoutRulerService',
              },
              {
                type: 'block',
                block: 'component',
                source: 'NbLayoutDimensions',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'area',
    name: 'Examples',
    path: 'examples',
    children: [
      {
        type: 'page',
        name: 'Example Apps',
        description:
          'Example apps built with Lyra, each in a theme of its own, with their code: a course platform, a booking site, an intranet, a fitness app and more.',
        children: [
          {
            type: 'block',
            block: 'example-gallery',
          },
        ],
      },
    ],
  },
  {
    type: 'area',
    name: 'Icons',
    path: 'icons',
    children: [
      {
        type: 'page',
        name: 'Browse Icons',
        description:
          'Browse the icons Lyra comes with by category, in outline and fill, and download them or copy how to use them.',
        children: [
          {
            type: 'block',
            block: 'icons',
          },
        ],
      },
      {
        type: 'page',
        name: 'Register Icon Packs',
        toc: 'headings',
        children: [
          {
            type: 'block',
            block: 'markdown',
            source: 'guides/custom-icons.md',
          },
        ],
      },
    ],
  },
  {
    type: 'area',
    name: 'Theme',
    path: 'theme',
    children: [
      {
        type: 'page',
        name: 'Theme Editor',
        description:
          'Make a Lyra theme of your own: pick its colours, fonts and corners, see it on real components and example apps, and copy the code to use it.',
        children: [
          {
            type: 'block',
            block: 'theme-editor',
          },
        ],
      },
      {
        type: 'section',
        name: 'Design System',
        children: [
          {
            type: 'page',
            name: 'Design System Intro',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/intro.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Design System Theme',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/theme.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Typography',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/typography.md',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Customization',
        children: [
          {
            type: 'page',
            name: 'Enable Customizable Theme',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/enable-customizable-theme.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Use Theme Variables',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/use-theme-variables.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Style Other Elements',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/other-elements.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Create Custom Theme',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/custom-theme.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Component Defaults',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/component-defaults.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'CSS Custom Properties',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/css-properties.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Enable Multiple Runtime Themes',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/multiple-runtime-themes.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Changing Theme',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'design-system/theme-change.md',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Built-in Themes',
        children: [
          {
            type: 'page',
            name: 'Default Theme',
            children: [
              {
                type: 'block',
                block: 'theme',
                name: 'Default',
                source: 'default',
              },
            ],
          },
          {
            type: 'page',
            name: 'Dark Theme',
            children: [
              {
                type: 'block',
                block: 'theme',
                name: 'Dark',
                source: 'dark',
              },
            ],
          },
          {
            type: 'page',
            name: 'Cosmic Theme',
            children: [
              {
                type: 'block',
                block: 'theme',
                name: 'Cosmic',
                source: 'cosmic',
              },
            ],
          },
          {
            type: 'page',
            name: 'Corporate Theme',
            children: [
              {
                type: 'block',
                block: 'theme',
                name: 'Corporate',
                source: 'corporate',
              },
            ],
          },
          {
            type: 'page',
            name: 'Material Light Theme',
            children: [
              {
                type: 'block',
                block: 'theme',
                name: 'Material light',
                source: 'material-light',
              },
            ],
          },
          {
            type: 'page',
            name: 'Material Dark Theme',
            children: [
              {
                type: 'block',
                block: 'theme',
                name: 'Material dark',
                source: 'material-dark',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Services',
        children: [
          {
            type: 'page',
            name: 'ThemeService',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbThemeService',
              },
            ],
          },
          {
            type: 'page',
            name: 'MediaBreakpoints',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbMediaBreakpointsService',
              },
            ],
          },
          {
            type: 'page',
            name: 'JSThemesRegistry',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbJSThemesRegistry',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'area',
    name: 'Extras',
    path: 'extras',
    children: [
      {
        type: 'section',
        name: 'Components',
        children: [
          {
            type: 'tabs',
            name: 'Markdown Editor',
            icon: 'markdown-editor.svg',
            source: ['NbMarkdownEditorComponent'],
          },
          {
            type: 'tabs',
            name: 'Markdown Viewer',
            icon: 'markdown-viewer.svg',
            source: ['NbMarkdownViewerComponent'],
          },
          {
            type: 'tabs',
            name: 'Phone Input',
            icon: 'phone-input.svg',
            source: ['NbPhoneInputComponent', 'NbPhoneNumberValidatorDirective'],
          },
          {
            type: 'tabs',
            name: 'Input Mask',
            icon: 'input-mask.svg',
            source: ['NbMaskDirective'],
          },
          {
            type: 'tabs',
            name: 'Color Picker',
            icon: 'color-picker.svg',
            source: ['NbColorPickerComponent'],
          },
          {
            type: 'tabs',
            name: 'QR Code',
            icon: 'qr-code.svg',
            source: ['NbQrCodeComponent'],
          },
          {
            type: 'tabs',
            name: 'Video & Audio',
            icon: 'media.svg',
            source: ['NbVideoComponent', 'NbAudioComponent'],
          },
          {
            type: 'tabs',
            name: 'Chart',
            icon: 'chart.svg',
            source: ['NbChartComponent', 'NbLineChartComponent', 'NbBarChartComponent', 'NbPieChartComponent'],
          },
        ],
      },
      {
        type: 'section',
        name: 'Auth',
        children: [
          {
            type: 'page',
            name: 'Introduction',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/intro.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Installation',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/install.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Configuring a Strategy',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/strategy.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Configuring UI',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/ui.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Custom Auth Components',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/custom-ui.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Redirect after Login',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/redirect.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Getting User Token',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/token.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Protecting application routes',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/guard.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Configuring Google OAuth2',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/oauth2.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Configuring Azure OAuth2',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/azure.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Backend API endpoints',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/backend-api.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Firebase Authentication',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'auth/firebase-authentication.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbAuthService',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbAuthService',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbPasswordAuthStrategy',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbPasswordAuthStrategy',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbOAuth2AuthStrategy',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbOAuth2AuthStrategy',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbDummyAuthStrategy',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbDummyAuthStrategy',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbTokenService',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbTokenService',
              },
              {
                type: 'block',
                block: 'component',
                source: 'NbAuthSimpleToken',
              },
              {
                type: 'block',
                block: 'component',
                source: 'NbAuthJWTToken',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbTokenLocalStorage',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbTokenLocalStorage',
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        name: 'Security',
        children: [
          {
            type: 'page',
            name: 'Introduction',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'security/intro.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Installation',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'security/install.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'ACL Configuration & Usage',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'security/acl-configuration.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'Multiple User Roles',
            children: [
              {
                type: 'block',
                block: 'markdown',
                source: 'security/multiple-roles.md',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbAclService',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbAclService',
              },
            ],
          },
          {
            type: 'page',
            name: 'NbAccessChecker',
            children: [
              {
                type: 'block',
                block: 'component',
                source: 'NbAccessChecker',
              },
            ],
          },
        ],
      },
    ],
  },
];
