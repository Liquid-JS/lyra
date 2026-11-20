/**
 * The icons page's categories, in the order it shows them, each with its icons by their base name (without
 * `-outline`). An icon not listed here shows under "More", last.
 */
export const NGD_ICON_CATEGORIES: readonly { name: string; icons: readonly string[] }[] = [
  {
    name: 'Interface',
    icons: [
      'menu', 'menu-2', 'menu-arrow', 'more-horizontal', 'more-vertical', 'grid', 'layout', 'layers', 'browser',
      'options', 'options-2', 'settings', 'settings-2', 'toggle-left', 'toggle-right', 'radio-button-off',
      'radio-button-on', 'checkmark', 'checkmark-bold', 'checkmark-circle', 'checkmark-circle-2', 'checkmark-square', 'checkmark-square-2',
      'done-all', 'close', 'close-circle', 'close-square', 'plus', 'plus-circle', 'plus-square', 'minus', 'minus-bold',
      'minus-circle',
      'minus-square', 'square', 'search', 'zoom-in', 'zoom-out', 'eye', 'eye-off', 'eye-off-2', 'funnel', 'home',
      'external-link', 'log-in', 'log-out', 'power', 'lock', 'unlock', 'refresh', 'sync', 'loader', 'slash', 'keypad',
      'qr-code',
    ],
  },
  {
    name: 'Arrows',
    icons: [
      'arrow-back', 'arrow-forward', 'arrow-upward', 'arrow-downward', 'arrow-ios-back', 'arrow-ios-forward',
      'arrow-ios-upward', 'arrow-ios-downward', 'arrow-circle-left', 'arrow-circle-right', 'arrow-circle-up',
      'arrow-circle-down', 'arrowhead-left', 'arrowhead-right', 'arrowhead-up', 'arrowhead-down', 'caret-left',
      'caret-right', 'caret-up', 'caret-down', 'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
      'corner-down-left', 'corner-down-right', 'corner-left-down', 'corner-left-up', 'corner-right-down',
      'corner-right-up', 'corner-up-left', 'corner-up-right', 'diagonal-arrow-left-down', 'diagonal-arrow-left-up',
      'diagonal-arrow-right-down', 'diagonal-arrow-right-up', 'expand', 'collapse', 'move', 'swap',
    ],
  },
  {
    name: 'Status',
    icons: [
      'alert-circle', 'alert-triangle', 'info', 'question-mark', 'question-mark-circle', 'shield', 'shield-off', 'bell',
      'bell-off', 'star', 'heart', 'flag', 'award', 'bookmark',
    ],
  },
  {
    name: 'Editing & text',
    icons: [
      'edit', 'edit-2', 'copy', 'scissors', 'crop', 'save', 'trash', 'trash-2', 'undo', 'backspace', 'bold', 'italic',
      'strikethrough', 'heading', 'text', 'quote', 'align-left', 'align-center', 'align-right', 'indent', 'outdent',
      'list', 'list-checked', 'list-numbered', 'link', 'link-2', 'attach', 'attach-2', 'hash', 'translate', 'code',
      'code-block', 'terminal', 'brush', 'color-palette', 'color-picker', 'pantone', 'flip', 'flip-2', 'table',
      'table-column-add-left', 'table-column-add-right', 'table-column-remove', 'table-remove', 'table-row-add-above',
      'table-row-add-below', 'table-row-remove',
    ],
  },
  {
    name: 'Files',
    icons: [
      'file', 'file-add', 'file-remove', 'file-text', 'folder', 'folder-add', 'folder-open', 'folder-remove', 'archive',
      'clipboard', 'inbox', 'download', 'upload', 'cloud-download', 'cloud-upload', 'code-download', 'hard-drive',
      'printer', 'book', 'book-open',
    ],
  },
  {
    name: 'Communication',
    icons: [
      'email', 'at', 'message-circle', 'message-square', 'paper-plane', 'phone', 'phone-call', 'phone-missed',
      'phone-off', 'voicemail', 'share', 'broadcast',
    ],
  },
  {
    name: 'People',
    icons: ['person', 'person-add', 'person-delete', 'person-done', 'person-remove', 'people', 'smiling-face'],
  },
  {
    name: 'Media',
    icons: [
      'play', 'play-circle', 'pause', 'pause-circle', 'stop-circle', 'skip-back', 'skip-forward', 'rewind-left', 'rewind-right',
      'repeat', 'shuffle', 'shuffle-2', 'film', 'video', 'video-off', 'camera', 'image', 'image-2', 'mic', 'mic-off',
      'music', 'headphones', 'speaker', 'volume-up', 'volume-down', 'volume-mute', 'volume-off', 'closed-captions',
      'picture-in-picture', 'cast',
    ],
  },
  {
    name: 'Devices',
    icons: ['smartphone', 'monitor', 'tv', 'battery', 'charging', 'bluetooth', 'wifi', 'wifi-off', 'shake'],
  },
  {
    name: 'Charts',
    icons: ['activity', 'bar-chart', 'bar-chart-2', 'pie-chart', 'pie-chart-2', 'trending-up', 'trending-down', 'percent'],
  },
  {
    name: 'Shopping',
    icons: ['shopping-bag', 'shopping-cart', 'credit-card', 'pricetags', 'gift', 'truck', 'briefcase'],
  },
  {
    name: 'Places & things',
    icons: [
      'map', 'compass', 'navigation', 'navigation-2', 'globe', 'globe-2', 'globe-3', 'pin', 'car', 'rocket', 'clock',
      'calendar', 'sun', 'moon', 'umbrella', 'droplet', 'droplet-off', 'flame', 'flash', 'flash-off', 'thermometer',
      'thermometer-plus', 'thermometer-minus', 'coffee', 'utensils', 'bulb', 'cube', 'puzzle',
    ],
  },
  {
    name: 'Brands',
    icons: ['behance', 'facebook', 'github', 'google', 'linkedin', 'npm', 'twitter'],
  },
];
