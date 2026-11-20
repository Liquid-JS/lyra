// The texts of components, shared with the texts service.

export interface NbFileDropTexts {
  /** The prompt when nothing is selected, for a single file. */
  prompt: string;
  /** The prompt when nothing is selected, for multiple files, and below the files. */
  promptMultiple: string;
  /** Shown while files are dragged over the drop zone. */
  dropHere: string;
  /** Label of the button that removes a file, given its name. */
  remove: (name: string) => string;
  /** Announced to screen readers when files are added, given their names as a list, e.g. "a.png and b.png". */
  added: (names: string) => string;
  /** Announced to screen readers when files aren't added, given their names as a list; `rejected` tells the app why. */
  notAdded: (names: string) => string;
}

export interface NbPaginationTexts {
  /** Names the pagination landmark. */
  label: string;
  /** The items shown, e.g. "11–20 of 57"; the numbers come formatted for the locale. */
  range: (start: string, end: string, length: string) => string;
  /** Label of the page size select. */
  pageSize: string;
  /** Label of the page number input. */
  page: string;
  /** Follows the page number input, e.g. "of 6". */
  pageCount: (count: string) => string;
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface NbSelectTexts {
  /** Placeholder and label of the search input of a `searchable` select. */
  search: string;
  /** Shown when no option matches the search. */
  noMatches: string;
  /** Label of the row that goes back from a nested option the list is drilled into. */
  back: (title: string) => string;
}

export interface NbTimepickerLocalizationConfig {
  hoursText: string;
  minutesText: string;
  secondsText: string;
  ampmText: string;
  /** Header of the single-column time list. */
  timeText?: string;
  /** Names the time picker's popup. */
  dialogText?: string;
}
