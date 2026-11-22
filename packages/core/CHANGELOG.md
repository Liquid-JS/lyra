# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [22.0.0-alpha.3](https://github.com/Liquid-JS/lyra/compare/v22.0.0-alpha.2...v22.0.0-alpha.3) (2026-11-22)

### Bug Fixes

* **core:** keep a chat form's text clear of its send button while it leaves with an animation ([0545ffc](https://github.com/Liquid-JS/lyra/commit/0545ffca0f328025ca999cf6233be161cde9c096))
* **core:** keep a form field's padding for its addons while it leaves with an animation ([9ef8f76](https://github.com/Liquid-JS/lyra/commit/9ef8f7668ddb9098910b04fa3c65465b5339a637))
* **core:** keep dialogs open through navigation by default, and only close on leaving the page ([ab74077](https://github.com/Liquid-JS/lyra/commit/ab740771ff293de6e02160b86d042a04b02cea16))
* **core:** open and close a menu submenu that appears or goes while its item shows ([18ca79e](https://github.com/Liquid-JS/lyra/commit/18ca79e3ccf2a9a4d5d9bfb4b2ac9aed63493984))
* **core:** open and close accordion items smoothly when their content or the page changes ([f9f166b](https://github.com/Liquid-JS/lyra/commit/f9f166bac21ae5b69470e9e14485162e31bff36d))
* **core:** render a dialog's content as it opens, rather than a frame later ([14f4928](https://github.com/Liquid-JS/lyra/commit/14f4928041e6a57656c98aafd9038eee696b0846))
* **core:** show a file drop preview at its own size, centred, rather than stretched across ([d49732e](https://github.com/Liquid-JS/lyra/commit/d49732ef9fa0264b1bffd338f6cb7acfc56776e1))
* versions ([3b2b961](https://github.com/Liquid-JS/lyra/commit/3b2b961ba1570ec5ba7f879317d653e9e9f0e399))

### Features

* **core:** add highlightParents to nb-menu and collapsible to menu items ([74c1109](https://github.com/Liquid-JS/lyra/commit/74c1109543070efae8231f556320fe65d7985996))
* **core:** create accordion item content on first expand with nbAccordionItemBodyContent ([4997bbd](https://github.com/Liquid-JS/lyra/commit/4997bbdf0d01235b14e5e793022fa91ee15cc023))

# [22.0.0-alpha.1](https://github.com/Liquid-JS/lyra/compare/v22.0.0-alpha.0...v22.0.0-alpha.1) (2026-11-21)

### Bug Fixes

* **core:** keep nb-select's writeValue from waking the effect that calls it ([7c0ca7a](https://github.com/Liquid-JS/lyra/commit/7c0ca7aa4020f1aed9f219153fa7c0d51b0e1a08))
* **core:** render nbNumberInput on the server, whose DOM has no validity ([b7ea80e](https://github.com/Liquid-JS/lyra/commit/b7ea80ede5fe66253223aed0b2df98acd3354422))
* **core:** write form values untracked and skip values a control already holds ([f1f7839](https://github.com/Liquid-JS/lyra/commit/f1f78390c1c60d9887e0a9df0b892d4e8e0c7158))

# 22.0.0-alpha.0 (2026-11-21)

### Bug Fixes

* **core:** make actions reachable in Safari and set their badges over the icon's corner ([49eeb46](https://github.com/Liquid-JS/lyra/commit/49eeb469a2769351bf463a1fb5db90cc656cf038))

### Features

* **core:** add a data table with sorting, filtering, paging, selection and detail rows ([6e0cb9d](https://github.com/Liquid-JS/lyra/commit/6e0cb9ddd1991c2ef08d932015a386779fdca346))
* **core:** add a horizontal menu, parent items with their own page and a selected-item bar ([78ca80e](https://github.com/Liquid-JS/lyra/commit/78ca80e6f08c3f37222dca3d5b739f85b6cc0a23))
* **core:** add a no-data row, compact, striped and floating variants and aria-sort to tree grids ([103a0ab](https://github.com/Liquid-JS/lyra/commit/103a0ab88e390fff0ece11e94a3661962d1f03b3))
* **core:** add a ring shape to the progress bar and expose it to assistive technologies ([48aaad2](https://github.com/Liquid-JS/lyra/commit/48aaad2ab88ce52824ce4b37090a6a5738853b50))
* **core:** add a skeleton directive for content placeholders ([f3da500](https://github.com/Liquid-JS/lyra/commit/f3da500e0ba37f900b83e50a92dd02afcd528d35))
* **core:** add a slider for a number or a range ([b068d9b](https://github.com/Liquid-JS/lyra/commit/b068d9b6fa06ce2797a450af529daa5742a77f3e))
* **core:** add a table of contents with scroll-spy ([030b34e](https://github.com/Liquid-JS/lyra/commit/030b34e9117ae8a44079233e5a7bb1d41f8df871))
* **core:** add a theme select and a text size switcher ([db118c6](https://github.com/Liquid-JS/lyra/commit/db118c651daa18cb157a5018f1ddb110ecd1c1d2))
* **core:** add an inline position to the badge for status dots and labels ([84104e1](https://github.com/Liquid-JS/lyra/commit/84104e1a55f4f5a46527b3a3d53e6a8ec60f51cf))
* **core:** add confirm dialogs, dialog positions, open and close animations and dialog semantics ([80f2f94](https://github.com/Liquid-JS/lyra/commit/80f2f94bb71fb898ccbc78650fe3f3d4918f38a0))
* **core:** add form validation display with nbValidation, error messages and nbLabel ([cbc05a3](https://github.com/Liquid-JS/lyra/commit/cbc05a311035c131babd208059664b7ad7129ee1))
* **core:** add nb-breadcrumbs, a trail of links to the pages leading to the current one ([0d594cf](https://github.com/Liquid-JS/lyra/commit/0d594cfd1086988a9dc17f97df255e43b4277927))
* **core:** add nb-divider, a themed line between content ([01cc2c4](https://github.com/Liquid-JS/lyra/commit/01cc2c4c8d30383a3ad4cd99a4ee025b787d5365))
* **core:** add nb-file-drop, a form control for dropping, pasting or choosing files ([857b18c](https://github.com/Liquid-JS/lyra/commit/857b18cced208480198b21e2a63fdf2f66bcbb75))
* **core:** add nb-input-group to join adjacent controls ([38b274c](https://github.com/Liquid-JS/lyra/commit/38b274c2b922a0378089c73f7853fddaf029f2da))
* **core:** add nb-page-indicator to show a pager's pages as dots ([116f995](https://github.com/Liquid-JS/lyra/commit/116f9957bed086b0db7bc31d390e7c77bd1b7336))
* **core:** add nb-pagination to move through the pages of a list or table ([e91bfae](https://github.com/Liquid-JS/lyra/commit/e91bfae6e8af07562362141e340cf32c133cecef))
* **core:** add nbNumberInput and a ghost input, and size inputs like the other controls ([5c962cc](https://github.com/Liquid-JS/lyra/commit/5c962cc7f412d3c2eec086a6425026587b4dc543))
* **core:** add nbPopoverDisabled, disclosure states and an entrance animation to popovers ([7858af6](https://github.com/Liquid-JS/lyra/commit/7858af6de046bc11b3c393982532f93b68ed60cb))
* **core:** add nested options, windowed option lists and accessible options ([b00546d](https://github.com/Liquid-JS/lyra/commit/b00546db91318a01ca0dfd99b2bda6d2943bd121))
* **core:** announce spinners to assistive technologies and drive nbSpinner by its inputs ([2515567](https://github.com/Liquid-JS/lyra/commit/2515567a0774f60b46a30aca5102b2a60a8642e7))
* **core:** base the themes on CSS custom properties, with Material themes and status palettes ([1233f05](https://github.com/Liquid-JS/lyra/commit/1233f05fee1398613501be87e396acce172a319a))
* **core:** give cards filled and floating appearances, whole-card links, media and header actions ([bfcb7ea](https://github.com/Liquid-JS/lyra/commit/bfcb7ead35b68259d76743cf46df81778a33aae9))
* **core:** give nbButton a loading state, edges, app-wide defaults and controls' shared height ([21c590c](https://github.com/Liquid-JS/lyra/commit/21c590cd654196fa03ea1dcff88cde67de3b82f0))
* **core:** give radios sizes, a group name of their own and a checkbox-like checkedChange ([093b338](https://github.com/Liquid-JS/lyra/commit/093b338ba7bb6a1f5c0815482455c15c7f2ba6df))
* **core:** give route tabs keyboard focus rings, current-page state and narrow-screen padding ([1a1fc42](https://github.com/Liquid-JS/lyra/commit/1a1fc4201fa1369720e170d3fa7965f6189f9d05))
* **core:** give the accordion a card's look, a floating appearance and keyboard-friendly headers ([a52d2e0](https://github.com/Liquid-JS/lyra/commit/a52d2e0fbbcf7b10444eb08bf8a8889007ede651))
* **core:** give the alert filled, outline and accent appearances and a ghost close button ([15fadd3](https://github.com/Liquid-JS/lyra/commit/15fadd36f04eb99324fd14de0c2b8313306a8847))
* **core:** give the chat a card's look, multi-line messages, pasted files and floating appearance ([8bad904](https://github.com/Liquid-JS/lyra/commit/8bad904e151bcc9f95474379e411ea14cb94b227))
* **core:** give the checkbox sizes, validation display and Safari keyboard access ([107bd85](https://github.com/Liquid-JS/lyra/commit/107bd856f7938f9bde5db2eabf806d2e12773c58))
* **core:** give the context menu offset and disabled inputs, keyboard focus and disclosure state ([6319eda](https://github.com/Liquid-JS/lyra/commit/6319eda4cd2e70a16c6153e07a8b866e61f00095))
* **core:** give the datepicker month and year modes, keyboard access and kept values on errors ([71b9ca5](https://github.com/Liquid-JS/lyra/commit/71b9ca593e48e9641ec02fbdd0b1f9e6ea36f85b))
* **core:** give the select search, chips, select all, nested options and nullable values ([d2c07bc](https://github.com/Liquid-JS/lyra/commit/d2c07bc7c1d8e5f78a5ef64245793fdffc69a13e))
* **core:** give the timepicker validation, min and max, and full keyboard support ([a70e56e](https://github.com/Liquid-JS/lyra/commit/a70e56e50348adf9d54bfea8b6a2c35631fda3dc))
* **core:** give the toggle sizes, validation and a switcher that stands out when off ([6f6de47](https://github.com/Liquid-JS/lyra/commit/6f6de47d44efb5d7d829f92707201e63236d7e88))
* **core:** give toasts actions, a close button, pause on hover and live announcements ([ac4eb0e](https://github.com/Liquid-JS/lyra/commit/ac4eb0e5918d6663291257bae32bd832bc3c7d6e))
* **core:** give windows states, stacking, a shared backdrop and dialog semantics ([64ff0aa](https://github.com/Liquid-JS/lyra/commit/64ff0aa17f9545abbf62d298641aeadeda8af415))
* **core:** lay out list items with a title, description and actions, and link whole items ([e88b1be](https://github.com/Liquid-JS/lyra/commit/e88b1befee596b42166e800db24bde4c092e19fe))
* **core:** let apps add icons to a registered pack and pick the icons' style ([903da15](https://github.com/Liquid-JS/lyra/commit/903da150f7668dc1bb8337acb1108270783a13df))
* **core:** let the calendar pick a month or a year and work by keyboard as a grid ([c28b267](https://github.com/Liquid-JS/lyra/commit/c28b267fe821d12feba8fd069d2910f8302b35e2))
* **core:** let the sidebar close itself over the content and animate between its states ([8904c5e](https://github.com/Liquid-JS/lyra/commit/8904c5e9e884103032ff09a3d8959c0b1b8f3876))
* **core:** let the tag list manage its tags as a form control and add a hero tag ([1047513](https://github.com/Liquid-JS/lyra/commit/1047513d405ca1e6a8cc15c5c86aa29a3ceae12d))
* **core:** let tooltips show templates and describe their host for assistive technologies ([0f7c187](https://github.com/Liquid-JS/lyra/commit/0f7c187a5137da800154bea49392a48f05b4e360))
* **core:** make core standalone, signal-based and zoneless, with app-wide defaults and texts ([ef77cb1](https://github.com/Liquid-JS/lyra/commit/ef77cb19d466830a881ce41ad188e9623061fee2))
* **core:** make overlays follow their host, close one per Escape and open inside modal dialogs ([34befc5](https://github.com/Liquid-JS/lyra/commit/34befc52dcf9fc49828f83bd5f33581212b23534))
* **core:** make the button group a form control with a select-like value and separate buttons ([514ee4a](https://github.com/Liquid-JS/lyra/commit/514ee4ae706e1397f9ecd1f453a25bb066348890))
* **core:** make the calendar kit's pickers keyboard grids and read dates in the given format ([35a5afb](https://github.com/Liquid-JS/lyra/commit/35a5afb2aeda652ef1f23c859080a8455a453ec9))
* **core:** make the search accessible, translatable and one service for the app ([0c77ce6](https://github.com/Liquid-JS/lyra/commit/0c77ce65295bf0222d6afafc00bb608138dd211a))
* **core:** make the stepper keyboard-friendly and fit it across a phone ([e1d60f5](https://github.com/Liquid-JS/lyra/commit/e1d60f58779afaddd9bae2bcca225e14937c0905))
* **core:** make the tabset a keyboard tab list that fits narrow screens ([c41afc6](https://github.com/Liquid-JS/lyra/commit/c41afc63da8873809bad2a54a4e5847ff41fad9f))
* **core:** set up standalone and NgModule apps of the current Angular CLI with ng add ([5da45d7](https://github.com/Liquid-JS/lyra/commit/5da45d79ae4b2cd909884bc53851c0f669f6be92))
* **core:** show the user's picture as an image that falls back to initials coloured by status ([21d9a78](https://github.com/Liquid-JS/lyra/commit/21d9a78887e95d5dea15779986ef4623c7efb767))
* **core:** size form field addons to their content and give fields a starting width ([6b46157](https://github.com/Liquid-JS/lyra/commit/6b461576cb8e601be1038dd346d64d8232d42200))
* **core:** size the autocomplete's options to its field and make its list accessible ([bb8fd16](https://github.com/Liquid-JS/lyra/commit/bb8fd16c9e9a00f7c3d69d7965fecabb5450dff5))
* **core:** stick the layout's fixed footer, size it to the dynamic viewport and scope its styles ([f15f8d2](https://github.com/Liquid-JS/lyra/commit/f15f8d2cf42b0f9ca5386b4e65330860a10f23c7))
