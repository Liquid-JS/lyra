// The appearances of components, shared with the component defaults.

/** How an alert shows its status: `filled` with its colour, `outline` tinted with a border, or with an `accent` on top. */
export type NbAlertAppearance = 'filled' | 'outline' | 'accent';

export type NbButtonAppearance = 'filled' | 'outline' | 'ghost' | 'hero';

export type NbButtonToggleAppearance = Exclude<NbButtonAppearance, 'hero'>;

export type NbSelectAppearance = 'outline' | 'filled' | 'hero' | 'ghost';

export type NbTagAppearance = 'filled' | 'outline' | 'hero';
