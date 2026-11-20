export interface ComponentLink {
    path: string
    name?: string
    component?: string
    link?: string
    children?: ComponentLink[]
}

export const PLAYGROUND_COMPONENTS: ComponentLink[] = [
    {
        path: 'accordion',
        children: [
            {
                path: 'accordion-multi.component',
                link: '/accordion/accordion-multi.component',
                component: 'AccordionMultiComponent',
                name: 'Accordion Multi'
            },
            {
                path: 'accordion-showcase.component',
                link: '/accordion/accordion-showcase.component',
                component: 'AccordionShowcaseComponent',
                name: 'Accordion Showcase'
            },
            {
                path: 'accordion-test.component',
                link: '/accordion/accordion-test.component',
                component: 'AccordionTestComponent',
                name: 'Accordion Test'
            },
            {
                path: 'accordion-toggle.component',
                link: '/accordion/accordion-toggle.component',
                component: 'AccordionToggleComponent',
                name: 'Accordion Toggle'
            }
        ]
    },
    {
        path: 'action',
        children: [
            {
                path: 'action-badge.component',
                link: '/action/action-badge.component',
                component: 'ActionBadgeComponent',
                name: 'Action Badge'
            },
            {
                path: 'action-showcase.component',
                link: '/action/action-showcase.component',
                component: 'ActionShowcaseComponent',
                name: 'Action Showcase'
            },
            {
                path: 'action-sizes.component',
                link: '/action/action-sizes.component',
                component: 'ActionSizesComponent',
                name: 'Action Sizes'
            },
            {
                path: 'action-test.component',
                link: '/action/action-test.component',
                component: 'ActionTestComponent',
                name: 'Action Test'
            },
            {
                path: 'action-width.component',
                link: '/action/action-width.component',
                component: 'ActionWidthComponent',
                name: 'Action Width'
            },
            {
                path: 'action-dot-mode.component',
                link: '/action/action-dot-mode.component',
                component: 'ActionDotModeComponent',
                name: 'Action Dot Mode'
            }
        ]
    },
    {
        path: 'alert',
        children: [
            {
                path: 'alert-accents.component',
                link: '/alert/alert-accents.component',
                component: 'AlertAccentsComponent',
                name: 'Alert Accents'
            },
            {
                path: 'alert-colors.component',
                link: '/alert/alert-colors.component',
                component: 'AlertColorsComponent',
                name: 'Alert Colors'
            },
            {
                path: 'alert-outline.component',
                link: '/alert/alert-outline.component',
                component: 'AlertOutlineComponent',
                name: 'Alert Outline'
            },
            {
                path: 'alert-showcase.component',
                link: '/alert/alert-showcase.component',
                component: 'AlertShowcaseComponent',
                name: 'Alert Showcase'
            },
            {
                path: 'alert-sizes.component',
                link: '/alert/alert-sizes.component',
                component: 'AlertSizesComponent',
                name: 'Alert Sizes'
            },
            {
                path: 'alert-test.component',
                link: '/alert/alert-test.component',
                component: 'AlertTestComponent',
                name: 'Alert Test'
            }
        ]
    },
    {
        path: 'autocomplete',
        children: [
            {
                path: 'autocomplete-showcase.component',
                link: '/autocomplete/autocomplete-showcase.component',
                component: 'AutocompleteShowcaseComponent',
                name: 'Autocomplete Showcase'
            },
            {
                path: 'autocomplete-form.component',
                link: '/autocomplete/autocomplete-form.component',
                component: 'AutocompleteFormComponent',
                name: 'Autocomplete Form'
            },
            {
                path: 'autocomplete-group.component',
                link: '/autocomplete/autocomplete-group.component',
                component: 'AutocompleteGroupComponent',
                name: 'Autocomplete Group'
            },
            {
                path: 'autocomplete-custom-display.component',
                link: '/autocomplete/autocomplete-custom-display.component',
                component: 'AutocompleteCustomDisplayComponent',
                name: 'Autocomplete Custom Display'
            },
            {
                path: 'autocomplete-active-first.component',
                link: '/autocomplete/autocomplete-active-first.component',
                component: 'AutocompleteActiveFirstComponent',
                name: 'Autocomplete Active First'
            },
            {
                path: 'autocomplete-disabled.component',
                link: '/autocomplete/autocomplete-disabled.component',
                component: 'AutocompleteDisabledComponent',
                name: 'Autocomplete Disabled'
            }
        ]
    },
    {
        path: 'badge',
        children: [
            {
                path: 'badge-showcase.component',
                link: '/badge/badge-showcase.component',
                component: 'BadgeShowcaseComponent',
                name: 'Badge Showcase'
            },
            {
                path: 'badge-inline.component',
                link: '/badge/badge-inline.component',
                component: 'BadgeInlineComponent',
                name: 'Badge Inline'
            }
        ]
    },
    {
        path: 'button',
        children: [
            {
                path: 'button-colors.component',
                link: '/button/button-colors.component',
                component: 'ButtonColorsComponent',
                name: 'Button Colors'
            },
            {
                path: 'button-full-width.component',
                link: '/button/button-full-width.component',
                component: 'ButtonFullWidthComponent',
                name: 'Button Full Width'
            },
            {
                path: 'button-hero.component',
                link: '/button/button-hero.component',
                component: 'ButtonHeroComponent',
                name: 'Button Hero'
            },
            {
                path: 'button-outline.component',
                link: '/button/button-outline.component',
                component: 'ButtonOutlineComponent',
                name: 'Button Outline'
            },
            {
                path: 'button-shapes.component',
                link: '/button/button-shapes.component',
                component: 'ButtonShapesComponent',
                name: 'Button Shapes'
            },
            {
                path: 'button-showcase.component',
                link: '/button/button-showcase.component',
                component: 'ButtonShowcaseComponent',
                name: 'Button Showcase'
            },
            {
                path: 'button-sizes.component',
                link: '/button/button-sizes.component',
                component: 'ButtonSizesComponent',
                name: 'Button Sizes'
            },
            {
                path: 'button-types.component',
                link: '/button/button-types.component',
                component: 'ButtonTypesComponent',
                name: 'Button Types'
            },
            {
                path: 'button-icon.component',
                link: '/button/button-icon.component',
                component: 'ButtonIconComponent',
                name: 'Button Icon'
            },
            {
                path: 'button-interactive.component',
                link: '/button/button-interactive.component',
                component: 'ButtonInteractiveComponent',
                name: 'Button Interactive'
            },
            {
                path: 'button-loading.component',
                link: '/button/button-loading.component',
                component: 'ButtonLoadingComponent',
                name: 'Button Loading'
            }
        ]
    },
    {
        path: 'button-group',
        children: [
            {
                path: 'button-group-showcase.component',
                link: '/button-group/button-group-showcase.component',
                component: 'ButtonGroupShowcaseComponent',
                name: 'Button Group Showcase'
            },
            {
                path: 'button-group-multiple.component',
                link: '/button-group/button-group-multiple.component',
                component: 'ButtonGroupMultipleComponent',
                name: 'Button Group Multiple'
            },
            {
                path: 'button-group-sizes.component',
                link: '/button-group/button-group-sizes.component',
                component: 'ButtonGroupSizesComponent',
                name: 'Button Group Sizes'
            },
            {
                path: 'button-group-appearances.component',
                link: '/button-group/button-group-appearances.component',
                component: 'ButtonGroupAppearancesComponent',
                name: 'Button Group Appearances'
            },
            {
                path: 'button-group-shapes.component',
                link: '/button-group/button-group-shapes.component',
                component: 'ButtonGroupShapesComponent',
                name: 'Button Group Shapes'
            },
            {
                path: 'button-and-button-toggle-groups.component',
                link: '/button-group/button-and-button-toggle-groups.component',
                component: 'ButtonAndButtonToggleGroupsComponent',
                name: 'Button And Button Toggle Groups'
            },
            {
                path: 'button-group-interactive.component',
                link: '/button-group/button-group-interactive.component',
                component: 'ButtonGroupInteractiveComponent',
                name: 'Button Group Interactive'
            },
            {
                path: 'button-group-disabled.component',
                link: '/button-group/button-group-disabled.component',
                component: 'ButtonGroupDisabledComponent',
                name: 'Button Group Disabled'
            },
            {
                path: 'button-group-statuses.component',
                link: '/button-group/button-group-statuses.component',
                component: 'ButtonGroupStatusesComponent',
                name: 'Button Group Statuses'
            },
            {
                path: 'button-group-value-change.component',
                link: '/button-group/button-group-value-change.component',
                component: 'ButtonGroupValueChangeComponent',
                name: 'Button Group Value Change'
            }
        ]
    },
    {
        path: 'calendar',
        children: [
            {
                path: 'calendar-bounding-month.component',
                link: '/calendar/calendar-bounding-month.component',
                component: 'CalendarBoundingMonthComponent',
                name: 'Calendar Bounding Month'
            },
            {
                path: 'calendar-custom-day-cell-showcase.component',
                link: '/calendar/calendar-custom-day-cell-showcase.component',
                component: 'CalendarCustomDayCellShowcaseComponent',
                name: 'Calendar Custom Day Cell Showcase'
            },
            {
                path: 'calendar-filter.component',
                link: '/calendar/calendar-filter.component',
                component: 'CalendarFilterComponent',
                name: 'Calendar Filter'
            },
            {
                path: 'calendar-min-max.component',
                link: '/calendar/calendar-min-max.component',
                component: 'CalendarMinMaxComponent',
                name: 'Calendar Min Max'
            },
            {
                path: 'calendar-range-showcase.component',
                link: '/calendar/calendar-range-showcase.component',
                component: 'CalendarRangeShowcaseComponent',
                name: 'Calendar Range Showcase'
            },
            {
                path: 'calendar-showcase.component',
                link: '/calendar/calendar-showcase.component',
                component: 'CalendarShowcaseComponent',
                name: 'Calendar Showcase'
            },
            {
                path: 'calendar-size.component',
                link: '/calendar/calendar-size.component',
                component: 'CalendarSizeComponent',
                name: 'Calendar Size'
            },
            {
                path: 'calendar-start-view.component',
                link: '/calendar/calendar-start-view.component',
                component: 'CalendarStartViewComponent',
                name: 'Calendar Start View'
            },
            {
                path: 'calendar-without-navigation.component',
                link: '/calendar/calendar-without-navigation.component',
                component: 'CalendarWithoutNavigationComponent',
                name: 'Calendar Without Navigation'
            },
            {
                path: 'calendar-week-number.component',
                link: '/calendar/calendar-week-number.component',
                component: 'CalendarWeekNumberComponent',
                name: 'Calendar Week Number'
            }
        ]
    },
    {
        path: 'calendar-kit',
        children: [
            {
                path: 'calendar-kit-full-calendar.component',
                link: '/calendar-kit/calendar-kit-full-calendar.component',
                component: 'CalendarKitFullCalendarShowcaseComponent',
                name: 'Calendar Kit Full Calendar Showcase'
            }
        ]
    },
    {
        path: 'card',
        children: [
            {
                path: 'card-media.component',
                link: '/card/card-media.component',
                component: 'CardMediaComponent',
                name: 'Card Media'
            },
            {
                path: 'card-accents.component',
                link: '/card/card-accents.component',
                component: 'CardAccentsComponent',
                name: 'Card Accents'
            },
            {
                path: 'card-colors.component',
                link: '/card/card-colors.component',
                component: 'CardColorsComponent',
                name: 'Card Colors'
            },
            {
                path: 'card-full.component',
                link: '/card/card-full.component',
                component: 'CardFullComponent',
                name: 'Card Full'
            },
            {
                path: 'card-showcase.component',
                link: '/card/card-showcase.component',
                component: 'CardShowcaseComponent',
                name: 'Card Showcase'
            },
            {
                path: 'card-sizes.component',
                link: '/card/card-sizes.component',
                component: 'CardSizesComponent',
                name: 'Card Sizes'
            },
            {
                path: 'card-test.component',
                link: '/card/card-test.component',
                component: 'CardTestComponent',
                name: 'Card Test'
            },
            {
                path: 'card-without-body.component',
                link: '/card/card-without-body.component',
                component: 'CardWithoutBodyComponent',
                name: 'Card Without Body'
            },
            {
                path: 'card-sizes-combinations.component',
                link: '/card/card-sizes-combinations.component',
                component: 'CardSizesCombinationsComponent',
                name: 'Card Sizes Combinations'
            },
            {
                path: 'card-actions.component',
                link: '/card/card-actions.component',
                component: 'CardActionsComponent',
                name: 'Card Actions'
            },
            {
                path: 'card-appearances.component',
                link: '/card/card-appearances.component',
                component: 'CardAppearancesComponent',
                name: 'Card Appearances'
            },
            {
                path: 'card-interactive.component',
                link: '/card/card-interactive.component',
                component: 'CardInteractiveComponent',
                name: 'Card Interactive'
            }
        ]
    },
    {
        path: 'chat',
        children: [
            {
                path: 'chat-colors.component',
                link: '/chat/chat-colors.component',
                component: 'ChatColorsComponent',
                name: 'Chat Colors'
            },
            {
                path: 'chat-conversation-showcase.component',
                link: '/chat/chat-conversation-showcase.component',
                component: 'ChatConversationShowcaseComponent',
                name: 'Chat Conversation Showcase'
            },
            {
                path: 'chat-floating.component',
                link: '/chat/chat-floating.component',
                component: 'ChatFloatingComponent',
                name: 'Chat Floating'
            },
            {
                path: 'chat-drop.component',
                link: '/chat/chat-drop.component',
                component: 'ChatDropComponent',
                name: 'Chat Drop'
            },
            {
                path: 'chat-message-types-showcase.component',
                link: '/chat/chat-message-types-showcase.component',
                component: 'ChatMessageTypesShowcaseComponent',
                name: 'Chat Message Types Showcase'
            },
            {
                path: 'chat-showcase.component',
                link: '/chat/chat-showcase.component',
                component: 'ChatShowcaseComponent',
                name: 'Chat Showcase'
            },
            {
                path: 'chat-sizes.component',
                link: '/chat/chat-sizes.component',
                component: 'ChatSizesComponent',
                name: 'Chat Sizes'
            },
            {
                path: 'chat-test.component',
                link: '/chat/chat-test.component',
                component: 'ChatTestComponent',
                name: 'Chat Test'
            },
            {
                path: 'chat-custom-message.component',
                link: '/chat/chat-custom-message.component',
                component: 'ChatCustomMessageComponent',
                name: 'Chat Custom Message'
            },
            {
                path: 'chat-template-title.component',
                link: '/chat/chat-template-title.component',
                component: 'ChatTemplateTitleComponent',
                name: 'Chat Template Title'
            }
        ]
    },
    {
        path: 'checkbox',
        children: [
            {
                path: 'checkbox-disabled.component',
                link: '/checkbox/checkbox-disabled.component',
                component: 'CheckboxDisabledComponent',
                name: 'Checkbox Disabled'
            },
            {
                path: 'checkbox-showcase.component',
                link: '/checkbox/checkbox-showcase.component',
                component: 'CheckboxShowcaseComponent',
                name: 'Checkbox Showcase'
            },
            {
                path: 'checkbox-status.component',
                link: '/checkbox/checkbox-status.component',
                component: 'CheckboxStatusComponent',
                name: 'Checkbox Status'
            },
            {
                path: 'checkbox-test.component',
                link: '/checkbox/checkbox-test.component',
                component: 'CheckboxTestComponent',
                name: 'Checkbox Test'
            },
            {
                path: 'checkbox-indeterminate.component',
                link: '/checkbox/checkbox-indeterminate.component',
                component: 'CheckboxIndeterminateComponent',
                name: 'Checkbox Indeterminate'
            },
            {
                path: 'checkbox-sizes.component',
                link: '/checkbox/checkbox-sizes.component',
                component: 'CheckboxSizesComponent',
                name: 'Checkbox Sizes'
            }
        ]
    },
    {
        path: 'datepicker',
        children: [
            {
                path: 'datepicker-forms.component',
                link: '/datepicker/datepicker-forms.component',
                component: 'DatepickerFormsComponent',
                name: 'Datepicker Forms'
            },
            {
                path: 'datepicker-showcase.component',
                link: '/datepicker/datepicker-showcase.component',
                component: 'DatepickerShowcaseComponent',
                name: 'Datepicker Showcase'
            },
            {
                path: 'date-timepicker-showcase.component',
                link: '/datepicker/date-timepicker-showcase.component',
                component: 'DateTimepickerShowcaseComponent',
                name: 'Date Timepicker Showcase'
            },
            {
                path: 'date-timepicker-single-column.component',
                link: '/datepicker/date-timepicker-single-column.component',
                component: 'DateTimepickerSingleColumnComponent',
                name: 'Date Timepicker Single Column'
            },
            {
                path: 'datepicker-validation.component',
                link: '/datepicker/datepicker-validation.component',
                component: 'DatepickerValidationComponent',
                name: 'Datepicker Validation'
            },
            {
                path: 'rangepicker-showcase.component',
                link: '/datepicker/rangepicker-showcase.component',
                component: 'RangepickerShowcaseComponent',
                name: 'Rangepicker Showcase'
            },
            {
                path: 'datepicker-filter.component',
                link: '/datepicker/datepicker-filter.component',
                component: 'DatepickerFilterComponent',
                name: 'Datepicker Filter'
            },
            {
                path: 'datepicker-picker-mode.component',
                link: '/datepicker/datepicker-picker-mode.component',
                component: 'DatepickerPickerModeComponent',
                name: 'Datepicker Picker Mode'
            }
        ]
    },
    {
        path: 'datepicker-with-format',
        children: [
            {
                path: 'date-timepicker-dynamic-inputs-showcase.component',
                link: '/datepicker-with-format/date-timepicker-dynamic-inputs-showcase.component',
                component: 'DateTimepickerDynamicInputsShowcaseComponent',
                name: 'Date Timepicker Dynamic Inputs Showcase'
            },
            {
                path: 'datepicker-dynamic-inputs-showcase.component',
                link: '/datepicker-with-format/datepicker-dynamic-inputs-showcase.component',
                component: 'DatepickerDynamicInputsShowcaseComponent',
                name: 'Datepicker Dynamic Inputs Showcase'
            },
            {
                path: 'rangepicker-dynamic-inputs-showcase.component',
                link: '/datepicker-with-format/rangepicker-dynamic-inputs-showcase.component',
                component: 'RangepickerDynamicInputsShowcaseComponent',
                name: 'Rangepicker Dynamic Inputs Showcase'
            }
        ]
    },
    {
        path: 'timepicker',
        children: [
            {
                path: 'timepicker-showcase.component',
                link: '/timepicker/timepicker-showcase.component',
                component: 'TimepickerShowcaseComponent',
                name: 'Timepicker Showcase'
            },
            {
                path: 'timepicker-twelve-hours-format.component',
                link: '/timepicker/timepicker-twelve-hours-format.component',
                component: 'TimepickerTwelveHoursFormatComponent',
                name: 'Timepicker Twelve Hours Format'
            },
            {
                path: 'timepicker-single-column.component',
                link: '/timepicker/timepicker-single-column.component',
                component: 'TimepickerSingleColumnComponent',
                name: 'Timepicker Single Column'
            },
            {
                path: 'timepicker-with-seconds.component',
                link: '/timepicker/timepicker-with-seconds.component',
                component: 'TimepickerWithSecondsComponent',
                name: 'Timepicker With Seconds'
            },
            {
                path: 'timepicker-dynamic-inputs-showcase.component',
                link: '/timepicker/timepicker-dynamic-inputs-showcase.component',
                component: 'TimepickerDynamicInputsShowcaseComponent',
                name: 'Timepicker Dynamic Inputs Showcase'
            },
            {
                path: 'timepicker-form-control.component',
                link: '/timepicker/timepicker-form-control.component',
                component: 'TimepickerFormControlComponent',
                name: 'Timepicker Form Control'
            },
            {
                path: 'timepicker-ng-model.component',
                link: '/timepicker/timepicker-ng-model.component',
                component: 'TimepickerNgModelComponent',
                name: 'Timepicker Ng Model'
            },
            {
                path: 'timepicker-validation.component',
                link: '/timepicker/timepicker-validation.component',
                component: 'TimepickerValidationComponent',
                name: 'Timepicker Validation'
            }
        ]
    },
    {
        path: 'dialog',
        children: [
            {
                path: 'dialog-auto-focus.component',
                link: '/dialog/dialog-auto-focus.component',
                component: 'DialogAutoFocusComponent',
                name: 'Dialog Auto Focus'
            },
            {
                path: 'dialog-backdrop-click.component',
                link: '/dialog/dialog-backdrop-click.component',
                component: 'DialogBackdropClickComponent',
                name: 'Dialog Backdrop Click'
            },
            {
                path: 'dialog-esc.component',
                link: '/dialog/dialog-esc.component',
                component: 'DialogEscComponent',
                name: 'Dialog Esc'
            },
            {
                path: 'dialog-has-backdrop.component',
                link: '/dialog/dialog-has-backdrop.component',
                component: 'DialogHasBackdropComponent',
                name: 'Dialog Has Backdrop'
            },
            {
                path: 'dialog-result.component',
                link: '/dialog/dialog-result.component',
                component: 'DialogResultComponent',
                name: 'Dialog Result'
            },
            {
                path: 'dialog-scroll.component',
                link: '/dialog/dialog-scroll.component',
                component: 'DialogScrollComponent',
                name: 'Dialog Scroll'
            },
            {
                path: 'dialog-showcase.component',
                link: '/dialog/dialog-showcase.component',
                component: 'DialogShowcaseComponent',
                name: 'Dialog Showcase'
            },
            {
                path: 'dialog-template.component',
                link: '/dialog/dialog-template.component',
                component: 'DialogTemplateComponent',
                name: 'Dialog Template'
            },
            {
                path: 'dialog-confirm.component',
                link: '/dialog/dialog-confirm.component',
                component: 'DialogConfirmComponent',
                name: 'Dialog Confirm'
            },
            {
                path: 'dialog-position.component',
                link: '/dialog/dialog-position.component',
                component: 'DialogPositionComponent',
                name: 'Dialog Position'
            }
        ]
    },
    {
        path: 'flip-card',
        children: [
            {
                path: 'flip-card-accents.component',
                link: '/flip-card/flip-card-accents.component',
                component: 'FlipCardAccentsComponent',
                name: 'Flip Card Accents'
            },
            {
                path: 'flip-card-colors.component',
                link: '/flip-card/flip-card-colors.component',
                component: 'FlipCardColorsComponent',
                name: 'Flip Card Colors'
            },
            {
                path: 'flip-card-full.component',
                link: '/flip-card/flip-card-full.component',
                component: 'FlipCardFullComponent',
                name: 'Flip Card Full'
            },
            {
                path: 'flip-card-showcase.component',
                link: '/flip-card/flip-card-showcase.component',
                component: 'FlipCardShowcaseComponent',
                name: 'Flip Card Showcase'
            },
            {
                path: 'flip-card-sizes.component',
                link: '/flip-card/flip-card-sizes.component',
                component: 'FlipCardSizesComponent',
                name: 'Flip Card Sizes'
            }
        ]
    },
    {
        path: 'infinite-list',
        children: [
            {
                path: 'infinite-list-placeholders.component',
                link: '/infinite-list/infinite-list-placeholders.component',
                component: 'InfiniteListPlaceholdersComponent',
                name: 'Infinite List Placeholders'
            },
            {
                path: 'infinite-list-scroll-modes.component',
                link: '/infinite-list/infinite-list-scroll-modes.component',
                component: 'InfiniteListScrollModesComponent',
                name: 'Infinite List Scroll Modes'
            },
            {
                path: 'infinite-list-showcase.component',
                link: '/infinite-list/infinite-list-showcase.component',
                component: 'InfiniteListShowcaseComponent',
                name: 'Infinite List Showcase'
            },
            {
                path: 'infinite-news-list.component',
                link: '/infinite-list/infinite-news-list.component',
                component: 'InfiniteNewsListComponent',
                name: 'Infinite News List'
            }
        ]
    },
    {
        path: 'input',
        children: [
            {
                path: 'input-colors.component',
                link: '/input/input-colors.component',
                component: 'InputColorsComponent',
                name: 'Input Colors'
            },
            {
                path: 'input-full-width.component',
                link: '/input/input-full-width.component',
                component: 'InputFullWidthComponent',
                name: 'Input Full Width'
            },
            {
                path: 'input-shapes.component',
                link: '/input/input-shapes.component',
                component: 'InputShapesComponent',
                name: 'Input Shapes'
            },
            {
                path: 'input-showcase.component',
                link: '/input/input-showcase.component',
                component: 'InputsShowcaseComponent',
                name: 'Inputs Showcase'
            },
            {
                path: 'input-sizes.component',
                link: '/input/input-sizes.component',
                component: 'InputSizesComponent',
                name: 'Input Sizes'
            },
            {
                path: 'input-types.component',
                link: '/input/input-types.component',
                component: 'InputTypesComponent',
                name: 'Input Types'
            },
            {
                path: 'input-form.component',
                link: '/input/input-form.component',
                component: 'InputFormComponent',
                name: 'Input Form'
            },
            {
                path: 'input-ghost.component',
                link: '/input/input-ghost.component',
                component: 'InputGhostComponent',
                name: 'Input Ghost'
            },
            {
                path: 'input-number.component',
                link: '/input/input-number.component',
                component: 'InputNumberComponent',
                name: 'Input Number'
            }
        ]
    },
    {
        path: 'list',
        children: [
            {
                path: 'simple-list-showcase.component',
                link: '/list/simple-list-showcase.component',
                component: 'SimpleListShowcaseComponent',
                name: 'Simple List Showcase'
            },
            {
                path: 'users-list-showcase.component',
                link: '/list/users-list-showcase.component',
                component: 'UsersListShowcaseComponent',
                name: 'Users List Showcase'
            },
            {
                path: 'list-item-layout.component',
                link: '/list/list-item-layout.component',
                component: 'ListItemLayoutComponent',
                name: 'List Item Layout'
            }
        ]
    },
    {
        path: 'menu',
        children: [
            {
                path: 'menu-horizontal.component',
                link: '/menu/menu-horizontal.component',
                component: 'MenuHorizontalComponent',
                name: 'Menu Horizontal'
            },
            {
                path: 'menu-children.component',
                link: '/menu/menu-children.component',
                component: 'MenuChildrenComponent',
                name: 'Menu Children'
            },
            {
                path: 'menu-showcase.component',
                link: '/menu/menu-showcase.component',
                component: 'MenuShowcaseComponent',
                name: 'Menu Showcase'
            },
            {
                path: 'menu-autocollapse.component',
                link: '/menu/menu-autocollapse.component',
                component: 'MenuAutoCollapseComponent',
                name: 'Menu Auto Collapse'
            },
            {
                path: 'menu-link-params.component',
                link: '/menu/menu-link-params.component',
                component: 'MenuLinkParamsComponent',
                name: 'Menu Link Params'
            },
            {
                path: 'menu-badge.component',
                link: '/menu/menu-badge.component',
                component: 'MenuBadgeComponent',
                name: 'Menu Badge'
            },
            {
                path: 'menu-service.component',
                link: '/menu/menu-service.component',
                component: 'MenuServiceComponent',
                name: 'Menu Service',
                children: [
                    {
                        path: '2',
                        link: '/menu/menu-service.component/2',
                        component: 'MenuServiceItem2Component',
                        name: 'Menu Service Item2'
                    },
                    {
                        path: '3',
                        link: '/menu/menu-service.component/3',
                        component: 'MenuServiceItem3Component',
                        name: 'Menu Service Item3',
                        children: [
                            {
                                path: '1',
                                link: '/menu/menu-service.component/3/1',
                                component: 'MenuServiceItem31Component',
                                name: 'Menu Service Item31'
                            },
                            {
                                path: '2',
                                link: '/menu/menu-service.component/3/2',
                                component: 'MenuServiceItem32Component',
                                name: 'Menu Service Item32'
                            },
                            {
                                path: '3',
                                link: '/menu/menu-service.component/3/3',
                                component: 'MenuServiceItem33Component',
                                name: 'Menu Service Item33',
                                children: [
                                    {
                                        path: '1',
                                        link: '/menu/menu-service.component/3/3/1',
                                        component: 'MenuServiceItem331Component',
                                        name: 'Menu Service Item331'
                                    },
                                    {
                                        path: '2',
                                        link: '/menu/menu-service.component/3/3/2',
                                        component: 'MenuServiceItem332Component',
                                        name: 'Menu Service Item332'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: 'overlay',
        children: [
            {
                path: 'overlay-showcase.component',
                link: '/overlay/overlay-showcase.component',
                component: 'OverlayShowcaseComponent',
                name: 'Overlay Showcase'
            },
            {
                path: 'overlay-host.component',
                link: '/overlay/overlay-host.component',
                component: 'OverlayHostComponent',
                name: 'Overlay Host'
            }
        ]
    },
    {
        path: 'popover',
        children: [
            {
                path: 'popover-custom-component.component',
                link: '/popover/popover-custom-component.component',
                component: 'PopoverCustomComponentComponent',
                name: 'Popover Custom Component'
            },
            {
                path: 'popover-modes.component',
                link: '/popover/popover-modes.component',
                component: 'PopoverModesComponent',
                name: 'Popover Modes'
            },
            {
                path: 'popover-placements.component',
                link: '/popover/popover-placements.component',
                component: 'PopoverPlacementsComponent',
                name: 'Popover Placements'
            },
            {
                path: 'popover-showcase.component',
                link: '/popover/popover-showcase.component',
                component: 'PopoverShowcaseComponent',
                name: 'Popover Showcase'
            },
            {
                path: 'popover-template-ref.component',
                link: '/popover/popover-template-ref.component',
                component: 'PopoverTemplateRefComponent',
                name: 'Popover Template Ref'
            },
            {
                path: 'popover-test.component',
                link: '/popover/popover-test.component',
                component: 'PopoverTestComponent',
                name: 'Popover Test'
            },
            {
                path: 'popover-noop.component',
                link: '/popover/popover-noop.component',
                component: 'PopoverNoopComponent',
                name: 'Popover Noop'
            },
            {
                path: 'popover-dynamic.component',
                link: '/popover/popover-dynamic.component',
                component: 'PopoverDynamicComponent',
                name: 'Popover Dynamic'
            },
            {
                path: 'popover-dynamic-code.component',
                link: '/popover/popover-dynamic-code.component',
                component: 'PopoverDynamicCodeComponent',
                name: 'Popover Dynamic Code'
            }
        ]
    },
    {
        path: 'progress-bar',
        children: [
            {
                path: 'progress-bar-interactive.component',
                link: '/progress-bar/progress-bar-interactive.component',
                component: 'ProgressBarInteractiveComponent',
                name: 'Progress Bar Interactive'
            },
            {
                path: 'progress-bar-ring.component',
                link: '/progress-bar/progress-bar-ring.component',
                component: 'ProgressBarRingComponent',
                name: 'Progress Bar Ring'
            },
            {
                path: 'progress-bar-showcase.component',
                link: '/progress-bar/progress-bar-showcase.component',
                component: 'ProgressBarShowcaseComponent',
                name: 'Progress Bar Showcase'
            },
            {
                path: 'progress-bar-size.component',
                link: '/progress-bar/progress-bar-size.component',
                component: 'ProgressBarSizeComponent',
                name: 'Progress Bar Size'
            },
            {
                path: 'progress-bar-status.component',
                link: '/progress-bar/progress-bar-status.component',
                component: 'ProgressBarStatusComponent',
                name: 'Progress Bar Status'
            },
            {
                path: 'progress-bar-value.component',
                link: '/progress-bar/progress-bar-value.component',
                component: 'ProgressBarValueComponent',
                name: 'Progress Bar Value'
            }
        ]
    },
    {
        path: 'radio',
        children: [
            {
                path: 'radio-disabled.component',
                link: '/radio/radio-disabled.component',
                component: 'RadioDisabledComponent',
                name: 'Radio Disabled'
            },
            {
                path: 'radio-showcase.component',
                link: '/radio/radio-showcase.component',
                component: 'RadioShowcaseComponent',
                name: 'Radio Showcase'
            },
            {
                path: 'radio-statuses.component',
                link: '/radio/radio-statuses.component',
                component: 'RadioStatusesComponent',
                name: 'Radio Statuses'
            },
            {
                path: 'radio-disabled-group.component',
                link: '/radio/radio-disabled-group.component',
                component: 'RadioDisabledGroupComponent',
                name: 'Radio Disabled Group'
            },
            {
                path: 'radio-form.component',
                link: '/radio/radio-form.component',
                component: 'RadioFormComponent',
                name: 'Radio Form'
            },
            {
                path: 'radio-sizes.component',
                link: '/radio/radio-sizes.component',
                component: 'RadioSizesComponent',
                name: 'Radio Sizes'
            }
        ]
    },
    {
        path: 'reveal-card',
        children: [
            {
                path: 'reveal-card-accents.component',
                link: '/reveal-card/reveal-card-accents.component',
                component: 'RevealCardAccentsComponent',
                name: 'Reveal Card Accents'
            },
            {
                path: 'reveal-card-colors.component',
                link: '/reveal-card/reveal-card-colors.component',
                component: 'RevealCardColorsComponent',
                name: 'Reveal Card Colors'
            },
            {
                path: 'reveal-card-full.component',
                link: '/reveal-card/reveal-card-full.component',
                component: 'RevealCardFullComponent',
                name: 'Reveal Card Full'
            },
            {
                path: 'reveal-card-showcase.component',
                link: '/reveal-card/reveal-card-showcase.component',
                component: 'RevealCardShowcaseComponent',
                name: 'Reveal Card Showcase'
            },
            {
                path: 'reveal-card-sizes.component',
                link: '/reveal-card/reveal-card-sizes.component',
                component: 'RevealCardSizesComponent',
                name: 'Reveal Card Sizes'
            }
        ]
    },
    {
        path: 'select',
        children: [
            {
                path: 'select-clean.component',
                link: '/select/select-clean.component',
                component: 'SelectCleanComponent',
                name: 'Select Clean'
            },
            {
                path: 'select-disabled.component',
                link: '/select/select-disabled.component',
                component: 'SelectDisabledComponent',
                name: 'Select Disabled'
            },
            {
                path: 'select-form.component',
                link: '/select/select-form.component',
                component: 'SelectFormComponent',
                name: 'Select Form'
            },
            {
                path: 'select-groups.component',
                link: '/select/select-groups.component',
                component: 'SelectGroupsComponent',
                name: 'Select Groups'
            },
            {
                path: 'select-hero.component',
                link: '/select/select-hero.component',
                component: 'SelectHeroComponent',
                name: 'Select Hero'
            },
            {
                path: 'select-label.component',
                link: '/select/select-label.component',
                component: 'SelectLabelShowcaseComponent',
                name: 'Select Label Showcase'
            },
            {
                path: 'select-multiple.component',
                link: '/select/select-multiple.component',
                component: 'SelectMultipleComponent',
                name: 'Select Multiple'
            },
            {
                path: 'select-filled.component',
                link: '/select/select-filled.component',
                component: 'SelectFilledComponent',
                name: 'Select Filled'
            },
            {
                path: 'select-placeholder.component',
                link: '/select/select-placeholder.component',
                component: 'SelectPlaceholderComponent',
                name: 'Select Placeholder'
            },
            {
                path: 'select-shapes.component',
                link: '/select/select-shapes.component',
                component: 'SelectShapeComponent',
                name: 'Select Shape'
            },
            {
                path: 'select-showcase.component',
                link: '/select/select-showcase.component',
                component: 'SelectShowcaseComponent',
                name: 'Select Showcase'
            },
            {
                path: 'select-sizes.component',
                link: '/select/select-sizes.component',
                component: 'SelectSizesComponent',
                name: 'Select Sizes'
            },
            {
                path: 'select-status.component',
                link: '/select/select-status.component',
                component: 'SelectStatusComponent',
                name: 'Select Status'
            },
            {
                path: 'select-interactive.component',
                link: '/select/select-interactive.component',
                component: 'SelectInteractiveComponent',
                name: 'Select Interactive'
            },
            {
                path: 'select-test.component',
                link: '/select/select-test.component',
                component: 'SelectTestComponent',
                name: 'Select Test'
            },
            {
                path: 'select-compare-with.component',
                link: '/select/select-compare-with.component',
                component: 'SelectCompareWithComponent',
                name: 'Select Compare With'
            },
            {
                path: 'select-icon.component',
                link: '/select/select-icon.component',
                component: 'SelectIconComponent',
                name: 'Select Icon'
            },
            {
                path: 'select-nullable.component',
                link: '/select/select-nullable.component',
                component: 'SelectNullableComponent',
                name: 'Select Nullable'
            },
            {
                path: 'select-chips.component',
                link: '/select/select-chips.component',
                component: 'SelectChipsComponent',
                name: 'Select Chips'
            },
            {
                path: 'select-search.component',
                link: '/select/select-search.component',
                component: 'SelectSearchComponent',
                name: 'Select Search'
            },
            {
                path: 'select-all.component',
                link: '/select/select-all.component',
                component: 'SelectAllComponent',
                name: 'Select All'
            },
            {
                path: 'select-nested.component',
                link: '/select/select-nested.component',
                component: 'SelectNestedComponent',
                name: 'Select Nested'
            }
        ]
    },
    {
        path: 'spinner',
        children: [
            {
                path: 'spinner-button.component',
                link: '/spinner/spinner-button.component',
                component: 'SpinnerButtonComponent',
                name: 'Spinner Button'
            },
            {
                path: 'spinner-card.component',
                link: '/spinner/spinner-card.component',
                component: 'SpinnerCardComponent',
                name: 'Spinner Card'
            },
            {
                path: 'spinner-colors.component',
                link: '/spinner/spinner-colors.component',
                component: 'SpinnerColorsComponent',
                name: 'Spinner Colors'
            },
            {
                path: 'spinner-sizes.component',
                link: '/spinner/spinner-sizes.component',
                component: 'SpinnerSizesComponent',
                name: 'Spinner Sizes'
            },
            {
                path: 'spinner-tabs.component',
                link: '/spinner/spinner-tabs.component',
                component: 'SpinnerTabsComponent',
                name: 'Spinner Tabs'
            }
        ]
    },
    {
        path: 'stepper',
        children: [
            {
                path: 'stepper-showcase.component',
                link: '/stepper/stepper-showcase.component',
                component: 'StepperShowcaseComponent',
                name: 'Stepper Showcase'
            },
            {
                path: 'stepper-test.component',
                link: '/stepper/stepper-test.component',
                component: 'StepperTestComponent',
                name: 'Stepper Test'
            },
            {
                path: 'stepper-validation.component',
                link: '/stepper/stepper-validation.component',
                component: 'StepperValidationComponent',
                name: 'Stepper Validation'
            },
            {
                path: 'stepper-vertical.component',
                link: '/stepper/stepper-vertical.component',
                component: 'StepperVerticalComponent',
                name: 'Stepper Vertical'
            },
            {
                path: 'stepper-disabled-step-nav.component',
                link: '/stepper/stepper-disabled-step-nav.component',
                component: 'StepperDisabledStepNavComponent',
                name: 'Stepper Disabled Step Nav'
            },
            {
                path: 'stepper-linear.component',
                link: '/stepper/stepper-linear.component',
                component: 'StepperLinearComponent',
                name: 'Stepper Linear'
            },
            {
                path: 'stepper-step-change-event.component',
                link: '/stepper/stepper-step-change-event.component',
                component: 'StepperStepChangeEventComponent',
                name: 'Stepper Step Change Event'
            }
        ]
    },
    {
        path: 'tag',
        children: [
            {
                path: 'tag-showcase.component',
                link: '/tag/tag-showcase.component',
                component: 'TagShowcaseComponent',
                name: 'Tag Showcase'
            },
            {
                path: 'tag-appearance.component',
                link: '/tag/tag-appearance.component',
                component: 'TagAppearanceComponent',
                name: 'Tag Appearance'
            },
            {
                path: 'tag-input.component',
                link: '/tag/tag-input.component',
                component: 'TagInputComponent',
                name: 'Tag Input'
            },
            {
                path: 'tag-list-sizes.component',
                link: '/tag/tag-list-sizes.component',
                component: 'TagListSizesComponent',
                name: 'Tag List Sizes'
            },
            {
                path: 'tag-input-with-autocomplete.component',
                link: '/tag/tag-input-with-autocomplete.component',
                component: 'TagInputWithAutocompleteComponent',
                name: 'Tag Input With Autocomplete'
            },
            {
                path: 'tag-status.component',
                link: '/tag/tag-status.component',
                component: 'TagStatusComponent',
                name: 'Tag Status'
            },
            {
                path: 'tag-removable.component',
                link: '/tag/tag-removable.component',
                component: 'TagRemovableComponent',
                name: 'Tag Removable'
            },
            {
                path: 'tag-form.component',
                link: '/tag/tag-form.component',
                component: 'TagFormComponent',
                name: 'Tag Form'
            }
        ]
    },
    {
        path: 'tabset',
        children: [
            {
                path: 'route-tabset-showcase.component',
                link: '/tabset/route-tabset-showcase.component',
                component: 'RouteTabsetShowcaseComponent',
                name: 'Route Tabset Showcase',
                children: [
                    {
                        path: 'tab1',
                        link: '/tabset/route-tabset-showcase.component/tab1',
                        component: 'RouteTabsetShowcaseChild1Component',
                        name: 'Route Tabset Showcase Child1'
                    },
                    {
                        path: 'tab2',
                        link: '/tabset/route-tabset-showcase.component/tab2',
                        component: 'RouteTabsetShowcaseChild2Component',
                        name: 'Route Tabset Showcase Child2'
                    },
                    {
                        path: 'tab3',
                        link: '/tabset/route-tabset-showcase.component/tab3',
                        component: 'RouteTabsetShowcaseChild3Component',
                        name: 'Route Tabset Showcase Child3'
                    }
                ]
            },
            {
                path: 'tabset-badge.component',
                link: '/tabset/tabset-badge.component',
                component: 'TabsetBadgeComponent',
                name: 'Tabset Badge'
            },
            {
                path: 'tabset-icon.component',
                link: '/tabset/tabset-icon.component',
                component: 'TabsetIconComponent',
                name: 'Tabset Icon'
            },
            {
                path: 'tabset-showcase.component',
                link: '/tabset/tabset-showcase.component',
                component: 'TabsetShowcaseComponent',
                name: 'Tabset Showcase'
            },
            {
                path: 'tabset-test.component',
                link: '/tabset/tabset-test.component',
                component: 'TabsetTestComponent',
                name: 'Tabset Test'
            },
            {
                path: 'tabset-test.component/:tab',
                link: '/tabset/tabset-test.component/:tab',
                component: 'TabsetTestComponent',
                name: 'Tabset Test'
            },
            {
                path: 'tabset-width.component',
                link: '/tabset/tabset-width.component',
                component: 'TabsetWidthComponent',
                name: 'Tabset Width'
            },
            {
                path: 'tabset-disabled.component',
                link: '/tabset/tabset-disabled.component',
                component: 'TabsetDisabledComponent',
                name: 'Tabset Disabled'
            },
            {
                path: 'tabset-template-title.component',
                link: '/tabset/tabset-template-title.component',
                component: 'TabsetTemplateTitleComponent',
                name: 'Tabset Template Title'
            }
        ]
    },
    {
        path: 'toastr',
        children: [
            {
                path: 'toastr-destroy-by-click.component',
                link: '/toastr/toastr-destroy-by-click.component',
                component: 'ToastrDestroyByClickComponent',
                name: 'Toastr Destroy By Click'
            },
            {
                path: 'toastr-duration.component',
                link: '/toastr/toastr-duration.component',
                component: 'ToastrDurationComponent',
                name: 'Toastr Duration'
            },
            {
                path: 'toastr-icon.component',
                link: '/toastr/toastr-icon.component',
                component: 'ToastrIconComponent',
                name: 'Toastr Icon'
            },
            {
                path: 'toastr-positions.component',
                link: '/toastr/toastr-positions.component',
                component: 'ToastrPositionsComponent',
                name: 'Toastr Positions'
            },
            {
                path: 'toastr-prevent-duplicates.component',
                link: '/toastr/toastr-prevent-duplicates.component',
                component: 'ToastrPreventDuplicatesComponent',
                name: 'Toastr Prevent Duplicates'
            },
            {
                path: 'toastr-prevent-duplicates-behaviour.component',
                link: '/toastr/toastr-prevent-duplicates-behaviour.component',
                component: 'ToastrPreventDuplicatesBehaviourComponent',
                name: 'Toastr Prevent Duplicates Behaviour'
            },
            {
                path: 'toastr-showcase.component',
                link: '/toastr/toastr-showcase.component',
                component: 'ToastrShowcaseComponent',
                name: 'Toastr Showcase'
            },
            {
                path: 'toastr-statuses.component',
                link: '/toastr/toastr-statuses.component',
                component: 'ToastrStatusesComponent',
                name: 'Toastr Statuses'
            },
            {
                path: 'toastr-limit.component',
                link: '/toastr/toastr-limit.component',
                component: 'ToastrLimitComponent',
                name: 'Toastr Limit'
            },
            {
                path: 'toastr-actions.component',
                link: '/toastr/toastr-actions.component',
                component: 'ToastrActionsComponent',
                name: 'Toastr Actions'
            }
        ]
    },
    {
        path: 'tooltip',
        children: [
            {
                path: 'tooltip-colors.component',
                link: '/tooltip/tooltip-colors.component',
                component: 'TooltipColorsComponent',
                name: 'Tooltip Colors'
            },
            {
                path: 'tooltip-placements.component',
                link: '/tooltip/tooltip-placements.component',
                component: 'TooltipPlacementsComponent',
                name: 'Tooltip Placements'
            },
            {
                path: 'tooltip-showcase.component',
                link: '/tooltip/tooltip-showcase.component',
                component: 'TooltipShowcaseComponent',
                name: 'Tooltip Showcase'
            },
            {
                path: 'tooltip-with-icon.component',
                link: '/tooltip/tooltip-with-icon.component',
                component: 'TooltipWithIconComponent',
                name: 'Tooltip With Icon'
            },
            {
                path: 'tooltip-template.component',
                link: '/tooltip/tooltip-template.component',
                component: 'TooltipTemplateComponent',
                name: 'Tooltip Template'
            }
        ]
    },
    {
        path: 'user',
        children: [
            {
                path: 'user-showcase.component',
                link: '/user/user-showcase.component',
                component: 'UserShowcaseComponent',
                name: 'User Showcase'
            },
            {
                path: 'user-sizes.component',
                link: '/user/user-sizes.component',
                component: 'UserSizesComponent',
                name: 'User Sizes'
            },
            {
                path: 'user-avatar-settings.component',
                link: '/user/user-avatar-settings.component',
                component: 'UserAvatarSettingsComponent',
                name: 'User Avatar Settings'
            },
            {
                path: 'user-hide-captions.component',
                link: '/user/user-hide-captions.component',
                component: 'UserHideCaptionsComponent',
                name: 'User Hide Captions'
            },
            {
                path: 'user-shape.component',
                link: '/user/user-shape.component',
                component: 'NbUserShapeComponent',
                name: 'Nb User Shape'
            }
        ]
    },
    {
        path: 'window',
        children: [
            {
                path: 'template-window.component',
                link: '/window/template-window.component',
                component: 'TemplateWindowComponent',
                name: 'Template Window'
            },
            {
                path: 'window-showcase.component',
                link: '/window/window-showcase.component',
                component: 'WindowShowcaseComponent',
                name: 'Window Showcase'
            },
            {
                path: 'windows-backdrop.component',
                link: '/window/windows-backdrop.component',
                component: 'WindowsBackdropComponent',
                name: 'Windows Backdrop'
            },
            {
                path: 'window-controls.component',
                link: '/window/window-controls.component',
                component: 'WindowControlsComponent',
                name: 'Window Controls'
            },
            {
                path: 'window-template-title.component',
                link: '/window/window-template-title.component',
                component: 'WindowTemplateTitleComponent',
                name: 'Window Template Title'
            },
            {
                path: 'window-result.component',
                link: '/window/window-result.component',
                component: 'WindowResultComponent',
                name: 'Window Result'
            }
        ]
    },
    {
        path: 'oauth2',
        children: [
            {
                path: 'callback',
                link: '/oauth2/callback',
                component: 'OAuth2CallbackComponent',
                name: 'OAuth2Callback'
            }
        ]
    },
    {
        path: 'oauth2-password'
    },
    {
        path: 'tree-grid',
        children: [
            {
                path: 'tree-grid-showcase.component',
                link: '/tree-grid/tree-grid-showcase.component',
                component: 'TreeGridShowcaseComponent',
                name: 'Tree Grid Showcase'
            },
            {
                path: 'tree-grid-sortable.component',
                link: '/tree-grid/tree-grid-sortable.component',
                component: 'TreeGridSortableComponent',
                name: 'Tree Grid Sortable'
            },
            {
                path: 'tree-grid-filterable.component',
                link: '/tree-grid/tree-grid-filterable.component',
                component: 'TreeGridFilterableComponent',
                name: 'Tree Grid Filterable'
            },
            {
                path: 'tree-grid-basic.component',
                link: '/tree-grid/tree-grid-basic.component',
                component: 'TreeGridBasicComponent',
                name: 'Tree Grid Basic'
            },
            {
                path: 'tree-grid-responsive.component',
                link: '/tree-grid/tree-grid-responsive.component',
                component: 'TreeGridResponsiveComponent',
                name: 'Tree Grid Responsive'
            },
            {
                path: 'tree-grid-custom-icons.component',
                link: '/tree-grid/tree-grid-custom-icons.component',
                component: 'TreeGridCustomIconsComponent',
                name: 'Tree Grid Custom Icons'
            },
            {
                path: 'tree-grid-disable-click-toggle.component',
                link: '/tree-grid/tree-grid-disable-click-toggle.component',
                component: 'TreeGridDisableClickToggleComponent',
                name: 'Tree Grid Disable Click Toggle'
            },
            {
                path: 'tree-grid-custom-node-structure.component',
                link: '/tree-grid/tree-grid-custom-node-structure.component',
                component: 'TreeGridCustomNodeStructureComponent',
                name: 'Tree Grid Custom Node Structure'
            },
            {
                path: 'tree-grid-no-data.component',
                link: '/tree-grid/tree-grid-no-data.component',
                component: 'TreeGridNoDataComponent',
                name: 'Tree Grid No Data'
            },
            {
                path: 'tree-grid-variants.component',
                link: '/tree-grid/tree-grid-variants.component',
                component: 'TreeGridVariantsComponent',
                name: 'Tree Grid Variants'
            }
        ]
    },
    {
        path: 'icon',
        children: [
            {
                path: 'icon-showcase.component',
                link: '/icon/icon-showcase.component',
                component: 'IconShowcaseComponent',
                name: 'Icon Showcase'
            },
            {
                path: 'icon-colors.component',
                link: '/icon/icon-colors.component',
                component: 'IconColorsComponent',
                name: 'Icon Colors'
            }
        ]
    },
    {
        path: 'toggle',
        children: [
            {
                path: 'toggle-disabled.component',
                link: '/toggle/toggle-disabled.component',
                component: 'ToggleDisabledComponent',
                name: 'Toggle Disabled'
            },
            {
                path: 'toggle-showcase.component',
                link: '/toggle/toggle-showcase.component',
                component: 'ToggleShowcaseComponent',
                name: 'Toggle Showcase'
            },
            {
                path: 'toggle-status.component',
                link: '/toggle/toggle-status.component',
                component: 'ToggleStatusComponent',
                name: 'Toggle Status'
            },
            {
                path: 'toggle-test.component',
                link: '/toggle/toggle-test.component',
                component: 'ToggleTestComponent',
                name: 'Toggle Test'
            },
            {
                path: 'toggle-label-position.component',
                link: '/toggle/toggle-label-position.component',
                component: 'ToggleLabelPositionComponent',
                name: 'Toggle Label Position'
            },
            {
                path: 'toggle-form.component',
                link: '/toggle/toggle-form.component',
                component: 'ToggleFormComponent',
                name: 'Toggle Form'
            },
            {
                path: 'toggle-sizes.component',
                link: '/toggle/toggle-sizes.component',
                component: 'ToggleSizesComponent',
                name: 'Toggle Sizes'
            }
        ]
    },
    {
        path: 'form-field',
        children: [
            {
                path: 'form-field-showcase.component',
                link: '/form-field/form-field-showcase.component',
                component: 'FormFieldShowcaseComponent',
                name: 'Form Field Showcase'
            },
            {
                path: 'form-field-password.component',
                link: '/form-field/form-field-password.component',
                component: 'FormFieldPasswordComponent',
                name: 'Form Field Password'
            },
            {
                path: 'form-field-input.component',
                link: '/form-field/form-field-input.component',
                component: 'FormFieldInputComponent',
                name: 'Form Field Input'
            },
            {
                path: 'form-field-text.component',
                link: '/form-field/form-field-text.component',
                component: 'FormFieldTextComponent',
                name: 'Form Field Text'
            }
        ]
    },
    {
        path: 'input-group',
        children: [
            {
                path: 'input-group-showcase.component',
                link: '/input-group/input-group-showcase.component',
                component: 'InputGroupShowcaseComponent',
                name: 'Input Group Showcase'
            },
            {
                path: 'input-group-full-width.component',
                link: '/input-group/input-group-full-width.component',
                component: 'InputGroupFullWidthComponent',
                name: 'Input Group Full Width'
            }
        ]
    },
    {
        path: 'validation',
        children: [
            {
                path: 'validation-showcase.component',
                link: '/validation/validation-showcase.component',
                component: 'ValidationShowcaseComponent',
                name: 'Validation Showcase'
            },
            {
                path: 'validation-messages.component',
                link: '/validation/validation-messages.component',
                component: 'ValidationMessagesComponent',
                name: 'Validation Messages'
            },
            {
                path: 'validation-template-driven.component',
                link: '/validation/validation-template-driven.component',
                component: 'ValidationTemplateDrivenComponent',
                name: 'Validation Template Driven'
            },
            {
                path: 'validation-signal-forms.component',
                link: '/validation/validation-signal-forms.component',
                component: 'ValidationSignalFormsComponent',
                name: 'Validation Signal Forms'
            },
            {
                path: 'validation-group.component',
                link: '/validation/validation-group.component',
                component: 'ValidationGroupComponent',
                name: 'Validation Group'
            }
        ]
    },
    {
        path: 'file-drop',
        children: [
            {
                path: 'file-drop-multiple.component',
                link: '/file-drop/file-drop-multiple.component',
                component: 'FileDropMultipleComponent',
                name: 'File Drop Multiple'
            },
            {
                path: 'file-drop-preview.component',
                link: '/file-drop/file-drop-preview.component',
                component: 'FileDropPreviewComponent',
                name: 'File Drop Preview'
            },
            {
                path: 'file-drop-showcase.component',
                link: '/file-drop/file-drop-showcase.component',
                component: 'FileDropShowcaseComponent',
                name: 'File Drop Showcase'
            },
            {
                path: 'file-drop-sizes.component',
                link: '/file-drop/file-drop-sizes.component',
                component: 'FileDropSizesComponent',
                name: 'File Drop Sizes'
            }
        ]
    },
    {
        path: 'pagination',
        children: [
            {
                path: 'pagination-showcase.component',
                link: '/pagination/pagination-showcase.component',
                component: 'PaginationShowcaseComponent',
                name: 'Pagination Showcase'
            },
            {
                path: 'pagination-tree-grid.component',
                link: '/pagination/pagination-tree-grid.component',
                component: 'PaginationTreeGridComponent',
                name: 'Pagination Tree Grid'
            }
        ]
    },
    {
        path: 'breadcrumbs',
        children: [
            {
                path: 'breadcrumbs-showcase.component',
                link: '/breadcrumbs/breadcrumbs-showcase.component',
                component: 'BreadcrumbsShowcaseComponent',
                name: 'Breadcrumbs Showcase'
            },
            {
                path: 'breadcrumbs-separator.component',
                link: '/breadcrumbs/breadcrumbs-separator.component',
                component: 'BreadcrumbsSeparatorComponent',
                name: 'Breadcrumbs Separator'
            }
        ]
    },
    {
        path: 'toc',
        children: [
            {
                path: 'toc-showcase.component',
                link: '/toc/toc-showcase.component',
                component: 'TocShowcaseComponent',
                name: 'Toc Showcase'
            }
        ]
    },
    {
        path: 'qr-code',
        children: [
            {
                path: 'qr-code-showcase.component',
                link: '/qr-code/qr-code-showcase.component',
                component: 'QrCodeShowcaseComponent',
                name: 'Qr Code Showcase'
            },
            {
                path: 'qr-code-download.component',
                link: '/qr-code/qr-code-download.component',
                component: 'QrCodeDownloadComponent',
                name: 'Qr Code Download'
            }
        ]
    },
    {
        path: 'media',
        children: [
            {
                path: 'video-showcase.component',
                link: '/media/video-showcase.component',
                component: 'VideoShowcaseComponent',
                name: 'Video Showcase'
            },
            {
                path: 'video-stream.component',
                link: '/media/video-stream.component',
                component: 'VideoStreamComponent',
                name: 'Video Stream'
            },
            {
                path: 'audio-showcase.component',
                link: '/media/audio-showcase.component',
                component: 'AudioShowcaseComponent',
                name: 'Audio Showcase'
            }
        ]
    },
    {
        path: 'markdown',
        children: [
            {
                path: 'markdown-editor-showcase.component',
                link: '/markdown/markdown-editor-showcase.component',
                component: 'MarkdownEditorShowcaseComponent',
                name: 'Markdown Editor Showcase'
            },
            {
                path: 'markdown-editor-status.component',
                link: '/markdown/markdown-editor-status.component',
                component: 'MarkdownEditorStatusComponent',
                name: 'Markdown Editor Status'
            },
            {
                path: 'markdown-viewer-showcase.component',
                link: '/markdown/markdown-viewer-showcase.component',
                component: 'MarkdownViewerShowcaseComponent',
                name: 'Markdown Viewer Showcase'
            },
            {
                path: 'markdown-viewer-templates.component',
                link: '/markdown/markdown-viewer-templates.component',
                component: 'MarkdownViewerTemplatesComponent',
                name: 'Markdown Viewer Templates'
            }
        ]
    },
    {
        path: 'phone-input',
        children: [
            {
                path: 'phone-input-showcase.component',
                link: '/phone-input/phone-input-showcase.component',
                component: 'PhoneInputShowcaseComponent',
                name: 'Phone Input Showcase'
            },
            {
                path: 'phone-input-sizes.component',
                link: '/phone-input/phone-input-sizes.component',
                component: 'PhoneInputSizesComponent',
                name: 'Phone Input Sizes'
            },
            {
                path: 'phone-input-validation.component',
                link: '/phone-input/phone-input-validation.component',
                component: 'PhoneInputValidationComponent',
                name: 'Phone Input Validation'
            }
        ]
    },
    {
        path: 'mask',
        children: [
            {
                path: 'mask-showcase.component',
                link: '/mask/mask-showcase.component',
                component: 'MaskShowcaseComponent',
                name: 'Mask Showcase'
            },
            {
                path: 'mask-validation.component',
                link: '/mask/mask-validation.component',
                component: 'MaskValidationComponent',
                name: 'Mask Validation'
            }
        ]
    },
    {
        path: 'color-picker',
        children: [
            {
                path: 'color-picker-showcase.component',
                link: '/color-picker/color-picker-showcase.component',
                component: 'ColorPickerShowcaseComponent',
                name: 'Color Picker Showcase'
            },
            {
                path: 'color-picker-sizes.component',
                link: '/color-picker/color-picker-sizes.component',
                component: 'ColorPickerSizesComponent',
                name: 'Color Picker Sizes'
            },
            {
                path: 'color-picker-validation.component',
                link: '/color-picker/color-picker-validation.component',
                component: 'ColorPickerValidationComponent',
                name: 'Color Picker Validation'
            }
        ]
    },
    {
        path: 'chart',
        children: [
            {
                path: 'chart-showcase.component',
                link: '/chart/chart-showcase.component',
                component: 'ChartShowcaseComponent',
                name: 'Chart Showcase'
            }
        ]
    },
    {
        path: 'theme-select',
        children: [
            {
                path: 'theme-select-showcase.component',
                link: '/theme-select/theme-select-showcase.component',
                component: 'ThemeSelectShowcaseComponent',
                name: 'Theme Select Showcase'
            }
        ]
    },
    {
        path: 'theme-editor',
        children: [
            {
                path: 'theme-editor-preview.component',
                link: '/theme-editor/theme-editor-preview.component',
                component: 'ThemeEditorPreviewComponent',
                name: 'Theme Editor Preview'
            },
            {
                path: 'theme-editor-states.component',
                link: '/theme-editor/theme-editor-states.component',
                component: 'ThemeEditorStatesComponent',
                name: 'Theme Editor States'
            }
        ]
    },
    {
        path: 'divider',
        children: [
            {
                path: 'divider-showcase.component',
                link: '/divider/divider-showcase.component',
                component: 'DividerShowcaseComponent',
                name: 'Divider Showcase'
            }
        ]
    },
    {
        path: 'slider',
        children: [
            {
                path: 'slider-showcase.component',
                link: '/slider/slider-showcase.component',
                component: 'SliderShowcaseComponent',
                name: 'Slider Showcase'
            },
            {
                path: 'slider-sizes.component',
                link: '/slider/slider-sizes.component',
                component: 'SliderSizesComponent',
                name: 'Slider Sizes'
            },
            {
                path: 'slider-open.component',
                link: '/slider/slider-open.component',
                component: 'SliderOpenComponent',
                name: 'Slider Open'
            },
            {
                path: 'slider-transform.component',
                link: '/slider/slider-transform.component',
                component: 'SliderTransformComponent',
                name: 'Slider Transform'
            }
        ]
    },
    {
        path: 'skeleton',
        children: [
            {
                path: 'skeleton-showcase.component',
                link: '/skeleton/skeleton-showcase.component',
                component: 'SkeletonShowcaseComponent',
                name: 'Skeleton Showcase'
            }
        ]
    },
    {
        path: 'page-indicator',
        children: [
            {
                path: 'page-indicator-showcase.component',
                link: '/page-indicator/page-indicator-showcase.component',
                component: 'PageIndicatorShowcaseComponent',
                name: 'Page Indicator Showcase'
            }
        ]
    },
    {
        path: 'table',
        children: [
            {
                path: 'table-showcase.component',
                link: '/table/table-showcase.component',
                component: 'TableShowcaseComponent',
                name: 'Table Showcase'
            },
            {
                path: 'table-server.component',
                link: '/table/table-server.component',
                component: 'TableServerComponent',
                name: 'Table Server'
            },
            {
                path: 'table-selection.component',
                link: '/table/table-selection.component',
                component: 'TableSelectionComponent',
                name: 'Table Selection'
            }
        ]
    },
    {
        path: 'showcase',
        children: [
            {
                path: 'auth',
                children: [
                    {
                        path: 'pastel',
                        link: '/showcase/auth/pastel',
                        component: 'AuthPastelShellComponent',
                        name: 'Auth Pastel Shell',
                        children: [
                            {
                                path: 'sign-in',
                                link: '/showcase/auth/pastel/sign-in',
                                component: 'AuthSignInComponent',
                                name: 'Auth Sign In'
                            },
                            {
                                path: 'sign-up',
                                link: '/showcase/auth/pastel/sign-up',
                                component: 'AuthSignUpComponent',
                                name: 'Auth Sign Up'
                            },
                            {
                                path: 'forgot-password',
                                link: '/showcase/auth/pastel/forgot-password',
                                component: 'AuthForgotPasswordComponent',
                                name: 'Auth Forgot Password'
                            }
                        ]
                    },
                    {
                        path: 'studio',
                        link: '/showcase/auth/studio',
                        component: 'AuthStudioShellComponent',
                        name: 'Auth Studio Shell',
                        children: [
                            {
                                path: 'sign-in',
                                link: '/showcase/auth/studio/sign-in',
                                component: 'AuthSignInComponent',
                                name: 'Auth Sign In'
                            },
                            {
                                path: 'sign-up',
                                link: '/showcase/auth/studio/sign-up',
                                component: 'AuthSignUpComponent',
                                name: 'Auth Sign Up'
                            },
                            {
                                path: 'forgot-password',
                                link: '/showcase/auth/studio/forgot-password',
                                component: 'AuthForgotPasswordComponent',
                                name: 'Auth Forgot Password'
                            }
                        ]
                    },
                    {
                        path: 'sign-in',
                        link: '/showcase/auth/sign-in',
                        component: 'AuthSignInComponent',
                        name: 'Auth Sign In'
                    },
                    {
                        path: 'sign-up',
                        link: '/showcase/auth/sign-up',
                        component: 'AuthSignUpComponent',
                        name: 'Auth Sign Up'
                    },
                    {
                        path: 'forgot-password',
                        link: '/showcase/auth/forgot-password',
                        component: 'AuthForgotPasswordComponent',
                        name: 'Auth Forgot Password'
                    }
                ]
            },
            {
                path: 'site',
                children: [
                    {
                        path: 'home',
                        link: '/showcase/site/home',
                        component: 'SiteHomeComponent',
                        name: 'Site Home'
                    },
                    {
                        path: 'blog',
                        link: '/showcase/site/blog',
                        component: 'SiteBlogComponent',
                        name: 'Site Blog'
                    },
                    {
                        path: 'article',
                        link: '/showcase/site/article',
                        component: 'SiteArticleComponent',
                        name: 'Site Article'
                    },
                    {
                        path: 'site-mockup.component',
                        link: '/showcase/site/site-mockup.component',
                        component: 'SiteMockupComponent',
                        name: 'Site Mockup'
                    }
                ]
            },
            {
                path: 'mobile',
                children: [
                    {
                        path: 'today',
                        link: '/showcase/mobile/today',
                        component: 'MobileTodayComponent',
                        name: 'Mobile Today'
                    },
                    {
                        path: 'customers',
                        link: '/showcase/mobile/customers',
                        component: 'MobileCustomersComponent',
                        name: 'Mobile Customers'
                    },
                    {
                        path: 'customer',
                        link: '/showcase/mobile/customer',
                        component: 'MobileCustomerComponent',
                        name: 'Mobile Customer'
                    },
                    {
                        path: 'messages',
                        link: '/showcase/mobile/messages',
                        component: 'MobileMessagesComponent',
                        name: 'Mobile Messages'
                    },
                    {
                        path: 'settings',
                        link: '/showcase/mobile/settings',
                        component: 'MobileSettingsComponent',
                        name: 'Mobile Settings'
                    }
                ]
            },
            {
                path: 'shop',
                children: [
                    {
                        path: 'products',
                        link: '/showcase/shop/products',
                        component: 'ShopProductsComponent',
                        name: 'Shop Products'
                    },
                    {
                        path: 'products/:id',
                        link: '/showcase/shop/products/:id',
                        component: 'ShopProductComponent',
                        name: 'Shop Product'
                    },
                    {
                        path: 'cart',
                        link: '/showcase/shop/cart',
                        component: 'ShopCartComponent',
                        name: 'Shop Cart'
                    },
                    {
                        path: 'checkout',
                        link: '/showcase/shop/checkout',
                        component: 'ShopCheckoutComponent',
                        name: 'Shop Checkout'
                    },
                    {
                        path: 'order-placed',
                        link: '/showcase/shop/order-placed',
                        component: 'ShopOrderPlacedComponent',
                        name: 'Shop Order Placed'
                    },
                    {
                        path: 'orders',
                        link: '/showcase/shop/orders',
                        component: 'ShopOrdersComponent',
                        name: 'Shop Orders'
                    }
                ]
            },
            {
                path: 'saas',
                children: [
                    {
                        path: 'dashboard',
                        link: '/showcase/saas/dashboard',
                        component: 'SaasDashboardComponent',
                        name: 'Saas Dashboard'
                    },
                    {
                        path: 'customers',
                        link: '/showcase/saas/customers',
                        component: 'SaasCustomersComponent',
                        name: 'Saas Customers'
                    },
                    {
                        path: 'customers/edit',
                        link: '/showcase/saas/customers/edit',
                        component: 'SaasCustomerEditComponent',
                        name: 'Saas Customer Edit'
                    },
                    {
                        path: 'invoice',
                        link: '/showcase/saas/invoice',
                        component: 'SaasInvoiceComponent',
                        name: 'Saas Invoice'
                    },
                    {
                        path: 'settings',
                        link: '/showcase/saas/settings',
                        component: 'SaasSettingsComponent',
                        name: 'Saas Settings'
                    }
                ]
            },
            {
                path: 'portfolio',
                children: [
                    {
                        path: 'home',
                        link: '/showcase/portfolio/home',
                        component: 'PortfolioHomeComponent',
                        name: 'Portfolio Home'
                    },
                    {
                        path: 'work',
                        link: '/showcase/portfolio/work',
                        component: 'PortfolioWorkComponent',
                        name: 'Portfolio Work'
                    },
                    {
                        path: 'about',
                        link: '/showcase/portfolio/about',
                        component: 'PortfolioAboutComponent',
                        name: 'Portfolio About'
                    },
                    {
                        path: 'contact',
                        link: '/showcase/portfolio/contact',
                        component: 'PortfolioContactComponent',
                        name: 'Portfolio Contact'
                    }
                ]
            },
            {
                path: 'pulse',
                children: [
                    {
                        path: 'today',
                        link: '/showcase/pulse/today',
                        component: 'PulseTodayComponent',
                        name: 'Pulse Today'
                    },
                    {
                        path: 'workout',
                        link: '/showcase/pulse/workout',
                        component: 'PulseWorkoutComponent',
                        name: 'Pulse Workout'
                    },
                    {
                        path: 'trends',
                        link: '/showcase/pulse/trends',
                        component: 'PulseTrendsComponent',
                        name: 'Pulse Trends'
                    },
                    {
                        path: 'settings',
                        link: '/showcase/pulse/settings',
                        component: 'PulseSettingsComponent',
                        name: 'Pulse Settings'
                    }
                ]
            },
            {
                path: 'book',
                children: [
                    {
                        path: 'home',
                        link: '/showcase/book/home',
                        component: 'BookHomeComponent',
                        name: 'Book Home'
                    },
                    {
                        path: 'book',
                        link: '/showcase/book/book',
                        component: 'BookBookComponent',
                        name: 'Book Book'
                    },
                    {
                        path: 'confirmed',
                        link: '/showcase/book/confirmed',
                        component: 'BookConfirmedComponent',
                        name: 'Book Confirmed'
                    },
                    {
                        path: 'bookings',
                        link: '/showcase/book/bookings',
                        component: 'BookBookingsComponent',
                        name: 'Book Bookings'
                    }
                ]
            },
            {
                path: 'summit',
                children: [
                    {
                        path: 'home',
                        link: '/showcase/summit/home',
                        component: 'SummitHomeComponent',
                        name: 'Summit Home'
                    },
                    {
                        path: 'agenda',
                        link: '/showcase/summit/agenda',
                        component: 'SummitAgendaComponent',
                        name: 'Summit Agenda'
                    },
                    {
                        path: 'speakers',
                        link: '/showcase/summit/speakers',
                        component: 'SummitSpeakersComponent',
                        name: 'Summit Speakers'
                    },
                    {
                        path: 'tickets',
                        link: '/showcase/summit/tickets',
                        component: 'SummitTicketsComponent',
                        name: 'Summit Tickets'
                    }
                ]
            },
            {
                path: 'relay',
                children: [
                    {
                        path: 'home',
                        link: '/showcase/relay/home',
                        component: 'RelayHomeComponent',
                        name: 'Relay Home'
                    },
                    {
                        path: 'pricing',
                        link: '/showcase/relay/pricing',
                        component: 'RelayPricingComponent',
                        name: 'Relay Pricing'
                    },
                    {
                        path: 'overview',
                        link: '/showcase/relay/overview',
                        component: 'RelayOverviewComponent',
                        name: 'Relay Overview'
                    },
                    {
                        path: 'keys',
                        link: '/showcase/relay/keys',
                        component: 'RelayKeysComponent',
                        name: 'Relay Keys'
                    },
                    {
                        path: 'events',
                        link: '/showcase/relay/events',
                        component: 'RelayEventsComponent',
                        name: 'Relay Events'
                    },
                    {
                        path: 'docs',
                        link: '/showcase/relay/docs',
                        component: 'RelayDocsComponent',
                        name: 'Relay Docs'
                    }
                ]
            },
            {
                path: 'hub',
                children: [
                    {
                        path: 'home',
                        link: '/showcase/hub/home',
                        component: 'HubHomeComponent',
                        name: 'Hub Home'
                    },
                    {
                        path: 'people',
                        link: '/showcase/hub/people',
                        component: 'HubPeopleComponent',
                        name: 'Hub People'
                    },
                    {
                        path: 'documents',
                        link: '/showcase/hub/documents',
                        component: 'HubDocumentsComponent',
                        name: 'Hub Documents'
                    },
                    {
                        path: 'documents/new',
                        link: '/showcase/hub/documents/new',
                        component: 'HubNewDocumentComponent',
                        name: 'Hub New Document'
                    },
                    {
                        path: 'requests',
                        link: '/showcase/hub/requests',
                        component: 'HubRequestsComponent',
                        name: 'Hub Requests'
                    },
                    {
                        path: 'tickets',
                        link: '/showcase/hub/tickets',
                        component: 'HubTicketsComponent',
                        name: 'Hub Tickets'
                    },
                    {
                        path: 'chat',
                        link: '/showcase/hub/chat',
                        component: 'HubChatComponent',
                        name: 'Hub Chat'
                    },
                    {
                        path: 'settings',
                        link: '/showcase/hub/settings',
                        component: 'HubSettingsComponent',
                        name: 'Hub Settings'
                    }
                ]
            },
            {
                path: 'learn',
                children: [
                    {
                        path: 'catalogue',
                        link: '/showcase/learn/catalogue',
                        component: 'LearnCatalogueComponent',
                        name: 'Learn Catalogue'
                    },
                    {
                        path: 'course',
                        link: '/showcase/learn/course',
                        component: 'LearnCourseComponent',
                        name: 'Learn Course'
                    },
                    {
                        path: 'lesson',
                        link: '/showcase/learn/lesson',
                        component: 'LearnLessonComponent',
                        name: 'Learn Lesson'
                    },
                    {
                        path: 'quiz',
                        link: '/showcase/learn/quiz',
                        component: 'LearnQuizComponent',
                        name: 'Learn Quiz'
                    }
                ]
            },
            {
                path: 'wallet',
                children: [
                    {
                        path: 'overview',
                        link: '/showcase/wallet/overview',
                        component: 'WalletOverviewComponent',
                        name: 'Wallet Overview'
                    },
                    {
                        path: 'transactions',
                        link: '/showcase/wallet/transactions',
                        component: 'WalletTransactionsComponent',
                        name: 'Wallet Transactions'
                    },
                    {
                        path: 'budgets',
                        link: '/showcase/wallet/budgets',
                        component: 'WalletBudgetsComponent',
                        name: 'Wallet Budgets'
                    },
                    {
                        path: 'transfer',
                        link: '/showcase/wallet/transfer',
                        component: 'WalletTransferComponent',
                        name: 'Wallet Transfer'
                    }
                ]
            },
            {
                path: 'stay',
                children: [
                    {
                        path: 'search',
                        link: '/showcase/stay/search',
                        component: 'StaySearchComponent',
                        name: 'Stay Search'
                    },
                    {
                        path: 'listing',
                        link: '/showcase/stay/listing',
                        component: 'StayListingComponent',
                        name: 'Stay Listing'
                    },
                    {
                        path: 'listing/:id',
                        link: '/showcase/stay/listing/:id',
                        component: 'StayListingComponent',
                        name: 'Stay Listing'
                    },
                    {
                        path: 'booking',
                        link: '/showcase/stay/booking',
                        component: 'StayBookingComponent',
                        name: 'Stay Booking'
                    },
                    {
                        path: 'trips',
                        link: '/showcase/stay/trips',
                        component: 'StayTripsComponent',
                        name: 'Stay Trips'
                    }
                ]
            }
        ]
    },
    {
        path: 'context-menu',
        children: [
            {
                path: 'context-menu-click.component',
                link: '/context-menu/context-menu-click.component',
                component: 'ContextMenuClickComponent',
                name: 'Context Menu Click'
            },
            {
                path: 'context-menu-showcase.component',
                link: '/context-menu/context-menu-showcase.component',
                component: 'ContextMenuShowcaseComponent',
                name: 'Context Menu Showcase'
            },
            {
                path: 'context-menu-test.component',
                link: '/context-menu/context-menu-test.component',
                component: 'ContextMenuTestComponent',
                name: 'Context Menu Test'
            },
            {
                path: 'context-menu-modes.component',
                link: '/context-menu/context-menu-modes.component',
                component: 'ContextMenuModesComponent',
                name: 'Context Menu Modes'
            },
            {
                path: 'context-menu-noop.component',
                link: '/context-menu/context-menu-noop.component',
                component: 'ContextMenuNoopComponent',
                name: 'Context Menu Noop'
            },
            {
                path: 'context-menu-right-click.component',
                link: '/context-menu/context-menu-right-click.component',
                component: 'ContextMenuRightClickComponent',
                name: 'Context Menu Right Click'
            }
        ]
    },
    {
        path: 'layout',
        children: [
            {
                path: 'layout-column-left.component',
                link: '/layout/layout-column-left.component',
                component: 'LayoutColumnLeftComponent',
                name: 'Layout Column Left'
            },
            {
                path: 'layout-fixed-header.component',
                link: '/layout/layout-fixed-header.component',
                component: 'LayoutFixedHeaderComponent',
                name: 'Layout Fixed Header'
            },
            {
                path: 'layout-footer-test.component',
                link: '/layout/layout-footer-test.component',
                component: 'LayoutFooterTestComponent',
                name: 'Layout Footer Test'
            },
            {
                path: 'layout-header-test.component',
                link: '/layout/layout-header-test.component',
                component: 'LayoutHeaderTestComponent',
                name: 'Layout Header Test'
            },
            {
                path: 'layout-showcase.component',
                link: '/layout/layout-showcase.component',
                component: 'LayoutShowcaseComponent',
                name: 'Layout Showcase'
            },
            {
                path: 'layout-sidebar-subheader.component',
                link: '/layout/layout-sidebar-subheader.component',
                component: 'LayoutSidebarSubheaderComponent',
                name: 'Layout Sidebar Subheader'
            },
            {
                path: 'layout-subheader.component',
                link: '/layout/layout-subheader.component',
                component: 'LayoutSubheaderComponent',
                name: 'Layout Subheader'
            },
            {
                path: 'layout-test.component',
                link: '/layout/layout-test.component',
                component: 'LayoutTestComponent',
                name: 'Layout Test'
            },
            {
                path: 'layout-w-footer.component',
                link: '/layout/layout-w-footer.component',
                component: 'LayoutWFooterComponent',
                name: 'Layout WFooter'
            },
            {
                path: 'theme-breakpoint-test.component',
                link: '/layout/theme-breakpoint-test.component',
                component: 'ThemeBreakpointTestComponent',
                name: 'Theme Breakpoint Test'
            },
            {
                path: 'theme-change-test.component',
                link: '/layout/theme-change-test.component',
                component: 'ThemeChangeTestComponent',
                name: 'Theme Change Test'
            }
        ]
    },
    {
        path: 'scroll',
        children: [
            {
                path: 'scroll-window.component',
                link: '/scroll/scroll-window.component',
                component: 'ScrollWindowComponent',
                name: 'Scroll Window'
            }
        ]
    },
    {
        path: 'search',
        children: [
            {
                path: 'search-customized-test.component',
                link: '/search/search-customized-test.component',
                component: 'SearchCustomizedTestComponent',
                name: 'Search Customized Test'
            },
            {
                path: 'search-event.component',
                link: '/search/search-event.component',
                component: 'SearchEventComponent',
                name: 'Search Event'
            },
            {
                path: 'search-showcase.component',
                link: '/search/search-showcase.component',
                component: 'SearchShowcaseComponent',
                name: 'Search Showcase'
            },
            {
                path: 'search-test.component',
                link: '/search/search-test.component',
                component: 'SearchTestComponent',
                name: 'Search Test'
            },
            {
                path: 'search-with-input-event.component',
                link: '/search/search-with-input-event.component',
                component: 'SearchWithInputEventComponent',
                name: 'Search With Input Event'
            }
        ]
    },
    {
        path: 'sidebar',
        children: [
            {
                path: 'sidebar-close.component',
                link: '/sidebar/sidebar-close.component',
                component: 'SidebarCloseComponent',
                name: 'Sidebar Close'
            },
            {
                path: 'sidebar-compacted.component',
                link: '/sidebar/sidebar-compacted.component',
                component: 'SidebarCompactedComponent',
                name: 'Sidebar Compacted'
            },
            {
                path: 'sidebar-fixed.component',
                link: '/sidebar/sidebar-fixed.component',
                component: 'SidebarFixedComponent',
                name: 'Sidebar Fixed'
            },
            {
                path: 'sidebar-one-test.component',
                link: '/sidebar/sidebar-one-test.component',
                component: 'SidebarOneTestComponent',
                name: 'Sidebar One Test'
            },
            {
                path: 'sidebar-right.component',
                link: '/sidebar/sidebar-right.component',
                component: 'SidebarRightComponent',
                name: 'Sidebar Right'
            },
            {
                path: 'sidebar-showcase.component',
                link: '/sidebar/sidebar-showcase.component',
                component: 'SidebarShowcaseComponent',
                name: 'Sidebar Showcase'
            },
            {
                path: 'sidebar-test.component',
                link: '/sidebar/sidebar-test.component',
                component: 'SidebarTestComponent',
                name: 'Sidebar Test'
            },
            {
                path: 'sidebar-three-test.component',
                link: '/sidebar/sidebar-three-test.component',
                component: 'SidebarThreeTestComponent',
                name: 'Sidebar Three Test'
            },
            {
                path: 'sidebar-toggle.component',
                link: '/sidebar/sidebar-toggle.component',
                component: 'SidebarToggleComponent',
                name: 'Sidebar Toggle'
            },
            {
                path: 'sidebar-two-test.component',
                link: '/sidebar/sidebar-two-test.component',
                component: 'SidebarTwoTestComponent',
                name: 'Sidebar Two Test'
            }
        ]
    },
    {
        path: 'menu',
        children: [
            {
                path: 'menu-test.component',
                link: '/menu/menu-test.component',
                component: 'MenuTestComponent',
                name: 'Menu Test',
                children: [
                    {
                        path: '1',
                        link: '/menu/menu-test.component/1',
                        component: 'MenuItem1Component',
                        name: 'Menu Item1'
                    },
                    {
                        path: '2',
                        link: '/menu/menu-test.component/2',
                        component: 'MenuItem2Component',
                        name: 'Menu Item2'
                    },
                    {
                        path: '12',
                        link: '/menu/menu-test.component/12',
                        component: 'MenuItem1Component',
                        name: 'Menu Item1'
                    },
                    {
                        path: '3',
                        link: '/menu/menu-test.component/3',
                        component: 'MenuItem3Component',
                        name: 'Menu Item3',
                        children: [
                            {
                                path: '1',
                                link: '/menu/menu-test.component/3/1',
                                component: 'MenuItem31Component',
                                name: 'Menu Item31'
                            },
                            {
                                path: '2',
                                link: '/menu/menu-test.component/3/2',
                                component: 'MenuItem32Component',
                                name: 'Menu Item32'
                            },
                            {
                                path: '3',
                                link: '/menu/menu-test.component/3/3',
                                component: 'MenuItem33Component',
                                name: 'Menu Item33',
                                children: [
                                    {
                                        path: '1',
                                        link: '/menu/menu-test.component/3/3/1',
                                        component: 'MenuItem331Component',
                                        name: 'Menu Item331'
                                    },
                                    {
                                        path: '2',
                                        link: '/menu/menu-test.component/3/3/2',
                                        component: 'MenuItem332Component',
                                        name: 'Menu Item332'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: '4',
                        link: '/menu/menu-test.component/4',
                        component: 'MenuItem4Component',
                        name: 'Menu Item4'
                    }
                ]
            }
        ]
    },
    {
        path: 'user',
        children: [
            {
                path: 'user-test.component',
                link: '/user/user-test.component',
                component: 'UserTestComponent',
                name: 'User Test'
            }
        ]
    },
    {
        path: 'azure',
        children: [
            {
                path: 'callback',
                link: '/azure/callback',
                component: 'AzureCallbackComponent',
                name: 'Azure Callback'
            }
        ]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                link: '/auth/login',
                component: 'NbLoginComponent',
                name: 'Nb Login'
            },
            {
                path: 'register',
                link: '/auth/register',
                component: 'NbRegisterComponent',
                name: 'Nb Register'
            },
            {
                path: 'logout',
                link: '/auth/logout',
                component: 'NbLogoutComponent',
                name: 'Nb Logout'
            },
            {
                path: 'request-password',
                link: '/auth/request-password',
                component: 'NbRequestPasswordComponent',
                name: 'Nb Request Password'
            },
            {
                path: 'reset-password',
                link: '/auth/reset-password',
                component: 'NbResetPasswordComponent',
                name: 'Nb Reset Password'
            },
            {
                path: 'acl/acl-test.component',
                link: '/auth/acl/acl-test.component',
                component: 'AclTestComponent',
                name: 'Acl Test'
            },
            {
                path: 'auth-guard.service',
                link: '/auth/auth-guard.service',
                component: 'AuthPlaygroundComponent',
                name: 'Auth Playground'
            },
            {
                path: 'api-calls.component',
                link: '/auth/api-calls.component',
                component: 'PlaygroundApiCallsComponent',
                name: 'Playground Api Calls'
            }
        ]
    },
    {
        path: 'firebase',
        children: [
            {
                path: 'login',
                link: '/firebase/login',
                component: 'NbLoginComponent',
                name: 'Nb Login'
            },
            {
                path: 'register',
                link: '/firebase/register',
                component: 'NbRegisterComponent',
                name: 'Nb Register'
            },
            {
                path: 'logout',
                link: '/firebase/logout',
                component: 'NbLogoutComponent',
                name: 'Nb Logout'
            },
            {
                path: 'request-password',
                link: '/firebase/request-password',
                component: 'NbRequestPasswordComponent',
                name: 'Nb Request Password'
            },
            {
                path: 'reset-password',
                link: '/firebase/reset-password',
                component: 'NbResetPasswordComponent',
                name: 'Nb Reset Password'
            },
            {
                path: 'password-showcase',
                link: '/firebase/password-showcase',
                component: 'PasswordAuthShowcaseComponent',
                name: 'Password Auth Showcase'
            },
            {
                path: 'social-auth-showcase',
                link: '/firebase/social-auth-showcase',
                component: 'IdentityProvidersAuthShowcaseComponent',
                name: 'Identity Providers Auth Showcase'
            }
        ]
    },
    {
        path: 'smart-home',
        children: [
            {
                path: 'auth',
                children: [
                    {
                        path: 'login',
                        link: '/smart-home/auth/login',
                        component: 'LoginComponent',
                        name: 'Login'
                    }
                ]
            }
        ]
    }
]
