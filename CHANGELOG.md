# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [22.0.0-alpha.5](https://github.com/Liquid-JS/lyra/compare/v22.0.0-alpha.4...v22.0.0-alpha.5) (2026-11-24)

### Features

* **extras:** add nb-markdown-renderer, the markdown viewer without its processor and styles ([57f59a1](https://github.com/Liquid-JS/lyra/commit/57f59a1635f4ca03a288f9ede7b6405f5509e36f))

# [22.0.0-alpha.4](https://github.com/Liquid-JS/lyra/compare/v22.0.0-alpha.3...v22.0.0-alpha.4) (2026-11-22)

### Bug Fixes

* **core:** clip an accordion item's body only while it's closed or animating ([dc2a8f8](https://github.com/Liquid-JS/lyra/commit/dc2a8f805db73a6f53adb8ea2f3d6a9850afcd02))
* **extras:** show a focus ring on the markdown editor's toolbar buttons ([1d51e0e](https://github.com/Liquid-JS/lyra/commit/1d51e0e180d1497354d0366bd3c2cc20222c382a))

### Features

* **core:** give every focusable part the theme's focus ring, or a highlight where it reads as text ([5d5242e](https://github.com/Liquid-JS/lyra/commit/5d5242e9de8c7eab49f557f4075524e0d7b632ae))

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

# [22.0.0-alpha.2](https://github.com/Liquid-JS/lyra/compare/v22.0.0-alpha.1...v22.0.0-alpha.2) (2026-11-21)

### Bug Fixes

* accept the 22 prereleases of lyr-core and lyr-auth as peers ([1f35960](https://github.com/Liquid-JS/lyra/commit/1f359602ccaf5bab5a8c69f0a03d3b93e4ddbf80))

# [22.0.0-alpha.1](https://github.com/Liquid-JS/lyra/compare/v22.0.0-alpha.0...v22.0.0-alpha.1) (2026-11-21)

### Bug Fixes

* **core:** keep nb-select's writeValue from waking the effect that calls it ([7c0ca7a](https://github.com/Liquid-JS/lyra/commit/7c0ca7aa4020f1aed9f219153fa7c0d51b0e1a08))
* **core:** render nbNumberInput on the server, whose DOM has no validity ([b7ea80e](https://github.com/Liquid-JS/lyra/commit/b7ea80ede5fe66253223aed0b2df98acd3354422))
* **core:** write form values untracked and skip values a control already holds ([f1f7839](https://github.com/Liquid-JS/lyra/commit/f1f78390c1c60d9887e0a9df0b892d4e8e0c7158))
* **extras:** write form values untracked in the phone input, mask, colour picker and markdown editor ([04f53bc](https://github.com/Liquid-JS/lyra/commit/04f53bc78a1a1dfce096c32e97df5aacca28b656))

# 22.0.0-alpha.0 (2026-11-21)

### Bug Fixes

* **accordion:** extract inner elements styles outside accordion ([#2536](https://github.com/Liquid-JS/lyra/issues/2536)) ([9089690](https://github.com/Liquid-JS/lyra/commit/90896900ff44d4bbcee37d4c9ccfd0785accdeae))
* **accordion:** fix accordion border-radius and shadow ([#584](https://github.com/Liquid-JS/lyra/issues/584)) ([22ba6ef](https://github.com/Liquid-JS/lyra/commit/22ba6ef68c1a0e21505279e63cb6ad7fe9877cb5))
* **accordion:** fix incorrect accordion mapping ([#1535](https://github.com/Liquid-JS/lyra/issues/1535)) ([3a0382c](https://github.com/Liquid-JS/lyra/commit/3a0382c08158f1a5645a4c717f51471f1bede5da))
* **accordion:** prevent styling of projected icons ([#1836](https://github.com/Liquid-JS/lyra/issues/1836)) ([a7b55da](https://github.com/Liquid-JS/lyra/commit/a7b55da766fb8f3fc8a148f256b344930f7473ed))
* **actions:** icon button alignment ([#1895](https://github.com/Liquid-JS/lyra/issues/1895)) ([04d7e33](https://github.com/Liquid-JS/lyra/commit/04d7e33674c624aca19d5017db06928f81de9a2f))
* add missing components exports to public api ([#1487](https://github.com/Liquid-JS/lyra/issues/1487)) ([2f551aa](https://github.com/Liquid-JS/lyra/commit/2f551aac768fe1dcf88c55d5c2b53c349eae8829))
* add missing modules in examples ([#1424](https://github.com/Liquid-JS/lyra/issues/1424)) ([1139848](https://github.com/Liquid-JS/lyra/commit/1139848651d3473546a684947415954b52835a28))
* add missing public api entries ([#1545](https://github.com/Liquid-JS/lyra/issues/1545)) ([fe56655](https://github.com/Liquid-JS/lyra/commit/fe566557bc5ff08bf7da53f3211077fc079c5f65))
* add polyfills for IE (es7 array & object) ([#361](https://github.com/Liquid-JS/lyra/issues/361)) ([3f91898](https://github.com/Liquid-JS/lyra/commit/3f91898de17b904614aa2d5515a37b2847d164bb)), closes [#272](https://github.com/Liquid-JS/lyra/issues/272)
* add scroll strategy options to public api ([#2129](https://github.com/Liquid-JS/lyra/issues/2129)) ([79ab083](https://github.com/Liquid-JS/lyra/commit/79ab083c98c0cad23c2c597dc01e3465ce5b0f55))
* **aio:** fix todo, remove a 'selected' option ([0fa1202](https://github.com/Liquid-JS/lyra/commit/0fa12029205ebd157f2b9e040f88f31da6a0c351))
* **aio:** remove the demo project, update angular to 4.0.2, remove ng-bootstrap ([9740eec](https://github.com/Liquid-JS/lyra/commit/9740eec18af2c3caf5632260fef8d3e01b98999d))
* **aot:** fix styles import ([3fa775f](https://github.com/Liquid-JS/lyra/commit/3fa775f262656314373f34b87eabc445b6274d39))
* **app-routing:** add 404 route ([92469d2](https://github.com/Liquid-JS/lyra/commit/92469d2f12eb8c95b9db8d9ce89010f920a8bc27))
* **app\pages\editors\ckeditor:** property 'CKEDITOR_BASEPATH' does not ([5b02d10](https://github.com/Liquid-JS/lyra/commit/5b02d1073b40e1a81a640a00ef369fefe3585236))
* **app:** fix merge issues ([1c225eb](https://github.com/Liquid-JS/lyra/commit/1c225eb9bc5942ac4b2438c0267138b58fcdb25c))
* assets ([612972c](https://github.com/Liquid-JS/lyra/commit/612972c4a4f38224147e32d30392882bc9dcaf3b))
* **auth:** fix OAuth2 strategy grant_type password to send username, not email ([#659](https://github.com/Liquid-JS/lyra/issues/659)), closes [#653](https://github.com/Liquid-JS/lyra/issues/653)
* **auth:** add client_id to the refresh request ([#2350](https://github.com/Liquid-JS/lyra/issues/2350)) ([10b01fa](https://github.com/Liquid-JS/lyra/commit/10b01fae48b74bbc2f9c0d8a138119cf0237c125))
* **auth:** add login page email autofocus ([5481ab2](https://github.com/Liquid-JS/lyra/commit/5481ab28eda2a0a20039347d1de9a195a8e0cd10))
* **auth:** add missed of import ([8ed12ba](https://github.com/Liquid-JS/lyra/commit/8ed12ba4cacae79a6446b7b4ed2d2974d8f87623))
* **auth:** add missed of import [#2](https://github.com/Liquid-JS/lyra/issues/2) ([3f9f889](https://github.com/Liquid-JS/lyra/commit/3f9f88902f8dde3df70fb93b09497ecfa5b5e8a4))
* **auth:** add missing export for secured http service ([#1166](https://github.com/Liquid-JS/lyra/issues/1166)) ([a7418ca](https://github.com/Liquid-JS/lyra/commit/a7418cac87908082a21579b6a6c7df36c3697844))
* **auth:** add missing rxjs import and fix isAuthenticated function ([521fff6](https://github.com/Liquid-JS/lyra/commit/521fff62d29b28468e8e38262e85f697e60c0cb3))
* **auth:** allow empty logout endpoint ([#1211](https://github.com/Liquid-JS/lyra/issues/1211)) ([564138d](https://github.com/Liquid-JS/lyra/commit/564138d5590110c05b3d13b05f366605fdb5050e))
* **auth:** apply standard vars to all themes ([f425885](https://github.com/Liquid-JS/lyra/commit/f4258850597254115977800e1822d14f5961ef25))
* **auth:** don't import child routes as it will rewrite the app routes ([#920](https://github.com/Liquid-JS/lyra/issues/920)) ([d054a73](https://github.com/Liquid-JS/lyra/commit/d054a73d4c8eb8522d5031dfe5b603ea0cd8eeac))
* **auth:** don't import http module ([#919](https://github.com/Liquid-JS/lyra/issues/919)) ([fd2c106](https://github.com/Liquid-JS/lyra/commit/fd2c106ad9f13576e4b5ece9d2e4491b304f1455)), closes [#631](https://github.com/Liquid-JS/lyra/issues/631)
* **auth:** don't import http module ([#919](https://github.com/Liquid-JS/lyra/issues/919)) ([995de58](https://github.com/Liquid-JS/lyra/commit/995de58e8dc23d175b55e6d3ebb49d3da07f489f)), closes [#631](https://github.com/Liquid-JS/lyra/issues/631)
* **auth:** fix "resolve values statically" issue ([2f948ba](https://github.com/Liquid-JS/lyra/commit/2f948ba8fbd12b816700ced06052d29918d66362))
* **auth:** fix `isAuthenticatedOrRefresh` to not refresh token with no value ([#708](https://github.com/Liquid-JS/lyra/issues/708)) ([b29418f](https://github.com/Liquid-JS/lyra/commit/b29418f80f1cea60234d17790f95d541221994e3))
* **auth:** fix auth dummy provider & change auth components layout ([7d7a629](https://github.com/Liquid-JS/lyra/commit/7d7a6293ae249ade975a5e74dac5f762cdc472fd))
* **auth:** fix auth service isAuthenticated, onAuthenticationChange not returning a boolean, fix [#15](https://github.com/Liquid-JS/lyra/issues/15) ([93d45f1](https://github.com/Liquid-JS/lyra/commit/93d45f17f9b29131eb168ed854855e537d868af5))
* **auth:** fix auth services resolution ([87a63b1](https://github.com/Liquid-JS/lyra/commit/87a63b10041d3acbff04347639bb7edc10e255f4))
* **auth:** fix btn-pulse classes ([7c77c0e](https://github.com/Liquid-JS/lyra/commit/7c77c0e5c91d43a387bf4dea29184bf1587ad52c))
* **auth:** fix default token setter ([ee44135](https://github.com/Liquid-JS/lyra/commit/ee44135f3f512c1356db7c1c844290f1032982e5))
* **auth:** fix default token setter ([374a030](https://github.com/Liquid-JS/lyra/commit/374a03083754aa5b6b0081f8237b839f832c3251))
* **auth:** fix email-pass-auth.provider default logout message ([f67ceb8](https://github.com/Liquid-JS/lyra/commit/f67ceb8670147006673ddc570f2cf0a0b3d43772))
* **auth:** fix full-name validation error showing password validation text ([d12397b](https://github.com/Liquid-JS/lyra/commit/d12397bda4a8a2ad286f1488db4a95ec1695669b))
* **auth:** fix import error ([95fe953](https://github.com/Liquid-JS/lyra/commit/95fe95316bfe9603cd3d018d660a40b656b8faaf))
* **auth:** fix incorrect deep usage ([ae9dca1](https://github.com/Liquid-JS/lyra/commit/ae9dca1c4649cd91b2a5c7e9f960b5de2f561654))
* **auth:** fix jwt interceptor to set Authorization header only if token is valid ([#294](https://github.com/Liquid-JS/lyra/issues/294)) ([1e99ff3](https://github.com/Liquid-JS/lyra/commit/1e99ff30fb8310f72faf107e2067398cce5300e7))
* **auth:** fix login form validation ([047f9b0](https://github.com/Liquid-JS/lyra/commit/047f9b0457f58e720be0c4bfb308f2ec798e86ea))
* **auth:** fix logout action ([a28386e](https://github.com/Liquid-JS/lyra/commit/a28386edc79c92b646866e551fd27d9e078a018d))
* **auth:** fix scrollbar cutoff issue with auth ([#87](https://github.com/Liquid-JS/lyra/issues/87)) ([893d56a](https://github.com/Liquid-JS/lyra/commit/893d56adfe56a0d4f6e8fe9b9591a20e3bafade4))
* **auth:** fix token checking ([0a3725e](https://github.com/Liquid-JS/lyra/commit/0a3725e9efa62be7705ac1a39130cb3ee193076c))
* **auth:** fix token parceler suppressing `getClassByName` errors ([#548](https://github.com/Liquid-JS/lyra/issues/548)) ([ac41765](https://github.com/Liquid-JS/lyra/commit/ac41765b8b3af768c1f8f0d309d9c7f9efb1d2b3)), closes [#528](https://github.com/Liquid-JS/lyra/issues/528)
* **auth:** fix type of error response ([fefd8fa](https://github.com/Liquid-JS/lyra/commit/fefd8faca0cdd3bcd17c5918640c331e65222d52))
* **auth:** fix typo in request password sub-title ([#105](https://github.com/Liquid-JS/lyra/issues/105)) ([336b05e](https://github.com/Liquid-JS/lyra/commit/336b05e396d57f465a5891c6aa89f25cfdb88375))
* **auth:** include helpers into public api ([#1754](https://github.com/Liquid-JS/lyra/issues/1754)) ([f6f301b](https://github.com/Liquid-JS/lyra/commit/f6f301bed1ab74e51874ae2bb3ae80f6a09737a4))
* **auth:** make social icons bigger ([#1659](https://github.com/Liquid-JS/lyra/issues/1659)) ([d596e31](https://github.com/Liquid-JS/lyra/commit/d596e314e48df1249f34b368dd61c55def32343d))
* **auth:** move accept-group styles in auth-block ([174cfb5](https://github.com/Liquid-JS/lyra/commit/174cfb5ceb4b8f6a3282983146124777f4a68786))
* **auth:** refactor index.ts and fix module API ([8d4bda5](https://github.com/Liquid-JS/lyra/commit/8d4bda5a77722638961ed0141f381cc88e8417a7))
* **auth:** replace private with protected ([#1167](https://github.com/Liquid-JS/lyra/issues/1167)) ([ce86a3a](https://github.com/Liquid-JS/lyra/commit/ce86a3a8f4cdbdd5c76eac8804497ff84ea8e7ae))
* **auth:** return missed labels ([f446b99](https://github.com/Liquid-JS/lyra/commit/f446b995a1f7b19dbf945e152bae34e6314a1e48))
* **auth:** set correct theme for auth ([#2287](https://github.com/Liquid-JS/lyra/issues/2287)) ([c12873d](https://github.com/Liquid-JS/lyra/commit/c12873dd920aa5e3149bf37170d27af2225817b4))
* **auth:** two minor typos in auth components ([#1682](https://github.com/Liquid-JS/lyra/issues/1682)) ([44225d4](https://github.com/Liquid-JS/lyra/commit/44225d40f8c8754c1a8fe31e3b160a651c440d27))
* **auth:** use basic status instead deprecated empty string ([#2063](https://github.com/Liquid-JS/lyra/issues/2063)) ([a202468](https://github.com/Liquid-JS/lyra/commit/a2024682f4934ae59cd7fec4822282ef415682ee))
* **auth:** use socicons ([0aee121](https://github.com/Liquid-JS/lyra/commit/0aee1215db69bc3dfa15446948ad35a3edb27bad))
* **auth:** wrap auth block router in card ([c055bb3](https://github.com/Liquid-JS/lyra/commit/c055bb3bdb8a09c384c46dfbc81719d1bc36f4e9))
* **autocomplete:** fix show options for the autocomplete ([#3152](https://github.com/Liquid-JS/lyra/issues/3152)) ([a693caf](https://github.com/Liquid-JS/lyra/commit/a693caffbbf24172ac26efcbf7f25fe6e3d03b44))
* **autocomplete:** handle null and undefined values ([#2814](https://github.com/Liquid-JS/lyra/issues/2814)) ([7753027](https://github.com/Liquid-JS/lyra/commit/7753027cb9e1efec28cc26a54b18a53b5f2e1eb0))
* **autocomplete:** input focus behavior on value change ([#2852](https://github.com/Liquid-JS/lyra/issues/2852)) ([a86da11](https://github.com/Liquid-JS/lyra/commit/a86da1117c4a586df1fb8f453311fb3127041e01))
* **autocomplete:** update input element disabled state ([#2555](https://github.com/Liquid-JS/lyra/issues/2555)) ([23e59ba](https://github.com/Liquid-JS/lyra/commit/23e59ba1e08aa1810e4228bca906774e07cfd201))
* avoid to declare and export NbTable component ([#2126](https://github.com/Liquid-JS/lyra/issues/2126)) ([dbf5192](https://github.com/Liquid-JS/lyra/commit/dbf51920d18acf2aac3072440532dc9b219b19dc))
* **baAmChart:** remove unused scss file ([6bca50b](https://github.com/Liquid-JS/lyra/commit/6bca50b36e79594f62b5a95513ed592042775f3a))
* **baFullCalendar:** fix of incorrect filename ([c66de4a](https://github.com/Liquid-JS/lyra/commit/c66de4a295dac8c5835e5810e0fc33585fc65f5f))
* **baSidebar:** fix current selected menu ([affc122](https://github.com/Liquid-JS/lyra/commit/affc122a779b1a99a42778f1f9c998064155ad94))
* **bg:** correct image to pre-load and optimized bg image ([774bebf](https://github.com/Liquid-JS/lyra/commit/774bebfcd2e754ed518544f70822a9701d17a0ef))
* **bootstrap loader:** fix [#193](https://github.com/Liquid-JS/lyra/issues/193) by pinning bootstrap-loader version ([aa1a81c](https://github.com/Liquid-JS/lyra/commit/aa1a81c5834ca0936b1f9aa19f5206b4a83f7dcb))
* **bootstrap:** button group, modal and input ([#1540](https://github.com/Liquid-JS/lyra/issues/1540)) ([2a177c0](https://github.com/Liquid-JS/lyra/commit/2a177c09efcfe1a519dfddc30b6617aed1ea757f))
* **bootstrap:** fix a NgbModule importing ([a61bd29](https://github.com/Liquid-JS/lyra/commit/a61bd29166f53e4cc12f2e8b1211740c934cba3e))
* **bootstrap:** remove bootstrap, ng-bootstrap doesn't support Angular v14.2.x and more ([#3146](https://github.com/Liquid-JS/lyra/issues/3146)) ([f3f05ce](https://github.com/Liquid-JS/lyra/commit/f3f05cece1da7f5f8f2129916c8c233afe9340a5))
* **bower.js:** delete excess comma ([466ccc1](https://github.com/Liquid-JS/lyra/commit/466ccc1330d78783fe6d0eaef10088bd5d59da9a))
* **bower.json:** remove tailing comma ([3770257](https://github.com/Liquid-JS/lyra/commit/3770257c1b67e271407d0103d2b0fc8e037b817c))
* **breadcrumbs:** breadcrumbs color in mint theme should not be the same as background is ([#378](https://github.com/Liquid-JS/lyra/issues/378)) ([ae0011c](https://github.com/Liquid-JS/lyra/commit/ae0011c05a8b9621ddd8fb8f7b428ee767d1745c))
* **breadcrumbs:** fix [#2](https://github.com/Liquid-JS/lyra/issues/2) breadcrubms visibility ([a1046ce](https://github.com/Liquid-JS/lyra/commit/a1046ce2b41d98ab02e4e2d2c7c4289f0c5cc5f3))
* **breakpoints:** fix breakpoints example ([9c4fc0b](https://github.com/Liquid-JS/lyra/commit/9c4fc0bab45aec682585790369c3a424c311eac4))
* **bug:** deleted absolute path for assets ([#510](https://github.com/Liquid-JS/lyra/issues/510)) ([b78e72d](https://github.com/Liquid-JS/lyra/commit/b78e72dde977e7774783b01830921bca2b2ab93b))
* **build:** pin webpack version ([3ddd6f9](https://github.com/Liquid-JS/lyra/commit/3ddd6f9e9b8fbe3bcb7711a8e31e0e0a7e967ee0))
* **build:** provide ES5 code in UMD bundles ([#2520](https://github.com/Liquid-JS/lyra/issues/2520)) ([e64bac0](https://github.com/Liquid-JS/lyra/commit/e64bac0d787090f61eb7060b107efe1e101a8a62))
* **build:** rename a stylelint config file ([8f41115](https://github.com/Liquid-JS/lyra/commit/8f4111512811fe74ee5c5e145b5258c1d63688ed))
* **button group:** prevent unpress in single mode button group ([#2860](https://github.com/Liquid-JS/lyra/issues/2860)) ([4b8a430](https://github.com/Liquid-JS/lyra/commit/4b8a4302ff92f4f894184678d055c043f471ec77))
* **button link:** remove text decoration ([#2190](https://github.com/Liquid-JS/lyra/issues/2190)) ([0495259](https://github.com/Liquid-JS/lyra/commit/0495259cbd83ab698ae2e624b11f7d01da1abff1))
* **button:** fix button glow ([#1179](https://github.com/Liquid-JS/lyra/issues/1179)) ([9f040b8](https://github.com/Liquid-JS/lyra/commit/9f040b8196ca8769d7b3212214ffa2a58d48256f))
* **button:** fix outline button ([0bcad95](https://github.com/Liquid-JS/lyra/commit/0bcad95dd06238bc5fd5e4f69928180281800c0e))
* **button:** make sure icon has margins when button has html co… ([#1953](https://github.com/Liquid-JS/lyra/issues/1953)) ([a17accb](https://github.com/Liquid-JS/lyra/commit/a17accb51b7d5fb4d018f0346dc8d12c80585010))
* **button:** prevent expression changed error on icon button ([#2846](https://github.com/Liquid-JS/lyra/issues/2846)) ([baee608](https://github.com/Liquid-JS/lyra/commit/baee608bde85a88937a38f6859e5c660a7106745))
* **button:** return text color on focus ([#1030](https://github.com/Liquid-JS/lyra/issues/1030)) ([230c83e](https://github.com/Liquid-JS/lyra/commit/230c83eebda09af53abce7033870433384b8fda7))
* **buttons:** fix button colors ([7f487a9](https://github.com/Liquid-JS/lyra/commit/7f487a9a1615712ff67864b19b757bf87de637b8))
* **buttons:** fix buttons styles ([10f74ef](https://github.com/Liquid-JS/lyra/commit/10f74ef6b181593d83ad5dfa9e6031f4bbe8bf4f))
* **buttons:** fix dropdowns and group buttons styles ([ba43f49](https://github.com/Liquid-JS/lyra/commit/ba43f49618947345b2a4cf683075f5b40e45629c))
* **buttons:** fix outline and default button styles for default theme ([4982a80](https://github.com/Liquid-JS/lyra/commit/4982a80e5a1561d8368053a4498104ba2fa2de3b))
* **buttons:** improve button styles ([1d43a7d](https://github.com/Liquid-JS/lyra/commit/1d43a7d01a607b3a86b0237f2615e7f1f4778a58))
* **buttons:** improve hover effect for the button links ([59aa52a](https://github.com/Liquid-JS/lyra/commit/59aa52a3bc44f2943c63a2e9a0deef24b71208e3))
* **buttons:** improve icon and dropdown button styles ([e1c1280](https://github.com/Liquid-JS/lyra/commit/e1c1280697a62a6ddfeea829af47cc90e751a0b7))
* **buttons:** indicate focus state of outline button just with border-color ([e68a1ea](https://github.com/Liquid-JS/lyra/commit/e68a1ea16b57acdd39da60b8734faf947a2bbf28)), closes [#295](https://github.com/Liquid-JS/lyra/issues/295)
* **buttons:** move cursor to config, define color for active states ([1005ce6](https://github.com/Liquid-JS/lyra/commit/1005ce6f130fbe6333306342906f2907c43711d8))
* **buttons:** move light and dark gradients to the functions ([c6511b3](https://github.com/Liquid-JS/lyra/commit/c6511b37f62ae28ac04acd77b2e12462429f9c1a))
* **buttons:** remove transition from buttons ([7e3f56d](https://github.com/Liquid-JS/lyra/commit/7e3f56d3e4abab24e589954e57f220543f4ced69))
* **button:** styling for disabled anchor ([#2649](https://github.com/Liquid-JS/lyra/issues/2649)) ([19a5b43](https://github.com/Liquid-JS/lyra/commit/19a5b43d706b288d289d8bdfe2ca99fb00f63754))
* **calendar range cells:** handle unset date or selectedValue ([#2537](https://github.com/Liquid-JS/lyra/issues/2537)) ([0f20b9c](https://github.com/Liquid-JS/lyra/commit/0f20b9c710b40ed2aefba4c82a05e22cf4b5f564))
* **calendar:** fix native date service addMonth date overflow ([#1347](https://github.com/Liquid-JS/lyra/issues/1347)) ([ffd386c](https://github.com/Liquid-JS/lyra/commit/ffd386c6d4fa8e18090f71ca94725366660b3d0f))
* **calendar:** prevent selected day text color override ([#1655](https://github.com/Liquid-JS/lyra/issues/1655)) ([e8834d7](https://github.com/Liquid-JS/lyra/commit/e8834d70513cde4427223f993d47ca16b7f986f4))
* **calendar:** show day in today's date ([#899](https://github.com/Liquid-JS/lyra/issues/899)) ([e023aa3](https://github.com/Liquid-JS/lyra/commit/e023aa305355a3d1a1be0f37d393724aeae0fa6b))
* **calendar:** use last defined week day to determine week numb… ([#1969](https://github.com/Liquid-JS/lyra/issues/1969)) ([ba78d94](https://github.com/Liquid-JS/lyra/commit/ba78d9499645bddca59fc7578f05844c65cc2a58))
* **calendar:** use nbButton in calendar navigation ([#837](https://github.com/Liquid-JS/lyra/issues/837)) ([f460f85](https://github.com/Liquid-JS/lyra/commit/f460f85c41a4f65eea0c457b56b4d685dce1aa2c)), closes [#827](https://github.com/Liquid-JS/lyra/issues/827)
* **card:** improve card heights ([839d7aa](https://github.com/Liquid-JS/lyra/commit/839d7aae668f22f3e203de3cd5d46e77fd994c76))
* **card:** make card body is flexible by default ([ddb48cf](https://github.com/Liquid-JS/lyra/commit/ddb48cf9bd0a806cd3fed719e523099e46f42176))
* **card:** make card body relative ([c82252e](https://github.com/Liquid-JS/lyra/commit/c82252ed88e3b453b73eb687a5cc47ed0ef3a988))
* **card:** make two smaller cards same height as one large ([#1821](https://github.com/Liquid-JS/lyra/issues/1821)) ([88eb8f7](https://github.com/Liquid-JS/lyra/commit/88eb8f7e94368a722f96edea900160e3ae16cf9d))
* **cards:** improve cards styles ([dec296d](https://github.com/Liquid-JS/lyra/commit/dec296d0e628ffd47c200a88f74ba9478db34700))
* **cdk:** fix cdk mappings duplicates ([#2068](https://github.com/Liquid-JS/lyra/issues/2068)) ([8179a02](https://github.com/Liquid-JS/lyra/commit/8179a02b7f092d9488fc45fdfb1e3085f0b49e0e))
* **cdk:** fix scroll blocker for custom `withScroll` mode ([#1364](https://github.com/Liquid-JS/lyra/issues/1364)) ([34193cc](https://github.com/Liquid-JS/lyra/commit/34193ccd8ff30d598c3c3859dfff095acdbeb620)), closes [#1158](https://github.com/Liquid-JS/lyra/issues/1158) [#1259](https://github.com/Liquid-JS/lyra/issues/1259)
* **changelog:** final changes :champagne: ([5224baa](https://github.com/Liquid-JS/lyra/commit/5224baa88230b5cbb73a387104a505bd0e23c7bd))
* **CHANGELOG:** fix a typo ([e60e20d](https://github.com/Liquid-JS/lyra/commit/e60e20de64b6c08678cca369838829368a5824d0))
* **changelog:** fix typo ([21e0a33](https://github.com/Liquid-JS/lyra/commit/21e0a3397ca29c48e2f255b0e3b186bca94742bd))
* **CHANGELOG:** update CHANGELOG ([a5a1faf](https://github.com/Liquid-JS/lyra/commit/a5a1faf9d3d27f64f80193da9690c8bcc6de72de))
* **chat:** double image preview ([#2766](https://github.com/Liquid-JS/lyra/issues/2766)) ([1b3c809](https://github.com/Liquid-JS/lyra/commit/1b3c8095a3d08c21e7df213a9be2a1de3d44c8e3))
* **chat:** file drop in firefox ([#2776](https://github.com/Liquid-JS/lyra/issues/2776)) ([07db7f5](https://github.com/Liquid-JS/lyra/commit/07db7f50e45a37eb78fdc95ff4438433206eca8b))
* **checkbox, radio:** check mark positioning in IE ([#830](https://github.com/Liquid-JS/lyra/issues/830)) ([ac52315](https://github.com/Liquid-JS/lyra/commit/ac52315fc0d31cf529d978819029ce160e958e48))
* **checkbox:** don't style user icons in checkbox ([#2857](https://github.com/Liquid-JS/lyra/issues/2857)) ([a94a867](https://github.com/Liquid-JS/lyra/commit/a94a86753965fdfb754e1310ee7d87b62647fb20))
* **checkbox:** fix disable state with reactive forms ([#599](https://github.com/Liquid-JS/lyra/issues/599)) ([7d8beea](https://github.com/Liquid-JS/lyra/commit/7d8beeaf5a0e656896389cbde89b6836640aac53)), closes [#296](https://github.com/Liquid-JS/lyra/issues/296)
* **checkbox:** fix inactive background color ([#1502](https://github.com/Liquid-JS/lyra/issues/1502)) ([48966b8](https://github.com/Liquid-JS/lyra/commit/48966b845d5cc78faed17f9c7c5bdebef7358189))
* **checkbox:** fix value output ([#1505](https://github.com/Liquid-JS/lyra/issues/1505)) ([0ea3167](https://github.com/Liquid-JS/lyra/commit/0ea316723f4c9bd25f286bac9b50c30bf25cdb83))
* **checkbox:** hide check mark when unchecked and disabled ([#863](https://github.com/Liquid-JS/lyra/issues/863)) ([c7205d4](https://github.com/Liquid-JS/lyra/commit/c7205d46606eb3549da1b0c7bf68e12ed249114f)), closes [#862](https://github.com/Liquid-JS/lyra/issues/862)
* **checkbox:** prevent second click event from input ([#1835](https://github.com/Liquid-JS/lyra/issues/1835)) ([115ce08](https://github.com/Liquid-JS/lyra/commit/115ce08cc74305a80c4a9829573acda116060c47))
* **checkbox:** rename variables according to property where it used ([#1372](https://github.com/Liquid-JS/lyra/issues/1372)) ([2c02daf](https://github.com/Liquid-JS/lyra/commit/2c02dafbe40633ecb2cece0bde215988d3be6187))
* **ci:** prevent travis from killing deploy docs job ([#1928](https://github.com/Liquid-JS/lyra/issues/1928)) ([0b969cb](https://github.com/Liquid-JS/lyra/commit/0b969cbe33c3e007ac6e95d13533803802435e72))
* **ckeditor:** fix [#150](https://github.com/Liquid-JS/lyra/issues/150) source color is same as background ([8488eb5](https://github.com/Liquid-JS/lyra/commit/8488eb51844b9be05f4cdeca7ae61ee2fd70438b))
* **ckeditor:** fix Cannot read property exception ([d799ade](https://github.com/Liquid-JS/lyra/commit/d799adeee494d85e7460a5033e0f8004f8bb9a30))
* **ckeditor:** fix ckeditor loader ([c15fee6](https://github.com/Liquid-JS/lyra/commit/c15fee6eb6ce7f2944b5e5ccb53411b76e2abf82))
* **ckeditor:** fix ckeditor styles ([3a9ecd2](https://github.com/Liquid-JS/lyra/commit/3a9ecd2f6463ee12ea51afc6341ae89b800d2ef1))
* **ckeditor:** pin working version ([8a6baf2](https://github.com/Liquid-JS/lyra/commit/8a6baf283c4213ab975468a4c82d3eb9626327f7))
* **components:** fix border radius of color card, adjust layout styles ([efbc827](https://github.com/Liquid-JS/lyra/commit/efbc8273e2f4c63edb19d4011852fd547b44102d))
* **config:** fix [#223](https://github.com/Liquid-JS/lyra/issues/223) isDevServer is not defined ([80a1553](https://github.com/Liquid-JS/lyra/commit/80a15536a54ca9fa92a75cbeac6fccd56666149f))
* **content top:** [#618](https://github.com/Liquid-JS/lyra/issues/618), update tslint config ([e315b1a](https://github.com/Liquid-JS/lyra/commit/e315b1a4dfb33803ae15d972ba27efe14c804101))
* **context menu:** add cursor pointer to menu host ([#1662](https://github.com/Liquid-JS/lyra/issues/1662)) ([337cacf](https://github.com/Liquid-JS/lyra/commit/337cacf0d253f0d45d18b53b8bbbe062096eefd8))
* **context menu:** don't close on item click with noop strategy ([#2875](https://github.com/Liquid-JS/lyra/issues/2875)) ([a76fccf](https://github.com/Liquid-JS/lyra/commit/a76fccf4ab53157e32a3a8881489cb4c97db752f))
* **context menu:** emit destroy when component got destroyed ([#2767](https://github.com/Liquid-JS/lyra/issues/2767)) ([5036b89](https://github.com/Liquid-JS/lyra/commit/5036b89960d23ca89d091b8ff9d25d22818e3955))
* **context menu:** prevent close on expand icon click ([#2923](https://github.com/Liquid-JS/lyra/issues/2923)) ([2b7f60c](https://github.com/Liquid-JS/lyra/commit/2b7f60c0980092cddc3ac858ab41ea60339027c3))
* **context-menu:** hide on menu item click ([#431](https://github.com/Liquid-JS/lyra/issues/431)) ([a5bcd3c](https://github.com/Liquid-JS/lyra/commit/a5bcd3c7ac804fb3901cbb2867e8547d7c045ad3))
* **context-menu:** updated context menu arrow left position calculation ([#1268](https://github.com/Liquid-JS/lyra/issues/1268)) ([0db8c2c](https://github.com/Liquid-JS/lyra/commit/0db8c2ce90ab17ae12c93e7d90ffc296548fffe1)), closes [#973](https://github.com/Liquid-JS/lyra/issues/973)
* **core:** apply the nb-for-theme mixin when CSS custom properties are enabled ([71183e2](https://github.com/Liquid-JS/lyra/commit/71183e21f1cad1faef74a7401912a810056c88ee))
* **core:** give the layout footer fixed positioning when it is fixed ([f3e9541](https://github.com/Liquid-JS/lyra/commit/f3e954198f86bf2fe60aa6afce47d4089682ab83))
* **core:** leave a collapsed submenu's items out of the tab order ([e6e291d](https://github.com/Liquid-JS/lyra/commit/e6e291d2301e6a58b28f8e23545c35f1bf089971)), closes [#3322](https://github.com/Liquid-JS/lyra/issues/3322)
* **core:** make actions reachable in Safari and set their badges over the icon's corner ([49eeb46](https://github.com/Liquid-JS/lyra/commit/49eeb469a2769351bf463a1fb5db90cc656cf038))
* **core:** remove obsolete vendor-prefixed and IE-specific CSS ([9b98130](https://github.com/Liquid-JS/lyra/commit/9b98130434913072b28cb1db8e939187549e8d17))
* **core:** stop the range adapter from parsing a missing end date ([afe3ae3](https://github.com/Liquid-JS/lyra/commit/afe3ae30e244d4eacd1f1ef55f32446ccc1c3416))
* **core:** treat an invalid date written to the datepicker as empty ([ee4c765](https://github.com/Liquid-JS/lyra/commit/ee4c765d3c6902b31f3cf2c2cb58fa4eee947819))
* **dashboard/trafficChart:** fix cut tooltips ([7b1c4cc](https://github.com/Liquid-JS/lyra/commit/7b1c4cc5ea175d540bba1b98b607c67a50d387e8)), closes [#321](https://github.com/Liquid-JS/lyra/issues/321)
* **dashboard\todo\checkbox:** checkboxes was rendering uncorrectly ([743dc38](https://github.com/Liquid-JS/lyra/commit/743dc38f721eb84816082d2f52f532533ec19b2b))
* **dashboard:** change margin for the line chart ([067535b](https://github.com/Liquid-JS/lyra/commit/067535b50032219e07f188621f780ccb96aa9a63))
* **datapicker:** input update issue with reactive forms ([#2945](https://github.com/Liquid-JS/lyra/issues/2945)) ([07527f8](https://github.com/Liquid-JS/lyra/commit/07527f8d7f0518342a5fdea8f3920d69432180dd))
* **date service:** prevent format calls if date isn't passed ([#1291](https://github.com/Liquid-JS/lyra/issues/1291)) ([a3d6035](https://github.com/Liquid-JS/lyra/commit/a3d603595bfd777f4ba4bbb7a89be89590b3ad82))
* **datepicker:** start from date typed in input ([#1300](https://github.com/Liquid-JS/lyra/issues/1300)) ([dfc75f0](https://github.com/Liquid-JS/lyra/commit/dfc75f08b467448492c82d0b436fc85d58c21a3c))
* **datepicker, radio:** always call touched callback ([#2026](https://github.com/Liquid-JS/lyra/issues/2026)) ([d3a8e44](https://github.com/Liquid-JS/lyra/commit/d3a8e44b5ee16fd17c0b829e4dde50eda1a7719a))
* **datepicker:** add missing show header input ([#1889](https://github.com/Liquid-JS/lyra/issues/1889)) ([d265991](https://github.com/Liquid-JS/lyra/commit/d265991a721c626dc1f72437616f2d11124d3726))
* **datepicker:** background and border theming ([#2418](https://github.com/Liquid-JS/lyra/issues/2418)) ([381eb00](https://github.com/Liquid-JS/lyra/commit/381eb000cec890ec10636bac89c4ff0b7a7aff8d))
* **datepicker:** check trigger strategy is defined before destroying ([#2011](https://github.com/Liquid-JS/lyra/issues/2011)) ([a678e60](https://github.com/Liquid-JS/lyra/commit/a678e60f96b12aa6bb97975bb351f907ca2275fb))
* **datepicker:** date fns date format ([#1172](https://github.com/Liquid-JS/lyra/issues/1172)) ([257eb9a](https://github.com/Liquid-JS/lyra/commit/257eb9a81b95cf9cffd5b81ed2db0b81672ecbd9))
* **datepicker:** fix datepicker format not available error ([#1117](https://github.com/Liquid-JS/lyra/issues/1117)) ([83cda23](https://github.com/Liquid-JS/lyra/commit/83cda23a7268df08c664285ae82dafbe11acd33d)), closes [#1088](https://github.com/Liquid-JS/lyra/issues/1088)
* **datepicker:** fix datepicker spec ([#850](https://github.com/Liquid-JS/lyra/issues/850)) ([a69e681](https://github.com/Liquid-JS/lyra/commit/a69e681acf1090fdcc18d926a400f0e6e64d2421))
* **datepicker:** fix initial value render ([#3050](https://github.com/Liquid-JS/lyra/issues/3050)) ([e821643](https://github.com/Liquid-JS/lyra/commit/e821643159df87d36363c481ea16bb49a9eb6696))
* **datepicker:** make it valid in case of empty input ([#1247](https://github.com/Liquid-JS/lyra/issues/1247)) ([799b8b8](https://github.com/Liquid-JS/lyra/commit/799b8b88aced65aab2d2300ae2003fabdb3cda75)), closes [#1182](https://github.com/Liquid-JS/lyra/issues/1182)
* **default:** change default variables, fix tabsets ([1cb64c6](https://github.com/Liquid-JS/lyra/commit/1cb64c63ea70ad096046a6305753a6ca2df77512))
* **default:** fix checkboxes and radio buttons styles ([cfd08ab](https://github.com/Liquid-JS/lyra/commit/cfd08ab6f459bc6d1fa765933eac0ba7b9b66f70))
* **default:** fix inputs, buttons focus and user components ([1291873](https://github.com/Liquid-JS/lyra/commit/12918734c2ec6a48739c3922253b52564d95963f))
* **default:** improve js theme, add "theme-only" mixins ([4caa451](https://github.com/Liquid-JS/lyra/commit/4caa451cd4ab93ea0fdc0b0fe641b065b2ac2612))
* **dependencies:** fix [#426](https://github.com/Liquid-JS/lyra/issues/426) [#423](https://github.com/Liquid-JS/lyra/issues/423), tslint config update ([2108067](https://github.com/Liquid-JS/lyra/commit/2108067aabb408ca77bead2fe496e7a4292e8a70))
* **dependencies:** remove jQuery ([02394da](https://github.com/Liquid-JS/lyra/commit/02394da969f2e4d5aca36e7582d9ca62f8228bb2))
* **dependencies:** sort dependencies by name ([c70d866](https://github.com/Liquid-JS/lyra/commit/c70d866016c04eac7769caf076f1593886351f7f))
* **dependencies:** update angular to 2.4.4 ([be9c677](https://github.com/Liquid-JS/lyra/commit/be9c677c0606635521e7da674dc40c1a1b32228d))
* **dependencies:** update webpack to 2.2.0 ([386f8bb](https://github.com/Liquid-JS/lyra/commit/386f8bbf744d363de7befd73303a5eabc38307bd))
* **dev docs:** specify correct lts tag ([#1593](https://github.com/Liquid-JS/lyra/issues/1593)) ([f7a8be4](https://github.com/Liquid-JS/lyra/commit/f7a8be4d8aa45d2f75ea45bacdb25e96f5487a50))
* **DEV_DOCS:** add missed line in development on the latest Nebular sources ([#182](https://github.com/Liquid-JS/lyra/issues/182)) ([3b84981](https://github.com/Liquid-JS/lyra/commit/3b8498192d30afacb2c2983325f0b5d0875b722c))
* **DEV_DOCS:** icons published ([d654c55](https://github.com/Liquid-JS/lyra/commit/d654c5594b9d79b23321990f17e0e3eabc153547))
* **DEV_DOCS:** update todo and framework styles structure ([39d76a8](https://github.com/Liquid-JS/lyra/commit/39d76a85d5f5e66f172ed8dc6320699b546951f8))
* **dialog:** accept partial of component in NbDialogService open context  ([#1175](https://github.com/Liquid-JS/lyra/issues/1175)) ([9a5f4d9](https://github.com/Liquid-JS/lyra/commit/9a5f4d9fd2cb866f0f132350d15106d3707f71ae)), closes [#1173](https://github.com/Liquid-JS/lyra/issues/1173)
* **dialog:** stop listening for close events when dialog closes ([#1860](https://github.com/Liquid-JS/lyra/issues/1860)) ([7ddbfbd](https://github.com/Liquid-JS/lyra/commit/7ddbfbdb71c438cd6fba317c9e20ebeef4b6edcf))
* **docs:** fix warning `Invalid value for $grid-breakpoints..` ([#736](https://github.com/Liquid-JS/lyra/issues/736)) ([23e7804](https://github.com/Liquid-JS/lyra/commit/23e7804abe234c80c0e0a1744f26fb9e7aaf74f4))
* **docs-blocks:** fix undefined parameters ([6ead866](https://github.com/Liquid-JS/lyra/commit/6ead866237a3ae15cb7422a7be1fa4e993087c43))
* **docs-gen:** use sync node process for docs parser ([21d2338](https://github.com/Liquid-JS/lyra/commit/21d2338b23060c633a778a3fc570b05a7d89d0bc))
* **docs-header:** fix active route underlining ([6dbed14](https://github.com/Liquid-JS/lyra/commit/6dbed142c6e675b26499a7f33e3b19143732185f))
* **docs-header:** fix mobile menu ([d76bc6f](https://github.com/Liquid-JS/lyra/commit/d76bc6f4d9d23a867f06f3334cd97c8d9985165b))
* **docs-header:** remove hover for mobile menu ([858868b](https://github.com/Liquid-JS/lyra/commit/858868b21834e030794b7bcfcf7b8c66ea79e611))
* **docs-header:** restyle mobile menu ([8e875da](https://github.com/Liquid-JS/lyra/commit/8e875da4862bdcf1c3b86c3469eabcc5ade09bf3))
* **docs-header:** use color-fg for homepage header ([b69fc94](https://github.com/Liquid-JS/lyra/commit/b69fc94079dcaf9ab85b2bfed4d5010cb17c6b56))
* **docs:** add a note about new theme ([#504](https://github.com/Liquid-JS/lyra/issues/504)) ([872645c](https://github.com/Liquid-JS/lyra/commit/872645ca6583d5ea785aae008568e2b53ecb893f))
* **docs:** add context-menu item click handler example ([#371](https://github.com/Liquid-JS/lyra/issues/371)) ([96ec81b](https://github.com/Liquid-JS/lyra/commit/96ec81b04051a18a5d3abd3c213e8a623c322a8a))
* **docs:** add missed backtick ([#1069](https://github.com/Liquid-JS/lyra/issues/1069)) ([3324fd5](https://github.com/Liquid-JS/lyra/commit/3324fd5a655863b100566704b49d4d0b43403cfb))
* **docs:** add missing operator ([#455](https://github.com/Liquid-JS/lyra/issues/455)) ([1cb4993](https://github.com/Liquid-JS/lyra/commit/1cb49935242352385f0a55a5ccd0f6780fd3608c))
* **docs:** add progress-bar icon ([#476](https://github.com/Liquid-JS/lyra/issues/476)) ([98562f5](https://github.com/Liquid-JS/lyra/commit/98562f5ad3d985aaf6cec464955374ac7d4994ff))
* **docs:** add radio icon ([#748](https://github.com/Liquid-JS/lyra/issues/748)) ([9110266](https://github.com/Liquid-JS/lyra/commit/911026643de952ba641cb0c54f97672d264b2134))
* **docs:** add search container class ([#1270](https://github.com/Liquid-JS/lyra/issues/1270)) ([e1a84f4](https://github.com/Liquid-JS/lyra/commit/e1a84f4d0ff26dafb0ad7546a0f85d40f4996066))
* **docs:** articles grammar ([#1810](https://github.com/Liquid-JS/lyra/issues/1810)) ([a0efb6b](https://github.com/Liquid-JS/lyra/commit/a0efb6bf012c646c6fd09c65a2a5e8a58b9363c5))
* **docs:** change features section background ([#1556](https://github.com/Liquid-JS/lyra/issues/1556)) ([c33442b](https://github.com/Liquid-JS/lyra/commit/c33442b8700b27f856f49c14174b084117aa3caf))
* **docs:** comment the comment ([610a3e0](https://github.com/Liquid-JS/lyra/commit/610a3e0e414107a82202b8d489a444948ce07122))
* **docs:** correct link for Angular router ([a445062](https://github.com/Liquid-JS/lyra/commit/a445062dcc052e41a9071b2e109d94997f16ef1a))
* **docs:** correct mention of date-fns ([#1572](https://github.com/Liquid-JS/lyra/issues/1572)) ([bad91ec](https://github.com/Liquid-JS/lyra/commit/bad91ec0e3d82caf46f89f9bea95620d2f11ba88))
* **docs:** custom theme link ([#1832](https://github.com/Liquid-JS/lyra/issues/1832)) ([b17f6b4](https://github.com/Liquid-JS/lyra/commit/b17f6b44131062feb1637623102a3eb28f261845))
* **docs:** delay first calculation of examples' height ([#586](https://github.com/Liquid-JS/lyra/issues/586)) ([9a74fc1](https://github.com/Liquid-JS/lyra/commit/9a74fc14a7197b18a5f362b37a7bee324adaebfe))
* **docs:** disable custom outline as it breaks Eva components ([#1537](https://github.com/Liquid-JS/lyra/issues/1537)) ([c48caaf](https://github.com/Liquid-JS/lyra/commit/c48caafdbdea4859af859e416d81e02af0d475f5))
* **docs:** docs fixes, minimize icons, remove unused fonts ([#1491](https://github.com/Liquid-JS/lyra/issues/1491)) ([9334d3e](https://github.com/Liquid-JS/lyra/commit/9334d3e7b8e647aea56a661cc791163b365092f4))
* **docs:** example row helper ([#1548](https://github.com/Liquid-JS/lyra/issues/1548)) ([c0d404f](https://github.com/Liquid-JS/lyra/commit/c0d404f29fcdd6178d66b200156d71ce9ae81348))
* **docs:** fix a typo ([fd0f0c5](https://github.com/Liquid-JS/lyra/commit/fd0f0c57a3d3bb0d4eac25d61a2b18bc3a8e13ac))
* **docs:** fix absolute urls ([30e4b05](https://github.com/Liquid-JS/lyra/commit/30e4b0591cc76eb274dc2d350525172793e279c4))
* **docs:** fix auth install article Closes [#273](https://github.com/Liquid-JS/lyra/issues/273) ([180d8f1](https://github.com/Liquid-JS/lyra/commit/180d8f1d98260cc0283ffc34dd565f4f476f8464))
* **docs:** fix auth md article formatting ([ac0f668](https://github.com/Liquid-JS/lyra/commit/ac0f668b94cb2e31b86d5c32064a6a6c0a33d104))
* **docs:** fix block's margins ([060a089](https://github.com/Liquid-JS/lyra/commit/060a089517f679d2a8c3758437c51c7d1fc889af))
* **docs:** fix changelog typos ([0236ea7](https://github.com/Liquid-JS/lyra/commit/0236ea72e917b52084d2e37d844b95edb2832415))
* **docs:** fix component styles table ([#1543](https://github.com/Liquid-JS/lyra/issues/1543)) ([ab166fd](https://github.com/Liquid-JS/lyra/commit/ab166fd537653bcce8c337fb4a6ad17e4c5c3dad))
* **docs:** fix dead links and code examples ([#905](https://github.com/Liquid-JS/lyra/issues/905)) ([d8307c9](https://github.com/Liquid-JS/lyra/commit/d8307c9850df0d0b6547fbf04a8bd679311958d8))
* **docs:** fix docs deployment ([#3218](https://github.com/Liquid-JS/lyra/issues/3218)) ([96968a6](https://github.com/Liquid-JS/lyra/commit/96968a647c764b3b3f63e79c8b82f92d735398c6))
* **docs:** fix enabling blur theme ([184875d](https://github.com/Liquid-JS/lyra/commit/184875d8c90222c0c6f53ab6ea4342e2530c5d02))
* **docs:** fix incorrect component mention ([#375](https://github.com/Liquid-JS/lyra/issues/375)) ([3fcbb61](https://github.com/Liquid-JS/lyra/commit/3fcbb61f9e2bcfae3e4363e41a8d8b9501b1fe20)), closes [#286](https://github.com/Liquid-JS/lyra/issues/286)
* **docs:** fix incorrect eva-icons/bootstrap readme ([#1611](https://github.com/Liquid-JS/lyra/issues/1611)) ([73c5d36](https://github.com/Liquid-JS/lyra/commit/73c5d36ce2c10e6d9f26dc43632fb92bee925f5d))
* **docs:** fix mention of angular-cli.json file to `angular.json` ([#701](https://github.com/Liquid-JS/lyra/issues/701)) ([3211c54](https://github.com/Liquid-JS/lyra/commit/3211c54a7ef2dfba4f1edf8f085871d2db149cba))
* **docs:** fix menu styles ([95413cb](https://github.com/Liquid-JS/lyra/commit/95413cb65af1bc8f58f3bb3bb6cf93f901cea0d5))
* **docs:** fix password strategy link ([#1245](https://github.com/Liquid-JS/lyra/issues/1245)) ([c71d9fd](https://github.com/Liquid-JS/lyra/commit/c71d9fd7bafab246c7f92dcf4ad6d446042aadc7))
* **docs:** fix popover examples ([#503](https://github.com/Liquid-JS/lyra/issues/503)) ([83061ef](https://github.com/Liquid-JS/lyra/commit/83061efde48140a8a1b5f87b7cddf713bd6274a9))
* **docs:** fix ribbon position ([a1f17a3](https://github.com/Liquid-JS/lyra/commit/a1f17a3dbb881f55db491eac77e05fb7e3bfadf9))
* **docs:** fix styles ([1858dc6](https://github.com/Liquid-JS/lyra/commit/1858dc68540e72945a78caa8d2e3af0c1c74e3dc))
* **docs:** fix transparent background color ([#1536](https://github.com/Liquid-JS/lyra/issues/1536)) ([0aed7b6](https://github.com/Liquid-JS/lyra/commit/0aed7b69b2e2d64e8961605d9d5a5f91657d0b98))
* **docs:** fix typo ([c0a7bcd](https://github.com/Liquid-JS/lyra/commit/c0a7bcdbb378b29d2ad983c97d8304dffb04c722))
* **docs:** fix typo ([74a793c](https://github.com/Liquid-JS/lyra/commit/74a793ca927b434bec32574a9b10d361ec7518b2))
* **docs:** fix typo in auth-guard docs ([#277](https://github.com/Liquid-JS/lyra/issues/277)) ([682314d](https://github.com/Liquid-JS/lyra/commit/682314d18b3166815d4866173be91d6d439ebf72))
* **docs:** fix widget margin ([ba5def0](https://github.com/Liquid-JS/lyra/commit/ba5def0737a852490223761220d02188d3388a80))
* **docs:** fixed small errors ([#1574](https://github.com/Liquid-JS/lyra/issues/1574)) ([03a8085](https://github.com/Liquid-JS/lyra/commit/03a8085431a3a0dbdfcecada8d0d58b7869021b3))
* **docs:** footer email link ([#1206](https://github.com/Liquid-JS/lyra/issues/1206)) ([2e44bbc](https://github.com/Liquid-JS/lyra/commit/2e44bbc0f7dad88953bc788175b71cb843004735))
* **docs:** give code views one copy button, larger, filled, and fixed while the code scrolls ([126fa1d](https://github.com/Liquid-JS/lyra/commit/126fa1d81844f34e68c243282634146afc3e14ce))
* **docs:** import prismjs language-scripts globally ([28d9923](https://github.com/Liquid-JS/lyra/commit/28d9923541b33b1511544b98b7236e9b7e1c30c2))
* **docs:** increase block's gaps ([4c86139](https://github.com/Liquid-JS/lyra/commit/4c8613961b98fe184a22dafba141cdc07527a412))
* **docs:** keep an example's theme in the address as its links change pages, so reloading shows it ([51f5296](https://github.com/Liquid-JS/lyra/commit/51f5296c9077d2d3e80c72300d43bd281d8d2edb))
* **docs:** keep nb-fs-icon in tree-grid showcase only ([#1330](https://github.com/Liquid-JS/lyra/issues/1330)) ([0e1f432](https://github.com/Liquid-JS/lyra/commit/0e1f43274368b9c77db76b7293e8f002117fc619))
* **docs:** keep the client-side app as the 404 page when publishing to GitHub Pages ([320ff2d](https://github.com/Liquid-JS/lyra/commit/320ff2da55e51c65300a79e176f3d0655e11a0d3))
* **docs:** live example height on theme change ([57aae1a](https://github.com/Liquid-JS/lyra/commit/57aae1a8b489b7b611410c2384dabf4dce189bae))
* **docs:** minor doc fixes ([c48fd9e](https://github.com/Liquid-JS/lyra/commit/c48fd9ed64fba7ba1e0fb42986daf4ae94a134b9))
* **docs:** minor doc fixes ([0a420f1](https://github.com/Liquid-JS/lyra/commit/0a420f19a86ad9fab21b4ab5fc2e0ba55a019bae))
* **docs:** misses one line in the create new page help ([a587ac2](https://github.com/Liquid-JS/lyra/commit/a587ac260649d13e8f2fb46e5a3c04977e44f609))
* **docs:** prefix root css urls with base path ([#1453](https://github.com/Liquid-JS/lyra/issues/1453)) ([d42c896](https://github.com/Liquid-JS/lyra/commit/d42c896bdd42e41ff72256a64665a3ca8a792b16))
* **docs:** prevent empty methods table ([f761f85](https://github.com/Liquid-JS/lyra/commit/f761f852e6a46d163fe2c360a04df35c31b24246))
* **docs:** prevent scrolling when user scroll ([#982](https://github.com/Liquid-JS/lyra/issues/982)) ([bc2ab1d](https://github.com/Liquid-JS/lyra/commit/bc2ab1da29bbf3f325c119d65410434e84e3681d)), closes [#810](https://github.com/Liquid-JS/lyra/issues/810)
* **docs:** remove bootstrap from docs ([#3164](https://github.com/Liquid-JS/lyra/issues/3164)) ([b711f1d](https://github.com/Liquid-JS/lyra/commit/b711f1da9becb618fc9b70dd3e4ebf9091e5257e))
* **docs:** remove comma between shorthand properties in themes table ([#130](https://github.com/Liquid-JS/lyra/issues/130)) ([#133](https://github.com/Liquid-JS/lyra/issues/133)) ([b36a409](https://github.com/Liquid-JS/lyra/commit/b36a409b9952b636acee1097a5edbe86f5932b01))
* **docs:** remove concave line and update dark example background ([#1562](https://github.com/Liquid-JS/lyra/issues/1562)) ([21a40ee](https://github.com/Liquid-JS/lyra/commit/21a40ee430f5f30101d3af35550a84c4e6ee7eae))
* **docs:** remove rc version mention ([#1068](https://github.com/Liquid-JS/lyra/issues/1068)) ([ba1983c](https://github.com/Liquid-JS/lyra/commit/ba1983cd4e37be5feb27bf473ed63b188f490bac))
* **docs:** restyle methods block ([da7bb60](https://github.com/Liquid-JS/lyra/commit/da7bb6000386f4fbd2912ab9eba8214f5eeaa2da))
* **docs:** return missed section anchors ([#370](https://github.com/Liquid-JS/lyra/issues/370)) ([3895c81](https://github.com/Liquid-JS/lyra/commit/3895c81b319bc1ac8e70ebe3a5dd8bf17b18bf5a))
* **docs:** show the outline checkmark after copying code ([67d1c9b](https://github.com/Liquid-JS/lyra/commit/67d1c9b36e5423529f49904656abb96dcdb714e2))
* **docs:** trigger change detection if tab updated ([#1445](https://github.com/Liquid-JS/lyra/issues/1445)) ([9679e3a](https://github.com/Liquid-JS/lyra/commit/9679e3ae61d519e9dba951817cc6ceeda4dfc24c))
* **docs:** update .github templates accordingly ([9e5a7d5](https://github.com/Liquid-JS/lyra/commit/9e5a7d56e400844367d230a4ad7b233d183d3182))
* **docs:** update analytics tracking to exclude duplicated events ([#502](https://github.com/Liquid-JS/lyra/issues/502)) ([36e2611](https://github.com/Liquid-JS/lyra/commit/36e26110cf6c6f28fa55fa0552321668bf322e29))
* **docs:** update articles copy ([f76ce1f](https://github.com/Liquid-JS/lyra/commit/f76ce1f6f940584a2488bcff70e6895ebe1632c3))
* **docs:** update changed component theme vars link ([#1550](https://github.com/Liquid-JS/lyra/issues/1550)) ([ae73257](https://github.com/Liquid-JS/lyra/commit/ae732577f7e4ad1498ad263d72f720b08a7126e9))
* **docs:** update concept-theme-system.md ([#602](https://github.com/Liquid-JS/lyra/issues/602)) ([95fbe74](https://github.com/Liquid-JS/lyra/commit/95fbe74a5c08fe268f24e0b036c3e1af9cd80eeb))
* **docs:** update copy ([#587](https://github.com/Liquid-JS/lyra/issues/587)) ([d8e8881](https://github.com/Liquid-JS/lyra/commit/d8e8881a9b373f4b36ee445f923dac943949c390))
* **docs:** update documentation ([7c790c3](https://github.com/Liquid-JS/lyra/commit/7c790c32c186fd3ba5066dd206c80a9aeabb6146))
* **docs:** update examples after Eva migration ([#1448](https://github.com/Liquid-JS/lyra/issues/1448)) ([bc2ee49](https://github.com/Liquid-JS/lyra/commit/bc2ee49e41401caa00a464b0bb3097bb50ad5d62))
* **docs:** update font spacing ([#193](https://github.com/Liquid-JS/lyra/issues/193)) ([7e2a41a](https://github.com/Liquid-JS/lyra/commit/7e2a41a876fea018f50688fdb465a96af7c5bab9))
* **docs:** update links inside install guide page ([#2079](https://github.com/Liquid-JS/lyra/issues/2079)) ([cd8cd9d](https://github.com/Liquid-JS/lyra/commit/cd8cd9d534cfc3d73e4cb057e5dc8ab215422fbc))
* **docs:** update marked version ([#124](https://github.com/Liquid-JS/lyra/issues/124)) ([f4c970e](https://github.com/Liquid-JS/lyra/commit/f4c970e75223e0e6218849a9485f4de3d1ad9730))
* **docs:** update menu component to react to expand (add a relevant class) ([#206](https://github.com/Liquid-JS/lyra/issues/206)) ([18ccdf6](https://github.com/Liquid-JS/lyra/commit/18ccdf6ddbc62c894a3123e419323ca0345aa697)), closes [#180](https://github.com/Liquid-JS/lyra/issues/180)
* **docs:** update mobile styles ([#487](https://github.com/Liquid-JS/lyra/issues/487)) ([6af2694](https://github.com/Liquid-JS/lyra/commit/6af269417d77d66d704b1c7a0d205d7cb786c0b9))
* **docs:** update styles ([#486](https://github.com/Liquid-JS/lyra/issues/486)) ([9e44fb8](https://github.com/Liquid-JS/lyra/commit/9e44fb8ff8de1db46a168d8c17930de28b0c4932))
* **docs:** use correct tag in usage example ([#186](https://github.com/Liquid-JS/lyra/issues/186)) ([b2333a9](https://github.com/Liquid-JS/lyra/commit/b2333a919b3d4640326e2352c3b134d0899951c4))
* **docs:** use current tab component property ([#1447](https://github.com/Liquid-JS/lyra/issues/1447)) ([122585a](https://github.com/Liquid-JS/lyra/commit/122585a4fe76643bb4de1083b451f4c3e638ffc8))
* **docs:** use primary color for highlight ([#1583](https://github.com/Liquid-JS/lyra/issues/1583)) ([e9381c2](https://github.com/Liquid-JS/lyra/commit/e9381c2a3428874784e6e55f2dedf0d14c0c5f4a))
* **docs:** wrong NbEvaIconsModule import ([#1623](https://github.com/Liquid-JS/lyra/issues/1623)) ([a1c5e0c](https://github.com/Liquid-JS/lyra/commit/a1c5e0cbcb45d1507e4c8e989fd190c9234122e2))
* **dropdown:** improve dropdown styles ([b59289f](https://github.com/Liquid-JS/lyra/commit/b59289fc6eb41ab0d0e7a00e96c695d78a540b72))
* **dropdown:** increase dropdown default size ([505e634](https://github.com/Liquid-JS/lyra/commit/505e6346c7f39f882b44f53b2f2a256f08a1a2bb))
* **dynamic overlay:** prevent multiple onStable subscriptions ([#2494](https://github.com/Liquid-JS/lyra/issues/2494)) ([f22e87d](https://github.com/Liquid-JS/lyra/commit/f22e87d77240a958ee82a47aad73a96f8c15a6e3))
* **dynamic overlay:** recreate overlay when overlay container change ([#1913](https://github.com/Liquid-JS/lyra/issues/1913)) ([258b75b](https://github.com/Liquid-JS/lyra/commit/258b75bd0bbca25e376ed31b0fa53d37a63654b0))
* **e2e:** add redundance note in protractor.conf.ci.js ([#839](https://github.com/Liquid-JS/lyra/issues/839)) ([a7ed638](https://github.com/Liquid-JS/lyra/commit/a7ed63860d3fb6ba6a8f2f0559a308bc0c68e610))
* **electron:** fix electron build (fix [#407](https://github.com/Liquid-JS/lyra/issues/407), fix [#429](https://github.com/Liquid-JS/lyra/issues/429)) ([8887516](https://github.com/Liquid-JS/lyra/commit/8887516c442dc90ce2865e00f977ea7ab033351b))
* **environment:** remove fixed environment ([7c44a0b](https://github.com/Liquid-JS/lyra/commit/7c44a0b3fbab092375171e67752141446b43e8ee))
* fix libraries versions ([902289b](https://github.com/Liquid-JS/lyra/commit/902289b90be64cec9f63f81748e4c56dc6b6edfb))
* fix linter errors ([654c631](https://github.com/Liquid-JS/lyra/commit/654c63156f6fcc9413c924d5336f680e0ca6d3a8))
* fix peer dependency rxjs version ([#546](https://github.com/Liquid-JS/lyra/issues/546)) ([402bca2](https://github.com/Liquid-JS/lyra/commit/402bca21ba75042947fa6f0753f55890877d0fd3)), closes [#514](https://github.com/Liquid-JS/lyra/issues/514)
* fix the linter errors ([842a514](https://github.com/Liquid-JS/lyra/commit/842a514425616d4eaa6906a861ff4cd5db984d76))
* **flip card:** add prefixed backface-visibility property ([#1658](https://github.com/Liquid-JS/lyra/issues/1658)) ([6373117](https://github.com/Liquid-JS/lyra/commit/637311708500b260924bf9e12fe0a3b283dd7bb2))
* **flip card:** prevent extra whitespace ([#2854](https://github.com/Liquid-JS/lyra/issues/2854)) ([e8fa95b](https://github.com/Liquid-JS/lyra/commit/e8fa95b14f272ac301182ab54c34cf1fae0848a2))
* **flipcard:** fix flip card back view in Safari and IE ([0ccb4ab](https://github.com/Liquid-JS/lyra/commit/0ccb4ab0ddc3d8eb9f79600cad7bef51d66e6672))
* **focus trigger strategy clickout:** consider click target ([#2885](https://github.com/Liquid-JS/lyra/issues/2885)) ([a5f695a](https://github.com/Liquid-JS/lyra/commit/a5f695af6b160b54952225bf72930cd72bebf91e))
* **focus trigger strategy:** detect click out via activeElement ([#2865](https://github.com/Liquid-JS/lyra/issues/2865)) ([1f8e0cb](https://github.com/Liquid-JS/lyra/commit/1f8e0cb3db8936b28afdb370a3b354d3eec77cfc))
* **focus trigger:** prevent stream destroy on focus out ([#2189](https://github.com/Liquid-JS/lyra/issues/2189)) ([42ff4ee](https://github.com/Liquid-JS/lyra/commit/42ff4ee48eeebc04b2a762145443d352208aae22))
* **font-awesome-loader:** fix an issue about the font-awesome-sass-loader. ([#206](https://github.com/Liquid-JS/lyra/issues/206)) ([c295473](https://github.com/Liquid-JS/lyra/commit/c29547396d77d1488030dc907b5d366e5fe33dc0))
* **footer:** use correct footer color variable ([#454](https://github.com/Liquid-JS/lyra/issues/454)) ([c2e310d](https://github.com/Liquid-JS/lyra/commit/c2e310d8b08261e5b3da2696dae48d5b51046a4c))
* **form controls:** mark as touched ([#864](https://github.com/Liquid-JS/lyra/issues/864)) ([e06d3a7](https://github.com/Liquid-JS/lyra/commit/e06d3a7dc0814d27f083cf684cd900b0cab3f701))
* **form field:** addon alignment ([#2460](https://github.com/Liquid-JS/lyra/issues/2460)) ([dc154ab](https://github.com/Liquid-JS/lyra/commit/dc154abf9e7370dbcf1c453a0072a62fa60960ee))
* **form field:** make form control container take all space ([#2241](https://github.com/Liquid-JS/lyra/issues/2241)) ([2e11ec9](https://github.com/Liquid-JS/lyra/commit/2e11ec96296ee066061d987376d4a89a0ec89362))
* **forms:** fix issue with checkboxes and radio buttons in different forms ([f01d1cd](https://github.com/Liquid-JS/lyra/commit/f01d1cd488f858b6562bcca346db7f98b56deb22))
* **forms:** fix variables values ([447459a](https://github.com/Liquid-JS/lyra/commit/447459a168c12b55948bc41298f357aa684cc38e))
* **forms:** improve checked state for checkboxes and radio buttons ([1910714](https://github.com/Liquid-JS/lyra/commit/19107145dc13a183e760e19f66c8d448e6b86a56))
* **forms:** improve positioning of the selected radio button ([8c23dc0](https://github.com/Liquid-JS/lyra/commit/8c23dc038916cf087227310886a28d7bf0734293))
* **forms:** update ng2-bootstrap ([86a6483](https://github.com/Liquid-JS/lyra/commit/86a648374d135c7801848102381727f7a2a745de))
* **framework:** fix linting issues ([a145bbb](https://github.com/Liquid-JS/lyra/commit/a145bbb5024e84f600dea1331f1893753034937a))
* **framework:** replace [@akveo](https://github.com/akveo) with [@nebular](https://github.com/nebular) ([6202b3e](https://github.com/Liquid-JS/lyra/commit/6202b3e945f897cadae5469f4f1c8f6994f9477c))
* **grid:** remove unused incorrect styles ([e602783](https://github.com/Liquid-JS/lyra/commit/e602783e2281f1eb3f8983253f8d06cffd921f87))
* **header:** fix layout header test ([#153](https://github.com/Liquid-JS/lyra/issues/153)) ([b97ee8f](https://github.com/Liquid-JS/lyra/commit/b97ee8fe2df4dfdd9de2524c2a4c1cec6dcca188))
* **hover trigger strategy:** prevent resubscription after destroy ([#2058](https://github.com/Liquid-JS/lyra/issues/2058)) ([1e1a293](https://github.com/Liquid-JS/lyra/commit/1e1a293d189cc63f15a53c9e69682ee754fbc149))
* **icon:** fix NULL content render in MS Edge ([#2043](https://github.com/Liquid-JS/lyra/issues/2043)) ([f37223a](https://github.com/Liquid-JS/lyra/commit/f37223a933dd9cd7ed255c84dcdc2b3ede518ced))
* **icons:** fix readme ([7fdd24c](https://github.com/Liquid-JS/lyra/commit/7fdd24c96bd9541cff6654e35dd39ed39af1b3fa))
* **icons:** fix scss internal file names ([fab69cd](https://github.com/Liquid-JS/lyra/commit/fab69cdedf4c763ba2f7dcdf20eeb7f2b967dc68))
* **icons:** improve styles for the icons ([ff81ec1](https://github.com/Liquid-JS/lyra/commit/ff81ec167a8ee79c11a857d57328f0feccde4b22))
* **icons:** improve typo for the checkmark icon ([b7ee4ad](https://github.com/Liquid-JS/lyra/commit/b7ee4ad3f45e01504845e4481d720090fb1fdc52))
* **icon:** specify vertical align ([#1657](https://github.com/Liquid-JS/lyra/issues/1657)) ([8ceb343](https://github.com/Liquid-JS/lyra/commit/8ceb34322b7ed8dfcd2c951d639b4cc5e1fb3838))
* **imports:** fix imports to not include .ts extension. ([#201](https://github.com/Liquid-JS/lyra/issues/201)) ([348f674](https://github.com/Liquid-JS/lyra/commit/348f67423b2d9b599fdad65fffff2d2d79779447))
* **infinite-list:** fix example file path ([60d0d1e](https://github.com/Liquid-JS/lyra/commit/60d0d1e40ef178caaa1092da3d5088c624fe98a8))
* **inputs styles:** return forgotten styles ([db65924](https://github.com/Liquid-JS/lyra/commit/db6592423d38a7073a3d69192b2f875d026b1bcf))
* **input:** use correct status property name ([#2248](https://github.com/Liquid-JS/lyra/issues/2248)) ([737ffe2](https://github.com/Liquid-JS/lyra/commit/737ffe25be717a71edeaf4e3a99f45f1f5490b54))
* **js-theme:** fix defaut font, fix e2e & unit tests ([cff8561](https://github.com/Liquid-JS/lyra/commit/cff8561669cff6c4af12ecd3dd8f56f26b795581))
* **js-themes:** fix js-themes inheritance and colors ([5d791bd](https://github.com/Liquid-JS/lyra/commit/5d791bd5943c699b7b476ce81ff794f21e31da06))
* **layout header:** prevent stretching wider than window max width ([#1980](https://github.com/Liquid-JS/lyra/issues/1980)) ([c42c880](https://github.com/Liquid-JS/lyra/commit/c42c880db90e764b9fdcb4641fc8bf0ad9c99670))
* **layout:** access view child property after view init ([#2249](https://github.com/Liquid-JS/lyra/issues/2249)) ([5bb21a7](https://github.com/Liquid-JS/lyra/commit/5bb21a780f48fca2de3abdad4b0003a2e582e36a))
* **layout:** add border for the panel headers ([da524e9](https://github.com/Liquid-JS/lyra/commit/da524e9a0fd3f8735caed71b121c4749d4406d88))
* **layout:** add layout padding for header ([6d0ec82](https://github.com/Liquid-JS/lyra/commit/6d0ec82237fbdb4849fdcc249827cd97de6f706f))
* **layout:** fix center layout ([155c78a](https://github.com/Liquid-JS/lyra/commit/155c78a57c1f9e5bc2872a3e53ade75ca1c7ab27))
* **layout:** fix class name to not overlap styles with bootstrap ([440dff6](https://github.com/Liquid-JS/lyra/commit/440dff6c42c7e622d605d3a0289603fa6f2b63a4))
* **layout:** fix flexbug, same as in bcbfcc0 but works in IE11 too ([#148](https://github.com/Liquid-JS/lyra/issues/148)) ([#355](https://github.com/Liquid-JS/lyra/issues/355)) ([a432e82](https://github.com/Liquid-JS/lyra/commit/a432e824659da1ac6a5a3f4234bdf6dac9c27c8c))
* **layout:** fix IE issues with flex box ([3c41d96](https://github.com/Liquid-JS/lyra/commit/3c41d96d2e1307270df7ef75ebc7345f14cd1498))
* **layout:** fix issue with fixed header and bootstrap modals ([37bcc81](https://github.com/Liquid-JS/lyra/commit/37bcc816a5dfb4698ee1deca801e01023527e5fc))
* **layout:** fix issue with flex and smart table (IE issue) ([ae61e7e](https://github.com/Liquid-JS/lyra/commit/ae61e7e73934c9b58065683c0fa4d00c2333de76))
* **layout:** fix layout and card padding ([7bf19c9](https://github.com/Liquid-JS/lyra/commit/7bf19c94b0a9b004222eeccd5a5afaecd754fde4))
* **layout:** fix layout flex value ([ad7c528](https://github.com/Liquid-JS/lyra/commit/ad7c5283df372de868f253fba91b305d230648ae))
* **layout:** fix layout height when header is not fixed ([#437](https://github.com/Liquid-JS/lyra/issues/437)) ([084391b](https://github.com/Liquid-JS/lyra/commit/084391b440bc91cff68703f1f51a52418721e18a))
* **layout:** fix sidebar + layout behavior being depended on sidebar placement ([fa17dfa](https://github.com/Liquid-JS/lyra/commit/fa17dfa764def98df41abd18d365d41c3771f473))
* **layout:** fix sidebar + layout behavior being depended on sidebar placement ([6609ffa](https://github.com/Liquid-JS/lyra/commit/6609ffa59bc018351c3def73873d3bfc297631b7))
* **layout:** fix z-index for the different types of sidebar (IE issue) ([8b415e5](https://github.com/Liquid-JS/lyra/commit/8b415e536b3e7e058360d891665461b99c75d034))
* **layout:** improve sizes for card and user components ([fc4c723](https://github.com/Liquid-JS/lyra/commit/fc4c723f5054ddd0ef559e98bdd222b4d5d3c2ec))
* **layout:** prevent dom api calls on server ([#1107](https://github.com/Liquid-JS/lyra/issues/1107)) ([7511bb0](https://github.com/Liquid-JS/lyra/commit/7511bb0777b8506acf6ceb50fee725f5133cbac9)), closes [#1060](https://github.com/Liquid-JS/lyra/issues/1060)
* **layout:** prevent layout expansion when some child with overflow:hidden has an element with width larger than layout width ([bcbfcc0](https://github.com/Liquid-JS/lyra/commit/bcbfcc0aeb58f08ebbd4366bc48fa87d9fa64f2e))
* **layout:** provide correct link colors for cosmic theme ([f96e8dc](https://github.com/Liquid-JS/lyra/commit/f96e8dcb6cefa8f418545d8112ff87cf74d518ce))
* **layout:** scroll block in with scroll mode ([#1805](https://github.com/Liquid-JS/lyra/issues/1805)) ([8958fc9](https://github.com/Liquid-JS/lyra/commit/8958fc93753aaa0422c5e0f4fb592a940fe02daa))
* **layout:** set document dir directly ([#1164](https://github.com/Liquid-JS/lyra/issues/1164)) ([37eaea7](https://github.com/Liquid-JS/lyra/commit/37eaea73db8eb45ffa2d352c59028a0f507c1c8f))
* **layout:** set header background color on host element ([#1823](https://github.com/Liquid-JS/lyra/issues/1823)) ([34cb370](https://github.com/Liquid-JS/lyra/commit/34cb37092d15c867d767cc56568647774a99bbc5))
* **layout:** set top position on fixed header ([#1604](https://github.com/Liquid-JS/lyra/issues/1604)) ([6b89f73](https://github.com/Liquid-JS/lyra/commit/6b89f73769563c868d7cd88deca1c9f8b3bd45c1))
* **layout:** stub for search unhandled exception ([360b14d](https://github.com/Liquid-JS/lyra/commit/360b14d8bd6a797c977308134edbc405652819c4))
* **layout:** typo in basic usage example ([#1213](https://github.com/Liquid-JS/lyra/issues/1213)) ([6b21fe3](https://github.com/Liquid-JS/lyra/commit/6b21fe3d0844b189c5fcafe63b988649498b63d2)), closes [#1212](https://github.com/Liquid-JS/lyra/issues/1212)
* **layout:** with window mode scroll ([d8b08e8](https://github.com/Liquid-JS/lyra/commit/d8b08e886f4249f931ad10e98fa00aa2c71f59b6))
* **license:** fix license copyright ([0a6eb8d](https://github.com/Liquid-JS/lyra/commit/0a6eb8de5ed520a9d605f18d913a89c12dfca327))
* **lint:** allow unused expressions ([c1f7d2f](https://github.com/Liquid-JS/lyra/commit/c1f7d2f3c97af0bdceceb82b72b7cddb9cbc1386))
* **list:** vertically center list item content ([#1894](https://github.com/Liquid-JS/lyra/issues/1894)) ([7a179bc](https://github.com/Liquid-JS/lyra/commit/7a179bcf1f3208baff828486f54eebf037ba0ba9))
* **login:** fix navigation error ([b4b22de](https://github.com/Liquid-JS/lyra/commit/b4b22de3248afd0a9d762da899ff464051f5d498))
* **login:** fix styles issues ([3ec1fc3](https://github.com/Liquid-JS/lyra/commit/3ec1fc33040bfdcc5083aa166cf500b020b7517f))
* **login:** take into account remember me setting ([#644](https://github.com/Liquid-JS/lyra/issues/644)) ([d35b65b](https://github.com/Liquid-JS/lyra/commit/d35b65b95fef63e14145d1961e223ff700c7ba03)), closes [#330](https://github.com/Liquid-JS/lyra/issues/330)
* **logo:** hover color of logo is changed ([#457](https://github.com/Liquid-JS/lyra/issues/457)) ([130bcc3](https://github.com/Liquid-JS/lyra/commit/130bcc3bf2811a9ca840d374f3a7e28b12ab045d))
* **maps\leaflet:** Leaflet maps controls overlapping on mobile version ([bae2bbc](https://github.com/Liquid-JS/lyra/commit/bae2bbc8dae9943f7f21c893d7c1413d1c95366b)), closes [Close#29](https://github.com/Close/issues/29)
* memory leaks ([#3000](https://github.com/Liquid-JS/lyra/issues/3000)) ([d6374b1](https://github.com/Liquid-JS/lyra/commit/d6374b1a1dbdfd99b23544b91a02a61871da7039))
* **menu:** add an icon supporting to group title ([e4d044b](https://github.com/Liquid-JS/lyra/commit/e4d044bbce66e2bd4449db910566d0967e7e7a8c))
* **menu:** add login/register pages to menu ([2949fed](https://github.com/Liquid-JS/lyra/commit/2949fed4024fdefbc84713c7ef1c13d56746847e))
* **menu:** add RTL chevron menu icon ([#1042](https://github.com/Liquid-JS/lyra/issues/1042)) ([3f6ca4f](https://github.com/Liquid-JS/lyra/commit/3f6ca4ff00c4eea5f48bc2cc2c10972a3a6adf41))
* **menu:** apply default values for menuItems ([#344](https://github.com/Liquid-JS/lyra/issues/344)) ([674eef5](https://github.com/Liquid-JS/lyra/commit/674eef5cfabc39d5408dca421e2504264ceae555))
* **menu:** avoid DOM elements creation for hidden menu items ([#312](https://github.com/Liquid-JS/lyra/issues/312)) ([0c10917](https://github.com/Liquid-JS/lyra/commit/0c109174ae1667125354e7f1fe25433638765016)), closes [#270](https://github.com/Liquid-JS/lyra/issues/270)
* **menu:** change menu layout for default theme ([049f22b](https://github.com/Liquid-JS/lyra/commit/049f22b8e978b941195b8b4694e406a98e4a031d))
* **menu:** change to relative links to pages ([f9d511b](https://github.com/Liquid-JS/lyra/commit/f9d511bde7c24d6d21b742389e6ea3aeb62535d8))
* **menu:** clear typing for NbMenuItem pathMatch property ([#1627](https://github.com/Liquid-JS/lyra/issues/1627)) ([49bea48](https://github.com/Liquid-JS/lyra/commit/49bea48beda0f299f74d197e613321c537350993))
* **menu:** correct example property usage ([#1216](https://github.com/Liquid-JS/lyra/issues/1216)) ([87ecccf](https://github.com/Liquid-JS/lyra/commit/87ecccf5571d03e01fea09bccbe0803371690631))
* **menu:** don't collapse menu which has a selected item ([#225](https://github.com/Liquid-JS/lyra/issues/225)) ([5c489f3](https://github.com/Liquid-JS/lyra/commit/5c489f3f06e3650ad03fd7b9ba249399ba714085))
* **menu:** fix [#13](https://github.com/Liquid-JS/lyra/issues/13) add menu title ([6e56ee1](https://github.com/Liquid-JS/lyra/commit/6e56ee1b4eafd9842a7f52cf526eb187d55977a2))
* **menu:** fix [#84](https://github.com/Liquid-JS/lyra/issues/84) page title and breadcrumb not showing up ([8340ace](https://github.com/Liquid-JS/lyra/commit/8340acec7ab6b07731960c8b8bb7b3a2a399608a))
* **menu:** fix a url/link binding, add itemClick event ([14694e3](https://github.com/Liquid-JS/lyra/commit/14694e3aa240d24ca7a40ec7355e65bf3d1cbeb1))
* **menu:** fix an event bubbling ([d68d4ba](https://github.com/Liquid-JS/lyra/commit/d68d4ba2f4e019cd82e29574de0c8c27d094d9f7))
* **menu:** fix an issue when the menu items are duplicating ([97db695](https://github.com/Liquid-JS/lyra/commit/97db69580ee7180969ed505479bb65c91cf17968))
* **menu:** fix an issue where an menu items array is undefined ([c866200](https://github.com/Liquid-JS/lyra/commit/c86620064e06b7c308e8141eb90cc2a2ca0e62d8))
* **menu:** fix an issue where tag is empty ([3ea746a](https://github.com/Liquid-JS/lyra/commit/3ea746a31e059f937acddbf4aeac506fb66fdc6a))
* **menu:** fix an issue where the dynamic route is not selected ([1d68b7c](https://github.com/Liquid-JS/lyra/commit/1d68b7c664cb506a164e4e333a49471609f991d1))
* **menu:** fix an issue where the menu component is not rerendering ([d08727f](https://github.com/Liquid-JS/lyra/commit/d08727f51887b3683da8251e360b0c7f2ca68a7c))
* **menu:** fix an issue where the menu items is not adding ([75cf666](https://github.com/Liquid-JS/lyra/commit/75cf6669e40f90a9fdc62c17562e87ac2317d84f))
* **menu:** fix an unsubscribe issue ([31c4e16](https://github.com/Liquid-JS/lyra/commit/31c4e164e2744475d10e65dcf56d4ed54cb2fea8))
* **menu:** fix inactive menu item ([2468710](https://github.com/Liquid-JS/lyra/commit/24687102cf341b937d5ef9bd96f87a0235b09b12))
* **menu:** fix items not being prepared when passed through input ([#181](https://github.com/Liquid-JS/lyra/issues/181)) ([2e9d14a](https://github.com/Liquid-JS/lyra/commit/2e9d14a365bdaa49a0208e2b65d51fa48bd024d1))
* **menu:** fix merge conflict ([2ab3980](https://github.com/Liquid-JS/lyra/commit/2ab3980e5768cf3d799fe27c6c2a2d2f31f66515))
* **menu:** fix selected determination for pathMatch partial router links ([3e66636](https://github.com/Liquid-JS/lyra/commit/3e66636a05210387d834f54bd672500f4007836a))
* **menu:** fix some menu styles & behavior ([fe848fd](https://github.com/Liquid-JS/lyra/commit/fe848fdb54f0140f788dfb2097f26f91e56c9a1f))
* **menu:** height calculation ([#621](https://github.com/Liquid-JS/lyra/issues/621)) ([7542d5e](https://github.com/Liquid-JS/lyra/commit/7542d5ed11a6556b7a91c4209e58a878daed37fa)), closes [#620](https://github.com/Liquid-JS/lyra/issues/620) [#369](https://github.com/Liquid-JS/lyra/issues/369) [#532](https://github.com/Liquid-JS/lyra/issues/532) [#307](https://github.com/Liquid-JS/lyra/issues/307) [#444](https://github.com/Liquid-JS/lyra/issues/444) [#392](https://github.com/Liquid-JS/lyra/issues/392) [akveo/ngx-admin#1703](https://github.com/akveo/ngx-admin/issues/1703) [akveo/ngx-admin#1819](https://github.com/akveo/ngx-admin/issues/1819)
* **menu:** highlight when active anchors ([#1034](https://github.com/Liquid-JS/lyra/issues/1034)) ([c14215a](https://github.com/Liquid-JS/lyra/commit/c14215a4bc9eb69ccc5679bcd692a556edac5355)), closes [#875](https://github.com/Liquid-JS/lyra/issues/875)
* **menu:** icon color should use `text-hint-color` ([#1614](https://github.com/Liquid-JS/lyra/issues/1614)) ([dad01b2](https://github.com/Liquid-JS/lyra/commit/dad01b278c09ad6ff36aa321b6167edfe409a5b7))
* **menu:** improve animation for submenus ([684b72c](https://github.com/Liquid-JS/lyra/commit/684b72c142afd5ca4a5333acf7a971e1cbe366b6))
* **menu:** improve menu and sidebar styles ([8243425](https://github.com/Liquid-JS/lyra/commit/8243425db0af2ed4ed81aef1ad264f894c4dea89))
* **menu:** improve menu styles after icons changes ([88e2d3f](https://github.com/Liquid-JS/lyra/commit/88e2d3fedd9f8fae2db24f7b77554e465527241f))
* **menu:** path fragment comparison ([#1809](https://github.com/Liquid-JS/lyra/issues/1809)) ([abbd659](https://github.com/Liquid-JS/lyra/commit/abbd6590f3c039c90eee458e61883e513be914e2))
* **menu:** possible fix for menu item selection check ([e7dfd22](https://github.com/Liquid-JS/lyra/commit/e7dfd22f59083e1d44f511ea940395065022d9f2))
* **menu:** prevent color override in css vars mode ([#2201](https://github.com/Liquid-JS/lyra/issues/2201)) ([ac50dae](https://github.com/Liquid-JS/lyra/commit/ac50daebc6b3cbae52f593bd2c878d7cacb94246))
* **menu:** prevent extra '/' in menu link for empty path string ([#375](https://github.com/Liquid-JS/lyra/issues/375)) ([3f824b6](https://github.com/Liquid-JS/lyra/commit/3f824b6e82834e0a83a2498d7617d3fd427deb58))
* **menu:** remove hardcoded max-height ([#122](https://github.com/Liquid-JS/lyra/issues/122)) ([a753bee](https://github.com/Liquid-JS/lyra/commit/a753bee9a66f8146a6087294f24e4907985b0e95)), closes [#65](https://github.com/Liquid-JS/lyra/issues/65)
* **menu:** remove unnecessary / ([105163a](https://github.com/Liquid-JS/lyra/commit/105163a0f293e0e258e72b5f64bc08a391617970))
* **menu:** static links don't lead anywhere ([6464be1](https://github.com/Liquid-JS/lyra/commit/6464be13408142e0387bc716c71de40c19a9fe85))
* **menu:** stop sidebar adding display: none to collapsed item span t… ([#155](https://github.com/Liquid-JS/lyra/issues/155)) ([4c10d2a](https://github.com/Liquid-JS/lyra/commit/4c10d2aeac01f2e0197d421ccdebc318dc7da110))
* **menu:** trigger change detection after setting max-height ([#349](https://github.com/Liquid-JS/lyra/issues/349)) ([8c10372](https://github.com/Liquid-JS/lyra/commit/8c10372993b83016a364cfb4158890a7af327fb6)), closes [#263](https://github.com/Liquid-JS/lyra/issues/263)
* **menu:** update url-matching helper to include `;` ([#475](https://github.com/Liquid-JS/lyra/issues/475)) ([c67ec11](https://github.com/Liquid-JS/lyra/commit/c67ec1154125ac4bd6d1e2dd3a340b8bec0ea363))
* **merge:** fix merge issues ([3244131](https://github.com/Liquid-JS/lyra/commit/3244131e14b70732c3920debdac0354b5d77369b))
* **merge:** fix merge issues ([563c6d0](https://github.com/Liquid-JS/lyra/commit/563c6d03334f5043d007e36870956e724e94cf85))
* **merge:** merge tree view component ([4e5d682](https://github.com/Liquid-JS/lyra/commit/4e5d682ae84b795e74a7c5ed976e6c1c8b971408))
* **merge:** merge tree view component ([a46c259](https://github.com/Liquid-JS/lyra/commit/a46c259318db2cf467e6ad5b0e45cd1b1d2e860d))
* **modal:** rtl modal header ([#632](https://github.com/Liquid-JS/lyra/issues/632)) ([0370abe](https://github.com/Liquid-JS/lyra/commit/0370abe1a1b9999290c3bfa7b4c3ca7e9c50f732)), closes [#419](https://github.com/Liquid-JS/lyra/issues/419)
* **modals:** style close modal button ([079128f](https://github.com/Liquid-JS/lyra/commit/079128f1f4fd27252dc5de55ec084c7575aff866))
* **moment date service:** use locale format by default ([#2856](https://github.com/Liquid-JS/lyra/issues/2856)) ([491c696](https://github.com/Liquid-JS/lyra/commit/491c6962b7ca526f83479c615514a69abe9d2daf))
* **month picker:** prevent duplicates ([#1377](https://github.com/Liquid-JS/lyra/issues/1377)) ([47aff73](https://github.com/Liquid-JS/lyra/commit/47aff7319694cd71dd19d9ae920e0349893faf26))
* move auth examples to base component without layout ([#1479](https://github.com/Liquid-JS/lyra/issues/1479)) ([30e6942](https://github.com/Liquid-JS/lyra/commit/30e6942f9d28e49391cbacb27e7e52e9ce017e13))
* **nbButton:** allow specifying custom tabindex ([#2452](https://github.com/Liquid-JS/lyra/issues/2452)) ([e9f84be](https://github.com/Liquid-JS/lyra/commit/e9f84be756f699a77f25b5a2af887db1c4c334e9))
* **nbButton:** set disabled DOM property ([#871](https://github.com/Liquid-JS/lyra/issues/871)) ([23a709d](https://github.com/Liquid-JS/lyra/commit/23a709d375c0fcde9b6f1af80e1f3d157e12a9af))
* **nbIsGranted:** prevent subscription memory leak ([#2087](https://github.com/Liquid-JS/lyra/issues/2087)) ([2084356](https://github.com/Liquid-JS/lyra/commit/2084356dfe7e0caf08b12c5b21212a43b9dabee6))
* **NbTreeGrid:** Add a provide for CDK_TABLE ([#3265](https://github.com/Liquid-JS/lyra/issues/3265)) ([63d1d6c](https://github.com/Liquid-JS/lyra/commit/63d1d6cb782934800c71748347cc7d7037406632))
* **ng2-bootstrap:** update components accordingly ([aa5badb](https://github.com/Liquid-JS/lyra/commit/aa5badbc96427e9e7ae564740dc68fa52c9a0727))
* **ng2-uploader:** fix version issue [#113](https://github.com/Liquid-JS/lyra/issues/113) ([7d0ff2e](https://github.com/Liquid-JS/lyra/commit/7d0ff2ef96fead8dd030497d05e11fa9c6abc774))
* **oauth2:** grant_type now sends credentials in x-www-form-urlencoded form ([#832](https://github.com/Liquid-JS/lyra/issues/832)) ([57fda28](https://github.com/Liquid-JS/lyra/commit/57fda2800b49d1dc905a90847f5d4303327e2cdc)), closes [#716](https://github.com/Liquid-JS/lyra/issues/716)
* **oauth2:** body requests in x-www-form-urlencoded ([#1066](https://github.com/Liquid-JS/lyra/issues/1066)) ([3ee11f2](https://github.com/Liquid-JS/lyra/commit/3ee11f2f163e95e326f362e487c9cdccef84a1cf))
* **option group:** propagate disabled state to child options ([#1416](https://github.com/Liquid-JS/lyra/issues/1416)) ([54da610](https://github.com/Liquid-JS/lyra/commit/54da61027b588603780908bea10be1e26ce457e2))
* **option:** emit selection change when selection is changed ([#1334](https://github.com/Liquid-JS/lyra/issues/1334)) ([788a6d4](https://github.com/Liquid-JS/lyra/commit/788a6d4ef0c944493307c4a7d6cae16167930c3d))
* **outline-btn-group:** reduce specificity of transparent background ([#313](https://github.com/Liquid-JS/lyra/issues/313)) ([eb18ebe](https://github.com/Liquid-JS/lyra/commit/eb18ebe86ad495772dd9e9a55c1d26935e8aaf07)), closes [#295](https://github.com/Liquid-JS/lyra/issues/295)
* **overlay:** fix click trigger ([#912](https://github.com/Liquid-JS/lyra/issues/912)) ([08c2eb6](https://github.com/Liquid-JS/lyra/commit/08c2eb6b51dce7342c114775689af863c5635d56)), closes [#907](https://github.com/Liquid-JS/lyra/issues/907)
* **overlay:** hover trigger stop fire show if container already exists ([#947](https://github.com/Liquid-JS/lyra/issues/947)) ([2988a4b](https://github.com/Liquid-JS/lyra/commit/2988a4b2d8a45f26ef28873a4936566545952480))
* **overlay:** set context on component portals before first cd run ([#1395](https://github.com/Liquid-JS/lyra/issues/1395)) ([4ff3816](https://github.com/Liquid-JS/lyra/commit/4ff38169c748f40df29cda7b1cc29e4527b685b4))
* **overlay:** set position when content or context update ([#2081](https://github.com/Liquid-JS/lyra/issues/2081)) ([e85830f](https://github.com/Liquid-JS/lyra/commit/e85830fd2ca5196ace0ae7180e3397f8c419cffd))
* **overlay:** take 1 on stable event ([#3013](https://github.com/Liquid-JS/lyra/issues/3013)) ([a73351a](https://github.com/Liquid-JS/lyra/commit/a73351a198a846383fc9a11ebc647738a7860c3b))
* **overlay:** z-index ([#735](https://github.com/Liquid-JS/lyra/issues/735)) ([9c22a52](https://github.com/Liquid-JS/lyra/commit/9c22a5202e71171d219bf4fc4c90bf8141c9149c))
* **package:** add leaflet into package.json as some users have issues with it, fix [#22](https://github.com/Liquid-JS/lyra/issues/22) ([5edbe1f](https://github.com/Liquid-JS/lyra/commit/5edbe1f5d3c556fa0223b05db83f10bc6fb8e0b8))
* **package:** fix start:aot script ([4202930](https://github.com/Liquid-JS/lyra/commit/420293058c97ddf25c17abcac3455929b727e4f8))
* **package:** package.json cleanup ([4ce58ea](https://github.com/Liquid-JS/lyra/commit/4ce58eafcbcffda47f709962934c1db82d471a88))
* **packages smoke:** update webdriver-manager ([#1881](https://github.com/Liquid-JS/lyra/issues/1881)) ([e6c4966](https://github.com/Liquid-JS/lyra/commit/e6c4966237495cf6436cd32403c93822720b5b60))
* **packages:** get rid of almost all bower components ([d03c9d8](https://github.com/Liquid-JS/lyra/commit/d03c9d82b124e49e20c04749064b711cd482291b))
* **picture uploader:** AOT minor fixes ([54756fc](https://github.com/Liquid-JS/lyra/commit/54756fca9994e32ccef9b6603ab8b833d36ec622))
* **picture uploader:** ngx-uploader integration ([65dcb90](https://github.com/Liquid-JS/lyra/commit/65dcb90f05e50a04cda50cddd154c280d7863272))
* **playground:** fix playground styles ([cfe85d1](https://github.com/Liquid-JS/lyra/commit/cfe85d1e4cb3a2038f7fff871d7a855e83757a90))
* **playground:** replace lazy loaded module with components loading until this is supported ([936bc07](https://github.com/Liquid-JS/lyra/commit/936bc0796eb3b430cfc667be24ee843442a0e0df))
* **playground:** use nebular buttons in examples ([#849](https://github.com/Liquid-JS/lyra/issues/849)) ([b8c3148](https://github.com/Liquid-JS/lyra/commit/b8c314864a55d301f313234ff7eba036131ed01e))
* **popover, tooltip:** convert falsy values for adjustments to noop ([#1905](https://github.com/Liquid-JS/lyra/issues/1905)) ([3ec69e7](https://github.com/Liquid-JS/lyra/commit/3ec69e796e6938554e65a37063e45e862eb6d592))
* **popover, tooltip:** template check hint for adjustment ([#2278](https://github.com/Liquid-JS/lyra/issues/2278)) ([a77863d](https://github.com/Liquid-JS/lyra/commit/a77863d4a5ee30a555726cd2554bf7b8907f2e2e))
* **popover:** add missing start and end positions to positions mapping ([#1904](https://github.com/Liquid-JS/lyra/issues/1904)) ([64777a4](https://github.com/Liquid-JS/lyra/commit/64777a43974c76315a669ec24e40721eb3628ca2))
* **popover:** fix popover component example ([#711](https://github.com/Liquid-JS/lyra/issues/711)) ([9980664](https://github.com/Liquid-JS/lyra/commit/99806649730902fbe180e3e8d0c18a87331b55ad)), closes [#618](https://github.com/Liquid-JS/lyra/issues/618) [#619](https://github.com/Liquid-JS/lyra/issues/619)
* **popover:** fix template context not being passed, update cdk to 7.2.1 ([#1153](https://github.com/Liquid-JS/lyra/issues/1153)) ([c83188c](https://github.com/Liquid-JS/lyra/commit/c83188c96c7f81392929c864fdddfb9412f734f3)), closes [#1084](https://github.com/Liquid-JS/lyra/issues/1084) [#848](https://github.com/Liquid-JS/lyra/issues/848)
* **popover:** get back default 15px offset ([#1201](https://github.com/Liquid-JS/lyra/issues/1201)) ([f7433e7](https://github.com/Liquid-JS/lyra/commit/f7433e78ca0d9a5744c723b9680cedfcbff9d52e))
* **popover:** hide when host was removed ([#430](https://github.com/Liquid-JS/lyra/issues/430)) ([a07496d](https://github.com/Liquid-JS/lyra/commit/a07496d8017847d2b9f236aeb851c5edc98cd589))
* **popover:** inner triangle size ([#1020](https://github.com/Liquid-JS/lyra/issues/1020)) ([fe078c7](https://github.com/Liquid-JS/lyra/commit/fe078c726e88d9c2e0ee00dd4544c2395a8de355))
* **popover:** null check the ref before disposing ([#1086](https://github.com/Liquid-JS/lyra/issues/1086)) ([b3f7d39](https://github.com/Liquid-JS/lyra/commit/b3f7d39398564bfb8d59bfd7b5d04fd34ba81313))
* **popover:** run markForCheck to detect changes if nb-layout has onPush ([#267](https://github.com/Liquid-JS/lyra/issues/267)) ([7af0f62](https://github.com/Liquid-JS/lyra/commit/7af0f6214d6fc71bebe6e93228cacc1489162d43)), closes [#266](https://github.com/Liquid-JS/lyra/issues/266)
* **preloader:** fix menu being shown before preloader goes away ([4ee8cb1](https://github.com/Liquid-JS/lyra/commit/4ee8cb146602ac77b02e5b6d43b761349e03cf0e))
* **preloader:** missed file ([d2fadd0](https://github.com/Liquid-JS/lyra/commit/d2fadd02d21ea39ae1ae685af48ae20765e8040c))
* **preloader:** missed file, add again, hopefully final version ([ffe020f](https://github.com/Liquid-JS/lyra/commit/ffe020fd2a468c064aba6924ea4db914d6d652d2))
* **preloader:** missed file, remove again ([44faacd](https://github.com/Liquid-JS/lyra/commit/44faacd19a1f1a05c175e75396fbf59f246c63d7))
* **preloader:** missed file, removed ([e84c009](https://github.com/Liquid-JS/lyra/commit/e84c009dc3871e62661086250e5bf4be7d85d1d4))
* **preloader:** missed file, smth weird going on with this file... ([e0a25d6](https://github.com/Liquid-JS/lyra/commit/e0a25d64c0f7c2a78651b17e228835736e994dd8))
* provide browser globals with injection tokens ([#358](https://github.com/Liquid-JS/lyra/issues/358)) ([63f4bb8](https://github.com/Liquid-JS/lyra/commit/63f4bb8f45bb6b463824274843fb7bbf1e85fd42))
* provide Nebular scroll services adapters ([#2140](https://github.com/Liquid-JS/lyra/issues/2140)) ([0e0d11c](https://github.com/Liquid-JS/lyra/commit/0e0d11cb088e1b9a31ce11255a7234670db99dc7))
* **radio, select:** prevent updates of destroyed component ([#2617](https://github.com/Liquid-JS/lyra/issues/2617)) ([1ead242](https://github.com/Liquid-JS/lyra/commit/1ead2421e0e00ac9ebd0855449b8ab9842b38cf6))
* **radio:** add setDisabledState hook ([#2717](https://github.com/Liquid-JS/lyra/issues/2717)) ([db9e556](https://github.com/Liquid-JS/lyra/commit/db9e556f070f0a381898ed58e4f0d9d17e0e4d07))
* **radio:** add value reset with undefined ([#2511](https://github.com/Liquid-JS/lyra/issues/2511)) ([9ac12c7](https://github.com/Liquid-JS/lyra/commit/9ac12c71ca04a7fb579ad60a34d3ff76f940eedc))
* **radio:** prevent circles distraction ([#1549](https://github.com/Liquid-JS/lyra/issues/1549)) ([abb50df](https://github.com/Liquid-JS/lyra/commit/abb50df2090c9a57ea0bb6fca71713c590a937d0))
* **radio:** radio group ngModel doesn't setup initial value ([#842](https://github.com/Liquid-JS/lyra/issues/842)) ([92b6f6b](https://github.com/Liquid-JS/lyra/commit/92b6f6b0155ae75282ecf09f0703bd46ca16fe2d))
* **radio:** radio group now has bigger priority when setting value and disabled ([#841](https://github.com/Liquid-JS/lyra/issues/841)) ([99acd25](https://github.com/Liquid-JS/lyra/commit/99acd253ae287ccff8291d87d83e3c22d185037e))
* **radio:** reverse order of elements in RTL ([#2093](https://github.com/Liquid-JS/lyra/issues/2093)) ([2e61d8d](https://github.com/Liquid-JS/lyra/commit/2e61d8d683e3621779367ac7a0bccf2316fa0061))
* **range-picker:** correct type for min, max, filter properties ([#2877](https://github.com/Liquid-JS/lyra/issues/2877)) ([73cdec0](https://github.com/Liquid-JS/lyra/commit/73cdec0c9d457fcd0aa5f4e9ae6cd443f5a8b7e9))
* **rangepicker:** avoid setting month cell to null ([#2330](https://github.com/Liquid-JS/lyra/issues/2330)) ([a577b26](https://github.com/Liquid-JS/lyra/commit/a577b26e588bb03299475973b62fc34aaebae761))
* **readme:** add image ([67a71b4](https://github.com/Liquid-JS/lyra/commit/67a71b4d0c3e2e89731f46b7f6dd45b1723307af))
* **readme:** another image udpate ([b9d63ef](https://github.com/Liquid-JS/lyra/commit/b9d63ef8f2be778dd0ea908175841b3b081c8aff))
* **readme:** fix browser support table ([#2304](https://github.com/Liquid-JS/lyra/issues/2304)) ([23dc3be](https://github.com/Liquid-JS/lyra/commit/23dc3bed50f8a5b47510ebe1ba91d7855c56da05))
* **README:** fix dependency status link ([24fe588](https://github.com/Liquid-JS/lyra/commit/24fe588b42b97ff1f09636f1d382db179c0a5da1))
* **readme:** fix grammar ([b29f493](https://github.com/Liquid-JS/lyra/commit/b29f493425b505062f462335659ff7948dcb22ec))
* **readme:** fix image size ([30e27ed](https://github.com/Liquid-JS/lyra/commit/30e27ed0cae3c1698424dfbef2af5bf6a23bb057))
* **readme:** fix image text ([0cb5acf](https://github.com/Liquid-JS/lyra/commit/0cb5acff0ba07a6a0fd34f1283d3e70715dded7b))
* **readme:** fix typo ([33700c0](https://github.com/Liquid-JS/lyra/commit/33700c017b05dcc5875f7697d84e2c7a18b860eb))
* **readme:** fix typo ([122644b](https://github.com/Liquid-JS/lyra/commit/122644b2e8a483e417375ca226e79a2695917d5e))
* **readme:** img update ([1a9fe51](https://github.com/Liquid-JS/lyra/commit/1a9fe5113e77f8704d1faa162b58b54e1e0a71a2))
* **readme:** path to perfection.. ([fc4442a](https://github.com/Liquid-JS/lyra/commit/fc4442a248cba01dacbc48f02c033e7709c25e82))
* **readme:** typo fix ([69a9e39](https://github.com/Liquid-JS/lyra/commit/69a9e395f919e118f749cb357e95a57dca484b5e))
* **readme:** update image ([ff0e478](https://github.com/Liquid-JS/lyra/commit/ff0e478946042a1eef9c14b17f9ef53482ea3b6f))
* **register:** typo fix ([70f3dc8](https://github.com/Liquid-JS/lyra/commit/70f3dc8dbf0b8018cbdf36962283f0f2bcc4d690))
* remove empty component file ([#1352](https://github.com/Liquid-JS/lyra/issues/1352)) ([e0cc301](https://github.com/Liquid-JS/lyra/commit/e0cc301dd77590c35606ae8bc597cfc58b37abba))
* remove scss debug calls ([#1339](https://github.com/Liquid-JS/lyra/issues/1339)) ([b9bd521](https://github.com/Liquid-JS/lyra/commit/b9bd521ca3e2cff7e56f8ac3202af7b11df283b4))
* **reveal card:** card shadow being cut off ([#1656](https://github.com/Liquid-JS/lyra/issues/1656)) ([6001564](https://github.com/Liquid-JS/lyra/commit/600156492e5c0058b4ea8d3ee648d5ff5622529d))
* **reveal-card:** fix second card being visible on small screens ([#438](https://github.com/Liquid-JS/lyra/issues/438)) ([cad2246](https://github.com/Liquid-JS/lyra/commit/cad2246ad03e2fc3af08c6af92cd7b02799351f9))
* **route tabset:** support icon config object ([#2810](https://github.com/Liquid-JS/lyra/issues/2810)) ([ff00a16](https://github.com/Liquid-JS/lyra/commit/ff00a1659beb7ebbe27e3796ed5799e9d81505bc))
* **route tabset:** tab icon margin ([#2154](https://github.com/Liquid-JS/lyra/issues/2154)) ([f7210b2](https://github.com/Liquid-JS/lyra/commit/f7210b27618bc8df81db1e4010b007fc28bd55e6))
* **route:** fix [#2](https://github.com/Liquid-JS/lyra/issues/2), add a default handler for non registered routes ([86a8cb1](https://github.com/Liquid-JS/lyra/commit/86a8cb1cda92506de2432dcb518bfc0fee636ddf))
* **router-tabset:** navigate using router link ([#1146](https://github.com/Liquid-JS/lyra/issues/1146)) ([cb1c21e](https://github.com/Liquid-JS/lyra/commit/cb1c21e67bac66a9e682328cadd67e5358b7c18d)), closes [#188](https://github.com/Liquid-JS/lyra/issues/188)
* **router:** redirect not found routes to dashboard ([54f5f9a](https://github.com/Liquid-JS/lyra/commit/54f5f9a0417f469302b1f24bbce14531f670a196))
* **router:** remove prefixes from routers ([9377a5c](https://github.com/Liquid-JS/lyra/commit/9377a5c65697fbc81e8293bfb50a8e9622810f58))
* **router:** remove router-depricated references ([cac8518](https://github.com/Liquid-JS/lyra/commit/cac851847df7b34edd6e87924443095b522afdb3))
* **rtl:** reset bootstrap default styles ([#414](https://github.com/Liquid-JS/lyra/issues/414)) ([7634df5](https://github.com/Liquid-JS/lyra/commit/7634df55a3511b7f78802e94b740ddd2501a8abc))
* **schematics:** fix eva-icons schematic ([#1380](https://github.com/Liquid-JS/lyra/issues/1380)) ([0c809da](https://github.com/Liquid-JS/lyra/commit/0c809da292cca8153cb0dedf87660cdb9bccb829))
* **schematics:** inline template indentation ([#988](https://github.com/Liquid-JS/lyra/issues/988)) ([31b7184](https://github.com/Liquid-JS/lyra/commit/31b718481c26385837b3348557353ccc93d24036))
* **schematics:** use cli version for schematics/angular package ([#1937](https://github.com/Liquid-JS/lyra/issues/1937)) ([4589726](https://github.com/Liquid-JS/lyra/commit/45897262d3b690e2459fb202827bb180977bbb42))
* **scripts:** add moment and date-fns bundles ([#818](https://github.com/Liquid-JS/lyra/issues/818)) ([c78ae5f](https://github.com/Liquid-JS/lyra/commit/c78ae5fdadfea2c84e389af6bad0689d3a1f02e7))
* scroll bar theming ([#1890](https://github.com/Liquid-JS/lyra/issues/1890)) ([e6b19a5](https://github.com/Liquid-JS/lyra/commit/e6b19a509a323946da76c2138d3da754d9fe12b8))
* **scroll dispatcher:** emit scroll events from cdkScrollable directive ([#2714](https://github.com/Liquid-JS/lyra/issues/2714)) ([f715e97](https://github.com/Liquid-JS/lyra/commit/f715e972cb3e55e45adf2b7959db016afc8ea9ee))
* **scroll service:** listen position requests right after layout created ([#2949](https://github.com/Liquid-JS/lyra/issues/2949)) ([74d64cf](https://github.com/Liquid-JS/lyra/commit/74d64cfbd3c7bff532c8d0b2275cc768d0b19ff9))
* **scroll:** fix scrolling behavior on ios devices ([ea99a16](https://github.com/Liquid-JS/lyra/commit/ea99a1691ee85c5aedf87f564f9003498d64d14d))
* **search:** close search with navigation ([970be1e](https://github.com/Liquid-JS/lyra/commit/970be1e2939f4c406a28c0cc1d7031aeb6b79ef1))
* **search:** create new Subject for new layout ([1e7eadd](https://github.com/Liquid-JS/lyra/commit/1e7eaddc8bdf8e95a493d4c8f125e5f2ec5dfa8b))
* **search:** emit activate and deactivate events ([#1162](https://github.com/Liquid-JS/lyra/issues/1162)) ([67c5718](https://github.com/Liquid-JS/lyra/commit/67c5718acf33fee3bfe9f631dee176bd5a4cfe38))
* **search:** fix default search background settings ([7a1e566](https://github.com/Liquid-JS/lyra/commit/7a1e566401bf8b6a92be84ad653f0258f0e23190))
* **search:** fix issue with several search components on the one page ([71aa396](https://github.com/Liquid-JS/lyra/commit/71aa396562796663a548d593338d22fd475863a4))
* **search:** fix issue with z-index and layout header ([508fe1b](https://github.com/Liquid-JS/lyra/commit/508fe1b16452c57fb25cd143c6f6ef70b706cd5a))
* **search:** fix layout view for rotate search ([6acc5da](https://github.com/Liquid-JS/lyra/commit/6acc5dada57bab8a9c427bfdff6e2ced007e1e54))
* **search:** fix search not un-subscribing from events ([#185](https://github.com/Liquid-JS/lyra/issues/185)) ([691e100](https://github.com/Liquid-JS/lyra/commit/691e10073cc330b2cfab8c6693440f973ed34314))
* **search:** fix tests some time not passing on search ([#176](https://github.com/Liquid-JS/lyra/issues/176)) ([254ddd3](https://github.com/Liquid-JS/lyra/commit/254ddd3d7bbb7f42d0f4f0137ee8eb0bdd9d9250))
* **search:** prevent tabout from search field ([6d05ea9](https://github.com/Liquid-JS/lyra/commit/6d05ea980e96a3b1767b30362659e1f8342e3a5a))
* **search:** remove redundant wrapper ([076e834](https://github.com/Liquid-JS/lyra/commit/076e8349c6e722588e6b521a1e9b162119b027f0))
* **search:** remove simple search ([fdc287d](https://github.com/Liquid-JS/lyra/commit/fdc287de26656d83935df8805933625fd14cfb9a))
* **search:** resolve search field component factory ([#439](https://github.com/Liquid-JS/lyra/issues/439)) ([15cf18d](https://github.com/Liquid-JS/lyra/commit/15cf18d8c2eaaebcd2a8d6cd858a2c457cb9d9fc))
* **search:** unsubscribe observables ([#1112](https://github.com/Liquid-JS/lyra/issues/1112)) ([ffc6835](https://github.com/Liquid-JS/lyra/commit/ffc68350da187a06f837f4964d52f4ed580c48f9))
* **security:** make config work with strict ts mode ([#1215](https://github.com/Liquid-JS/lyra/issues/1215)) ([7c78d6c](https://github.com/Liquid-JS/lyra/commit/7c78d6cde075d9f73d824bdd3e46473fd0ebcd66)), closes [#1166](https://github.com/Liquid-JS/lyra/issues/1166)
* **select-with-autocomplete:** fix first render with disabled autocomplete ([#3104](https://github.com/Liquid-JS/lyra/issues/3104)) ([efcd690](https://github.com/Liquid-JS/lyra/commit/efcd69028a5785a2143cd768d8f4e020af242ea2))
* **select-with-autocomplete:** fix select autocomplete width ([#3113](https://github.com/Liquid-JS/lyra/issues/3113)) ([078c9f3](https://github.com/Liquid-JS/lyra/commit/078c9f337c17d856725d791d9e0e0f8c7daf08c9))
* **select-with-autocomplete:** improve select open after input changed ([#3110](https://github.com/Liquid-JS/lyra/issues/3110)) ([eaa036b](https://github.com/Liquid-JS/lyra/commit/eaa036b58e1ab6b5dc29f3c27bf0eb6029414904))
* **select, autocomplete:** don't open overlay without options ([#2930](https://github.com/Liquid-JS/lyra/issues/2930)) ([fca5cd1](https://github.com/Liquid-JS/lyra/commit/fca5cd14016b101466908f24a0c17c2664eb3e19))
* **select:** add ellipsis on selection view ([#2809](https://github.com/Liquid-JS/lyra/issues/2809)) ([9b525f4](https://github.com/Liquid-JS/lyra/commit/9b525f45501de9e17544c85178b8adc6d723c67d))
* **select:** add theme property for open select border ([#1653](https://github.com/Liquid-JS/lyra/issues/1653)) ([d16dcba](https://github.com/Liquid-JS/lyra/commit/d16dcbab35e60933a0180e14f12b93eec9bbf552))
* **select:** add type button, stop form submitting ([#945](https://github.com/Liquid-JS/lyra/issues/945)) ([255fca9](https://github.com/Liquid-JS/lyra/commit/255fca98ce787072d77ad8093e66331f3c8efd36))
* **select:** allow initial falsy values ([#1936](https://github.com/Liquid-JS/lyra/issues/1936)) ([02080fb](https://github.com/Liquid-JS/lyra/commit/02080fbb3726c27c4c4dd9bed67c36a45ac65838))
* **select:** allow select to work with empty values in nb-option ([#1282](https://github.com/Liquid-JS/lyra/issues/1282)) ([ca4a1ff](https://github.com/Liquid-JS/lyra/commit/ca4a1ff69fdc5fca1d03549c0dc342bdae21650f))
* **select:** correctly handle reset value when multiple is on ([#2815](https://github.com/Liquid-JS/lyra/issues/2815)) ([37a0bc2](https://github.com/Liquid-JS/lyra/commit/37a0bc26ef6212cf60fe4f250394bc6d39db9cb9))
* **select:** disable layout scrolling ([#1012](https://github.com/Liquid-JS/lyra/issues/1012)) ([1bd8214](https://github.com/Liquid-JS/lyra/commit/1bd8214ca78d83bc8c06ed695a5f3a6e2b300c97)), closes [#992](https://github.com/Liquid-JS/lyra/issues/992)
* **select:** disable opening disabled select after clicking on content ([#3068](https://github.com/Liquid-JS/lyra/issues/3068)) ([1c6ef1b](https://github.com/Liquid-JS/lyra/commit/1c6ef1becbda8414221c71db4da9e9aea17c6d0c))
* **select:** emit array when resetting multiple select ([#1399](https://github.com/Liquid-JS/lyra/issues/1399)) ([526cd0e](https://github.com/Liquid-JS/lyra/commit/526cd0ef4514af3f8019ba1e0fee9f4f1a1065e3))
* **select:** make options list same width as button ([#1650](https://github.com/Liquid-JS/lyra/issues/1650)) ([1658ccf](https://github.com/Liquid-JS/lyra/commit/1658ccf1dc44acdcea8c18ff321f52586cb56ad0))
* **select:** mark touched on hide trigger only when select is open ([#1878](https://github.com/Liquid-JS/lyra/issues/1878)) ([8295c32](https://github.com/Liquid-JS/lyra/commit/8295c3223b57d92bf6f7e480acb54a9cca26d599))
* **select:** options text selection disabled ([#1033](https://github.com/Liquid-JS/lyra/issues/1033)) ([fef2a9a](https://github.com/Liquid-JS/lyra/commit/fef2a9a822edf0638cb2fea418d321470266c574))
* **select:** prevent change detection of destroyed option ([#1329](https://github.com/Liquid-JS/lyra/issues/1329)) ([9e2245f](https://github.com/Liquid-JS/lyra/commit/9e2245f8189be7f65f31ef5595f0d7fcdd7fb377))
* **select:** prevent dispose call on uninitialized properties ([#1340](https://github.com/Liquid-JS/lyra/issues/1340)) ([a7a158d](https://github.com/Liquid-JS/lyra/commit/a7a158d5de309c45794a4ba8e9800ca2c4595d25))
* **select:** prevent empty select height collapsing ([#1643](https://github.com/Liquid-JS/lyra/issues/1643)) ([43655c7](https://github.com/Liquid-JS/lyra/commit/43655c786487b4a037824026e5a5b83aabda9cc0))
* **select:** prevent navigation to disabled option from keyboard ([#1427](https://github.com/Liquid-JS/lyra/issues/1427)) ([657d8ae](https://github.com/Liquid-JS/lyra/commit/657d8ae5f5f064948ba66d37a925c1412070349e))
* **select:** prevent opening of disabled select when clicking on toggle ([#1865](https://github.com/Liquid-JS/lyra/issues/1865)) ([0542371](https://github.com/Liquid-JS/lyra/commit/0542371bfc05457531592fe8bffd1a7e3a5a3215))
* **select:** remove max width from options list in full width s… ([#1837](https://github.com/Liquid-JS/lyra/issues/1837)) ([272cbd3](https://github.com/Liquid-JS/lyra/commit/272cbd3b6d83ea312a2cda90e0beebe8cb7b8213))
* **select:** remove usage of deleted variables ([#1670](https://github.com/Liquid-JS/lyra/issues/1670)) ([ff4dc8b](https://github.com/Liquid-JS/lyra/commit/ff4dc8b039625e98cfdf95040c411766167c7f76))
* **select:** resubscribe on options changes ([#1009](https://github.com/Liquid-JS/lyra/issues/1009)) ([949b050](https://github.com/Liquid-JS/lyra/commit/949b05014f6a318251903ced4aededa436947b11))
* **select:** run change detection after setting initial value ([#898](https://github.com/Liquid-JS/lyra/issues/898)) ([5cf94f2](https://github.com/Liquid-JS/lyra/commit/5cf94f2a16a0242448a1d2599e67d1ea4804d158))
* **select:** scroll into selected option on open ([#2859](https://github.com/Liquid-JS/lyra/issues/2859)) ([1c02e15](https://github.com/Liquid-JS/lyra/commit/1c02e15aefd8213da9c7793bdcb1ece40132de66))
* **select:** set value from queue when options change ([#2082](https://github.com/Liquid-JS/lyra/issues/2082)) ([c934329](https://github.com/Liquid-JS/lyra/commit/c93432923ff58a109bb60ba4e21ced164fad3f9d))
* **select:** transparent gap between options ([#1563](https://github.com/Liquid-JS/lyra/issues/1563)) ([714c45e](https://github.com/Liquid-JS/lyra/commit/714c45e08f054b7a980a21cf0fae4de2f294ed9c))
* **select:** update selected after cd run is finished ([#1299](https://github.com/Liquid-JS/lyra/issues/1299)) ([2a1f113](https://github.com/Liquid-JS/lyra/commit/2a1f113a9362b350646e33acf5e10aba65553ebc))
* **select:** use new 'checked' input ([#1747](https://github.com/Liquid-JS/lyra/issues/1747)) ([4bfd22d](https://github.com/Liquid-JS/lyra/commit/4bfd22d2cf5ca639b864ddbadd09844b7d04dac1))
* **services:** fix providers for root, correctly apply another themes ([40aa2ed](https://github.com/Liquid-JS/lyra/commit/40aa2ed0ae094670c73600ec8923443007915eed))
* **sidebar:** add href attribute to placeholder links in sidebar and pageTop ([#377](https://github.com/Liquid-JS/lyra/issues/377)) ([bb4bf77](https://github.com/Liquid-JS/lyra/commit/bb4bf77ceb06816befb2a9b74aff66e93050fd71))
* **sidebar:** add shadow for window mode ([6196ed7](https://github.com/Liquid-JS/lyra/commit/6196ed742f004e302b98445a01582f1ee409e020))
* **sidebar:** emit expand event when expanded because of menu c… ([#1897](https://github.com/Liquid-JS/lyra/issues/1897)) ([a07487d](https://github.com/Liquid-JS/lyra/commit/a07487d64c6604af511eee0e92a915776d48675a))
* **sidebar:** emit state change ([#2645](https://github.com/Liquid-JS/lyra/issues/2645)) ([8a35e85](https://github.com/Liquid-JS/lyra/commit/8a35e85b5b13c7b2828c1bee4922ef1e7a01de10))
* **sidebar:** expand if not compacted or collapsed ([#984](https://github.com/Liquid-JS/lyra/issues/984)) ([33a0990](https://github.com/Liquid-JS/lyra/commit/33a0990871e95cda9e34bc3bff10dea4281acb19))
* **sidebar:** expand when menu with children clicked ([#1750](https://github.com/Liquid-JS/lyra/issues/1750)) ([7ad7005](https://github.com/Liquid-JS/lyra/commit/7ad7005dc53e2517a57146d4dc25c174136b9804))
* **sidebar:** fix center content not being shrink ([156dba2](https://github.com/Liquid-JS/lyra/commit/156dba2a797ffd1992fa2dddf83ac0078f6aa21c))
* **sidebar:** fix selection issue ([a74c056](https://github.com/Liquid-JS/lyra/commit/a74c056065d7304d3f54440c545556b49173bfbe))
* **sidebar:** fix sidebar from absolute to fixed ([59460cb](https://github.com/Liquid-JS/lyra/commit/59460cbcdbf7249c40418f2e4c12da49d4665258))
* **sidebar:** fix sidebar height ([5ea9774](https://github.com/Liquid-JS/lyra/commit/5ea9774a435a6302e5e36ef6548bc4ce7067b439))
* **sidebar:** fix sidebar scroll behavior ([838f687](https://github.com/Liquid-JS/lyra/commit/838f687276f884a558200527b9018a2fd99c7cd1))
* **sidebar:** fix sidebar styles ([36788af](https://github.com/Liquid-JS/lyra/commit/36788af19cdf0ab99c1e7b775e3f6c3e7be88693))
* **sidebar:** improve sidebar scroll performance ([2ec7e38](https://github.com/Liquid-JS/lyra/commit/2ec7e3877f5df6a4df69f1106f6b98fe925f8272))
* **sidebar:** only expand sidebar when item has children elements ([#158](https://github.com/Liquid-JS/lyra/issues/158)) ([3a47dbf](https://github.com/Liquid-JS/lyra/commit/3a47dbf2657b1a530434e2b45fee4131ab3cd347)), closes [#23](https://github.com/Liquid-JS/lyra/issues/23)
* **sidebar:** prevent translation to the top when overlay opened ([#1607](https://github.com/Liquid-JS/lyra/issues/1607)) ([c2a11fb](https://github.com/Liquid-JS/lyra/commit/c2a11fbde8dd77951a4d75dbb433caa6cba52fd4))
* **sidebar:** sidebar state observable ([#2729](https://github.com/Liquid-JS/lyra/issues/2729)) ([dd0c88e](https://github.com/Liquid-JS/lyra/commit/dd0c88ed843219c96944ab9cc649cf7b3372f37e))
* **sidebar:** update state when responsive setting change ([#2654](https://github.com/Liquid-JS/lyra/issues/2654)) ([bf7e2a3](https://github.com/Liquid-JS/lyra/commit/bf7e2a3987f37f559ad0f8ffed92fddd46eaae45))
* **smart table:** map to existing theme variable ([#1558](https://github.com/Liquid-JS/lyra/issues/1558)) ([bfa3d16](https://github.com/Liquid-JS/lyra/commit/bfa3d1682dade701c9eefcd775ab6f0ab1567573))
* **smart table:** use primary colors ([#1746](https://github.com/Liquid-JS/lyra/issues/1746)) ([82ad5c4](https://github.com/Liquid-JS/lyra/commit/82ad5c45201c8a1bfb86ab94964fd907a5b93f57))
* **smart-table:** improve smart table styles ([b8cac0e](https://github.com/Liquid-JS/lyra/commit/b8cac0e1e7baa9d4c169f443ac1eccecdd018c6f))
* **source map:** fix [#136](https://github.com/Liquid-JS/lyra/issues/136) source map no being generated correctly ([c79ac94](https://github.com/Liquid-JS/lyra/commit/c79ac94a66f78146b61223e4e83a04fc3647b71b))
* **spinner:** ability to set spinner message ([#1508](https://github.com/Liquid-JS/lyra/issues/1508)) ([64f94c1](https://github.com/Liquid-JS/lyra/commit/64f94c1879c518fb1d192dbf3f49b76078877298))
* **styles:** additional bg hidden by default ([40c4091](https://github.com/Liquid-JS/lyra/commit/40c409185a0549f98e260a3e3ee07d80076b4968))
* **styles:** body bg image instead of css pattern ([02fdd09](https://github.com/Liquid-JS/lyra/commit/02fdd09bc0ba7dd6508ce6ac4930951ee233aaed))
* **styles:** chart bg with same transparency as chart border ([a47d13e](https://github.com/Liquid-JS/lyra/commit/a47d13e46a218605a4c9d0b425d49cb003b3c99e))
* **styles:** fix [#372](https://github.com/Liquid-JS/lyra/issues/372) input-group issues ([a523c7c](https://github.com/Liquid-JS/lyra/commit/a523c7ced440f64996c2078ef914c00bec8ccccc))
* **styles:** get rid of nested mixins as sass doesn't support this for the time being ([#331](https://github.com/Liquid-JS/lyra/issues/331)) ([157b69d](https://github.com/Liquid-JS/lyra/commit/157b69d7e334250395e5405acab4cc744c9c334b)), closes [#316](https://github.com/Liquid-JS/lyra/issues/316)
* **styles:** input groups active border colors ([89c9db7](https://github.com/Liquid-JS/lyra/commit/89c9db7a71b6039d60cbf993d4e5eadd51335ad4))
* **styles:** move blur bg to blur theme configuration ([0b44fd6](https://github.com/Liquid-JS/lyra/commit/0b44fd6293236c7bb07d51fbc5f276f5bbfb6421))
* **styles:** sticky background and input background and border colors ([71bdc5c](https://github.com/Liquid-JS/lyra/commit/71bdc5c9d13900c9dcc81e38d70e5ef02f01b39a))
* support strict template check ([#2273](https://github.com/Liquid-JS/lyra/issues/2273)) ([9b4ff5b](https://github.com/Liquid-JS/lyra/commit/9b4ff5bbd2584e3c51c52f81f6028491574f0f53))
* **table:** improve styles for smart-tables and nebular icons ([a89cb5f](https://github.com/Liquid-JS/lyra/commit/a89cb5f15687f8af2d81dbb0935432a4433788a9))
* **table:** remove search field ([bfab17b](https://github.com/Liquid-JS/lyra/commit/bfab17bd4357623ada699e8f1c82b6ef1a2397ee))
* **tabset:** fix exception, when renders conditionally with *ngIf directive ([#501](https://github.com/Liquid-JS/lyra/issues/501)) ([946e68c](https://github.com/Liquid-JS/lyra/commit/946e68c9277686716bd7a5874c5ccce39779ae51))
* **tabset:** lazy loading ([#2827](https://github.com/Liquid-JS/lyra/issues/2827)) ([a51513c](https://github.com/Liquid-JS/lyra/commit/a51513cca4ce156a57bb2e1938a75cb7d54c631b))
* **tabset:** prevent select call if no active tab found ([#1444](https://github.com/Liquid-JS/lyra/issues/1444)) ([f738f9d](https://github.com/Liquid-JS/lyra/commit/f738f9dd1cccc3b704ef0ad54f122959c2fcacf2))
* **tabset:** removes bold emphasize for hovered tab ([#651](https://github.com/Liquid-JS/lyra/issues/651)) ([22e39eb](https://github.com/Liquid-JS/lyra/commit/22e39eb42cf5b66151f1cc907934bea40f7bf101)), closes [#540](https://github.com/Liquid-JS/lyra/issues/540)
* **tabs:** fix linter error ([d08decc](https://github.com/Liquid-JS/lyra/commit/d08decc64ea2ef78891843ca6ba35e334a03f168))
* **tabs:** fix route-tabset styles ([fe0e41a](https://github.com/Liquid-JS/lyra/commit/fe0e41ae2c9fc66fd97c3a1eddbce89ec1d7f658))
* **tabs:** hide nga-tab itself if it's not active ([14fc8fd](https://github.com/Liquid-JS/lyra/commit/14fc8fdbf7d6239ba2105bc9b8801ff99632c8ca))
* **tabs:** improve tabs styles ([b037739](https://github.com/Liquid-JS/lyra/commit/b037739a3274add682c92f2f7d1c185d1c7b753c))
* **tabs:** use button mixins for the the active tab ([90df2dd](https://github.com/Liquid-JS/lyra/commit/90df2dd543c9ab6fdedc6f9e02470b6c5b4b383e))
* **tag list:** prevent autofocus on initial load ([#2734](https://github.com/Liquid-JS/lyra/issues/2734)) ([8d60faf](https://github.com/Liquid-JS/lyra/commit/8d60fafdf4bce680b08f64a45a91e5d17dcccb02))
* **tag list:** prevent initialisation error in Universal ([#2937](https://github.com/Liquid-JS/lyra/issues/2937)) ([e6a8ba0](https://github.com/Liquid-JS/lyra/commit/e6a8ba063a8eb999e29b7321ecc42dd711ed8913))
* **tavis:** fix karma config for browserstack ([#156](https://github.com/Liquid-JS/lyra/issues/156)) ([d5a4873](https://github.com/Liquid-JS/lyra/commit/d5a48733afbf8b7f6ec308bbf13137115505ff39))
* **test:** exclude schematics from main test ([#991](https://github.com/Liquid-JS/lyra/issues/991)) ([cd15b02](https://github.com/Liquid-JS/lyra/commit/cd15b025686aea02c2f7a2bfd317928799b3b7a3))
* **tests:** add layout to test components ([951735e](https://github.com/Liquid-JS/lyra/commit/951735e0ccef7abec14364bcc1eb58bcf416f28e))
* **tests:** fit -> it ([0e8c260](https://github.com/Liquid-JS/lyra/commit/0e8c26097a339cb602ed4574d8273c92e6ea1dc4))
* **tests:** fix broken tests ([ea8ebc7](https://github.com/Liquid-JS/lyra/commit/ea8ebc7919f97b636970d44228b250612d75a77b))
* **tests:** fix menu tests ([50e8bc2](https://github.com/Liquid-JS/lyra/commit/50e8bc296f7d5fc53793b9c6a0277780f498db5e))
* **tests:** fix test for layout and searches, add nebular-icons ([1bbe59e](https://github.com/Liquid-JS/lyra/commit/1bbe59e12010cfbd516f96eafc19298176d3a436))
* **tests:** revert back running only one search test ([ffb0147](https://github.com/Liquid-JS/lyra/commit/ffb0147f18b2ae784002866a56b2952d3908095f))
* **test:** temporary disable the tests ([a84f0d2](https://github.com/Liquid-JS/lyra/commit/a84f0d2b54c3855a532f96bfb08cd71bb9dbfe7b))
* **theme:** add btn-hero-secondary-pulse styles ([2b4d29b](https://github.com/Liquid-JS/lyra/commit/2b4d29bc44e8533af9fd5e2148a949987613c293))
* **theme:** add description comment to btn-pulse mixin ([eb3683c](https://github.com/Liquid-JS/lyra/commit/eb3683c75179cf6a1a00f223f9ffacbca78213b3))
* **theme:** add nebular-icons as peer dependency ([#749](https://github.com/Liquid-JS/lyra/issues/749)) ([3e3fe1d](https://github.com/Liquid-JS/lyra/commit/3e3fe1dca4fc8bd29b2de9b080556573e036f2e1)), closes [#195](https://github.com/Liquid-JS/lyra/issues/195)
* **theme:** add new variable(btn-outline-focus-fg) for focused outline buttons ([#471](https://github.com/Liquid-JS/lyra/issues/471)) ([df31a4c](https://github.com/Liquid-JS/lyra/commit/df31a4c2b3578f9fb93e28b3173824b69d0a8e57))
* **theme:** add padding for submenu items ([65ca236](https://github.com/Liquid-JS/lyra/commit/65ca2367ab1d4252190ce9886ba27e40155a6c39))
* **theme:** add separators for cards and modals, add fullWidth input to actions ([ecb1e5f](https://github.com/Liquid-JS/lyra/commit/ecb1e5f09559f8e19df765d49e634f202cac7d13))
* **theme:** add the menu options to index.ts ([509246c](https://github.com/Liquid-JS/lyra/commit/509246c7b1d28f9845436a5311e564a58570e56e))
* **theme:** add the missed services ([8f2007a](https://github.com/Liquid-JS/lyra/commit/8f2007aa5e3fd5497e95e48ace942c456dbf5ee3))
* **theme:** add the tabs sass variables ([401c996](https://github.com/Liquid-JS/lyra/commit/401c996a6e3b6b069445500ecece10b04fda75b5))
* **theme:** change basic default styles ([ecdbc18](https://github.com/Liquid-JS/lyra/commit/ecdbc182e000e9942db388d64373e4e6c7f95723))
* **theme:** change cosmic default color, refactor theme ([8c0b3d8](https://github.com/Liquid-JS/lyra/commit/8c0b3d89fff3223ab64c0cfb1b64e4c7016f8d56))
* **theme:** change theme variables for default and cosmic themes ([af8335a](https://github.com/Liquid-JS/lyra/commit/af8335a4241106e9f865363183d27d7a4d82e9e1))
* **theme:** check ref before detaching ([#1116](https://github.com/Liquid-JS/lyra/issues/1116)) ([af58d3f](https://github.com/Liquid-JS/lyra/commit/af58d3fdb886752531060c52a5ed82aea88a6142))
* **theme:** correct custom properties subtraction ([#2932](https://github.com/Liquid-JS/lyra/issues/2932)) ([4e63abc](https://github.com/Liquid-JS/lyra/commit/4e63abc467ebca87944a486066f9f927cb236e14))
* **theme:** finalize themes with design system ([#1481](https://github.com/Liquid-JS/lyra/issues/1481)) ([5673e98](https://github.com/Liquid-JS/lyra/commit/5673e987c5a1eb1f7b31751523033f0a7a676070)), closes [#40dc7e](https://github.com/Liquid-JS/lyra/issues/40dc7e) [#ebeef2](https://github.com/Liquid-JS/lyra/issues/ebeef2) [#3b5998](https://github.com/Liquid-JS/lyra/issues/3b5998) [#55acee](https://github.com/Liquid-JS/lyra/issues/55acee) [#dd4b39](https://github.com/Liquid-JS/lyra/issues/dd4b39) [#0177b5](https://github.com/Liquid-JS/lyra/issues/0177b5) [#6b6b6b](https://github.com/Liquid-JS/lyra/issues/6b6b6b) [#2f96e8](https://github.com/Liquid-JS/lyra/issues/2f96e8) [#f26798](https://github.com/Liquid-JS/lyra/issues/f26798) [#0093fa](https://github.com/Liquid-JS/lyra/issues/0093fa)
* **theme:** fix a custom-control-description color ([d0b5d3d](https://github.com/Liquid-JS/lyra/commit/d0b5d3ddc7291d5c9981195f5f4af30627457217))
* **theme:** fix a theme module config ([cc9a095](https://github.com/Liquid-JS/lyra/commit/cc9a095343e345b8fab3f1ceca739cd26d335309))
* **theme:** fix an issue when scrollbar didn't reset after a route change ([#91](https://github.com/Liquid-JS/lyra/issues/91)) ([9c77dad](https://github.com/Liquid-JS/lyra/commit/9c77dad61a024735bc005bc61cfd3a6180db5d26))
* **theme:** fix breakpoint.spec ([7e616df](https://github.com/Liquid-JS/lyra/commit/7e616df8bcf673b78ee4c48d5ae0a46964cefa6f))
* **theme:** fix btn-hero focus ([aed71ab](https://github.com/Liquid-JS/lyra/commit/aed71aba3d4384012f8a779b5b62f511b3c8200b))
* **theme:** fix cursor type for dropdown item ([8ed85b0](https://github.com/Liquid-JS/lyra/commit/8ed85b0e815e96f30411ad0e4142b62b0b38ac7f))
* **theme:** fix font tests and remove light theme test ([bad7da4](https://github.com/Liquid-JS/lyra/commit/bad7da4e678f4a3abb37e19cb34922ac97d61ec5))
* **theme:** fix font-main ([0d4576b](https://github.com/Liquid-JS/lyra/commit/0d4576b812f86527eb9767d3c89d7fe004d71afb))
* **theme:** fix foreground color ([9ed1cb0](https://github.com/Liquid-JS/lyra/commit/9ed1cb0da83106b43d8d87c0d3462f96467e8687))
* **theme:** fix foreground colors ([31114d0](https://github.com/Liquid-JS/lyra/commit/31114d05210573db4dde68ed33355d26087c85db))
* **theme:** fix form theme configuration ([6ece384](https://github.com/Liquid-JS/lyra/commit/6ece3846685baebd44a034bcc3d7fbebf3e06f0e))
* **theme:** fix forms styles ([b73af9a](https://github.com/Liquid-JS/lyra/commit/b73af9a21b4e1a97ce7f4a4de9fa389d02050f78))
* **theme:** fix lint issues ([7a79acb](https://github.com/Liquid-JS/lyra/commit/7a79acb8b79d9ede1826c99424e10f53ea052fa8))
* **theme:** fix normalize import to not include file type extension ([#1114](https://github.com/Liquid-JS/lyra/issues/1114)) ([40fa356](https://github.com/Liquid-JS/lyra/commit/40fa356bb7fe056db6c80ad715b433a5844adcde))
* **theme:** fix overlay components providers import ([#858](https://github.com/Liquid-JS/lyra/issues/858)) ([843a6c6](https://github.com/Liquid-JS/lyra/commit/843a6c69d69865831858ed592db509453be575dc))
* **theme:** fix sidebar shadow styles for Safari ([#909](https://github.com/Liquid-JS/lyra/issues/909)) ([031b1e6](https://github.com/Liquid-JS/lyra/commit/031b1e62e6ca908763ba9c6385653f6f47a4ad30)), closes [#562](https://github.com/Liquid-JS/lyra/issues/562)
* **theme:** fix the input overrides ([c79e085](https://github.com/Liquid-JS/lyra/commit/c79e08513c8a6115e1202a784fa86391e93aa3ab))
* **theme:** fix weird error in the forRoot method ([f2fa103](https://github.com/Liquid-JS/lyra/commit/f2fa10308359ab17dd74c2749304b1c191077525))
* **theme:** fix window and document providers to work in AOT ([#345](https://github.com/Liquid-JS/lyra/issues/345)) ([0aa898b](https://github.com/Liquid-JS/lyra/commit/0aa898b797f051662ef238c7c444f513fdbf5bd7))
* **theme:** fix z-index for layout header ([86d46ac](https://github.com/Liquid-JS/lyra/commit/86d46aca7e325235bcef45e58f130fa54d9ab821))
* **theme:** improve actions menu styles ([e39da02](https://github.com/Liquid-JS/lyra/commit/e39da024a746d21c212e45b464288197d5c2971a))
* **theme:** improve card and tabs styles, change default theme ([b8fa5a5](https://github.com/Liquid-JS/lyra/commit/b8fa5a51d402b1ff9bfbe16d4d98e7ea44359e11))
* **theme:** improve checkbox and radio styles ([136b9be](https://github.com/Liquid-JS/lyra/commit/136b9be7380daae8432854d324f92357274f2020))
* **theme:** improve dropdown styles ([#1212](https://github.com/Liquid-JS/lyra/issues/1212)) ([68f3f97](https://github.com/Liquid-JS/lyra/commit/68f3f97af9ec4253fcd3c7b29eb5898a6162fa0a))
* **theme:** improve forms inputs styles ([d93eabe](https://github.com/Liquid-JS/lyra/commit/d93eabe1744ea97e019e7699851ac562f9931a99))
* **theme:** improve hero button styles ([9d0464d](https://github.com/Liquid-JS/lyra/commit/9d0464d0fb38093cdbbe0bff376ae117142d4cf7))
* **theme:** improve icon button styles ([373409f](https://github.com/Liquid-JS/lyra/commit/373409f0b84bf640b1d662b9c9ac5b4c4a4444a2))
* **theme:** improve scrollbars, tabs and cards styles ([fa4a7c7](https://github.com/Liquid-JS/lyra/commit/fa4a7c7104e449fd14a8a56727b6143f4b4ca43e))
* **theme:** improve smart table styles for default theme ([f29b926](https://github.com/Liquid-JS/lyra/commit/f29b926490e2b7ff7e646212543343af29541a5c))
* **theme:** improve styles for actions component ([6488067](https://github.com/Liquid-JS/lyra/commit/6488067a2582fa50cbb1b3315b115472b7c7484c))
* **theme:** improve styles for user component ([159bfa7](https://github.com/Liquid-JS/lyra/commit/159bfa78ce84e7565f8738096a77639c87e259a5))
* **theme:** improve the dropdown styles ([7cd9a2c](https://github.com/Liquid-JS/lyra/commit/7cd9a2c9f65cfa4e7582105b36c6a313091def9a))
* **theme:** improve the dropdown styles ([5b34cd2](https://github.com/Liquid-JS/lyra/commit/5b34cd297efb45c5c35b779f7b585115a26145e0))
* **theme:** improve the dropdown styles ([#1204](https://github.com/Liquid-JS/lyra/issues/1204)) ([19e5093](https://github.com/Liquid-JS/lyra/commit/19e5093b34eb4aebe34b2ef4f2c41c55a099c1a2))
* **theme:** improve the icon buttons styles ([#1201](https://github.com/Liquid-JS/lyra/issues/1201)) ([67e45f6](https://github.com/Liquid-JS/lyra/commit/67e45f60d8443b83b282055810e70812103e63cd))
* **theme:** improve user and tabs component, refactor default theme ([08f9dc7](https://github.com/Liquid-JS/lyra/commit/08f9dc7de52f5776e6975e8043565fc3b1f1f39d))
* **theme:** inline cdk styles ([#857](https://github.com/Liquid-JS/lyra/issues/857)) ([e218df4](https://github.com/Liquid-JS/lyra/commit/e218df48269c9d57fd4279073b7fd6bd51bf1f77)), closes [#856](https://github.com/Liquid-JS/lyra/issues/856)
* **theme:** linting issues ([25910b4](https://github.com/Liquid-JS/lyra/commit/25910b4270a9bf9696023f2c16a4d57d6b8f10dc))
* **theme:** merge fix ([be7b2f5](https://github.com/Liquid-JS/lyra/commit/be7b2f5534f9821e5d16a432b643ec75355e1055))
* **theme:** move the templates to the external html files ([96bc7a8](https://github.com/Liquid-JS/lyra/commit/96bc7a851ea7a2130a87a285af0d0777616ebe55))
* **theme:** prevent transition to initial status ([#2256](https://github.com/Liquid-JS/lyra/issues/2256)) ([8e52fc0](https://github.com/Liquid-JS/lyra/commit/8e52fc0b0a9c9e2410d96eddbc572b9ce87b0254))
* **theme:** provide component factory resolver in tooltip ([#981](https://github.com/Liquid-JS/lyra/issues/981)) ([57777f8](https://github.com/Liquid-JS/lyra/commit/57777f8d102a9ad6a08c828d2ef80b45d61ef57c)), closes [#979](https://github.com/Liquid-JS/lyra/issues/979)
* **theme:** refactor js theme ([31c4100](https://github.com/Liquid-JS/lyra/commit/31c4100f2de899c7fef3c65bf3f24e5dde48239e))
* **theme:** remove a fixed content height ([#882](https://github.com/Liquid-JS/lyra/issues/882)) ([a85eaf2](https://github.com/Liquid-JS/lyra/commit/a85eaf252ee089c101c2a7f5d72b16b425fae052)), closes [#836](https://github.com/Liquid-JS/lyra/issues/836)
* **theme:** remove debug ([b1116fb](https://github.com/Liquid-JS/lyra/commit/b1116fb8f7916afe6f67b489328919c1e7040331))
* **theme:** remove layout-padding for corporate theme, remove unnecessary color from icon ([#496](https://github.com/Liquid-JS/lyra/issues/496)) ([49abbb9](https://github.com/Liquid-JS/lyra/commit/49abbb99f8cde9c9a75ee2c2740b24799b923e68))
* **theme:** remove OnPush change detection strategy ([840096e](https://github.com/Liquid-JS/lyra/commit/840096eb0e8eb17a561a686886a057311fccd7cf))
* **theme:** remove stock bootstrap box-shadow ([#72](https://github.com/Liquid-JS/lyra/issues/72)) ([7d7b3ab](https://github.com/Liquid-JS/lyra/commit/7d7b3abf36051b906ffe8fc2bd8845e817105325))
* **theme:** remove unneeded immutable.js import ([36d4bf1](https://github.com/Liquid-JS/lyra/commit/36d4bf1f9099c65f89df7260ba01821147c81175))
* **theme:** rename menu2Service to menuInternalService ([#1162](https://github.com/Liquid-JS/lyra/issues/1162)) ([4360300](https://github.com/Liquid-JS/lyra/commit/4360300aefff751f808be00ca7b4aaa8a5140649))
* **theme:** replace template with ng-template ([8dee7ab](https://github.com/Liquid-JS/lyra/commit/8dee7abceed1eb3e921c741038037e9cc1a6e570))
* **theme:** sass deprecation warning of strict unary operations ([#3271](https://github.com/Liquid-JS/lyra/issues/3271)) ([364d6da](https://github.com/Liquid-JS/lyra/commit/364d6dae9c735e12f52bb25db2c16b279eeb4da3))
* **theme:** scrollbars color in IE ([#66](https://github.com/Liquid-JS/lyra/issues/66)) ([b5b500c](https://github.com/Liquid-JS/lyra/commit/b5b500cf354fb78d49087c73d67f8d23a1305c5b))
* **theme:** set scrollbars corner color ([#2943](https://github.com/Liquid-JS/lyra/issues/2943)) ([1447b15](https://github.com/Liquid-JS/lyra/commit/1447b15b6358bff24a85b89fd45289a44f527cdb))
* **themes:** fix get-value not working in component context ([#1493](https://github.com/Liquid-JS/lyra/issues/1493)) ([30bc29f](https://github.com/Liquid-JS/lyra/commit/30bc29f0ba7af0e18303fbb447b13c5f9a5c3157))
* **themes:** fix typo in layout component style ([#3098](https://github.com/Liquid-JS/lyra/issues/3098)) ([5740682](https://github.com/Liquid-JS/lyra/commit/5740682ec1d122bc59c2a3a0ee94feab4b50fbe5))
* **theme:** styling default theme ([07f0b25](https://github.com/Liquid-JS/lyra/commit/07f0b25e4da98692a23a71121b98c5c9a6f5035b))
* **theme:** this issue in static method in color.helper ([fb20d54](https://github.com/Liquid-JS/lyra/commit/fb20d54506cd67c9954152eaf022dbaee47ddba3))
* **theme:** typography small tag font-size ([0fe1ae8](https://github.com/Liquid-JS/lyra/commit/0fe1ae876c9ae860a491f5672b83a010f8e198ce))
* **theme:** typography small tag size use percents instead of rem ([d1ef72e](https://github.com/Liquid-JS/lyra/commit/d1ef72e1d23f81cc3fa34db383975808b0b89988))
* **theme:** update stylelint config and fix linter errors ([#1165](https://github.com/Liquid-JS/lyra/issues/1165)) ([6c05349](https://github.com/Liquid-JS/lyra/commit/6c0534958681a5c45be3ad6660aebfb42ed04e93))
* **theme:** use existing variable for bootstrap ([#807](https://github.com/Liquid-JS/lyra/issues/807)) ([e91f557](https://github.com/Liquid-JS/lyra/commit/e91f557cc5ef786a5469db61fc16fb0d02813afa)), closes [#739](https://github.com/Liquid-JS/lyra/issues/739)
* **theming:** enable a theme once it's installed (so no need in component mixing for simplest cases) ([b11f7ce](https://github.com/Liquid-JS/lyra/commit/b11f7ce41994a79981e8405bedb6f9d6510a359f))
* **theming:** fix nb-theme not working in component mode without nb-i… ([#1503](https://github.com/Liquid-JS/lyra/issues/1503)) ([0bc9f07](https://github.com/Liquid-JS/lyra/commit/0bc9f07e248cb6d9f8ed43cc26b2f2a41c381587))
* **timepicker:** change position adjustment to "counterclockwise" ([#3085](https://github.com/Liquid-JS/lyra/issues/3085)) ([a546295](https://github.com/Liquid-JS/lyra/commit/a5462959011b16797b4df281a208458fffe38f69))
* **timepicker:** remove duplicate providers ([#2529](https://github.com/Liquid-JS/lyra/issues/2529)) ([7e5e489](https://github.com/Liquid-JS/lyra/commit/7e5e489178f6d94161fda459b6603e5e0849b5c0))
* **timepicker:** save lastInputValue when changed via form api ([#2718](https://github.com/Liquid-JS/lyra/issues/2718)) ([74096d0](https://github.com/Liquid-JS/lyra/commit/74096d006505af0471cfbed396116c4dfb51103e))
* **toastr:** animations in firefox and edge ([#944](https://github.com/Liquid-JS/lyra/issues/944)) ([27e4a6a](https://github.com/Liquid-JS/lyra/commit/27e4a6a2af68da6a2aa15a728faafa93403074b0)), closes [#865](https://github.com/Liquid-JS/lyra/issues/865)
* **toastr:** call contains on body ([#1872](https://github.com/Liquid-JS/lyra/issues/1872)) ([a01ec7a](https://github.com/Liquid-JS/lyra/commit/a01ec7a3cffc0df46fe5cb40e130904a52b4ba77))
* **toastr:** dispose no longer used overlay container ([#1873](https://github.com/Liquid-JS/lyra/issues/1873)) ([4114ad1](https://github.com/Liquid-JS/lyra/commit/4114ad1b2c5559fe3ff6e42a940bb77113967acb))
* **toastr:** icon size shrink ([#1638](https://github.com/Liquid-JS/lyra/issues/1638)) ([838d974](https://github.com/Liquid-JS/lyra/commit/838d97419953434db1dd7018441ed42fe0dd8a3f))
* **toastr:** move toastr overlay in front of other overlays ([#2078](https://github.com/Liquid-JS/lyra/issues/2078)) ([906d3c0](https://github.com/Liquid-JS/lyra/commit/906d3c074061add73a71ee475053ae666e2178e4))
* **toastr:** recreate container if it's not attached to dom ([#1224](https://github.com/Liquid-JS/lyra/issues/1224)) ([3343136](https://github.com/Liquid-JS/lyra/commit/3343136e8b50b29d18cd8e90ba67575f0001e4e8)), closes [#1099](https://github.com/Liquid-JS/lyra/issues/1099)
* **todo:** fix [#7](https://github.com/Liquid-JS/lyra/issues/7) adding empty todo item issue ([c276c55](https://github.com/Liquid-JS/lyra/commit/c276c5535ad14d6001803746b355f3f43843ab81))
* **toggle:** alignment of toggle switches ([#2561](https://github.com/Liquid-JS/lyra/issues/2561)) ([09a7ba1](https://github.com/Liquid-JS/lyra/commit/09a7ba154828dde32a963e84cbd8dfbad11a6c7b))
* **toggle:** animation in IE11 ([#2062](https://github.com/Liquid-JS/lyra/issues/2062)) ([1d52a20](https://github.com/Liquid-JS/lyra/commit/1d52a20d7d61c222dea74cdacdca75bfd23f3256))
* **toggle:** set correct ARIA role ([#2097](https://github.com/Liquid-JS/lyra/issues/2097)) ([dd5f2b6](https://github.com/Liquid-JS/lyra/commit/dd5f2b621bdb404de59f970505504c5d239950bb))
* **tooltip, popover, context menu:** correct physical positions in RTL ([#2819](https://github.com/Liquid-JS/lyra/issues/2819)) ([0959935](https://github.com/Liquid-JS/lyra/commit/095993593d593242539b7c6de914771f40965ff1))
* **tooltip:** add angular positions classes ([#2048](https://github.com/Liquid-JS/lyra/issues/2048)) ([a15c81d](https://github.com/Liquid-JS/lyra/commit/a15c81dbf0675d9421cbe37679ccb47215898e05))
* **tooltip:** fix tooltip not being hide + tests ([#1123](https://github.com/Liquid-JS/lyra/issues/1123)) ([9360a4b](https://github.com/Liquid-JS/lyra/commit/9360a4b6e110209c30d9309eca8e1e5257058375))
* **travis:** fix incorrect travis filename ([cc2fb1b](https://github.com/Liquid-JS/lyra/commit/cc2fb1bc58f568500bc9015831e894deafadf74e))
* **travis:** fix typescript 2.0.2 issue ([c25faf8](https://github.com/Liquid-JS/lyra/commit/c25faf89cd7fbea0fd8b8c42a7b20c03f96166d8))
* **travis:** fix typescript 2.0.2 issue ([c9c5e44](https://github.com/Liquid-JS/lyra/commit/c9c5e446cbe27a08fdbad5496f587f8aedbc3458))
* **travis:** fix typescript 2.0.2 issue, second attempt ([f11b655](https://github.com/Liquid-JS/lyra/commit/f11b655d896d10fcd1997caa1ecd160bd225d2a8))
* **travis:** playing with travis configuration ([386b1dc](https://github.com/Liquid-JS/lyra/commit/386b1dc216249a56588526276a8ce6cfcb04ac44))
* **travis:** remove git depth to allow commits comparison ([#150](https://github.com/Liquid-JS/lyra/issues/150)) ([4704d9e](https://github.com/Liquid-JS/lyra/commit/4704d9eab0c858764499b1fb67a6ecccbfe3ca60))
* **travis:** stop randomly failing builds ([#126](https://github.com/Liquid-JS/lyra/issues/126)) ([3740e08](https://github.com/Liquid-JS/lyra/commit/3740e08781ede88c5a0009d3583147e574a72d4e))
* **tree grid:** assert node children is defined before spreading ([#1898](https://github.com/Liquid-JS/lyra/issues/1898)) ([26ad5d2](https://github.com/Liquid-JS/lyra/commit/26ad5d200d20b824ac22ae0e6f32ee53fa78c1ee))
* **trigger:** prevent stream destroy on mouse leave ([#2141](https://github.com/Liquid-JS/lyra/issues/2141)) ([7c79d1d](https://github.com/Liquid-JS/lyra/commit/7c79d1d03d0c106edfb8d52f852c71642bf2aa2b))
* **tsconfig:** use lib es7 in dev and publish ([cd069c0](https://github.com/Liquid-JS/lyra/commit/cd069c046c307d69a9c70d620bd4bb6627cb2f33))
* **tslint:** fix [#248](https://github.com/Liquid-JS/lyra/issues/248) disable one-line rule and add  property force to lint command ([#439](https://github.com/Liquid-JS/lyra/issues/439)) ([3516e40](https://github.com/Liquid-JS/lyra/commit/3516e404fa81e6bf292293fdbd75e99d6f489150))
* **tslint:** fix lint warnings ([3b95603](https://github.com/Liquid-JS/lyra/commit/3b956036a840eafd1c59d003b4df3ed8eb14d781))
* **typography:** concat anchor selector with color class ([#2161](https://github.com/Liquid-JS/lyra/issues/2161)) ([8c9ed86](https://github.com/Liquid-JS/lyra/commit/8c9ed8637641a3d857783606cbc7c5b0dd4660a8))
* **typography:** declare text color classes at the bottom ([#1862](https://github.com/Liquid-JS/lyra/issues/1862)) ([1072754](https://github.com/Liquid-JS/lyra/commit/1072754e424c69a10584688d833deb9133a928e9))
* **typography:** lean -> learn ([b5f5e90](https://github.com/Liquid-JS/lyra/commit/b5f5e9055cfd8876abcfd6b9cf5782165877c98d))
* **typography:** use text theme vars for text color classes ([#2192](https://github.com/Liquid-JS/lyra/issues/2192)) ([af2e674](https://github.com/Liquid-JS/lyra/commit/af2e674f6b71ecc0e7b6790c9312fbecc8c1e28c))
* **universal:** update dependencies to support universal enviro… ([#2057](https://github.com/Liquid-JS/lyra/issues/2057)) ([0b22c40](https://github.com/Liquid-JS/lyra/commit/0b22c40f351d5874ce917a7c8e066ff9a7e5aecc))
* update protractor ([#1647](https://github.com/Liquid-JS/lyra/issues/1647)) ([8c2046e](https://github.com/Liquid-JS/lyra/commit/8c2046ea08fb626a935d2925c77eed5c9bd0dbe9))
* **uploader:** fix card width ([eec3cc9](https://github.com/Liquid-JS/lyra/commit/eec3cc96f652511d6edd85eb02fa7e460713b5f0))
* **user, actions:** small style fixes ([1464ab0](https://github.com/Liquid-JS/lyra/commit/1464ab07b033f767f0609c5e5a887550214cb968))
* **user:** fix user component context menu showing an icon not correctly, fix [#25](https://github.com/Liquid-JS/lyra/issues/25) ([52dc4a8](https://github.com/Liquid-JS/lyra/commit/52dc4a82d164a9c369118e2760b4e9807f8ccc7c))
* **user:** fix user component styles ([6b74835](https://github.com/Liquid-JS/lyra/commit/6b74835adf31ea0756359c8a3aea7e7aef1331bc))
* **webpack:** [#2](https://github.com/Liquid-JS/lyra/issues/2) correct relative base url to work inside a folder ([4f10ea8](https://github.com/Liquid-JS/lyra/commit/4f10ea8403a356dcd3e83e9f475a3053d36b2612))
* **webpack:** correct relative base url to work inside a folder ([525d344](https://github.com/Liquid-JS/lyra/commit/525d3444fe7d0e3fd473f08391ebc627d38b1073))
* **window:** create new window container when overlay container change ([#1867](https://github.com/Liquid-JS/lyra/issues/1867)) ([edb6b16](https://github.com/Liquid-JS/lyra/commit/edb6b16632cf47493b9f276a840bae439b2fe809))
* **window:** Fixed window.component.ts creating incorrect context ([#1266](https://github.com/Liquid-JS/lyra/issues/1266)) ([30f4a5d](https://github.com/Liquid-JS/lyra/commit/30f4a5da3a75370676bca815aedeb10783178966))
* **window:** reattach overlay after window expand ([#1022](https://github.com/Liquid-JS/lyra/issues/1022)) ([4b9c648](https://github.com/Liquid-JS/lyra/commit/4b9c648ba9e961103c982931acd7aca2dc88a6a0))

### Build System

* **deps:** migrate to firebase 8 ([#2584](https://github.com/Liquid-JS/lyra/issues/2584)) ([b7a2c6e](https://github.com/Liquid-JS/lyra/commit/b7a2c6e07c5f6cd01445695df0a083670881ae1b))

### chore

* update angular ([#1449](https://github.com/Liquid-JS/lyra/issues/1449)) ([3000e3b](https://github.com/Liquid-JS/lyra/commit/3000e3b8d2029e7d1e07a8bf5fe5cd4400156860))

### Code Refactoring

* **auth:** make components CD=OnPush, use `nbInput`, `nbButton` ([#595](https://github.com/Liquid-JS/lyra/issues/595)) ([e1863ec](https://github.com/Liquid-JS/lyra/commit/e1863ec9fae15a19d90296b99e07fafa41d04b9a))
* **auth:** provider -> strategy, `setup` method, multiple tokens ([3428ec3](https://github.com/Liquid-JS/lyra/commit/3428ec3777afa48e87b65cd7ad47195987da0898))
* **auth:** rejects malformed tokens ([#597](https://github.com/Liquid-JS/lyra/issues/597)), closes [#517](https://github.com/Liquid-JS/lyra/issues/517)
* **auth:** require valid token by default ([#2259](https://github.com/Liquid-JS/lyra/issues/2259)) ([bc68d11](https://github.com/Liquid-JS/lyra/commit/bc68d11b9278e7a9f1c5c77b20c269c6025c0e58))
* **menu:** emit itemClick event after clicking on item with link ([#728](https://github.com/Liquid-JS/lyra/issues/728)) ([94342e0](https://github.com/Liquid-JS/lyra/commit/94342e00d0fce0f8b8b82365dc6064f0b11e081c)), closes [#423](https://github.com/Liquid-JS/lyra/issues/423)
* **menu:** replace item click ReplaySubject with plain Subject ([#724](https://github.com/Liquid-JS/lyra/issues/724)), closes [#695](https://github.com/Liquid-JS/lyra/issues/695)
* **nb-icon:** return null if icon wasn't found ([#2466](https://github.com/Liquid-JS/lyra/issues/2466)) ([4af8924](https://github.com/Liquid-JS/lyra/commit/4af8924ed1e62e1b65028893c3d5906f09456f48))
* **overlay trigger:** accept element instead event ([#2974](https://github.com/Liquid-JS/lyra/issues/2974)) ([2137969](https://github.com/Liquid-JS/lyra/commit/2137969b06bf12a4fad833fe50c427855b42f220))
* **overlay:** use full css property name ([#1403](https://github.com/Liquid-JS/lyra/issues/1403)) ([4133058](https://github.com/Liquid-JS/lyra/commit/41330589560e430b914be1d5ecbb95e7407e5857))
* **sidebar:** remove deprecated properties ([#2973](https://github.com/Liquid-JS/lyra/issues/2973)) ([0ba32cd](https://github.com/Liquid-JS/lyra/commit/0ba32cdc31aeaf7c0f98638c17970fec6c7e0e32))
* **sidebar:** use OnPush change detection strategy ([#2646](https://github.com/Liquid-JS/lyra/issues/2646)) ([59daeea](https://github.com/Liquid-JS/lyra/commit/59daeeadfdfd37be43e7cfc23fc50d74b036a16d))
* **theme:** refactor popover, context-menu and search components to use overlays ([#684](https://github.com/Liquid-JS/lyra/issues/684)) ([d3ba6ab](https://github.com/Liquid-JS/lyra/commit/d3ba6ab42b88ded18a3285c4527372b45cc33065)), closes [#683](https://github.com/Liquid-JS/lyra/issues/683) [#664](https://github.com/Liquid-JS/lyra/issues/664) [#668](https://github.com/Liquid-JS/lyra/issues/668)
* **theme:** remove angular2-toaster styling ([#721](https://github.com/Liquid-JS/lyra/issues/721)) ([026974e](https://github.com/Liquid-JS/lyra/commit/026974e262184a1925162193bc0f75cf3339e11a))
* **theme:** separate bootstrap styles into @nebular/bootstrap ([#707](https://github.com/Liquid-JS/lyra/issues/707)) ([a25f615](https://github.com/Liquid-JS/lyra/commit/a25f6152d3b7d1017b951cf5d3b2c311ee537cd9)), closes [#230](https://github.com/Liquid-JS/lyra/issues/230)
* use basic as default status ([#2136](https://github.com/Liquid-JS/lyra/issues/2136)) ([cc9b47e](https://github.com/Liquid-JS/lyra/commit/cc9b47e349fa2136f9412a102fb300dad8c53b72))

### Features

* accept icon config in components which use nb-icon ([#1935](https://github.com/Liquid-JS/lyra/issues/1935)) ([c9b9d32](https://github.com/Liquid-JS/lyra/commit/c9b9d3284bac378de3d8ead6ebc75935f918a294))
* **accordion:** Eva styles ([#1362](https://github.com/Liquid-JS/lyra/issues/1362)) ([98a159c](https://github.com/Liquid-JS/lyra/commit/98a159cf26af6e14d5199092cb7efed20d749e5e))
* **accordion:** toggle via keyboard ([#2085](https://github.com/Liquid-JS/lyra/issues/2085)) ([f8a1b32](https://github.com/Liquid-JS/lyra/commit/f8a1b327bbaf323074c890156d0885fe6f1e8d3c))
* **action:** provide new attributes for link and title ([#1046](https://github.com/Liquid-JS/lyra/issues/1046)) ([30bd394](https://github.com/Liquid-JS/lyra/commit/30bd394f5cb349a20753174e0747c08a8688a88a)), closes [#814](https://github.com/Liquid-JS/lyra/issues/814)
* **actions:** Eva style ([#1397](https://github.com/Liquid-JS/lyra/issues/1397)) ([6399fab](https://github.com/Liquid-JS/lyra/commit/6399fabb87d7283dfd24e28ae3a9f6d293062718))
* add ability to customize overlay offset ([#2628](https://github.com/Liquid-JS/lyra/issues/2628)) ([c1aafb9](https://github.com/Liquid-JS/lyra/commit/c1aafb9f2cf115dc4dab3937f64f882f2e266e7d))
* add angular adjustments ([#1996](https://github.com/Liquid-JS/lyra/issues/1996)) ([d8689c1](https://github.com/Liquid-JS/lyra/commit/d8689c1529abd36d5d3a134715d7d175918aa8c2))
* add basic and control statuses ([#2047](https://github.com/Liquid-JS/lyra/issues/2047)) ([884dd66](https://github.com/Liquid-JS/lyra/commit/884dd668d586d1fc0696a1dce103581e1986f473))
* add custom css class on overlays ([#2067](https://github.com/Liquid-JS/lyra/issues/2067)) ([147ec2e](https://github.com/Liquid-JS/lyra/commit/147ec2e28eef0184ae6af740ab3a4854d336ac5a))
* add firstDayOfWeek to datepickers ([#3220](https://github.com/Liquid-JS/lyra/issues/3220)) ([5923384](https://github.com/Liquid-JS/lyra/commit/592338463a10b06538f012e09fe387f4056a62fc))
* add keyboad navigation to select with autocomplete ([#3097](https://github.com/Liquid-JS/lyra/issues/3097)) ([c52fe3a](https://github.com/Liquid-JS/lyra/commit/c52fe3ae0590208a1f56848ebba40b6077af1d27))
* add new TreeGrid component ([#1226](https://github.com/Liquid-JS/lyra/issues/1226)) ([3d64818](https://github.com/Liquid-JS/lyra/commit/3d64818ac5e680645a631958d513b8a8373227e3)), closes [#1143](https://github.com/Liquid-JS/lyra/issues/1143)
* add prebuilt custom properties theme ([#2977](https://github.com/Liquid-JS/lyra/issues/2977)) ([ff0b034](https://github.com/Liquid-JS/lyra/commit/ff0b0342e6ccf45c37753627a05a17d48c4844a0))
* add support for TypeScript 4.0 ([#2523](https://github.com/Liquid-JS/lyra/issues/2523)) ([7b7f0a4](https://github.com/Liquid-JS/lyra/commit/7b7f0a465fd528dd33d1a91216463e2943ca78b1))
* **aio:** complete a bootstrap overriding ([42eb5d1](https://github.com/Liquid-JS/lyra/commit/42eb5d19249bb9ebb333a672a2365f14f6059f34))
* **alert:** add outline alerts ([#590](https://github.com/Liquid-JS/lyra/issues/590)) ([a7b8ff4](https://github.com/Liquid-JS/lyra/commit/a7b8ff4e7aa4c0844522179102b3dfa92472cdff))
* **alert:** Eva theme ([#1406](https://github.com/Liquid-JS/lyra/issues/1406)) ([8c6c677](https://github.com/Liquid-JS/lyra/commit/8c6c677edef45a0a43fee063bf16087351e11dcb))
* **analytics:** add google analytics ([d1bf1ef](https://github.com/Liquid-JS/lyra/commit/d1bf1ef6d15f15c5252b1ba0dccb05f126d2a463))
* **analytics:** use ga instead of gtag ([8f0d875](https://github.com/Liquid-JS/lyra/commit/8f0d8756b29fa7aa5568efc80cdc5d5a3cb5da11))
* angular package format ([#1474](https://github.com/Liquid-JS/lyra/issues/1474)) ([bbed8c1](https://github.com/Liquid-JS/lyra/commit/bbed8c1258a31dc22bfde7e281fc44c427e0b040))
* **angular:** update to Angular 16 ([#3222](https://github.com/Liquid-JS/lyra/issues/3222)) ([c19e6bd](https://github.com/Liquid-JS/lyra/commit/c19e6bd8db8bc3e2e89447c3e19669dc65de4a3f))
* **aot:** aot compilation work in progress ([d89d176](https://github.com/Liquid-JS/lyra/commit/d89d176e5419ecf1bbe49d119540d7a6c53c49d3))
* **app\components:** create tree view component ([4dfd7e8](https://github.com/Liquid-JS/lyra/commit/4dfd7e8c280f36d1ae2745d166dbc59948daec4e))
* **app\components:** create tree view component ([070cec7](https://github.com/Liquid-JS/lyra/commit/070cec726ea6d810e583d612a33c26f1ca60e36d))
* **app\pages:** add editor page and ckeditor ([dbbac18](https://github.com/Liquid-JS/lyra/commit/dbbac18846a753d4543de4eb43e2ed3bc7a9f620))
* **app:** initial a new project structure ([5b15df6](https://github.com/Liquid-JS/lyra/commit/5b15df6d04524de72df168fa92941a59463eae13))
* **auth:** ability to add additional request headers ([#2825](https://github.com/Liquid-JS/lyra/issues/2825)) ([3959848](https://github.com/Liquid-JS/lyra/commit/39598481cf3bea25be5b3618505b79aa868bc607))
* **auth:** ability to configure social link ([#205](https://github.com/Liquid-JS/lyra/issues/205)) ([86b2784](https://github.com/Liquid-JS/lyra/commit/86b2784c8da0671693f817ca9fdbe5f288065bee)), closes [#171](https://github.com/Liquid-JS/lyra/issues/171)
* **auth:** ability to specify a request method ([db14632](https://github.com/Liquid-JS/lyra/commit/db14632c01b70cb098ee93a442d86fe53ad3283a))
* **auth:** abstract service ([4ed2bd1](https://github.com/Liquid-JS/lyra/commit/4ed2bd1a1e3982096a4424225ff0bc8e47590c49))
* **auth:** add `failWhenNoToken` for login/register/token-refresh methods of `NbAuthPasswordStrategy` ([#547](https://github.com/Liquid-JS/lyra/issues/547)) ([089aeaa](https://github.com/Liquid-JS/lyra/commit/089aeaaaa224e9affe34e2de61cc780c4f3a8920)), closes [#318](https://github.com/Liquid-JS/lyra/issues/318)
* **auth:** add a back link to the strategy name in the token ([#571](https://github.com/Liquid-JS/lyra/issues/571)) ([1c89636](https://github.com/Liquid-JS/lyra/commit/1c8963683ed5cd025122217af6cf2d98a57ca3d7))
* **auth:** add a new grant type `password` to OAuth2 Strategy ([d8a66a8](https://github.com/Liquid-JS/lyra/commit/d8a66a8c858cbee7499c9c17f2d6ac6b94180758))
* **auth:** add back button ([#556](https://github.com/Liquid-JS/lyra/issues/556)) ([36fc953](https://github.com/Liquid-JS/lyra/commit/36fc95378179e4cb97bfe6dd97360fd48774c8bc))
* **auth:** add baseEndpoint in email auth provider configuration ([aca526b](https://github.com/Liquid-JS/lyra/commit/aca526bba1e0771a474c74407d82c6776c00037c))
* **auth:** add example usage ([4c73a5d](https://github.com/Liquid-JS/lyra/commit/4c73a5dae5d71c69a88794e3b3e7c49a1a3ff4ad))
* **auth:** add new `isAuthenticatedOrRefresh` method, update `NbAuthJWTInterceptor` to refresh the token ([#649](https://github.com/Liquid-JS/lyra/issues/649)) ([c8e8964](https://github.com/Liquid-JS/lyra/commit/c8e89646a884a9675e210510892e838e659ecc74))
* **auth:** add new NbAuthOAuth2JWTToken ([#583](https://github.com/Liquid-JS/lyra/issues/583)) ([aed2099](https://github.com/Liquid-JS/lyra/commit/aed209916a3f67d4da4998a73ad5c7c2d8c613b9))
* **auth:** add OAuth2 example with google auth ([fd95095](https://github.com/Liquid-JS/lyra/commit/fd9509562542fce280f1f1d917fc7ab39f0b4dab))
* **auth:** add OAuth2 strategy ([2f28cbc](https://github.com/Liquid-JS/lyra/commit/2f28cbc073a8615236a3e0fbeef4c69ccc34b40d))
* **auth:** add PKCE, a working remember me, translatable pages and strict types to auth ([163dba3](https://github.com/Liquid-JS/lyra/commit/163dba3c3eff08dc149ae42a9afcb93ad456afde))
* **auth:** add support for refresh tokens ([#390](https://github.com/Liquid-JS/lyra/issues/390)) ([dc57c85](https://github.com/Liquid-JS/lyra/commit/dc57c8537aa84930f4fb4c4d8d5fb953d2390f8a))
* **auth:** add todo to pass arguments in object in NgaAuthResult constructor ([03a11ed](https://github.com/Liquid-JS/lyra/commit/03a11ed0cb4b810226c44557e8c3261f93ff0ef6))
* **auth:** add todo to renafe *config to *options ([942e75e](https://github.com/Liquid-JS/lyra/commit/942e75e6ce35a5db939cf55687b2c378473f3abd))
* **auth:** allow auth module only as root ([2cfb6e9](https://github.com/Liquid-JS/lyra/commit/2cfb6e9dfd37048917117be15f5eb2d833fb0b53))
* **auth:** auth module structure and static views ([9c2d739](https://github.com/Liquid-JS/lyra/commit/9c2d739e652aeb228a133ed8c6237fcac25e159f))
* **auth:** fix typing issue ([f9cc922](https://github.com/Liquid-JS/lyra/commit/f9cc9228e49ff87e5a455ee94ff6853b747bbe26))
* **auth:** forms functionality ([dad7ba6](https://github.com/Liquid-JS/lyra/commit/dad7ba6365b057f3d0ef7635e7848aac50e66b10))
* **auth:** forms settings, ability to specify provider for the forms ([94f1de9](https://github.com/Liquid-JS/lyra/commit/94f1de9c24edc9b2549585e512f22b2bad2afd2d))
* **auth:** login validation ([d30f2ed](https://github.com/Liquid-JS/lyra/commit/d30f2ed1d3f45294dd2425f675610733243d2b61))
* **auth:** logout feature ([f3a6bf4](https://github.com/Liquid-JS/lyra/commit/f3a6bf4a2e6e5bff88a2664d5915f0573c7797b1))
* **auth:** NbOAuth2AuthStrategy add basic authentication scheme against token endpoints ([#582](https://github.com/Liquid-JS/lyra/issues/582)) ([4360a18](https://github.com/Liquid-JS/lyra/commit/4360a189c3c3174052952bc0bd4eb920b6bc9641)), closes [#581](https://github.com/Liquid-JS/lyra/issues/581)
* **auth:** optional logout endpoint ([6042a43](https://github.com/Liquid-JS/lyra/commit/6042a43daab3574a22888e98c1c8eef6000f64e5))
* **auth:** other modules validation ([9abf36f](https://github.com/Liquid-JS/lyra/commit/9abf36f999f3896f31699fd87c45cb0d2ffca89d))
* **auth:** proposed email provider config ([50b8793](https://github.com/Liquid-JS/lyra/commit/50b87939e042bf35551e16f4e6baa144e4ab920a))
* **auth:** providers & dummy provider ([7c18161](https://github.com/Liquid-JS/lyra/commit/7c18161d1731e175641aa208cb45d6db9e3e1a76))
* **auth:** register validation ([8ddcd7e](https://github.com/Liquid-JS/lyra/commit/8ddcd7eb4d133617080c5f194e76a36f1ec4b761))
* **auth:** remove bootstrap, use custom styles ([#738](https://github.com/Liquid-JS/lyra/issues/738)) ([b585490](https://github.com/Liquid-JS/lyra/commit/b585490aafd6ed490d2350c5663849a172b3140b))
* **auth:** remove redundant _all.scss theme file ([#2623](https://github.com/Liquid-JS/lyra/issues/2623)) ([09c5e91](https://github.com/Liquid-JS/lyra/commit/09c5e91a425ab00be2911f13201e2f871a0e30bf))
* **auth:** request pass feature ([06c0f50](https://github.com/Liquid-JS/lyra/commit/06c0f5002c115bb479e9f4b539d5682a6c69df39))
* **auth:** reset pass feature ([5f10dcd](https://github.com/Liquid-JS/lyra/commit/5f10dcdfa4b23bea2030a2d12c000422a89fa198))
* **auth:** secured http // no tests ([3b20ed5](https://github.com/Liquid-JS/lyra/commit/3b20ed5f8fdcfb9bedfdb03f4709a5b53375bcbe))
* **auth:** setup light theme ([4426075](https://github.com/Liquid-JS/lyra/commit/4426075faa144c23ae7bfeae39837ebe9adc89e2))
* **auth:** styles for auth based on theme ([ddeafbd](https://github.com/Liquid-JS/lyra/commit/ddeafbd97f0412f45f089754defe4cbbde7da147))
* **auth:** todos ([c9da9da](https://github.com/Liquid-JS/lyra/commit/c9da9da9bf535d3942d34b7c61c12993484c9d15))
* **auth:** TODOs update ([fbe5078](https://github.com/Liquid-JS/lyra/commit/fbe5078246c6f8af395de19dc2f7681f2e7295c0))
* **auth:** token streaming ([ae93031](https://github.com/Liquid-JS/lyra/commit/ae93031361113fb6a1c44a4fd4701f7c78bbc59b))
* **auth:** use existing refreshToken if it is not repeated by the backend refresh endpoint ([#593](https://github.com/Liquid-JS/lyra/issues/593)) ([dffbd59](https://github.com/Liquid-JS/lyra/commit/dffbd594b3deffa55e016a3b460588ca7704cfdc))
* **auth:** warn about empty token, return falsy result ([ad8afb0](https://github.com/Liquid-JS/lyra/commit/ad8afb03617bb5cc976d7a175858bad65c612549))
* **autocomplete:** input for focus on value change ([#2356](https://github.com/Liquid-JS/lyra/issues/2356)) ([ab15806](https://github.com/Liquid-JS/lyra/commit/ab158064649197d284a8806c4df9a42de50e35f9))
* **autocomplete:** make renderer constructor parameter required ([#2621](https://github.com/Liquid-JS/lyra/issues/2621)) ([2cd2c78](https://github.com/Liquid-JS/lyra/commit/2cd2c789dbe33fe46489a97a249b5e606a4b5f8d))
* **ba-checkbox:** create checkbox component ([e63812f](https://github.com/Liquid-JS/lyra/commit/e63812f01172c11c61f0f72b73f47f29959e299b))
* **badge:** add new badge component ([#111](https://github.com/Liquid-JS/lyra/issues/111)) ([a9324b4](https://github.com/Liquid-JS/lyra/commit/a9324b42b37bd596d85068b4205d4a90d1a93128))
* **badge:** dot mode ([#2479](https://github.com/Liquid-JS/lyra/issues/2479)) ([afe02b7](https://github.com/Liquid-JS/lyra/commit/afe02b7c67e21cdc1e4f3a4d6f43417deb8f5dd2))
* **badge:** Eva theme ([#1407](https://github.com/Liquid-JS/lyra/issues/1407)) ([c5799df](https://github.com/Liquid-JS/lyra/commit/c5799dfe02fbd226e7aeaae91171e77b87f8d2d0))
* **bootstrap:** separate bootstrap module setup ([abecc37](https://github.com/Liquid-JS/lyra/commit/abecc37d81fdf474ff6120b8009308f956f74686))
* **bootstrap:** update  bootstrap to 4.0.0 release (including ng-bootstrap, angular) ([#226](https://github.com/Liquid-JS/lyra/issues/226)) ([f047f14](https://github.com/Liquid-JS/lyra/commit/f047f144804a395bd1d152d9a6547ecc1957c024)), closes [#160](https://github.com/Liquid-JS/lyra/issues/160) [#223](https://github.com/Liquid-JS/lyra/issues/223) [#224](https://github.com/Liquid-JS/lyra/issues/224)
* **bootstrap:** update nebular/bootstrap to Eva ([#1507](https://github.com/Liquid-JS/lyra/issues/1507)) ([2ff1171](https://github.com/Liquid-JS/lyra/commit/2ff1171fec63ae0d689023e97e96613f3c332bbe))
* **breakpoint:** breakpoint tests and refactoring ([c12e035](https://github.com/Liquid-JS/lyra/commit/c12e0350e1505a0c5437d209e469a060cc43d046))
* **build:** add yarn supporting, adjust tsconfig ([781f511](https://github.com/Liquid-JS/lyra/commit/781f5112ff4c602fbcefaecb3e7c162f28d522c5))
* **build:** setup npm packaging for @nga/theme ([fb89a97](https://github.com/Liquid-JS/lyra/commit/fb89a976119a0c514976842f28cc4180ed113bfd))
* **build:** setup stylelint ([75f78a1](https://github.com/Liquid-JS/lyra/commit/75f78a1d648f3a209a8d5981575c02059a942766))
* **build:** setup tslint ([72184d6](https://github.com/Liquid-JS/lyra/commit/72184d61b9fe6bc259695e4db391ad0944a99690))
* **build:** update @angular/cli to RC0, update project structure ([0cf31da](https://github.com/Liquid-JS/lyra/commit/0cf31da46859edc3d8d56f03ea1d98b240d660f4))
* button group ([#2473](https://github.com/Liquid-JS/lyra/issues/2473)) ([72bb1b3](https://github.com/Liquid-JS/lyra/commit/72bb1b335524d5b7321e0bd0dd830ea73c477936))
* **button group:** add valueChange output ([#2722](https://github.com/Liquid-JS/lyra/issues/2722)) ([39c610c](https://github.com/Liquid-JS/lyra/commit/39c610c20ce38c5784ca70a0df3bf7ac1287a3bb))
* **button:** add `fullWidth` mode ([#591](https://github.com/Liquid-JS/lyra/issues/591)) ([13014d4](https://github.com/Liquid-JS/lyra/commit/13014d40fd8cacaf7fdb6037a6abb52b1f5ec156))
* **button:** Eva style ([#1359](https://github.com/Liquid-JS/lyra/issues/1359)) ([1dbddda](https://github.com/Liquid-JS/lyra/commit/1dbdddac4a1626435a103f85b74ef04ef4b04509))
* **buttons:** add buttons overrides ([2d2d4af](https://github.com/Liquid-JS/lyra/commit/2d2d4af2739d6c4de06e58e3dfc8f920748ddbcc))
* **calendar:** add capability to hide header ([#838](https://github.com/Liquid-JS/lyra/issues/838)) ([df9b21c](https://github.com/Liquid-JS/lyra/commit/df9b21cb6c46ca8d30a6bc91e192902ba71c9969)), closes [#828](https://github.com/Liquid-JS/lyra/issues/828)
* **calendar:** add week number column ([#1963](https://github.com/Liquid-JS/lyra/issues/1963)) ([28e7468](https://github.com/Liquid-JS/lyra/commit/28e7468e9f8adf3f21419c61346058c8c0469c1d))
* **calendar:** Eva 1.3 ([#2120](https://github.com/Liquid-JS/lyra/issues/2120)) ([0f03fb5](https://github.com/Liquid-JS/lyra/commit/0f03fb55b16dbfe9795f706b25551152e6b852de))
* **calendar:** Eva style ([#1365](https://github.com/Liquid-JS/lyra/issues/1365)) ([c5f7ead](https://github.com/Liquid-JS/lyra/commit/c5f7eada456c7913c24db192cad07e1d393edf1c))
* **calendar:** use nb-icon in navigation buttons ([#1388](https://github.com/Liquid-JS/lyra/issues/1388)) ([ab52c0c](https://github.com/Liquid-JS/lyra/commit/ab52c0c4dd5a516ce5be2d6b57a6ee0e33e7eca3))
* **card:** complete nga-card, add e2e tests for nga-card ([88106ea](https://github.com/Liquid-JS/lyra/commit/88106ea7bcce9a2000d7fa22946e40289bcd75c6))
* **card:** Eva style ([#1346](https://github.com/Liquid-JS/lyra/issues/1346)) ([cd4972c](https://github.com/Liquid-JS/lyra/commit/cd4972c0aa9b2fb7412780d28e4eb1d503175b2b))
* **card:** improve cards interface ([15b4d95](https://github.com/Liquid-JS/lyra/commit/15b4d9585fd807b2a355ef8a37a5fba57693b340))
* **card:** option to hide toggle button in reveal/flip cards ([#448](https://github.com/Liquid-JS/lyra/issues/448)) ([ef5ebbb](https://github.com/Liquid-JS/lyra/commit/ef5ebbb40503d4025ce521e6dcbcacbb7cdcba8e))
* **cards:** new card types ([f15470a](https://github.com/Liquid-JS/lyra/commit/f15470a0a75fbddb5355c9c72afa1270ef251ba3)), closes [#139](https://github.com/Liquid-JS/lyra/issues/139)
* **chat form:** add output for input change ([#2735](https://github.com/Liquid-JS/lyra/issues/2735)) ([1bb0dfb](https://github.com/Liquid-JS/lyra/commit/1bb0dfbe61984c7a5f1b38fbc949c91008698b91))
* **chat:** ability to provide template as chat title ([#2920](https://github.com/Liquid-JS/lyra/issues/2920)) ([9ccec64](https://github.com/Liquid-JS/lyra/commit/9ccec64fa7f6c6bea5071ae1e20f1fcd1fe02af2))
* **chat:** add `scrollBottom` chat option ([#1001](https://github.com/Liquid-JS/lyra/issues/1001)) ([d393f33](https://github.com/Liquid-JS/lyra/commit/d393f33a6085119a6e4b8bfa96c7bae4dc9e0c6d)), closes [#921](https://github.com/Liquid-JS/lyra/issues/921)
* **chat:** add support for custom message template ([#2750](https://github.com/Liquid-JS/lyra/issues/2750)) ([d84497c](https://github.com/Liquid-JS/lyra/commit/d84497ce40cfc4b1a6705bb28a96343baf5852bc))
* **chat:** date format for messages and support for change pla… ([#2227](https://github.com/Liquid-JS/lyra/issues/2227)) ([b63f004](https://github.com/Liquid-JS/lyra/commit/b63f00442d40a138d1f6f7f5391ffb2ebb9cf4a6))
* **chat:** Eva style ([#1408](https://github.com/Liquid-JS/lyra/issues/1408)) ([3433164](https://github.com/Liquid-JS/lyra/commit/3433164ad6131dc583eb331323680e4ffe0b1097))
* **checkbox:** add outline on focus ([#731](https://github.com/Liquid-JS/lyra/issues/731)) ([cc892d5](https://github.com/Liquid-JS/lyra/commit/cc892d5d449025dadc41f7219c236b45eb2485a7))
* **checkbox:** Eva style 💅 ([#1311](https://github.com/Liquid-JS/lyra/issues/1311)) ([75498aa](https://github.com/Liquid-JS/lyra/commit/75498aa5ba6087ae7f7cfe489cf0a6282d4e17b5))
* **checkbox:** expand checkbox variables for easier customization ([6b93924](https://github.com/Liquid-JS/lyra/commit/6b93924cf159d8ef96035aabb985acbd6454729c)), closes [#143](https://github.com/Liquid-JS/lyra/issues/143)
* **checkbox:** remove deprecated value input ([#2618](https://github.com/Liquid-JS/lyra/issues/2618)) ([0380050](https://github.com/Liquid-JS/lyra/commit/0380050ff2bb63b9d5ad6db82f2d6fa13445700b))
* **columns:** basic styles for columns ([7484f6a](https://github.com/Liquid-JS/lyra/commit/7484f6a871d4ea471e217b0155450e121b203ddb))
* **columns:** columns tests ([3eaf400](https://github.com/Liquid-JS/lyra/commit/3eaf4000c06bfb7d629f04e9e9c6d68822e0f519))
* **components:** add tree view component ([2e0fa1f](https://github.com/Liquid-JS/lyra/commit/2e0fa1f4ed6ef14dbf88599b36674d30a88bb7e3))
* **context menu:** Eva style ([#1423](https://github.com/Liquid-JS/lyra/issues/1423)) ([ddfb2ee](https://github.com/Liquid-JS/lyra/commit/ddfb2eea2664c953d8352aa629ac612d48548d41))
* **context-menu:** add `nbContextMenuTrigger` parameter ([#1139](https://github.com/Liquid-JS/lyra/issues/1139)) ([27b291e](https://github.com/Liquid-JS/lyra/commit/27b291e79283d8925c44bfc4178b772157840cda)), closes [#1112](https://github.com/Liquid-JS/lyra/issues/1112)
* **context-menu:** add context menu component ([13799a5](https://github.com/Liquid-JS/lyra/commit/13799a5c29a7fca2ea42b180960344750a3d2f82))
* **context-menu:** add dynamic inputs ([#1221](https://github.com/Liquid-JS/lyra/issues/1221)) ([9f8d659](https://github.com/Liquid-JS/lyra/commit/9f8d659e92edd274073ef977c4e64c49f2a1e125)), closes [#1101](https://github.com/Liquid-JS/lyra/issues/1101) [#1073](https://github.com/Liquid-JS/lyra/issues/1073)
* **core:** add a data table with sorting, filtering, paging, selection and detail rows ([6e0cb9d](https://github.com/Liquid-JS/lyra/commit/6e0cb9ddd1991c2ef08d932015a386779fdca346))
* **core:** add a horizontal menu, parent items with their own page and a selected-item bar ([78ca80e](https://github.com/Liquid-JS/lyra/commit/78ca80e6f08c3f37222dca3d5b739f85b6cc0a23))
* **core:** add a no-data row, compact, striped and floating variants and aria-sort to tree grids ([103a0ab](https://github.com/Liquid-JS/lyra/commit/103a0ab88e390fff0ece11e94a3661962d1f03b3))
* **core:** add a ring shape to the progress bar and expose it to assistive technologies ([48aaad2](https://github.com/Liquid-JS/lyra/commit/48aaad2ab88ce52824ce4b37090a6a5738853b50))
* **core:** add a skeleton directive for content placeholders ([f3da500](https://github.com/Liquid-JS/lyra/commit/f3da500e0ba37f900b83e50a92dd02afcd528d35))
* **core:** add a slider for a number or a range ([b068d9b](https://github.com/Liquid-JS/lyra/commit/b068d9b6fa06ce2797a450af529daa5742a77f3e))
* **core:** add a table of contents with scroll-spy ([030b34e](https://github.com/Liquid-JS/lyra/commit/030b34e9117ae8a44079233e5a7bb1d41f8df871))
* **core:** add a theme select and a text size switcher ([db118c6](https://github.com/Liquid-JS/lyra/commit/db118c651daa18cb157a5018f1ddb110ecd1c1d2))
* **core:** add an inline position to the badge for status dots and labels ([84104e1](https://github.com/Liquid-JS/lyra/commit/84104e1a55f4f5a46527b3a3d53e6a8ec60f51cf))
* **core:** add an opt-in close button and hover pause to toasts ([8c2fd1f](https://github.com/Liquid-JS/lyra/commit/8c2fd1f2b62e4fe85d525bead60a27ceb6f6ac12))
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
* **core:** allow customising the tag's remove icon ([2882388](https://github.com/Liquid-JS/lyra/commit/2882388dbd628c0d30621711c071c59320420852))
* **core:** announce spinners to assistive technologies and drive nbSpinner by its inputs ([2515567](https://github.com/Liquid-JS/lyra/commit/2515567a0774f60b46a30aca5102b2a60a8642e7))
* **core:** base the themes on CSS custom properties, with Material themes and status palettes ([1233f05](https://github.com/Liquid-JS/lyra/commit/1233f05fee1398613501be87e396acce172a319a))
* **core:** close dialogs on router navigation ([3d3967e](https://github.com/Liquid-JS/lyra/commit/3d3967ec0b6ef03dab6a0531f7e960ea13d18aa9))
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
* **core:** pass values to a dialog component's input and model signals ([8f64ee8](https://github.com/Liquid-JS/lyra/commit/8f64ee83ffc4d69a15c80fd468edb2e525156dbe))
* **core:** scroll the autocomplete's options with the arrow keys ([0a22c16](https://github.com/Liquid-JS/lyra/commit/0a22c16d782aee0ed1cf9339f3d9d6d97f41ef7b))
* **core:** set up standalone and NgModule apps of the current Angular CLI with ng add ([5da45d7](https://github.com/Liquid-JS/lyra/commit/5da45d79ae4b2cd909884bc53851c0f669f6be92))
* **core:** show the user's picture as an image that falls back to initials coloured by status ([21d9a78](https://github.com/Liquid-JS/lyra/commit/21d9a78887e95d5dea15779986ef4623c7efb767))
* **core:** size form field addons to their content and give fields a starting width ([6b46157](https://github.com/Liquid-JS/lyra/commit/6b461576cb8e601be1038dd346d64d8232d42200))
* **core:** size the autocomplete's options to its field and make its list accessible ([bb8fd16](https://github.com/Liquid-JS/lyra/commit/bb8fd16c9e9a00f7c3d69d7965fecabb5450dff5))
* **core:** stick the layout's fixed footer, size it to the dynamic viewport and scope its styles ([f15f8d2](https://github.com/Liquid-JS/lyra/commit/f15f8d2cf42b0f9ca5386b4e65330860a10f23c7))
* **date-fns:** add provideNbDateFnsDate and support date-fns 4 ([d7da9d5](https://github.com/Liquid-JS/lyra/commit/d7da9d57e31efff68fc6c8553239f47bde561c8a))
* **date-time picker:** ability to remove now button ([#2848](https://github.com/Liquid-JS/lyra/issues/2848)) ([a2c9d10](https://github.com/Liquid-JS/lyra/commit/a2c9d10711c8c40177f3199c72deb7b92ebdcc61))
* **date-time picker:** add dateTimeChange output ([#2816](https://github.com/Liquid-JS/lyra/issues/2816)) ([73a6b5a](https://github.com/Liquid-JS/lyra/commit/73a6b5a90e245996128a944ccc28fa96eb50b160))
* **datepicker:** allow to change adjustment ([#2806](https://github.com/Liquid-JS/lyra/issues/2806)) ([a3b5ae5](https://github.com/Liquid-JS/lyra/commit/a3b5ae5f7ea3356abb49737f4f46311ac0ffb7f4))
* **datepicker:** Eva style ([#1366](https://github.com/Liquid-JS/lyra/issues/1366)) ([d0c28a0](https://github.com/Liquid-JS/lyra/commit/d0c28a0b6ec7467730486e48162ebef0395a1258))
* **datepicker:** export calendar with time component ([#2528](https://github.com/Liquid-JS/lyra/issues/2528)) ([f378492](https://github.com/Liquid-JS/lyra/commit/f378492dfcc866e4234d2611b4ef06df0585ee90))
* **datepicker:** improve date and time inputs combination ([#3117](https://github.com/Liquid-JS/lyra/issues/3117)) ([8387967](https://github.com/Liquid-JS/lyra/commit/83879675ea6708f15f80cc293893b2ee6346bb96))
* **datepicker:** throw error when setting format for native date ([#986](https://github.com/Liquid-JS/lyra/issues/986)) ([3e9df5d](https://github.com/Liquid-JS/lyra/commit/3e9df5d1268d6ed853a95ea4ff85bd519ac13d74))
* **dependencies:** add typedoc ([85af867](https://github.com/Liquid-JS/lyra/commit/85af8676fcf664680b3402843b5808c1369ba971))
* **dependencies:** update @angular/cli to 1.0.0-beta.32.3 ([d63970c](https://github.com/Liquid-JS/lyra/commit/d63970c08ade0da8e6b92c37f82c7d72fb9ccdd7))
* **dependencies:** update angular to 2.4.3. DLL Integration ([ea73420](https://github.com/Liquid-JS/lyra/commit/ea7342008ae04d00b395ddf7779beb9e1b3e1069))
* **dependencies:** update angular to 2.4.8 ([cfb0bf0](https://github.com/Liquid-JS/lyra/commit/cfb0bf0e5538e94216034322f2ecf011f68fc9d9))
* **dependencies:** update angular to 2.4.9 ([47b7f63](https://github.com/Liquid-JS/lyra/commit/47b7f6398e2b7080014cffa1dc7547b873139b96))
* **dependencies:** update bootstrap & angular, accompanying fixes (angular cli kept as previous due to build issues) ([3e2d582](https://github.com/Liquid-JS/lyra/commit/3e2d582a0733e7b9758f9f440a75824d2acbbf1c)), closes [#42](https://github.com/Liquid-JS/lyra/issues/42)
* **dependencies:** update ng-router-loader to 2.1.0 ([1ae084a](https://github.com/Liquid-JS/lyra/commit/1ae084afc04e71f4acf5bf3e725e5c7f9ec34014))
* **docs-menu:** restyle menu ([db5e297](https://github.com/Liquid-JS/lyra/commit/db5e29702155bbe651f5a2d847324ceabd233ded))
* **docs:** [@docs-private](https://github.com/docs-private) support ([#1231](https://github.com/Liquid-JS/lyra/issues/1231)) ([dc33127](https://github.com/Liquid-JS/lyra/commit/dc33127f7f083205dcf1443c5e8cfc270a3dc6ec))
* **docs:** add a home page and an examples gallery of apps built with Lyra ([1b04c92](https://github.com/Liquid-JS/lyra/commit/1b04c921d226cdfb2a1fdd62d859ec8c6358773f))
* **docs:** add a theme editor with live previews and exports ([e8d33f9](https://github.com/Liquid-JS/lyra/commit/e8d33f910a23fc8e878e06e32fa4c6adf76a563b))
* **docs:** add capability to use playground module in the docs application ([#310](https://github.com/Liquid-JS/lyra/issues/310)) ([7676095](https://github.com/Liquid-JS/lyra/commit/7676095c75f9f028aa731056bf8214294adf949b))
* **docs:** add docs app ([2bda93e](https://github.com/Liquid-JS/lyra/commit/2bda93e26b861cf22ff0276d694ee755b6127b80))
* **docs:** add eva icons link in the footer ([#963](https://github.com/Liquid-JS/lyra/issues/963)) ([c230986](https://github.com/Liquid-JS/lyra/commit/c2309861f1c5036537aeed7906c8f8f1534f5abc))
* **docs:** add Eva section ([#1552](https://github.com/Liquid-JS/lyra/issues/1552)) ([1209d65](https://github.com/Liquid-JS/lyra/commit/1209d65fb93d73963a86497dc48fdb952262cd54))
* **docs:** add example change animation ([#531](https://github.com/Liquid-JS/lyra/issues/531)) ([e7bb266](https://github.com/Liquid-JS/lyra/commit/e7bb266d6b88d611382b04c66b4cd737aff7fb0e))
* **docs:** add groups to components list ([#646](https://github.com/Liquid-JS/lyra/issues/646)) ([73cf1b4](https://github.com/Liquid-JS/lyra/commit/73cf1b4e9f0151bde047b52cdcce506e45600ea4))
* **docs:** add installation guides ([#740](https://github.com/Liquid-JS/lyra/issues/740)) ([d08c4d5](https://github.com/Liquid-JS/lyra/commit/d08c4d5de0791fe4d4959d839c979520e9e8a102))
* **docs:** add redirect to 'next' subdirectory ([#1446](https://github.com/Liquid-JS/lyra/issues/1446)) ([a3c838f](https://github.com/Liquid-JS/lyra/commit/a3c838f1a81d0d29458c4316763e02ea0c06bdbf))
* **docs:** add routing loader ([#1533](https://github.com/Liquid-JS/lyra/issues/1533)) ([dd33a22](https://github.com/Liquid-JS/lyra/commit/dd33a221d799589b9a18918d4ec8494ab67c5228))
* **docs:** add star & download badges into the hero section ([#813](https://github.com/Liquid-JS/lyra/issues/813)) ([c3c755a](https://github.com/Liquid-JS/lyra/commit/c3c755a173ff1c9a1c172d452b66aa4b410644ac))
* **docs:** add tabs to docs ([12b18c4](https://github.com/Liquid-JS/lyra/commit/12b18c4a663361534891846a393a1b524466f8e9))
* **docs:** add version select ([#1599](https://github.com/Liquid-JS/lyra/issues/1599)) ([3987d76](https://github.com/Liquid-JS/lyra/commit/3987d7623c89488fb1506e0ed47a1b9911498738))
* **docs:** documentation generating supporting ([94a1f5a](https://github.com/Liquid-JS/lyra/commit/94a1f5a893632424d9f3dc92affae90fe63efb3c))
* **docs:** enable analytics for documentation ([37f2fe0](https://github.com/Liquid-JS/lyra/commit/37f2fe0cb9b1ef33becfd28191ee1573241c518a))
* **docs:** Eva update ([#1433](https://github.com/Liquid-JS/lyra/issues/1433)) ([e4fb525](https://github.com/Liquid-JS/lyra/commit/e4fb525cbd679d6c847237290e895ff99b9c7cf5))
* **docs:** fix typo in security docs ([#717](https://github.com/Liquid-JS/lyra/issues/717)) ([fc3b2d4](https://github.com/Liquid-JS/lyra/commit/fc3b2d406bf3da4d165871aa45ecc08143b53906))
* **docs:** give lyra its own icon, the lyra constellation with vega as a bright star ([1230c7a](https://github.com/Liquid-JS/lyra/commit/1230c7a7eceed53e5a08933b7c022aa2c217a0ab))
* **docs:** homepage & docs poc ([41879c8](https://github.com/Liquid-JS/lyra/commit/41879c81c3f2e3ac54f40ceb72bd9b30190c565e))
* **docs:** make the docs an installable app that keeps working offline ([7ac5573](https://github.com/Liquid-JS/lyra/commit/7ac5573c4abd43d270ba0459f0761ab25c306542))
* **docs:** new landing ([#1412](https://github.com/Liquid-JS/lyra/issues/1412)) ([34166a4](https://github.com/Liquid-JS/lyra/commit/34166a4773a66ec5599f1a36ff929718162c86db))
* **docs:** rebuild the documentation site as a standalone, prerendered Lyra app ([51a8938](https://github.com/Liquid-JS/lyra/commit/51a89381f4fd83be6e95075b770bcfbf3d6eebab))
* **docs:** responsive styles ([a351990](https://github.com/Liquid-JS/lyra/commit/a351990d820b76d07e1552168e093733d9cd9483))
* **docs:** restyle header on docs ([0e321ea](https://github.com/Liquid-JS/lyra/commit/0e321eaa64a2e9d95e38ac6e949c55938ec41dfa))
* **docs:** restyle links ([41759cf](https://github.com/Liquid-JS/lyra/commit/41759cfee67af99a236c63f051b443aa2c6f9a4c))
* **docs:** set title per tab ([09d71c9](https://github.com/Liquid-JS/lyra/commit/09d71c9c7d91ecd31ee07350302f3ba77755dea5))
* **docs:** update akveo logo ([#674](https://github.com/Liquid-JS/lyra/issues/674)) ([5d79c2a](https://github.com/Liquid-JS/lyra/commit/5d79c2ab9b4d93b153356ff99fbbdd22a015115b))
* **docs:** update docs design, add playground examples ([f40e78f](https://github.com/Liquid-JS/lyra/commit/f40e78f64fa453c75a940c0fb5be1f07497ea948))
* **docs:** update urls to include baseUrl ([#489](https://github.com/Liquid-JS/lyra/issues/489)) ([f7fb11a](https://github.com/Liquid-JS/lyra/commit/f7fb11a5fd7750b21b734e8ae3231b087abd3f25))
* **docs:** use path-location instead of hash ([61d4139](https://github.com/Liquid-JS/lyra/commit/61d4139956eca33fbdcd26eb9b073f6a9540e29d))
* **electron:** add rudimentary support for electron ([#230](https://github.com/Liquid-JS/lyra/issues/230)) ([5cb7e13](https://github.com/Liquid-JS/lyra/commit/5cb7e13477d4692780cb376bb436eee2197a6b18))
* **electron:** add rudimentary support for electron ([#230](https://github.com/Liquid-JS/lyra/issues/230)) ([18c6912](https://github.com/Liquid-JS/lyra/commit/18c6912c721c950a34b637073f1e33d63635109f))
* **electron:** complete electron integration ([c6a9d67](https://github.com/Liquid-JS/lyra/commit/c6a9d67a835d4cd4232ab33d81f7316539be57a6))
* **extras:** add a colour picker field ([70956a9](https://github.com/Liquid-JS/lyra/commit/70956a9458f0e9cd35bc4e69434817111f6a01d4))
* **extras:** add a markdown editor and a markdown viewer ([431d2a5](https://github.com/Liquid-JS/lyra/commit/431d2a5311aa8ee4d6ba4adef61a7f0ef43bd4c7))
* **extras:** add a phone number field with country picker and validators ([efa57bb](https://github.com/Liquid-JS/lyra/commit/efa57bbf1862d7c0b440c2c94c363ae8a880ab26))
* **extras:** add a QR code component with downloads ([d127204](https://github.com/Liquid-JS/lyra/commit/d127204bbcfd101a52cbef2b26673d4c4c0eb4bb))
* **extras:** add an input mask directive ([8dfb76d](https://github.com/Liquid-JS/lyra/commit/8dfb76dada7a68ab81c7df6b84685a8587139fda))
* **extras:** add charts on chart.js in the theme's colours ([ffab2b4](https://github.com/Liquid-JS/lyra/commit/ffab2b47f0302c021acbd36e8c46e5f6f89ff665))
* **extras:** add the @liquid-js/lyr-extras package of components built on other libraries ([f5b1377](https://github.com/Liquid-JS/lyra/commit/f5b1377141473ce05e807ed2cbe159da981969c3))
* **extras:** add video and audio players with Lyra's controls ([779269c](https://github.com/Liquid-JS/lyra/commit/779269c5970be47645427ff1ad67bed88e434079))
* **favicon:** add new favicon ([8e89f03](https://github.com/Liquid-JS/lyra/commit/8e89f0324b0e49ee00c3fcbeb8c4b76d2003d1d4))
* Firebase auth ([#2385](https://github.com/Liquid-JS/lyra/issues/2385)) ([2f75ba1](https://github.com/Liquid-JS/lyra/commit/2f75ba19fe0cd68cf318433120cd93b9d3bf30af))
* **firebase-auth:** move to the modular Firebase API and reset passwords from the reset link ([3820d2e](https://github.com/Liquid-JS/lyra/commit/3820d2e1fea49cfe43012349c3c2f20e755c6ce9))
* **font:** update default font value ([5b93759](https://github.com/Liquid-JS/lyra/commit/5b937599f6294b10b01b8d2c57e15c58edd97354))
* **footer:** change ngx-admin link in footer ([#1105](https://github.com/Liquid-JS/lyra/issues/1105)) ([7e68c20](https://github.com/Liquid-JS/lyra/commit/7e68c20a92dbe8f86ff728f0df6d4e771a0b7408))
* **footer:** footer with fixed/non-fixed options ([fdcb893](https://github.com/Liquid-JS/lyra/commit/fdcb893f050a258df1037d050595ba45b5795328))
* **forms:** add example selects with valid styling ([#286](https://github.com/Liquid-JS/lyra/issues/286)) ([fd09e65](https://github.com/Liquid-JS/lyra/commit/fd09e652c828206be2e2bc29b953abe6c3f0be3d)), closes [#282](https://github.com/Liquid-JS/lyra/issues/282)
* **forms:** setup forms styles ([e166bc4](https://github.com/Liquid-JS/lyra/commit/e166bc43d61467162427bc5ae2ebefd252ffed96))
* **forms:** setup placeholder ellipsis and transition on focus ([126c33c](https://github.com/Liquid-JS/lyra/commit/126c33c708bdcfe66666eeced5f9de4e5a1041d1))
* **forms:** update forms to latest version ([44924ae](https://github.com/Liquid-JS/lyra/commit/44924aefcc0e19a6c6431940799824fdd1fbb6b4))
* **forms:** update forms to latest version ([ffae8cd](https://github.com/Liquid-JS/lyra/commit/ffae8cd2487e0e849a571cda3b4846fd6c989cfc))
* **gitter:** add gitter chat badge ([d6fce5f](https://github.com/Liquid-JS/lyra/commit/d6fce5f4fd4e7875c47293115092898f178bfd2c))
* **grid:** add breakpoints for xxl and xxxl sizes ([c009c15](https://github.com/Liquid-JS/lyra/commit/c009c154b530efc03ba28979f2c3e1c19811c993))
* **header:** add `subheader` mode when header is placed on a side of sidebar ([#555](https://github.com/Liquid-JS/lyra/issues/555)) ([4715b04](https://github.com/Liquid-JS/lyra/commit/4715b04b3b0e45ffed582164fd00c4327ccb1693)), closes [#554](https://github.com/Liquid-JS/lyra/issues/554)
* **header:** header with fixed/non-fixed options ([800ee2e](https://github.com/Liquid-JS/lyra/commit/800ee2e6a5a7cc206a81e1240a37bd3f43d3c788))
* **icon:** add support for ligature icons ([#2951](https://github.com/Liquid-JS/lyra/issues/2951)) ([b89339d](https://github.com/Liquid-JS/lyra/commit/b89339d371afd68eb2d199bcddc85d95f9c3484d))
* **icon:** Eva theme ([#1404](https://github.com/Liquid-JS/lyra/issues/1404)) ([16f2d19](https://github.com/Liquid-JS/lyra/commit/16f2d19cb13aae50dbfd734e3fbaf15a1a5f05fe))
* **icons:** add e-commerce icon ([#609](https://github.com/Liquid-JS/lyra/issues/609)) ([2ca41cf](https://github.com/Liquid-JS/lyra/commit/2ca41cf07d48e1fbe6fc206a3078df2cc68d58f3))
* **icons:** add expand, collapse icons, fix angle double right ([#542](https://github.com/Liquid-JS/lyra/issues/542)) ([82a5c93](https://github.com/Liquid-JS/lyra/commit/82a5c9349254336cf9efb266bb770bdca73fe81c))
* **icons:** add icon font ([af37030](https://github.com/Liquid-JS/lyra/commit/af3703013d71a6d57371bee595bd8b1806318beb))
* **icons:** add icons ([ea46d81](https://github.com/Liquid-JS/lyra/commit/ea46d81e735efefa3e3dcb4b4997d119625eeaca))
* **icons:** add new icons ([#722](https://github.com/Liquid-JS/lyra/issues/722)) ([be06906](https://github.com/Liquid-JS/lyra/commit/be06906d6a0f4ba8d6122509cc708462e956fccb))
* **icons:** add new icons in font ([1f042b3](https://github.com/Liquid-JS/lyra/commit/1f042b3c13548658b6f1c281c4b2f4d97ff34220))
* **icons:** new `nb-icon` component, icons library, and @nebular/eva-icons package ([#1319](https://github.com/Liquid-JS/lyra/issues/1319)) ([621f461](https://github.com/Liquid-JS/lyra/commit/621f46164fd71afeb9f90bd84110b8deb6b6c3b9))
* **icons:** setup icons package ([c3a67c9](https://github.com/Liquid-JS/lyra/commit/c3a67c9777f53871061ba6e841281e877f8d44f2))
* **icons:** ship the icon pack in @liquid-js/lyr-icons, with Lyra's own icons and app extras ([0ebbcf4](https://github.com/Liquid-JS/lyra/commit/0ebbcf4c7f67837871ba9af9e030ba98d836617e))
* **icons:** update icons pack ([23216eb](https://github.com/Liquid-JS/lyra/commit/23216eb26f2f8f6f071b0deff6907bcb1d574a0b))
* **infinite list:** threshold emissions throttling ([#2948](https://github.com/Liquid-JS/lyra/issues/2948)) ([718dd0a](https://github.com/Liquid-JS/lyra/commit/718dd0affb73d61834a4effbf2a314ca2d42def3))
* **input:** add more input color options ([#3108](https://github.com/Liquid-JS/lyra/issues/3108)) ([54da714](https://github.com/Liquid-JS/lyra/commit/54da71455494ef026ee6c3eb907c1ec7cf4127d7))
* **input:** Eva style ([#1343](https://github.com/Liquid-JS/lyra/issues/1343)) ([c9c288b](https://github.com/Liquid-JS/lyra/commit/c9c288b9a5f09a313a94644bc60bcf77b9b95e3a))
* **inputs\multi-checkbox:** add multi-checkbox directive ([70cdff1](https://github.com/Liquid-JS/lyra/commit/70cdff101fbf94fec40c64c7b1d5a7b8aaa5cd16))
* **inputs\rating:** add rating component ([2a607f9](https://github.com/Liquid-JS/lyra/commit/2a607f988e2ba726f5e7144fb1c253b001277f38))
* Ivy compatibility ([#2074](https://github.com/Liquid-JS/lyra/issues/2074)) ([d84e76b](https://github.com/Liquid-JS/lyra/commit/d84e76b4a0e872e055de93b00f6c93cc69e8770b))
* **js-themes:** update cosmic js-themes colors ([df1436d](https://github.com/Liquid-JS/lyra/commit/df1436df3c146397b274afe9179b1334d66da21e))
* **jstheme:** fix heading color ([5f331a4](https://github.com/Liquid-JS/lyra/commit/5f331a427eb634bf6feddb0a33d24d48ad79765c))
* **layout:** ability to get the created component ([10be090](https://github.com/Liquid-JS/lyra/commit/10be09091f8220cd6c48fcc99d13adebfdd21d1a))
* **layout:** ability to insert a component dynamically ([862ae6e](https://github.com/Liquid-JS/lyra/commit/862ae6e91723ad63187a9f75b226a5a11b5d1aff))
* **layout:** add a tabset component ([5c6127a](https://github.com/Liquid-JS/lyra/commit/5c6127aa0cfe14d839b52097960087561cd22ef7))
* **layout:** add card component ([72f9d41](https://github.com/Liquid-JS/lyra/commit/72f9d416d322302b9e47fd70ec051f858b80a44d))
* **layout:** add intermediate small breakpoint ([7b25d23](https://github.com/Liquid-JS/lyra/commit/7b25d2358bda82a91b3e505de8eaa1424f895e15))
* **layout:** add layout component ([ef57b50](https://github.com/Liquid-JS/lyra/commit/ef57b503795525197ed542db38d5256e433064be))
* **layout:** add nbLtr and nbRtl directives ([#2927](https://github.com/Liquid-JS/lyra/issues/2927)) ([35a7ad1](https://github.com/Liquid-JS/lyra/commit/35a7ad11316f8ffda9e2455146481de6a0382a46))
* **layout:** add scroll & ruler services ([043050a](https://github.com/Liquid-JS/lyra/commit/043050ac546db34fcc8bbc544cde1b8d987aa3ae))
* **layout:** add window mode ([ee80a25](https://github.com/Liquid-JS/lyra/commit/ee80a25215e4e9920c90c867bdbe8a86e14461ce))
* **layout:** add withScroll setting ([7dc76be](https://github.com/Liquid-JS/lyra/commit/7dc76be1077fd6e6912ea6cb8f9cee39513fb9b4))
* **layout:** added error message if layout not provided ([#2778](https://github.com/Liquid-JS/lyra/issues/2778)) ([7c12874](https://github.com/Liquid-JS/lyra/commit/7c12874b8f41f8c9554f87919e0eb2dfa2540701))
* **layout:** define intermediate small breakpoint on the js side ([1a2bc70](https://github.com/Liquid-JS/lyra/commit/1a2bc7045453bf3ed8b2abb2429a0d59db1c0269))
* **layout:** define smaller paddings, add min width ([e185a6e](https://github.com/Liquid-JS/lyra/commit/e185a6ebbec98f9271c2b186ad65f1f9a97e404b))
* **layout:** Eva style ([#1368](https://github.com/Liquid-JS/lyra/issues/1368)) ([c373cfc](https://github.com/Liquid-JS/lyra/commit/c373cfcd6d371618ff844544a2e48024e2759d86))
* **layout:** improve card and tabset styles, add typography overrides ([1716566](https://github.com/Liquid-JS/lyra/commit/1716566164b6db56bf047aab1b6314d97d80974d))
* **layout:** improve scroll bars styles ([5d6d4c0](https://github.com/Liquid-JS/lyra/commit/5d6d4c09a0537ae0cffe427b6cff0d10178d2d80))
* **layout:** window mode staged padding ([a465f49](https://github.com/Liquid-JS/lyra/commit/a465f49d8faa521b65913d89889fee918c0ddfab))
* **list:** Eva style ([#1363](https://github.com/Liquid-JS/lyra/issues/1363)) ([b280112](https://github.com/Liquid-JS/lyra/commit/b280112976cc74410013cc12293ed0da454e1a2a))
* **loader:** remove loaders ([1c10938](https://github.com/Liquid-JS/lyra/commit/1c10938efed7e3fe6566a0984f28ea4c060b0923))
* **login:** add angular 2 form logic ([2ba1810](https://github.com/Liquid-JS/lyra/commit/2ba18109cdd98a9d523326b057fdf0968441f203))
* **logout:** let logout.component use form configs ([#78](https://github.com/Liquid-JS/lyra/issues/78)) ([41d0f78](https://github.com/Liquid-JS/lyra/commit/41d0f78b330af992652397b8d58642409ce888d9))
* **menu component:** improve accessibility ([#3136](https://github.com/Liquid-JS/lyra/issues/3136)) ([7ce24c0](https://github.com/Liquid-JS/lyra/commit/7ce24c03174cfc280eeb1d22a473e554fe4b5957))
* **menu:** 'hidden' menu attribute to hide the link from the menu but keep other related features in place (page title, breadcrumbs). Fix [#151](https://github.com/Liquid-JS/lyra/issues/151) ([9178b60](https://github.com/Liquid-JS/lyra/commit/9178b6014b42d0d0aeedcb0307d9a92b9da3538c))
* **menu:** add a 'home' option ([9938c45](https://github.com/Liquid-JS/lyra/commit/9938c4575651f0ebf1e2fcd0a2f1bac53531af09))
* **menu:** add a data property to NgaMenuItem ([7d717dd](https://github.com/Liquid-JS/lyra/commit/7d717ddeb5d864e8673e63f9e1c5522142dc3b8c))
* **menu:** add a group name option ([f03d532](https://github.com/Liquid-JS/lyra/commit/f03d53271bd71351f37530805d2a64c834c63292))
* **menu:** add a menu service ([9c93169](https://github.com/Liquid-JS/lyra/commit/9c93169abed217429a52b1c2cc939fc3087c481f))
* **menu:** add an animation for a sub menu ([375843c](https://github.com/Liquid-JS/lyra/commit/375843c5e0f4159889b83db4e2233c853b6e3b63))
* **menu:** add an onItemSelect event ([f7486cb](https://github.com/Liquid-JS/lyra/commit/f7486cb653aec180d6fef0f5859e940c47b2f945))
* **menu:** add an option to set skipLocationChange ([#1043](https://github.com/Liquid-JS/lyra/issues/1043)) ([3d3ee03](https://github.com/Liquid-JS/lyra/commit/3d3ee033e2aedb48cd3fcb070a037b75fe91096a)), closes [#1028](https://github.com/Liquid-JS/lyra/issues/1028)
* **menu:** add animation for submenus, add autoCollapse feature ([51e2ffb](https://github.com/Liquid-JS/lyra/commit/51e2ffbe5a1b6003bada37390c6c14468ad4cfaf))
* **menu:** add collapseAll function ([#478](https://github.com/Liquid-JS/lyra/issues/478)) ([2942bfd](https://github.com/Liquid-JS/lyra/commit/2942bfda5e48f4d2701ca4347a167dfa855a1bff))
* **menu:** add getSelectedItem method to a menu service ([8209faa](https://github.com/Liquid-JS/lyra/commit/8209faae5ad7e8ed3b63fc906dffe2ca39f0f96e))
* **menu:** add menu selecting by default ([0a3eb67](https://github.com/Liquid-JS/lyra/commit/0a3eb678ab78878e9c98a827fa4c7c67ebb83bf6))
* **menu:** add support for query parameters ([#283](https://github.com/Liquid-JS/lyra/issues/283)) ([#324](https://github.com/Liquid-JS/lyra/issues/324)) ([bbd86aa](https://github.com/Liquid-JS/lyra/commit/bbd86aab0525081ea2e5d8095c478b62af7c066b))
* **menu:** add the possibility to add the menu items to @Input ([c8ff171](https://github.com/Liquid-JS/lyra/commit/c8ff171c19daa79517acf57e993fd36782d71554))
* **menu:** Eva style ([#1421](https://github.com/Liquid-JS/lyra/issues/1421)) ([0e032b6](https://github.com/Liquid-JS/lyra/commit/0e032b682553ab6ec7941786e81fae4117a133b1))
* **menu:** highlight childless items when path matches ([2d60a28](https://github.com/Liquid-JS/lyra/commit/2d60a286d258194f98641e90186b0659176f0f3d))
* **menu:** menu TODOs ([463954c](https://github.com/Liquid-JS/lyra/commit/463954c81ca1338abed82100b5ca62bd08150e8b))
* **menu:** support more navigation extras ([#2420](https://github.com/Liquid-JS/lyra/issues/2420)) ([03aabfa](https://github.com/Liquid-JS/lyra/commit/03aabfa3c820567160838dcf2e2ebb2e51374bf1))
* **menu:** TODOs added ([928b6d6](https://github.com/Liquid-JS/lyra/commit/928b6d6bd471986438f3c410bb30bd6f658746cd))
* **modals:** define modal body styles ([bf6d2c2](https://github.com/Liquid-JS/lyra/commit/bf6d2c23874e09c67588ba1b13852274f8af6e0c))
* **moment:** add provideNbMomentDate, month and year formats and all name widths ([bdff58f](https://github.com/Liquid-JS/lyra/commit/bdff58f71a493728886d5f4578595048455b6635))
* **nga-actions:** nga-actions component ([283032c](https://github.com/Liquid-JS/lyra/commit/283032c97e35d4c5061be4104ca548268eb533f2))
* **overlay:** add missing component class suffix ([#2622](https://github.com/Liquid-JS/lyra/issues/2622)) ([3e20fe4](https://github.com/Liquid-JS/lyra/commit/3e20fe4e9a54b08e782a12bb2d88c5bf25861127))
* **overlay:** add noop trigger strategy ([#1133](https://github.com/Liquid-JS/lyra/issues/1133)) ([1e43929](https://github.com/Liquid-JS/lyra/commit/1e43929694c9a07bfcf0a5a969bb32eaba572630))
* **packages smoke:** add Eva icons package ([#1903](https://github.com/Liquid-JS/lyra/issues/1903)) ([8c0683b](https://github.com/Liquid-JS/lyra/commit/8c0683bc85f3aa5f70068e23141296dd8142c54c))
* **page:** scroll to top on new page ([1b266a6](https://github.com/Liquid-JS/lyra/commit/1b266a6ec435b387747536309df346cfc27bc083))
* **pages:** login page ([c10f864](https://github.com/Liquid-JS/lyra/commit/c10f864c59b693a3db3ae990ee11c6357c4cd8e0))
* **pages:** register page ([919cbf5](https://github.com/Liquid-JS/lyra/commit/919cbf5d2d56cd4736cf7bda2c9bc61c57e4f6e6))
* **playground:** add without-styles folder for bootstrap like use-cases ([#1271](https://github.com/Liquid-JS/lyra/issues/1271)) ([8e852ca](https://github.com/Liquid-JS/lyra/commit/8e852caa4a8aa90d25ca087da512a8f8a98023cb))
* **playground:** automatic refresh token ([#658](https://github.com/Liquid-JS/lyra/issues/658)) ([b4fc624](https://github.com/Liquid-JS/lyra/commit/b4fc62481c89a0223b9502bef2a61cd45250b56c))
* **playground:** components list ([#1106](https://github.com/Liquid-JS/lyra/issues/1106)) ([4ab7508](https://github.com/Liquid-JS/lyra/commit/4ab7508e537bc8ccfb928c882cd5abd4da25c777)), closes [#1077](https://github.com/Liquid-JS/lyra/issues/1077)
* **playground:** run the playground as a standalone, zoneless app with lazy routes ([57cd363](https://github.com/Liquid-JS/lyra/commit/57cd3638ece9e3901dd113e7478892d093a08514))
* **playground:** update examples to use the new `nbButton` ([#559](https://github.com/Liquid-JS/lyra/issues/559)) ([657147b](https://github.com/Liquid-JS/lyra/commit/657147b5280e1931dab90291bff2c55466296d85))
* **popover, tooltip:** add shown state api ([#1998](https://github.com/Liquid-JS/lyra/issues/1998)) ([6dbce1d](https://github.com/Liquid-JS/lyra/commit/6dbce1d54a5d1f71ddc9050074e400ba5c68d72f))
* **popover:** add ability for dynamic input ([#1149](https://github.com/Liquid-JS/lyra/issues/1149)) ([d427e59](https://github.com/Liquid-JS/lyra/commit/d427e595d3dcfd3e0b0eba20a9e922a0b65f2e6b)), closes [#953](https://github.com/Liquid-JS/lyra/issues/953) [#1142](https://github.com/Liquid-JS/lyra/issues/1142)
* **popover:** add new awesome `popover` component ([7dbefd6](https://github.com/Liquid-JS/lyra/commit/7dbefd6ad2fd0619419589b735e97f6c39d05584))
* **popover:** add popover-border-radius theme var ([#254](https://github.com/Liquid-JS/lyra/issues/254)) ([baf1a61](https://github.com/Liquid-JS/lyra/commit/baf1a619e36de310b1114b2d499be4fdc14fff9d))
* **popover:** add popover-border-radius theme var ([#254](https://github.com/Liquid-JS/lyra/issues/254)) ([362fa49](https://github.com/Liquid-JS/lyra/commit/362fa49d0c6b18257de704a432c679e00fa6453a))
* **popover:** Eva style ([#1349](https://github.com/Liquid-JS/lyra/issues/1349)) ([6d11c95](https://github.com/Liquid-JS/lyra/commit/6d11c95a33c93b7ee6f5c3f4dce76478581e7a97))
* **preloader:** preloader service which can take a list of promises and execute smth once all promises are completed ([d1f368e](https://github.com/Liquid-JS/lyra/commit/d1f368e571dfc9aec7175f00f0ec6c94afb6936a))
* **progress:** Eva style ([#1361](https://github.com/Liquid-JS/lyra/issues/1361)) ([06fccf7](https://github.com/Liquid-JS/lyra/commit/06fccf7e12f50fd187c3b5e9780fa2f4a9f9d9b1))
* **radio:** Eva style ([#1344](https://github.com/Liquid-JS/lyra/issues/1344)) ([3c9eaa2](https://github.com/Liquid-JS/lyra/commit/3c9eaa2b27091f8c446e75845f0ee3bfeb98a9a6))
* **rc5:** update to angular rc.5 ([5b7c132](https://github.com/Liquid-JS/lyra/commit/5b7c132eac28d1174e84e031358169d56b62ca45))
* **rc6:** update to rc6 ([053473a](https://github.com/Liquid-JS/lyra/commit/053473a442bf44f7b5d1de679bd2f89c3080e5fe))
* **rc6:** update to rc6 ([3ff5c51](https://github.com/Liquid-JS/lyra/commit/3ff5c51f1a89ad10869447a919ff272321d9d768))
* **readme:** short description update ([af5e8fc](https://github.com/Liquid-JS/lyra/commit/af5e8fc2a538a4f15a70cc6dbf2dd070e352a5bf))
* **readme:** status badges ([831518d](https://github.com/Liquid-JS/lyra/commit/831518dbfcff37cbd84edddd817216f78635c0e4))
* **register:** add angular 2 form logic ([1a2512d](https://github.com/Liquid-JS/lyra/commit/1a2512daaf93d44560f300c3094bb47cf4b08f46))
* **register:** add pages to menu ([751c8d9](https://github.com/Liquid-JS/lyra/commit/751c8d9981c197ae6cdd8f88201ae881991cecdc))
* remove fields scheduled to be removed in 4.0 ([#1439](https://github.com/Liquid-JS/lyra/issues/1439)) ([28778f7](https://github.com/Liquid-JS/lyra/commit/28778f7a51e41d2e26ba7a6b126c1252dff38298))
* remove Nebular 4 theme breaking notice ([#1426](https://github.com/Liquid-JS/lyra/issues/1426)) ([be5665e](https://github.com/Liquid-JS/lyra/commit/be5665eda8c1939dca519b620ead5cd2843ec6d7))
* **route tabset:** add support for NavigationExtras options ([#2753](https://github.com/Liquid-JS/lyra/issues/2753)) ([bcf7b65](https://github.com/Liquid-JS/lyra/commit/bcf7b6505727d0374d157abf3c7b9b82558c3646))
* **route-tabset:** add a route-tabset component ([c1992c9](https://github.com/Liquid-JS/lyra/commit/c1992c937dcab5e2cc710b9dfcba1f8191887fb0))
* **route-tabset:** configurable routerLinkActiveOptions ([#1239](https://github.com/Liquid-JS/lyra/issues/1239)) ([3cf29d8](https://github.com/Liquid-JS/lyra/commit/3cf29d8659ad338807a8ed5587a5fbb689334d25))
* **router tabset:** ability to configure routerLinkActiveOptions per tab ([#2907](https://github.com/Liquid-JS/lyra/issues/2907)) ([276d610](https://github.com/Liquid-JS/lyra/commit/276d610f376b1eb4d15d92bc954c5719f83aa3ef))
* **schematics:** add dark theme ([#1534](https://github.com/Liquid-JS/lyra/issues/1534)) ([c5d15c6](https://github.com/Liquid-JS/lyra/commit/c5d15c685a8b5a42399031b0cf90983c49c1edf0))
* **search:** add input to be able to customize info label ([#147](https://github.com/Liquid-JS/lyra/issues/147)) ([12a55dc](https://github.com/Liquid-JS/lyra/commit/12a55dc151a1d5f1f1c57972dd8581bb86413338)), closes [#21](https://github.com/Liquid-JS/lyra/issues/21)
* **search:** Eva theme ([#1419](https://github.com/Liquid-JS/lyra/issues/1419)) ([a7e582f](https://github.com/Liquid-JS/lyra/commit/a7e582fca558b11efc748a357995269fb5c74c6e))
* **search:** input event ([#1038](https://github.com/Liquid-JS/lyra/issues/1038)) ([58fa556](https://github.com/Liquid-JS/lyra/commit/58fa5567ae107bb945fffa877cce03c5cee6aca1))
* **search:** prevent search from crashing when no layout ([#332](https://github.com/Liquid-JS/lyra/issues/332)) ([36dc9dd](https://github.com/Liquid-JS/lyra/commit/36dc9dd253b4f8384355ba6cbceae51349efc0c6))
* **security:** add ability to assign multiple roles to a user ([#549](https://github.com/Liquid-JS/lyra/issues/549)) ([c3402a6](https://github.com/Liquid-JS/lyra/commit/c3402a69673d60e6106af0924649848c4241e7f9)), closes [#222](https://github.com/Liquid-JS/lyra/issues/222)
* **security:** add provideNbSecurity and a signal-based nbIsGranted ([c4c89fb](https://github.com/Liquid-JS/lyra/commit/c4c89fb2f5b9c270ea982164f660d648231613cf))
* **select-with-autocomplete:** add search when multi ([#3204](https://github.com/Liquid-JS/lyra/issues/3204)) ([8792f84](https://github.com/Liquid-JS/lyra/commit/8792f8463ffb2f80f81470e83407b44aefb4091f))
* **select, autocomplete:** ability to change scroll strategy ([#2567](https://github.com/Liquid-JS/lyra/issues/2567)) ([d10275b](https://github.com/Liquid-JS/lyra/commit/d10275b04b6cde2b39ef221a60a2dcc56856f884))
* **select, autocomplete:** ability to override options width ([#2874](https://github.com/Liquid-JS/lyra/issues/2874)) ([e30e00c](https://github.com/Liquid-JS/lyra/commit/e30e00c2626fcccf165e24a2f6c1ed21d4e8522d))
* **select, autocomplete:** add input to set options list class ([#2560](https://github.com/Liquid-JS/lyra/issues/2560)) ([92083e8](https://github.com/Liquid-JS/lyra/commit/92083e8e57526b8dd8e32da86fe147a6033088c4))
* **select, input:** add max width theme property ([#1480](https://github.com/Liquid-JS/lyra/issues/1480)) ([5a6d506](https://github.com/Liquid-JS/lyra/commit/5a6d506471a8bc7d180ed600f602fdd51cc80d36))
* **select:** add custom comparator input ([#2590](https://github.com/Liquid-JS/lyra/issues/2590)) ([1f8a57b](https://github.com/Liquid-JS/lyra/commit/1f8a57b91e81b6635057e695f41dd48677203048))
* **select:** Eva style ([#1391](https://github.com/Liquid-JS/lyra/issues/1391)) ([53fb3a6](https://github.com/Liquid-JS/lyra/commit/53fb3a602e39217025065b0e3d59d928812583d3))
* **select:** Eva style ([#2106](https://github.com/Liquid-JS/lyra/issues/2106)) ([7355d65](https://github.com/Liquid-JS/lyra/commit/7355d6576e349fbe310667a13dc4751649442d44))
* **select:** keyboard support ([#1417](https://github.com/Liquid-JS/lyra/issues/1417)) ([f8a5c9c](https://github.com/Liquid-JS/lyra/commit/f8a5c9cf7dd24dd71c0dd6e319b895858189b0ac))
* **select:** more border and icon theme properties ([#1468](https://github.com/Liquid-JS/lyra/issues/1468)) ([9e1c604](https://github.com/Liquid-JS/lyra/commit/9e1c6042384cb53834629edbffc0ad8da66ab661))
* **select:** options search ([#3091](https://github.com/Liquid-JS/lyra/issues/3091)) ([ff4f738](https://github.com/Liquid-JS/lyra/commit/ff4f73842147a21dca347c104dd2804a781b665c))
* **sidebar service:** add compact method ([#1997](https://github.com/Liquid-JS/lyra/issues/1997)) ([3c34805](https://github.com/Liquid-JS/lyra/commit/3c34805c76edeb1c4233dec94c74e2684dedc3eb))
* **sidebar:** ability to add custom url into the menu ([d7ec3fa](https://github.com/Liquid-JS/lyra/commit/d7ec3fa1dd17ead0c6fbfc3f4ca81c3626710cde))
* **sidebar:** add a state managing service ([74dfba2](https://github.com/Liquid-JS/lyra/commit/74dfba2d2e6bae67fd640b928cb1ebd70ea43417))
* **sidebar:** add ability fix sidebar container ([#642](https://github.com/Liquid-JS/lyra/issues/642)) ([7939344](https://github.com/Liquid-JS/lyra/commit/79393448814ab8a922de2b3b1b015aa9791e1dfe))
* **sidebar:** add ability fix sidebar container on low resolutions ([#645](https://github.com/Liquid-JS/lyra/issues/645)) ([efa16ef](https://github.com/Liquid-JS/lyra/commit/efa16eff4f326cf1325fb4c4d1a882238dfa2d77))
* **sidebar:** add ability to customize sidebar styles ([#373](https://github.com/Liquid-JS/lyra/issues/373)) ([ecfb007](https://github.com/Liquid-JS/lyra/commit/ecfb007a71d14a9af2afd4c18e396abde14a3b21))
* **sidebar:** add menu sidebar updating ([#548](https://github.com/Liquid-JS/lyra/issues/548)) ([05e17d2](https://github.com/Liquid-JS/lyra/commit/05e17d24dffaab6add5ea9312f1a352dd438e837)), closes [#236](https://github.com/Liquid-JS/lyra/issues/236)
* **sidebar:** add the ability to determine state and responsiveState  ([#1893](https://github.com/Liquid-JS/lyra/issues/1893)) ([bac0edc](https://github.com/Liquid-JS/lyra/commit/bac0edc749d4b8df37195aac3172b671ceed955c))
* **sidebar:** breakpoints configuration for compacted states  ([#457](https://github.com/Liquid-JS/lyra/issues/457)) ([56411db](https://github.com/Liquid-JS/lyra/commit/56411dbe55da3fe7f6bfc30087091cb7b6a61995))
* **sidebar:** custom links and 3rd level ([ded87ce](https://github.com/Liquid-JS/lyra/commit/ded87ce5270b98f3724abfeac5f69252761162da))
* **sidebar:** Eva theme ([#1367](https://github.com/Liquid-JS/lyra/issues/1367)) ([8c16fc4](https://github.com/Liquid-JS/lyra/commit/8c16fc4a9bdf14b0a846c310c55a36fd2bf079f9))
* **sidebar:** hide sidebar for the large breakpoint ([08648cb](https://github.com/Liquid-JS/lyra/commit/08648cbd9af07415c81897ffc97713f5e0d86e63))
* **sidebar:** menu separated from sidebar, menu merged with routes ([0ee317b](https://github.com/Liquid-JS/lyra/commit/0ee317bc4dc3f7fde8ad2e614f8564cf0ccbb599))
* **sidebar:** sidebar responsive & menu mobile styles ([9300cc3](https://github.com/Liquid-JS/lyra/commit/9300cc372065d4638e90ac450b0ea3402703653b))
* **sidebar:** sidebar with header & footer ([5b6c085](https://github.com/Liquid-JS/lyra/commit/5b6c085a742f4c6a2deeacd3ce44b77ed9764640))
* **smart table:** preparing a demo ([8b93999](https://github.com/Liquid-JS/lyra/commit/8b93999ba9fafe7b756efdaeef6a502759137431))
* **smart-table:** install ng2-smart-table ([120ffe7](https://github.com/Liquid-JS/lyra/commit/120ffe7d139e3eed09473829cb7eab46549dfc80))
* **smart-table:** update ng2-smart-table ([7860243](https://github.com/Liquid-JS/lyra/commit/78602432e4eaaf18e2dbd28a259196693390715b))
* **smarttable:** table setup ([5aea53a](https://github.com/Liquid-JS/lyra/commit/5aea53a1aa583cd4d2fc14388723d6f41446c43c))
* **smoke:** include packages-smoke update into release ([#1258](https://github.com/Liquid-JS/lyra/issues/1258)) ([8db4b29](https://github.com/Liquid-JS/lyra/commit/8db4b29008ae0681c2be8c5af03f7c174beb0673))
* specify next version in install instructions ([#1435](https://github.com/Liquid-JS/lyra/issues/1435)) ([99ca0c9](https://github.com/Liquid-JS/lyra/commit/99ca0c978a8f70f09d5315efd60323e68012b0bb))
* **spinner:** Eva style ([#1351](https://github.com/Liquid-JS/lyra/issues/1351)) ([da6cfee](https://github.com/Liquid-JS/lyra/commit/da6cfeebcb2533bdecea77a8d2b00bc68510e66b))
* **ssr:** add server-side rendering support ([c826187](https://github.com/Liquid-JS/lyra/commit/c8261870248e21cdf1da7017c1d71a3d00484ec7))
* **stepper:** add disable step navigation setting ([#1155](https://github.com/Liquid-JS/lyra/issues/1155)) ([e1503cc](https://github.com/Liquid-JS/lyra/commit/e1503ccede03ec6c363c65023c16440ad1b5c205)), closes [#902](https://github.com/Liquid-JS/lyra/issues/902)
* **stepper:** add linear mode ([#1151](https://github.com/Liquid-JS/lyra/issues/1151)) ([db5d214](https://github.com/Liquid-JS/lyra/commit/db5d21416884dbfa86a70266915ce61653991cad)), closes [#1040](https://github.com/Liquid-JS/lyra/issues/1040)
* **stepper:** add step change event ([#2779](https://github.com/Liquid-JS/lyra/issues/2779)) ([1b871f4](https://github.com/Liquid-JS/lyra/commit/1b871f464c38e1eb6bf6564ed562b60188e7c163))
* **stepper:** Eva theme ([#1405](https://github.com/Liquid-JS/lyra/issues/1405)) ([2d841d0](https://github.com/Liquid-JS/lyra/commit/2d841d0ae8f97c209ea45dc647609b2124382a9b))
* **styles:** add fadeIn animation ([e44109e](https://github.com/Liquid-JS/lyra/commit/e44109e380f895cd5aa9e265de8f54f7776b7098))
* **styles:** add themes supporting ([a656a6a](https://github.com/Liquid-JS/lyra/commit/a656a6a2df6b825ca624f7a4315974fb60b75f9e))
* **styles:** install mixing for a component containing nga-layout ([1a8cb21](https://github.com/Liquid-JS/lyra/commit/1a8cb21662a364e3fc706b4361d0b982187cfe45))
* **styles:** prepare styles for theming ([e64f80f](https://github.com/Liquid-JS/lyra/commit/e64f80f5ce66f44b4f3a667692f53a09f3f269ac))
* sync with Eva 1.1 ([#1995](https://github.com/Liquid-JS/lyra/issues/1995)) ([67d5689](https://github.com/Liquid-JS/lyra/commit/67d56890f036439a46dacf851dc5cc1cbe1a4a2f))
* **table:** confirm before delete ([cbef8bf](https://github.com/Liquid-JS/lyra/commit/cbef8bf6589dd55428cb1b43c0bb3736d3b0154d))
* **tables:** add smart table page ([33f0fbb](https://github.com/Liquid-JS/lyra/commit/33f0fbb457635e788d8ab927695480ab2afbf30f))
* **tabs:** ability to assign an icon ([#607](https://github.com/Liquid-JS/lyra/issues/607)) ([b78b8d3](https://github.com/Liquid-JS/lyra/commit/b78b8d3ab90dfc53ed56915222052e005bac0caf)), closes [#288](https://github.com/Liquid-JS/lyra/issues/288)
* **tabs:** add `disabled` property ([#1141](https://github.com/Liquid-JS/lyra/issues/1141)) ([ea7b209](https://github.com/Liquid-JS/lyra/commit/ea7b20901e539d7f716d9b6542286443709c9234)), closes [#387](https://github.com/Liquid-JS/lyra/issues/387)
* **tabset:** ability to provide template as tab label ([#2829](https://github.com/Liquid-JS/lyra/issues/2829)) ([d56a492](https://github.com/Liquid-JS/lyra/commit/d56a492d61e696a384a5ca0a361d3f94e00e0a44))
* **tabset:** add `lazyLoad` property to `nb-tab` so that it loads content before it is actually shown ([#227](https://github.com/Liquid-JS/lyra/issues/227)) ([270995d](https://github.com/Liquid-JS/lyra/commit/270995dc31a061e7bdd69af91669865357fdf8ce)), closes [#144](https://github.com/Liquid-JS/lyra/issues/144)
* **tabset:** add a tabId data attribute to the tab button ([#2738](https://github.com/Liquid-JS/lyra/issues/2738)) ([5aaab17](https://github.com/Liquid-JS/lyra/commit/5aaab176d38984e4896e8bf4f4cf4a9e07d5eff2))
* **tabset:** add lazy loading for tabs ([36cc837](https://github.com/Liquid-JS/lyra/commit/36cc8375645ed02a0dcd9b770fa1cd685b28ebb3))
* **tabset:** add style incapsulation for tabset components ([#911](https://github.com/Liquid-JS/lyra/issues/911)) ([33162af](https://github.com/Liquid-JS/lyra/commit/33162af276c85a35088ab89d4cae0e688ccbb091)), closes [#561](https://github.com/Liquid-JS/lyra/issues/561)
* **tabset:** add tabid property ([#1919](https://github.com/Liquid-JS/lyra/issues/1919)) ([d5bf53a](https://github.com/Liquid-JS/lyra/commit/d5bf53a5941a88d91b04bd6401cf78a1c000b76d))
* **tabset:** Eva style ([#1348](https://github.com/Liquid-JS/lyra/issues/1348)) ([25f30c5](https://github.com/Liquid-JS/lyra/commit/25f30c54f8436744ffa34d0730a7dc8f5f2a9e86))
* **tabset:** update background fot tabset selected ([#643](https://github.com/Liquid-JS/lyra/issues/643)) ([ff8e9b6](https://github.com/Liquid-JS/lyra/commit/ff8e9b61b721af7678d0a5b0e794f1a0560190a8))
* **tabs:** implement a tabs control ([a26063c](https://github.com/Liquid-JS/lyra/commit/a26063c244541a59bc34c2878acbcc63d3623cd5))
* **tabs:** inherit active tab to the card-header styles ([fadbab8](https://github.com/Liquid-JS/lyra/commit/fadbab88f8375ef53b5055590e0f69319c93ba70))
* tag component ([#2565](https://github.com/Liquid-JS/lyra/issues/2565)) ([bcdfcd8](https://github.com/Liquid-JS/lyra/commit/bcdfcd8a75c9f4593ff2c9295f0280de59f8ed4f))
* **test:** e2e and unit testing setup ([dd51f5e](https://github.com/Liquid-JS/lyra/commit/dd51f5e571605018efb31cce647199e94a8d1d74))
* **testing:** add e2e tests for nga-layout ([c1e0273](https://github.com/Liquid-JS/lyra/commit/c1e0273b9b7acc066cab9fa3d313df5def03f0d6))
* **testing:** add e2e tests for nga-layout ([0b998e7](https://github.com/Liquid-JS/lyra/commit/0b998e73c87629e093803d168b31f5028ff84f5f))
* **theme:** ability to add custom statuses ([#2625](https://github.com/Liquid-JS/lyra/issues/2625)) ([3b2e903](https://github.com/Liquid-JS/lyra/commit/3b2e90383f724c67b73ce63ad1c3d800c9f43aed))
* **theme:** add a charts overriding ([f84c285](https://github.com/Liquid-JS/lyra/commit/f84c28550c84e889aa872710dee8fbaab7e65549))
* **theme:** add a checkbox component ([8d3fbfb](https://github.com/Liquid-JS/lyra/commit/8d3fbfbc33535363fcce2a3d89097f47f0d8709c))
* **theme:** add a menu component ([7210f4c](https://github.com/Liquid-JS/lyra/commit/7210f4cc88f444e7dbe3d9f7837f51b4c66dd8ca))
* **theme:** add a search component ([#1068](https://github.com/Liquid-JS/lyra/issues/1068)) ([356f1f6](https://github.com/Liquid-JS/lyra/commit/356f1f6aee35290582c9f2e1d264bccd839acaa4))
* **theme:** add a shared module ([28f9eb9](https://github.com/Liquid-JS/lyra/commit/28f9eb990f0385cf00ee2a69ed2aef3bade0d8d6))
* **theme:** add a tables overrides module ([6df3a68](https://github.com/Liquid-JS/lyra/commit/6df3a68019a95f325316a9fdf00f6f30378e302a))
* **theme:** add Accordion component ([3a94f9c](https://github.com/Liquid-JS/lyra/commit/3a94f9c99e7dda62e590fd6b659bfcdcfd160fe6))
* **theme:** add alert component ([ee27fda](https://github.com/Liquid-JS/lyra/commit/ee27fda69c5e1d10cd045ad1be9465923ab49bb0))
* **theme:** add breakpoints map ([d36251d](https://github.com/Liquid-JS/lyra/commit/d36251d100bfd90a5b965727c63f9e0e27f34840))
* **theme:** add capability append component to the layout top by its factory ([#253](https://github.com/Liquid-JS/lyra/issues/253)) ([515636c](https://github.com/Liquid-JS/lyra/commit/515636ce75fc1f396c7500fe90e3db31ed0e6095))
* **theme:** add cdk ([#679](https://github.com/Liquid-JS/lyra/issues/679)) ([b9283d3](https://github.com/Liquid-JS/lyra/commit/b9283d359c25053aa6633e4c154c4c0ed3ee918e)), closes [#661](https://github.com/Liquid-JS/lyra/issues/661) [#660](https://github.com/Liquid-JS/lyra/issues/660)
* **theme:** add custom breakpoints in bootstrap grid ([143e884](https://github.com/Liquid-JS/lyra/commit/143e8846e076fbef4f9339161414a8895a271959))
* **theme:** add hero buttons pulse ([a90058a](https://github.com/Liquid-JS/lyra/commit/a90058a00aa316fcd291e06c10b4fe7759faca27))
* **theme:** add highlight for the user component ([7772e6f](https://github.com/Liquid-JS/lyra/commit/7772e6f3e85837869fe6b7d404f5bb4e9888ce8d))
* **theme:** add modals styles, remove icon packages, fix buttons ([0d0dead](https://github.com/Liquid-JS/lyra/commit/0d0deadb0ce92b61bfe0253bfc8eb09a8c9f179d))
* **theme:** add new Button component ([#341](https://github.com/Liquid-JS/lyra/issues/341)) ([89d429d](https://github.com/Liquid-JS/lyra/commit/89d429dfd0e42cfdd0d0400d070a8dd1d82386ce))
* **theme:** add new Calendar component & Calendar Kit module ([#598](https://github.com/Liquid-JS/lyra/issues/598)) ([8547527](https://github.com/Liquid-JS/lyra/commit/8547527d5d8e1c1c44e3475500e8f3fcf7ae859a))
* **theme:** add new Chat UI components set ([ebfcd0e](https://github.com/Liquid-JS/lyra/commit/ebfcd0ec34c2f959b971335fb9fc90b76d81c610))
* **theme:** add new DatePicker component ([#732](https://github.com/Liquid-JS/lyra/issues/732)) ([c00cc23](https://github.com/Liquid-JS/lyra/commit/c00cc23aef356304425b10ff3a716e63ed52c374))
* **theme:** add new Dialog component ([#688](https://github.com/Liquid-JS/lyra/issues/688)) ([2edd9b3](https://github.com/Liquid-JS/lyra/commit/2edd9b3c232d1ef69ce2eb06c73236db7196632a)), closes [#666](https://github.com/Liquid-JS/lyra/issues/666) [#665](https://github.com/Liquid-JS/lyra/issues/665)
* **theme:** add new Input directive ([#569](https://github.com/Liquid-JS/lyra/issues/569)) ([42c588e](https://github.com/Liquid-JS/lyra/commit/42c588e39ce495cb62a6f5a8ddfdaffedaf393ca))
* **theme:** add new List and Infinite List components ([#530](https://github.com/Liquid-JS/lyra/issues/530)) ([a07c78c](https://github.com/Liquid-JS/lyra/commit/a07c78c5bb68ce0929b89677c06932bbc920d0b0))
* **theme:** add new Radio component ([#746](https://github.com/Liquid-JS/lyra/issues/746)) ([9e04681](https://github.com/Liquid-JS/lyra/commit/9e04681ef1d832bc512bacfcb908b02bc1c15a7c))
* **theme:** add new Select component ([#698](https://github.com/Liquid-JS/lyra/issues/698)) ([d6a211f](https://github.com/Liquid-JS/lyra/commit/d6a211f34c9d3a8d1b1134767ef488aaf87c1bcc)), closes [#671](https://github.com/Liquid-JS/lyra/issues/671)
* **theme:** add new Toastr component ([#692](https://github.com/Liquid-JS/lyra/issues/692)) ([29e4fef](https://github.com/Liquid-JS/lyra/commit/29e4fef588d0c3bee325d70781ffc0ccce6cec59)), closes [#667](https://github.com/Liquid-JS/lyra/issues/667)
* **theme:** add new Tooltip component ([#703](https://github.com/Liquid-JS/lyra/issues/703)) ([0e05034](https://github.com/Liquid-JS/lyra/commit/0e05034f7c7f961476891af2f54b756360944618)), closes [#663](https://github.com/Liquid-JS/lyra/issues/663)
* **theme:** add new Window component ([#713](https://github.com/Liquid-JS/lyra/issues/713)) ([60a65cb](https://github.com/Liquid-JS/lyra/commit/60a65cb99365fd848c66b179538c97062c5dad43)), closes [#669](https://github.com/Liquid-JS/lyra/issues/669)
* **theme:** add overrides for dropdown, outline buttons, icon buttons ([80160ab](https://github.com/Liquid-JS/lyra/commit/80160abf3d8929db677611f5ec5e7c3821fe97e0))
* **theme:** add progress-bar component ([#459](https://github.com/Liquid-JS/lyra/issues/459)) ([3693494](https://github.com/Liquid-JS/lyra/commit/3693494477c7682bbcfeeec0ea001e2a7554db4b))
* **theme:** add RTL support ([#343](https://github.com/Liquid-JS/lyra/issues/343)) ([0326c1c](https://github.com/Liquid-JS/lyra/commit/0326c1ccbac87614257daf903591d384af64be1f))
* **theme:** add Spinner component ([8ef7412](https://github.com/Liquid-JS/lyra/commit/8ef741268f0eab8821e0dd301e98ae58082afd1d))
* **theme:** add Stepper component ([d474598](https://github.com/Liquid-JS/lyra/commit/d474598e6655a7e093a10c9eb7a6925d251df89d))
* **theme:** add styles for dropdown menu divider ([f646051](https://github.com/Liquid-JS/lyra/commit/f6460517f4761ffe17bd8fef348d039d62831908))
* **theme:** add the disabled buttons styles ([#1202](https://github.com/Liquid-JS/lyra/issues/1202)) ([2f9e004](https://github.com/Liquid-JS/lyra/commit/2f9e0047051fa95f404fff6bd328fe392fef64b1))
* **theme:** add the dropdown overrides ([#1197](https://github.com/Liquid-JS/lyra/issues/1197)) ([63cda32](https://github.com/Liquid-JS/lyra/commit/63cda326bd31663bf525b702dcd9b9125fe6038b))
* **theme:** add the forms overrides ([bf72529](https://github.com/Liquid-JS/lyra/commit/bf725291939b1741e9b5e8a9e076102a8e64ccf5))
* **theme:** add the input overrides ([23e0302](https://github.com/Liquid-JS/lyra/commit/23e030240794c661c97a5387bdcfe7d56c003f57))
* **theme:** add the maps overrides ([87c1ccb](https://github.com/Liquid-JS/lyra/commit/87c1ccbe41a2ee61097d0f144ad2df9948f5b0fd))
* **theme:** add the tree view overrides ([e8581d4](https://github.com/Liquid-JS/lyra/commit/e8581d46fa9b8e2b1f792d09783a449f40562646))
* **theme:** add the typography overrides ([2b8e406](https://github.com/Liquid-JS/lyra/commit/2b8e406cc50d2e0d0fa2245cfbefe38b26b6ceaa))
* **theme:** autocomplete component ([#1947](https://github.com/Liquid-JS/lyra/issues/1947)) ([d67dd6b](https://github.com/Liquid-JS/lyra/commit/d67dd6b4ea1871e91e5b18564076013255289a30))
* **theme:** change default link color ([528f2a0](https://github.com/Liquid-JS/lyra/commit/528f2a0b484bc1a6c5a20c27fc1b9a7e8d0cec16))
* **theme:** change min width & layout bg ([dee017a](https://github.com/Liquid-JS/lyra/commit/dee017a3dce79d13136b0a45025a5b81f500109b))
* **theme:** complete a menu component ([d8688c6](https://github.com/Liquid-JS/lyra/commit/d8688c69c96f8b43a4f28759271dfa6585551909))
* **theme:** complete a tabset component ([c553a6a](https://github.com/Liquid-JS/lyra/commit/c553a6a51172596b5d1850c87ecede9c076184b7))
* **theme:** complete the maps overrides ([21f6126](https://github.com/Liquid-JS/lyra/commit/21f6126fccbde0abc9a2c1f256b788f580a31bf8))
* **theme:** corporate - new theme ([#479](https://github.com/Liquid-JS/lyra/issues/479)) ([c75eaf7](https://github.com/Liquid-JS/lyra/commit/c75eaf73f668733d3853c405832d8587e8976124))
* **theme:** cosmic update ([#1420](https://github.com/Liquid-JS/lyra/issues/1420)) ([ee07fbc](https://github.com/Liquid-JS/lyra/commit/ee07fbc1661616610e3918aa13d50e7cd84bcf53))
* **theme:** css variables support ([#1257](https://github.com/Liquid-JS/lyra/issues/1257)) ([da136da](https://github.com/Liquid-JS/lyra/commit/da136da99ae26c0b7ccfb3a0da45e6b06c94e861)), closes [#46](https://github.com/Liquid-JS/lyra/issues/46)
* **theme:** enable CSS custom properties mode by default ([#2965](https://github.com/Liquid-JS/lyra/issues/2965)) ([3a88e9b](https://github.com/Liquid-JS/lyra/commit/3a88e9b1c776fbdb61239e7340c84d7757d62c97))
* **theme:** fix header border color ([1266227](https://github.com/Liquid-JS/lyra/commit/1266227a7ee17d4610a55c9546b30c50a3689a15))
* **theme:** fix tabset styles ([dcef4be](https://github.com/Liquid-JS/lyra/commit/dcef4bedfc968f682da3466988a01640b27c5b5f))
* **theme:** form field component ([#2238](https://github.com/Liquid-JS/lyra/issues/2238)) ([aee71a7](https://github.com/Liquid-JS/lyra/commit/aee71a73a0a9eb917e04e0f284d74de4e89925f5))
* **theme:** implement getByName breakpoints service method ([7a2a267](https://github.com/Liquid-JS/lyra/commit/7a2a267230bab0f597d665dfb6d69f57b7b799b2))
* **theme:** improve buttons styles ([#1200](https://github.com/Liquid-JS/lyra/issues/1200)) ([4ad9cd9](https://github.com/Liquid-JS/lyra/commit/4ad9cd9877cbab4002209758dac5f2d61ba155b2))
* **theme:** improve user layout and styles ([cce3e3b](https://github.com/Liquid-JS/lyra/commit/cce3e3bbb5857447e2ec7403f878239ff4bb3fad))
* **theme:** increase default padding & margin ([b71b000](https://github.com/Liquid-JS/lyra/commit/b71b0004e5373760a90713cf9a9a7b3594f094f4))
* **theme:** js themes poc ([e5eeb55](https://github.com/Liquid-JS/lyra/commit/e5eeb55bc37cba4a8f58ffc5eea69af372b9d978))
* **theme:** mixins for styling input range ([51778c2](https://github.com/Liquid-JS/lyra/commit/51778c2da4652c7ab248caf055dc634d0a49123b))
* **theme:** move d3 styles to demo ([ba7ab03](https://github.com/Liquid-JS/lyra/commit/ba7ab031d8c189189f6fca7a8551bfdc8642333f))
* **theme:** move js themes to separate files ([6e9ba9a](https://github.com/Liquid-JS/lyra/commit/6e9ba9aefe84adc384f8655b6d7975f5558aed92))
* **theme:** multi theme support ([a0648fd](https://github.com/Liquid-JS/lyra/commit/a0648fd6210294f2d73910cd7ab93848ac858767))
* **theme:** multiple values for nb-(except-)for-theme ([#1218](https://github.com/Liquid-JS/lyra/issues/1218)) ([6c9e11c](https://github.com/Liquid-JS/lyra/commit/6c9e11cf29102f8f22527de802a177d921051f8f))
* **theme:** ng-add schematic ([#942](https://github.com/Liquid-JS/lyra/issues/942)) ([5d5a874](https://github.com/Liquid-JS/lyra/commit/5d5a8742ad8072fa1aa1fe2c25d75adfeeb915e3))
* **theme:** override default bootstrap style for row css class for small screens ([#608](https://github.com/Liquid-JS/lyra/issues/608)) ([9be2fcb](https://github.com/Liquid-JS/lyra/commit/9be2fcb1652b3fbb75ca1ff09c56cece8b2800e9))
* **themes:** add new Dark theme! ([#1472](https://github.com/Liquid-JS/lyra/issues/1472)) ([3b5ad6c](https://github.com/Liquid-JS/lyra/commit/3b5ad6c5aba982452425db078e9e03a6b0f51217))
* **theme:** setup animation mixins ([01b9d26](https://github.com/Liquid-JS/lyra/commit/01b9d263afe4e90e12e996c63f5f56e72fe62eb2))
* **theme:** setup btn-pulse for non hero btns ([2436d3b](https://github.com/Liquid-JS/lyra/commit/2436d3be18330e538320ece10570b0941c5c67dc))
* **themes:** permanent highlighting of active row ([fc0c01a](https://github.com/Liquid-JS/lyra/commit/fc0c01a39c4448def970d72eee3cdc02a9e3a5d2))
* **theme:** support hidden property ([#31](https://github.com/Liquid-JS/lyra/issues/31)) ([f26922a](https://github.com/Liquid-JS/lyra/commit/f26922ad65aacaa791cd8ddf0d72f1c194ecefbe))
* **theme:** theme breakpoints ([8bb112f](https://github.com/Liquid-JS/lyra/commit/8bb112ffa486fa1c166d774b85650526d8c9c900))
* **theme:** update card border color for corporate theme ([#594](https://github.com/Liquid-JS/lyra/issues/594)) ([ff0985e](https://github.com/Liquid-JS/lyra/commit/ff0985e0c60da13e3a0504782291047eae945e3d))
* **theme:** user menu todo ([ab4e2a9](https://github.com/Liquid-JS/lyra/commit/ab4e2a9da16c7ff006680a17794b88d38c40c887))
* **theme:** wrap color helper methods to static class ([5c45d5e](https://github.com/Liquid-JS/lyra/commit/5c45d5e785e4618abfcb7c38f350618b9adf54ab))
* **theming:** add dynamic shade calculation ([dd3bc55](https://github.com/Liquid-JS/lyra/commit/dd3bc557fc9cab34a2fb01b21bb7279d5bda33e6))
* **theming:** css variables poc (doesn't work with sass function though) ([7878709](https://github.com/Liquid-JS/lyra/commit/7878709bb3b6c740fb2cd8287053c2d54bc592c8))
* **timepicker:** add disabled state ([#3127](https://github.com/Liquid-JS/lyra/issues/3127)) ([7af5a8d](https://github.com/Liquid-JS/lyra/commit/7af5a8d2f85c6f557d161eda536ab22dcb45114e))
* **timepicker:** add localization config ([#2719](https://github.com/Liquid-JS/lyra/issues/2719)) ([b9c77ce](https://github.com/Liquid-JS/lyra/commit/b9c77ceb978e5d68fd9a84fee21ca4ed37425abd))
* **timepicker:** add timepicker component ([#2402](https://github.com/Liquid-JS/lyra/issues/2402)) ([70ee391](https://github.com/Liquid-JS/lyra/commit/70ee391be03f8bb188768e1bedba8ce41e96f72a))
* **toastr:** add duplicates behavior ([#1628](https://github.com/Liquid-JS/lyra/issues/1628)) ([4ab5037](https://github.com/Liquid-JS/lyra/commit/4ab5037c620bda954c4344f43e4e2c17124f0d5e))
* **toastr:** add onclick, onclose events ([#2821](https://github.com/Liquid-JS/lyra/issues/2821)) ([3795905](https://github.com/Liquid-JS/lyra/commit/3795905926dfb9c29eb7676a0da5ecbe16750ccd))
* **toastr:** add toasts limit ([#1637](https://github.com/Liquid-JS/lyra/issues/1637)) ([56cac51](https://github.com/Liquid-JS/lyra/commit/56cac512f7ccd873d82d2014113f348db8f6d1f9))
* **toastr:** Eva style ([#1411](https://github.com/Liquid-JS/lyra/issues/1411)) ([e10ab2f](https://github.com/Liquid-JS/lyra/commit/e10ab2f6bb83cb5f9068d5aaa1940036946a3edb))
* **toastr:** remove deprecated iconPack property ([#2620](https://github.com/Liquid-JS/lyra/issues/2620)) ([77a3519](https://github.com/Liquid-JS/lyra/commit/77a3519b4199550eccd627d09a82910935248daf))
* **toastr:** show method now returns toast reference ([#1058](https://github.com/Liquid-JS/lyra/issues/1058)) ([aeeedf1](https://github.com/Liquid-JS/lyra/commit/aeeedf1673d8f1241b6cbd613e91be6e0cfa9331))
* **toggle:** add toggle component ([#1304](https://github.com/Liquid-JS/lyra/issues/1304)) ([d86edce](https://github.com/Liquid-JS/lyra/commit/d86edce97376e0c243c695fb10868010f80292dc))
* **tooltip, popover:** add disabled property ([#2841](https://github.com/Liquid-JS/lyra/issues/2841)) ([b7fe861](https://github.com/Liquid-JS/lyra/commit/b7fe861b847ac8794fe15142d594d2734183d138))
* **tooltip, popover:** remove ability to use falsy adjustment ([#2619](https://github.com/Liquid-JS/lyra/issues/2619)) ([32ab00e](https://github.com/Liquid-JS/lyra/commit/32ab00ef56cee97a86b9b918ecb5d47c25fbd090))
* **tooltip:** add new `nbTooltipTrigger` parameter ([#1138](https://github.com/Liquid-JS/lyra/issues/1138)) ([113d3b0](https://github.com/Liquid-JS/lyra/commit/113d3b050e2b91e0f5d44ec4ad8ca87f7bda398e))
* **tooltip:** dynamic inputs support ([#1184](https://github.com/Liquid-JS/lyra/issues/1184)) ([9ce7019](https://github.com/Liquid-JS/lyra/commit/9ce701903fff5a47ece1fe0af86e8b96f588e568)), closes [#1052](https://github.com/Liquid-JS/lyra/issues/1052) [#1159](https://github.com/Liquid-JS/lyra/issues/1159)
* **tooltip:** Eva style ([#1345](https://github.com/Liquid-JS/lyra/issues/1345)) ([85945ac](https://github.com/Liquid-JS/lyra/commit/85945acf450335122c0bb5aadfc9351c10118c93))
* **travis:** add slack notifications ([5bf0bb8](https://github.com/Liquid-JS/lyra/commit/5bf0bb8cd13498506009b74f0c00f33aec2306d1))
* **travis:** test travis config ([0c15ded](https://github.com/Liquid-JS/lyra/commit/0c15ded7d4580fdb7193bd852318fd6fdf893b49))
* **tree-grid:** Eva style ([#1409](https://github.com/Liquid-JS/lyra/issues/1409)) ([5fac736](https://github.com/Liquid-JS/lyra/commit/5fac736b1d509b0a06dc8f31493bdd59fdf69984))
* **typography:** add anchor text decoration theme property ([#2169](https://github.com/Liquid-JS/lyra/issues/2169)) ([be80661](https://github.com/Liquid-JS/lyra/commit/be80661a0dafb6fdb4ae5df61835649930200547))
* **typography:** complete typography ([984159a](https://github.com/Liquid-JS/lyra/commit/984159a838e8b7ea0b244b90275c8dcee8d7bd6e))
* **typography:** Eva style ([#1425](https://github.com/Liquid-JS/lyra/issues/1425)) ([66b02e6](https://github.com/Liquid-JS/lyra/commit/66b02e68815e74a7ca3ef12ba3149082b55e50de))
* **typography:** first bunch ([006a797](https://github.com/Liquid-JS/lyra/commit/006a797459a0c002c500e079bc046a478c9190bb))
* **typography:** specify body, paragraph and list styles ([#1546](https://github.com/Liquid-JS/lyra/issues/1546)) ([310127b](https://github.com/Liquid-JS/lyra/commit/310127be4b0370249a461fa50261275db17b5159))
* **typography:** sync with Eva 1 ([#1648](https://github.com/Liquid-JS/lyra/issues/1648)) ([a2e20a0](https://github.com/Liquid-JS/lyra/commit/a2e20a067bc93479442549b740a827b02c5cc84f))
* **ui:** add modals ([d56537a](https://github.com/Liquid-JS/lyra/commit/d56537af9f49d32b4bb174de45b29fabafb6d378))
* update angular to v21 ([#3306](https://github.com/Liquid-JS/lyra/issues/3306)) ([379b67f](https://github.com/Liquid-JS/lyra/commit/379b67f164b44b016c04bea62005385d98b14e60))
* update corporate theme ([#1434](https://github.com/Liquid-JS/lyra/issues/1434)) ([d564454](https://github.com/Liquid-JS/lyra/commit/d564454faa583f7db7179c78893136586b8e998b))
* update js themes ([#1631](https://github.com/Liquid-JS/lyra/issues/1631)) ([4d66419](https://github.com/Liquid-JS/lyra/commit/4d66419ea89260d9e1359bb6c74a26a47c67d159))
* update to Angular 11 ([#2611](https://github.com/Liquid-JS/lyra/issues/2611)) ([847bc99](https://github.com/Liquid-JS/lyra/commit/847bc99073b31adedc0e754997a9679bd9fae325))
* update to Angular 12 ([#2769](https://github.com/Liquid-JS/lyra/issues/2769)) ([5e74916](https://github.com/Liquid-JS/lyra/commit/5e749162816b967196af448a2dda2674ff306db3))
* update to Angular 13 ([#2944](https://github.com/Liquid-JS/lyra/issues/2944)) ([ed8cd04](https://github.com/Liquid-JS/lyra/commit/ed8cd04fcac1318c4a546cadd5d07358813772f5))
* update to Angular 14.2.x ([#3143](https://github.com/Liquid-JS/lyra/issues/3143)) ([275edf3](https://github.com/Liquid-JS/lyra/commit/275edf329de4056050dca02fe3c6345656c86054))
* update to Angular 15 ([#3163](https://github.com/Liquid-JS/lyra/issues/3163)) ([f3098ea](https://github.com/Liquid-JS/lyra/commit/f3098eac32039027578fa69c13401e80cc7974f3))
* update to Angular 17 ([#3236](https://github.com/Liquid-JS/lyra/issues/3236)) ([bced0eb](https://github.com/Liquid-JS/lyra/commit/bced0eb8dfc463beb2263d84cb82be40c61fb5e4))
* update to angular 6 ([#408](https://github.com/Liquid-JS/lyra/issues/408)) ([16314e8](https://github.com/Liquid-JS/lyra/commit/16314e8fb7dcebe23aca3b754d277e20a726597f))
* update to Angular 9 ([#2236](https://github.com/Liquid-JS/lyra/issues/2236)) ([899815f](https://github.com/Liquid-JS/lyra/commit/899815fe0dfa150679f2a8d1ad70c82ba825d13a))
* upgrade to Angular 10 ([#2464](https://github.com/Liquid-JS/lyra/issues/2464)) ([540ee46](https://github.com/Liquid-JS/lyra/commit/540ee46c7930308b2cfdaa745d6651c13bdb4bee))
* **uploader:** new picture uploader component ([d730430](https://github.com/Liquid-JS/lyra/commit/d730430884e9d1957c2cf95cf15697e7042ab152))
* **user:** allow use base64 images for user picture ([#238](https://github.com/Liquid-JS/lyra/issues/238)) ([28338a7](https://github.com/Liquid-JS/lyra/commit/28338a711311bc542b1f54cf6ba3d760ebdbc228))
* **user:** Eva style ([#1354](https://github.com/Liquid-JS/lyra/issues/1354)) ([2d05714](https://github.com/Liquid-JS/lyra/commit/2d057142ffefdf582d66e355d04ef6e5ef34cef7))
* **user:** user block component ([48e0191](https://github.com/Liquid-JS/lyra/commit/48e01917123906e8f65bd977005fcb45177008f2))
* **window:** ability to hide close button ([#2952](https://github.com/Liquid-JS/lyra/issues/2952)) ([ad64fe2](https://github.com/Liquid-JS/lyra/commit/ad64fe2bfe12ae9485c0eaef95328ec07bac42d9))
* **window:** add component instance property to window ref ([#2858](https://github.com/Liquid-JS/lyra/issues/2858)) ([fcf1a08](https://github.com/Liquid-JS/lyra/commit/fcf1a08404b80563fb83e9ea6bc4819e0f90364f))
* **window:** add window buttons configuration ([#2762](https://github.com/Liquid-JS/lyra/issues/2762)) ([9dcd40e](https://github.com/Liquid-JS/lyra/commit/9dcd40e95d94d3c84208288a534beb76d4cbd8f9))
* **window:** template as window title ([#2915](https://github.com/Liquid-JS/lyra/issues/2915)) ([8eaf460](https://github.com/Liquid-JS/lyra/commit/8eaf460af65812a6f69810d837903f67204c43d6))
* **window:** window may return result ([#2869](https://github.com/Liquid-JS/lyra/issues/2869)) ([95247a4](https://github.com/Liquid-JS/lyra/commit/95247a42c4ec661a7dfac187b7f6758879d924b1))

### BREAKING CHANGES

* - Bump Angular version to 12.
  - Minimal requred `tslib` version is `2.1.0`.
  - `NbTable` and `NbTreeGridComponent`:
    - `_viewRepeater`, `_coalescedStyleScheduler` constructor parameters are now required.
    - New parameters (`_viewportRuler`, `_stickyPositioningListener`) added to the constructor.
* **button:** 'accent' property removed.

  Static properties removed. Removed properties:
  SIZE_XSMALL, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, STATUS_PRIMARY,
  STATUS_INFO, STATUS_SUCCESS, STATUS_WARNING, STATUS_DANGER,
  SHAPE_RECTANGLE, SHAPE_ROUND, SHAPE_SEMI_ROUND.
  Use NbComponentSize, NbComponentStatus, NbComponentShape.

  Size classes were renamed:
  btn-xsmall -> size-tiny
  btn-small -> size-small
  btn-medium -> size-medium
  btn-large -> size-large

  Size getter 'xsmall' renamed to tiny.

  Status classes were renamed:
  btn-primary -> status-primary
  btn-info -> status-info
  btn-success -> status-success
  btn-warning -> status-warning
  btn-danger -> status-danger

  Shape classes were renamed:
  btn-rectangle -> shape-rectangle
  btn-round -> shape-round
  btn-semi-round -> shape-semi-round

  'btn-outline' class renamed to 'appearance-outline'.
  'btn-hero' class renamed to 'appearance-hero'.

  Button theme properties prefix changed to 'button' (was 'btn').

  Following theme properties were renamed:
  btn-fg -> button-filled-[status]-text-color,
  button-outline-[status]-[state?]-text-color,
  button-ghost-[status]-[state?]-text-color,
  button-hero-[status]-text-color
  btn-font-family -> button-text-font-family
  btn-line-height -> button-[size]-text-line-height
  btn-cursor -> button-cursor
  btn-[status]-bg -> button-filled-[status]-background-color
  btn-[status]-hover-bg -> button-filled-[status]-hover-background-color
  btn-[status]-active-bg -> button-filled-[status]-active-background-color
  btn-padding-y-[size], btn-padding-x-[size] -> button-[appearance]-[size]-padding
  btn-font-size-[size] -> button-[size]-text-font-size
  btn-rectangle-border-radius -> button-rectangle-border-radius
  btn-semi-round-border-radius -> button-semi-round-border-radius
  btn-round-border-radius -> button-round-border-radius
  btn-hero-shadow -> button-hero-shadow
  btn-hero-text-shadow -> button-hero-text-shadow
  btn-hero-bevel-size -> button-hero-bevel-size
  btn-hero-glow-size -> button-hero-glow-size
  btn-hero-[status]-bevel-color -> button-hero-[status]-bevel-color
  btn-hero-[status]-glow-color -> button-hero-[status]-glow-color
  btn-hero-[status]-left-bg -> button-hero-[status]-left-background-color
  btn-hero-[status]-right-bg -> button-hero-[status]-right-background-color
  btn-hero-[status]-left-hover-bg -> button-hero-[status]-hover-left-background-color
  btn-hero-[status]-right-hover-bg -> button-hero-[status]-hover-right-background-color
  btn-hero-[status]-left-active-bg -> button-hero-[status]-active-left-background-color
  btn-hero-[status]-right-active-bg -> button-hero-[status]-active-right-background-color
  btn-outline-fg -> button-outline-[status]-border-color
  btn-outline-hover-fg -> button-outline-[status]-hover-border-color
  btn-outline-focus-fg -> button-outline-[status]-focus-border-color

  Following theme properties were removed:
  btn-group-bg
  btn-group-fg
  btn-group-separator
  btn-disabled-opacity
  btn-secondary-bg
  btn-secondary-hover-bg
  btn-secondary-active-bg
  btn-secondary-border
  btn-secondary-border-width
  btn-hero-secondary-bevel-color
  btn-hero-secondary-glow-color
  btn-hero-border-radius

  'btn-pulse' status renamed to 'button-pulse'.

  'btn-full-width' renamed to 'full-width'.
* **typography:** 'alert', 'alert-success', 'alert-info', 'alert-warning', 'alert-danger',
  'alert-primary', 'alert-hint', 'font-secondary', 'font-main',
  'font-w-light', 'font-w-regular', 'font-w-bold', 'text-primary',
  'text-warning', 'text-success', 'text-info', 'text-danger',
  'text-heading', 'text-body', 'text-hint', 'text-white', 'bg-primary',
  'bg-warning', 'bg-success', 'bg-info', 'bg-danger', 'bg-heading',
  'bg-body', 'bg-hint', 'bg-white', 'text-indent', 'blockquote',
  'blockquote-reverse', 'blockquote-footer', 'small', 'mark'.
* **context menu:** 'context-menu-border' split into 'context-menu-border-color',
  'context-menu-border-style' and 'context-menu-border-width'.

  Following theme properties were removed:
  context-menu-fg
  context-menu-bg
  context-menu-active-fg
  context-menu-active-bg
  context-menu-arrow-size
* **user:** 'isMenuShown' property removed from NbUserComponent.
  'inverse' input removed from NbUserComponent.
  'background' class renamed to 'initials'.
  NbUserComponent SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE
  size static properties were removed. Use NbComponentSize instead.

  Size class names were prefixed with 'size-'.
  small -> size-small
  medium -> size-medium
  large -> size-large
  xlarge -> size-giant

  Following properties were renamed:
  user-font-size -> user-[size]-initials-text-font-size, user-[size]-name-text-font-size, user-[size]-title-text-font-size
  user-line-height -> user-[size]-initials-text-line-height, user-[size]-name-text-line-height, user-[size]-title-text-line-height
  user-bg -> user-picture-box-background-color
  user-fg -> user-initials-text-color
  user-fg-highlight -> user-picture-box-border-color
  user-font-family-secondary -> user-name-text-font-family
  user-size-small -> user-small-height, user-small-width
  user-size-medium -> user-medium-height, user-medium-width
  user-size-large -> user-large-height, user-large-width
  user-size-xlarge -> user-giant-height, user-giant-width

  NbUserComponent 'showNameValue', 'showTitleValue', 'showInitialsValue'
  properties removed. Use 'showName', 'showTitle', 'showInitials' instead.
* **auth:** ## 1. refactor(auth): rename auth provider to strategy

  - term auth `provider` renamed to auth `strategy` to eliminate intersection with Angular providers
  - `NbDummyAuthProvider` renamed to `NbDummyAuthStrategy`
  - `NbEmailPassAuthProvider` renamed to `NbDefaultAuthStrategy`
  - `NbAbstractAuthProvider` renamed to `NbAuthStrategy`
  - `NbAuthModule.forRoot({ forms.login.provider })` changed to `NbAuthModule.forRoot({ forms.login.strategy })`
  ```
  `NbAuthModule.forRoot({
    forms: {
       login: {
         strategy: 'email', // provider -> strategy
       },
    },
  })`
  ```
  ## 2. refactor(auth): rename config to options (to conform with the rest of the app)

  `NbDummyAuthStrategyOptions` & `NbDefaultAuthStrategyOptions` are now classes with default values.
  - NbAuthModule.forRoot now takes `options` instead of `config` for a strategies
  ```
  NbAuthModule.forRoot({
    strategies: {
      email: {
        service: NbEmailPassAuthStrategy,
        options: { // was `config` previously
          ...
        },
      },
    },
  }),
  ```
  ## 3. refactor(auth): pass strategies through special `setup` method

  Refactor strategies object to array and pass strategy options through `setup` method.
  Strategy name moved inside of options object.

  - Auth module options' `strategies` list changed from a key=>value object to an array.
  So now instead of

  ```
* **theme:** `appendToLayoutTop` and `clearLayoutTop` methods was removed from `NbThemeService`. Instead of this methods, you have to use `NbOverlayService`. It's the extension of @angular/cdk overlays, so, check [documentation](https://material.angular.io/cdk/overlay/overview) first of all. 

  Basic usage of overlays may look like this:

  ```ts
  constructor(protected overlay: NbOverlayService) {
  }

  const overlayRef = overlay.create();
  const overlayComponentPortal = new ComponentPortal(MyOverlayComponent);
  overlayRef.attach(overlayComponentPortal);
  ```
* **auth:** `failWhenNoToken` has been removed from password strategy as it was still not released and becoming redundant
* **auth:** `nbAuthCreateToken` (token.ts) function now takes a third parameter, which is the `ownerStrategyName`.
  Since `nbAuthCreateToken` is a part of public API this could *potentially* introduce a breaking change.
* **auth:** `NbAuthJWTInterceptor` now always tries to refresh the token.
  Urls for token sending can be filtered using a filter function:
  ```
  { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: (req) => filter(req)},
  ```
* **chat:** `NbChatMessageComponent` constructor now has a second parameter (`NbCustomMessageService`).
* **nb-icon:** `NbIconLibraries.getSvgIcon` and `NbIconLibraries.getIcon` could return null if icon wasn't found and won't throw.
* **menu:** `NbMenuComponent` and `NbContextMenuDirective` now fire itemClick even if item with `routerLink` was clicked.
* **auth:** `NbOAuth2AuthStrategy.buildAuthHeader` return type changed from `any` to `HttpHeaders | undefined`. If the method is overridden in a derived class, update its return type as well.
* **overlay:** `NbPositionedContainer` renamed to `NbPositionedContainerComponent`.
* **range-picker:** `NbRangepickerComponent`'s `min`, `max` properties are expecting `Date` (or `moment` if using moment adapter) type. `filter` function parameter also corrected to `Date`. `NbDatepicker` now a has second generic `D` to use for `min`, `max`, and `filter` arguments. It should be set to `Date` or `moment` type.
* **router tabset:** `NbRouteTabsetComponent.tabs` property type changed from `any` to `NbRouteTab`.
  `NbRouteTabsetComponent.changeTab` property type changed from `EventEmitter<any>` to `EventEmitter<NbRouteTab>`.
  `tab` parameter type of the `NbRouteTabsetComponent.selectTab` method changed from `any` to `NbRouteTab`.
* **infinite list:** `NbScrollableContainerDimentions` class renamed to `NbScrollableContainerDimensions`.
* **sidebar:** `NbSidebarComponent.toggleResponsive` method removed. Toggle `responsive` property.
  `NbSidebarComponent`'s `STATE_EXPANDED`, `STATE_COLLAPSED`, `STATE_COMPACTED` static properties removed. Use `NbSidebarState` type values (`'expanded'`, `'collapsed'`, `'compacted'`).
  `NbSidebarComponent`'s `RESPONSIVE_STATE_MOBILE`, `RESPONSIVE_STATE_TABLET`, `RESPONSIVE_STATE_PC`  static properties removed. Use `NbSidebarResponsiveState` type values (`'mobile'`, `'tablet'`, `'pc'`).
* **toastr:** `NbToastrConfig.iconPack` property removed. You can set icon pack via `icon` property:
  ```
  const toastrConfig = {
    // ...
    icon: { icon: 'star', pack: 'eva' },
  }
  ```

  `NbToastComponent.iconPack` and `NbToastComponent.iconConfig` properties removed.
  Use `icon` property instead.
* **overlay trigger:** `NbTriggerStrategyBase`'s `isNotOnHostOrContainer`, `isOnHostOrContainer`, `isOnHost`, `isOnContainer` methods now expect `Element` instead of `Event` as the first parameter. Pass `event.target as Element` instead of `event`.
* **autocomplete:** `renderer` constructor parameter is now required.
* **auth:** `requireValidToken` set to true by default.
  Now if response contains invalid token `NbAuthIllegalTokenError` is thrown.
  To enable old behavior, set `requireValidToken: false` in the auth strategy method config, e.g.:
  ```
  NbPasswordAuthStrategy.setup({
    // ...
    login: {
      // ...
      requireValidToken: false,
    },
  });
  ```
  or
  ```
  NbOAuth2AuthStrategy.setup({
    // ...
    authorize: {
      // ...
      requireValidToken: false,
    },
  });
  ```
* **auth:** According to RFC6749 section 4.3.2, the OAuth2 token request body with grant-type='password' must provide `username` to the auth server and not `email`.
* **sidebar:** Added change detector ref constructor parameter.
* **theme:** All bootstrap override styles were moved from the @nebular/theme package to the new @nebular/bootstrap package. If you don't need bootstrap support you can simply no use this package.
  @nebular/theme package introduced a dependency of normalize.css.
  @nebular/auth package now depends on @nebular/bootstrap (temporary).

  How To Update:
  - install Nebular Bootstrap
  `npm i @nebular/bootstrap`
  - then add it into your `styles.scss`
  ```scss
  @import '~@nebular/bootstrap/styles/globals';
  // ...

  @include nb-install() {
    // ...
    @include nb-bootstrap-global();
  }
  ```
* Angular 8+ now required
* **theme:** angular2-toaster styles were removed from Nebular.
  Instead, we suggest using our new `NbToastrService`.

  To Update:
  Add `NbToastrModule` into imports of your `app.module`.
  Inject `NbToastrService` into the required component.
  call `NbToastrService.show(...)` to render toasts.
  For more information check [toastr documentation](https://akveo.github.io/nebular/docs/components/toastr).
* **select:** Arrow selector and element changed to svg icon.

  NbSelectComponent 'isOpened' getter renamed to 'isOpen'.

  NbOptionComponent and NbOptionGroupComponent 'disabledClass' getter
  renamed to 'disabledAttribute'.

  Following theme properties were renamed:
  select-border-width -> select-[appearance]-border-width
  select-max-height -> select-options-list-max-height
  select-bg -> select-[appearance]-background-color
  select-option-disabled-bg -> select-option-[appearance]-disabled-background-color
  select-option-padding -> select-option-[appearance]-[size]-padding

  Following theme properties removed:
  select-checkmark-color
  select-checkbox-color
  select-option-disabled-opacity
* Badge, button, progress bar, toastr components now use basic status as a default.
* **theme:** bootstrap button class `.btn-tn` renamed to `btn-xs`
* **checkbox:** Checkbox check mark color variable (radio-fg) is expanded.
  There are three variables instead to set a color depending a the checkbox state:
  - checkbox-checkmark - base color
  - checkbox-checked-checkmark - color when checkbox checked
  - checkbox-disabled-checkmark - color when checkbox is disabled
* **menu:** Collapsed menu icon changes direction based on current layout direction.
* **context menu:** Context menu won't close on menu item click is trigger strategy is set to `noop` (`nbContextMenuTrigger="noop"`).
* **theme:** Custom properties mode is enabled by default.

  `@nebular/theme/styles/_components.scss` file removed. Replace imports from this files with:
  ```
  @import 'theming';
  @import 'themes';
  ```

  Removes `layout-window-mode-max-width`, `tabset-tab-text-hide-breakpoint`, `route-tabset-tab-text-hide-breakpoint` theme properties. Use `$layout-window-mode-max-width`, `$tabset-tab-text-hide-breakpoint`, `$route-tabset-tab-text-hide-breakpoint` variables instead.
* **theme:** Empty string won't be converted to `basic` status anymore. If you used to set `status` properties to `''` change it to `'basic'`.

  `NbComponentStatus` type replaced with `NbComponentOrCustomStatus` in following properties: `NbActionComponent.badgeStatus`, `NbBadge.status`, `NbBadgeComponent.status`, `NbButtonComponent.status`, `NbAlertComponent.status`, `NbCardComponent.status`, `NbChatFormComponent.status`, `NbChatComponent.status`, `NbCheckboxComponent.status`, `NbFormFieldControl.status$`, `NbFormControlState.status`, `NbInputDirective.status`, `NbInputDirective.status%`, `NbSelectComponent.status`, `NbSelectComponent.status$`, `NbIconConfig.status`, `NbIconComponent.status`, `NbProgressBarComponent.status`, `NbRadioComponent.status`, `NbRadioGroupComponent.status`, `NbSpinnerDirective.spinnerStatus`, `NbSpinnerComponent.status`, `NbTabComponent.badgeStatus`, `NbToastrConfig.status`, `NbToggleComponent.status`, `NbTooltipDirective.status`, `NbTooltipComponent.context.status`, `NbUserComponent.badgeStatus`.
  If you extended listed components replace `NbComponentStatus` in the property type with `NbComponentOrCustomStatus`.

  `NbBadgeComponent`, `NbButtonComponent`, `NbAlertComponent`, `NbCardComponent`, `NbChatComponent`, `NbCheckboxComponent`, `NbInputDirective`, `NbSelectComponent`, `NbIconComponent`, `NbProgressBarComponent`, `NbRadioComponent`, `NbSpinnerComponent`, `NbToastComponent`, `NbToggleComponent`, `NbTooltipComponent` constructors now require `NbStatusService` as a constructor parameter. If you extended listed components, inject `NbStatusService` and pass it to the base class.
* **tooltip, popover:** Falsy adjustment values no longer become converted to `NbAdjustment.NOOP`, pass `NbAdjustment.NOOP` instead.
* **progress:** Following progress theme variables were renamed:
  progress-bar-height-xlg -> progress-bar-giant-height
  progress-bar-height-lg -> progress-bar-large-height
  progress-bar-height -> progress-bar-medium-height
  progress-bar-height-sm -> progress-bar-small-height
  progress-bar-height-xs -> progress-bar-tiny-height
  progress-bar-font-size-xlg -> progress-bar-giant-text-font-size
  progress-bar-font-size-lg -> progress-bar-large-text-font-size
  progress-bar-font-size -> progress-bar-medium-text-font-size
  progress-bar-font-size-sm -> progress-bar-small-text-font-size
  progress-bar-font-size-xs -> progress-bar-tiny-text-font-size
  progress-bar-radius -> progress-bar-border-radius
  progress-bar-bg -> progress-bar-[status]-background-color
  progress-bar-font-color -> progress-bar-[status]-background-color
  progress-bar-font-weight -> progress-bar-[size]-text-font-weight
  progress-bar-primary-bg -> progress-bar-[status]-background-color
  progress-bar-success-bg -> progress-bar-[status]-background-color
  progress-bar-info-bg -> progress-bar-[status]-background-color
  progress-bar-warning-bg -> progress-bar-[status]-background-color
  progress-bar-danger-bg -> progress-bar-[status]-background-color

  'progress-bar-default-bg' removed.

  Size values changed from 'xs', 'sm', 'lg', 'xlg' changed to 'tiny',
  'small', 'medium', 'large', 'giant'.

  Size classes now set on nb-progress-bar element. Also class naming
  changed to 'size-[size-name]', 'status-[status-name]'.
* **card:** Following properties were renamed:
  card-font-size -> card-text-font-size
  card-font-weight -> card-text-font-weight
  card-line-height -> card-text-line-height
  card-bg -> card-background-color
  card-border-type -> card-border-style
  card-separator -> card-divider-color
  card-header-fg -> card-header-text-color
  card-header-primary-bg -> card-header-primary-background-color
  card-header-info-bg -> card-header-info-background-color
  card-header-success-bg -> card-header-success-background-color
  card-header-warning-bg -> card-header-warning-background-color
  card-header-danger-bg -> card-header-danger-background-color
  card-header-disabled-bg -> card-header-disabled-background-color
  card-margin -> card-margin-bottom
  card-height-xxsmall -> card-height-tiny
  card-height-small -> card-height-small
  card-height-medium -> card-height-medium
  card-height-large -> card-height-large
  card-height-xlarge -> card-height-giant

  Following properties were removed:
  card-fg
  card-fg-text
  card-fg-heading
  card-header-fg-heading
  card-header-active-bg
  card-header-active-fg
  card-header-border-width
  card-header-border-type
  card-header-border-color
  card-height-xsmall
  card-height-xxlarge

  All NbCardComponent static fields were removed. Removed fields:
  SIZE_XXSMALL, SIZE_XSMALL, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE, SIZE_XXLARGE, STATUS_PRIMARY, STATUS_INFO, STATUS_SUCCESS, STATUS_WARNING, STATUS_DANGER, ACCENT_PRIMARY, ACCENT_INFO, ACCENT_SUCCESS, ACCENT_WARNING, ACCENT_DANGER.
  Use NbComponentStatus, NbComponentSize instead.

  'disabled' status replaced with disabled input. 'active' status removed.
  Card size class renamed from 'card-[size-name]' to 'size-[size-name]'.
  Card status classes were renamed from '[status-name]-card' to
  'status-[status-name]'.

  NbCardComponent 'xsmall' and 'xxlarge' getters along with 'size-xsmall'
  and 'size-xxlarge' removed.

  NbCardComponent 'xxsmall', 'small', 'medium', 'large', 'xlarge' getters
  renamed to 'tiny', 'small', 'medium', 'large', 'giant' accordingly.
* **popover:** Following properties where renamed:
  popover-fg -> popover-text-color
  popover-bg -> popover-background-color
  popover-border -> popover-border-color
* **spinner:** Following spinner theme properties were renamed:
  spinner-bg -> spinner-background-color
  spinner-circle-bg -> spinner-circle-filled-color
  spinner-fg -> spinner-text-color
  spinner-primary-bg -> spinner-primary-circle-filled-color
  spinner-info-bg -> spinner-info-circle-filled-color
  spinner-success-bg -> spinner-success-circle-filled-color
  spinner-warning-bg -> spinner-warning-circle-filled-color
  spinner-danger-bg -> spinner-danger-circle-filled-color
  spinner-xsmall -> spinner-height-tiny
  spinner-small -> spinner-height-small
  spinner-medium -> spinner-height-medium
  spinner-large -> spinner-height-large
  spinner-xlarge -> spinner-height-giant

  Following properties were removed:
  spinner-xxsmall
  spinner-xxlarge
  spinner-disabled-bg
  spinner-disabled-fg
  spinner-active-bg

  'active' and 'disabled' along with NbSpinnerComponent STATUS_ACTIVE, STATUS_DISABLED static properties statuses were removed.

  Following NbSpinnerComponent static properties were removed:
  SIZE_XXSMALL, SIZE_XSMALL, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE, SIZE_XXLARGE, STATUS_PRIMARY, STATUS_INFO, STATUS_SUCCESS, STATUS_WARNING, STATUS_DANGER.

  Classes '[size-name]-spinner' changed to 'size-[size-name]'.
  Classes '[status-name]-spinner' changed to 'status-[status-name]'.

  NbSpinnerComponent 'xxsmall' and 'xxlarge' getters removed.
* **search:** Following theme properties renamed:
  search-bg -> search-background-color
  search-bg-secondary -> search-extra-background-color
  search-text -> search-text-color
  search-info -> search-info-text-color
  search-dash -> search-divider-color
  search-placeholder -> search-placeholder-text-color

  Following theme properties removed:
  search-btn-open-fg
  search-btn-close-fg
* **layout:** Following theme properties were renamed:

  header-font-family -> header-text-font-family
  header-font-size -> header-text-font-size
  header-line-height -> header-text-line-height
  header-fg -> header-text-color
  header-bg -> header-background-color

  layout-font-family -> layout-text-font-family
  layout-font-size -> layout-text-font-size
  layout-line-height -> layout-text-line-height
  layout-fg -> layout-text-color
  layout-bg -> layout-background-color
  layout-window-mode-bg -> layout-window-mode-background-color

  footer-fg -> footer-text-color
  footer-fg-highlight -> footer-text-highlight-color
  footer-bg -> footer-background-color
  footer-separator -> footer-divider-color
* **calendar:** Following theme properties were renamed:
  calendar-header-title-font-size -> calendar-header-title-text-font-size
  calendar-header-title-font-weight -> calendar-header-title-text-font-weight
  calendar-header-sub-title-font-size -> calendar-header-sub-title-text-font-size
  calendar-header-sub-title-font-weight -> calendar-header-sub-title-text-font-weight
  calendar-selected-item-bg -> calendar-cell-selected-background-color
  calendar-hover-item-bg -> calendar-cell-hover-background-color
  calendar-today-item-bg -> calendar-cell-today-background-color
  calendar-active-item-bg -> calendar-cell-active-background-color
  calendar-fg -> calendar-text-color
  calendar-selected-fg -> calendar-cell-selected-text-color
  calendar-today-fg -> calendar-cell-today-text-color
  calendar-weekday-font-size -> calendar-weekday-text-font-size
  calendar-weekday-font-weight -> calendar-weekday-text-font-weight
  calendar-weekday-fg -> calendar-weekday-text-color
  calendar-weekday-holiday-fg -> calendar-weekday-holiday-text-color
  calendar-range-bg-in-range -> calendar-in-range-background-color

  'calendar-inactive-opacity' and 'calendar-disabled-opacity' removed.
* **datepicker:** Following theme properties were renamed:
  datepicker-fg -> datepicker-text-color
  datepicker-bg -> datepicker-background-color
  datepicker-border -> datepicker-border-color
  datepicker-border-radius -> datepicker-border-radius
* **sidebar:** Following theme properties were renamed:
  sidebar-fg -> sidebar-text-color
  sidebar-bg -> sidebar-background-color
* **stepper:** Following theme properties were renamed:
  stepper-index-size -> stepper-step-index-width
  stepper-label-font-size -> stepper-step-text-font-size
  stepper-label-font-weight -> stepper-step-text-font-weight
  stepper-completed-fg -> stepper-step-completed-text-color
  stepper-fg -> stepper-step-text-color
  stepper-step-padding -> stepper-step-content-padding

  Following theme properties were removed:
  stepper-accent-color
  stepper-completed-icon-size
  stepper-completed-icon-weight

  NbStepperOrientation changed to type.

  NbStepperComponent 'disableStepNavigationValue' property removed. Use
  'disableStepNavigation' instead.
* **tree-grid:** Following theme properties were renamed:
  tree-grid-header-bg -> tree-grid-header-background
  tree-grid-footer-bg -> tree-grid-footer-background
  tree-grid-row-bg -> tree-grid-row-background
  tree-grid-row-bg-even -> tree-grid-row-even-background
  tree-grid-row-hover-bg -> tree-grid-row-hover-background

  Following theme properties were removed:
  tree-grid-sort-header-button-font-weight
  tree-grid-sort-header-button-color
  tree-grid-icon-color
* **tooltip:** Following tooltip theme properties were renamed:
  tooltip-bg -> tooltip-background-color
  tooltip-fg -> tooltip-text-color
  tooltip-font-size -> tooltip-text-font-size
  tooltip-status-fg -> tooltip-[status]-text-color
  tooltip-primary-bg -> tooltip-primary-background-color
  tooltip-info-bg -> tooltip-info-background-color
  tooltip-success-bg -> tooltip-success-background-color
  tooltip-warning-bg -> tooltip-warning-background-color
  tooltip-danger-bg -> tooltip-danger-background-color

  Tooltip status class renamed from [status-name]-tooltip to
  status-[status-name].
* Generic value type removed from NbSelectComponent
* **accordion:** NbAccordionComponent static properties were unused and removed.
  STATUS_ACTIVE, STATUS_DISABLED, STATUS_PRIMARY, STATUS_INFO,
  STATUS_SUCCESS, STATUS_WARNING,STATUS_DANGER.

  Following theme properties were renamed:
  accordion-header-font-family -> accordion-header-text-font-family
  accordion-header-font-size -> accordion-header-text-font-size
  accordion-header-font-weight -> accordion-header-text-font-weight
  accordion-header-fg-heading -> accordion-header-text-color
  accordion-header-disabled-fg -> accordion-header-disabled-text-color
  accordion-header-border-type -> accordion-header-border-style
  accordion-item-bg -> accordion-item-background-color
  accordion-item-font-size -> accordion-item-text-font-size
  accordion-item-font-weight -> accordion-item-text-font-weight
  accordion-item-font-family -> accordion-item-text-font-family
  accordion-item-fg-text -> accordion-item-text-color
  accordion-item-shadow -> accordion-shadow

  'accordion-separator' removed.
* **actions:** NbActionsComponent 'inverseValue' field and 'inverse' setter removed.
  NbActionsComponent 'fullWidthValue' field replaced with 'fullWidth'.
  NbActionsComponent size class named renamed to 'size-[size-name]'.
  NbActionsComponent static fields SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE removed.
  NbActionComponent 'disabledValue' field replaced with 'disabled'.

  Following theme variables name were renamed:
  actions-font-size -> actions-[size]-text-font-size
  actions-font-family -> actions-text-font-family
  actions-line-height -> actions-text-line-height
  actions-fg -> actions-text-color
  actions-bg -> actions-background-color
  actions-separator -> actions-divider-color
  actions-padding -> actions-[size]-padding
  actions-size-small -> actions-small-height
  actions-size-medium -> actions-medium-height
  actions-size-large -> actions-large-height
* **alert:** NbAlertComponent 'closableValue' replaced with 'closable'.

  All NbAlertComponent static fields removed.
  SIZE_XXSMALL, SIZE_XSMALL, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE,
  SIZE_XLARGE, SIZE_XXLARGE, STATUS_ACTIVE, STATUS_DISABLED,
  STATUS_PRIMARY, STATUS_INFO, STATUS_SUCCESS, STATUS_WARNING,
  STATUS_DANGER, ACCENT_ACTIVE, ACCENT_DISABLED, ACCENT_PRIMARY,
  ACCENT_INFO, ACCENT_SUCCESS, ACCENT_WARNING, ACCENT_DANGER,
  OUTLINE_ACTIVE, OUTLINE_DISABLED, OUTLINE_PRIMARY, OUTLINE_INFO,
  OUTLINE_SUCCESS, OUTLINE_WARNING, OUTLINE_DANGE.

  Active status removed.
  Disabled become input instead of status value. Disabled class renamed to
  'disabled'.

  NbAlertComponent 'hasAccent', 'hasStatus', 'hasOutline' getters removed.

  Status class names changed to 'status-[status-name]'.
  Outline class names changed to 'outline-[status-name]'.
  Accent class names changed to 'accent-[status-name]'.

  Following theme properties were renamed:

  alert-font-size -> alert-text-font-size
  alert-line-height -> alert-text-line-height
  alert-font-weight -> alert-text-font-weight
  alert-fg -> alert-text-color
  alert-bg -> alert-background-color
  alert-disabled-bg -> alert-disabled-background-color
  alert-disabled-fg -> alert-disabled-text-color
  alert-primary-bg -> alert-primary-background-color
  alert-info-bg -> alert-info-background-color
  alert-success-bg -> alert-success-background-color
  alert-warning-bg -> alert-warning-background-color
  alert-danger-bg -> alert-danger-background-color
  alert-height-xsmall -> alert-tiny-height
  alert-height-small -> alert-small-height
  alert-height-medium -> alert-medium-height
  alert-height-large -> alert-medium-padding
  alert-height-xlarge -> alert-large-height
  alert-closable-padding -> alert-closable-start-padding
  alert-margin -> alert-bottom-margin

  Following theme properties removed:
  alert-outline-fg
  alert-active-bg
  alert-height-xxsmall
  alert-height-xxlarge
  alert-button-padding
* **badge:** NbBadgeComponent status static fields removed.
  STATUS_PRIMARY, STATUS_INFO, STATUS_SUCCESS, STATUS_WARNING,
  STATUS_DANGER.

  NbBadgeComponent position static fields replaced with NbBadgePosition type.
  Removed properties: TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT,
  TOP_START, TOP_END, BOTTOM_START, BOTTOM_END.

  Badge status class now set on host element

  NbBadgeComponent 'positionClass' getter removed.
  Badge position class set on host element.
  Position class names prefixed with 'position-'.

  Following theme properties were renamed:
  badge-fg-text -> badge-[status]-text-color
  badge-primary-bg-color -> badge-primary-background-color
  badge-success-bg-color -> badge-success-background-color
  badge-info-bg-color -> badge-info-background-color
  badge-warning-bg-color -> badge-warning-background-color
  badge-danger-bg-color -> badge-danger-background-color
* **chat:** NbChatComponent 'accent' field removed.

  NbChatComponent sizes 'xxsmall' and 'xxlarge' removed.
  'xsmall' size changed to 'tiny', 'xlarge' changed to 'giant'.
  Size class changed to 'size-[size-name]'.
  All size static fields removed (SIZE_XXSMALL, SIZE_XSMALL, SIZE_SMALL,
  SIZE_MEDIUM, SIZE_LARGE, SIZE_XLARGE, SIZE_XXLARGE).

  NbChatComponent 'active' status removed.

  Disabled status removed. Use disabled input instead.

  Status class names changed to 'status-[status-name]'.

  NbChatMessageComponent 'replyValue' changed to 'reply'.

  Following theme properties removed:

  chat-font-size -> chat-text-font-size
  chat-fg -> chat-text-color
  chat-bg -> chat-background-color
  chat-height-xsmall -> chat-tiny-height
  chat-height-small -> chat-small-height
  chat-height-medium -> chat-medium-height
  chat-height-large -> chat-large-height
  chat-height-xlarge -> chat-giant-height
  chat-separator -> chat-divider-color
  chat-message-fg -> chat-message-text-color
  chat-message-bg -> chat-message-background
  chat-message-reply-bg -> chat-message-reply-background-color
  chat-message-reply-fg -> chat-message-reply-text-color
  chat-message-avatar-bg -> chat-message-avatar-background-color
  chat-message-sender-fg -> chat-message-sender-text-color
  chat-message-quote-fg -> chat-message-quote-background-color
  chat-message-quote-bg -> chat-message-quote-text-color
  chat-message-file-fg -> chat-message-file-text-color
  chat-message-file-bg -> chat-message-file-background-color
  chat-primary-bg -> chat-primary-background-color
  chat-success-bg -> chat-success-background-color
  chat-info-bg -> chat-info-background-color
  chat-warning-bg -> chat-warning-background-color
  chat-danger-bg -> chat-danger-background-color

  Following theme properties removed:

  chat-fg-text
  chat-height-xxsmall
  chat-height-xxlarge
  chat-form-bg
  chat-form-fg
  chat-form-border
  chat-form-placeholder-fg
  chat-form-active-border
  chat-disabled-bg
  chat-disabled-fg
  chat-active-bg
* **icon:** NbIconComponent status static fields removed.
  STATUS_PRIMARY, STATUS_INFO, STATUS_SUCCESS, STATUS_WARNING, STATUS_DANGER.
  'status' field now uses common NbComponentStatus type.

  NbIconComponent static class names renamed to 'status-[status-name]'.

  Following theme properties were renamed:
  icon-primary-fg -> icon-primary-color
  icon-info-fg -> icon-info-color
  icon-success-fg -> icon-success-color
  icon-warning-fg -> icon-warning-color
  icon-danger-fg -> icon-danger-color
* **cdk:** NbPlatform and NbScrollStrategyOptions from theme/components/cdk/overlay/mapping.ts removed. Use NbPlatform from theme/components/cdk/platform/platform-service.ts and NbScrollStrategyOptions from theme/components/cdk/adapter/block-scroll-strategy-adapter.ts.
  NbPlatformModule removed.
* **tabset:** NbTabset theme properties prefix changed to 'tabset'.

  Following properties were renamed:
  tabs-font-family -> tabset-tab-text-font-family
  tabs-font-size -> tabset-tab-text-font-size
  tabs-content-font-family -> tabset-content-text-font-family
  tabs-content-font-size -> tabset-content-text-font-size
  tabs-active-bg -> tabset-tab-selected-background-color
  tabs-padding -> tabset-tab-padding
  tabs-content-padding -> tabset-content-padding
  tabs-header-bg -> tabset-tab-background-color
  tabs-separator -> tabset-divider-color
  tabs-fg -> tabset-tab-text-color
  tabs-fg-disabled -> tabset-tab-disabled-text-color
  tabs-fg-text -> tabset-content-text-color
  tabs-fg-heading -> tabset-tab-selected-text-color, tabset-tab-focus-text-color, tabset-tab-hover-text-color
  tabs-bg -> tabset-content-background-color
  tabs-selected -> tabset-tab-underline-color
  tabs-icon-only-max-width -> tabset-tab-text-hide-breakpoint

  Following properties were removed:
  tabs-active-font-weight
  tabs-selected-second-color
  tabs-selected-degrees

  NbRouteTabset theme properties prefix changed to 'route-tabset'.

  Following properties were renamed:
  route-tabs-font-family -> route-tabset-tab-text-font-family
  route-tabs-font-size -> route-tabset-tab-text-font-size
  route-tabs-active-bg -> route-tabset-tab-selected-background-color
  route-tabs-active-font-weight ->
  route-tabs-padding -> route-tabset-tab-padding
  route-tabs-header-bg -> route-tabset-tab-background-color
  route-tabs-separator -> route-tabset-divider-color
  route-tabs-fg -> route-tabset-tab-text-color
  route-tabs-fg-disabled -> route-tabset-tab-disabled-text-color
  route-tabs-fg-heading -> route-tabset-tab-selected-text-color, route-tabset-tab-focus-text-color,
  route-tabset-tab-hover-text-color
  route-tabs-selected -> route-tabset-tab-underline-color
  route-tabs-icon-only-max-width -> route-tabset-tab-text-hide-breakpoint

  'route-tabs-bg' property was unused and removed.
* **toastr:** NbToastStatus enum removed. Toastr now uses common NbComponentstatus type.

  NbToastComponent status class names changed to 'status-[status-name]'.
  'default' class removed.

  Following theme properties were renamed:
  toastr-bg -> toastr-background
  toastr-fg -> toastr-text-color
  toastr-border -> toastr-border-style, toastr-border-width

  'toastr-icon-radius' removed.
* **auth:** now if login/register returns no value for token, unsuccessful NbAuthResult is returned
* **select:** Only 'null' and 'undefined' option values now considered as reset. false and falsy values such as 0, '', NaN don't reset select value anymore.
* Popover:
  'nbPopoverMode' input removed. Use 'nbPopoverTrigger' instead.
  NbPopoverDirective 'mode' property removed. Use 'trigger' instead.

  NbSelectComponent 'selectionChange' removed. Use nb-select (selected)
  binding to track selection change and <nb-option (click)=""> to track
  option click.
* **tabset:** Possibly a breaking change since tabs won't be bold in hover state.
* **auth:** possibly a breaking change since we don't use bootstrap inputs and buttons anymore
  and use Nebular components instead
  also OnPush added to the components
* **autocomplete:** Removed `focusInputOnValueChange` from `NbAutocompleteDirective`. Now autocomplete focuses input only when value is selected by option click or keyboard selection.
* **menu:** Removed inverse mode.

  NbMenuComponent 'autoCollapseValue' property changed to 'autoCollapse'.

  Following theme variables were removed:
  menu-font-family -> menu-text-font-family
  menu-font-size -> menu-text-font-size
  menu-font-weight -> menu-text-font-weight
  menu-fg -> menu-text-color
  menu-bg -> menu-background-color
  menu-active-fg -> menu-item-active-text-color
  menu-active-bg -> menu-item-active-background-color
  menu-submenu-bg -> menu-submenu-background-color
  menu-submenu-fg -> menu-submenu-text-color
  menu-submenu-active-fg -> menu-submenu-item-active-text-color
  menu-submenu-active-bg -> menu-submenu-item-active-background-color
  menu-submenu-active-border-color -> menu-submenu-item-active-border-color
  menu-submenu-hover-fg -> menu-item-hover-text-color
  menu-submenu-hover-bg -> menu-item-hover-background-color
  menu-group-fg -> menu-group-text-color
  menu-item-separator -> menu-item-divider-color
  menu-icon-font-size -> menu-item-icon-width
  menu-icon-margin -> menu-item-icon-margin
  menu-icon-color -> menu-item-icon-color
  menu-icon-active-color -> menu-item-icon-active-color

  Following theme properties were removed:
  menu-submenu-active-shadow
  menu-active-font-weight
  menu-submenu-item-container-padding
  menu-group-font-weight
  menu-group-font-size
  menu-group-padding
* **auth:** Replace `~@nebular/auth/styles/all` with `~@nebular/auth/styles/globals`.
* **deps:** Requires `@angular/fire` 6.1.0+ and `firebase` 8.0.0+.
* **dependencies:** since bootstrap is updated please look through the bootstrap release notes (https://github.com/twbs/bootstrap/releases) for proper steps to update your styles
* **icons:** Starting from version 4.0, Nebular introduces new `nb-icon` component and `NbIconLibraries` service to host SVG and Font icon packs. As a breaking change, Nebular moves from `nebular-icons` package to much more popular [Eva Icons pack](https://akveo.github.io/eva-icons/) consisting of 480+ beautiful SVG icons. We believe this will bring more quality and variety to interfaces based on Nebular.

  Now all Nebular components internally use `<nb-icon></nb-icon>` component utilizing Eva Icons SVG icons. More details on [nb-icon](https://akveo.github.io/nebular/docs/components/icon) component.

  There are two ways to upgrade:
  **Migrate to Eva Icons** (recommended):
  1) install Eva Icons Nebular package `npm i @nebular/eva-icons`
  2) register `NbEvaIconsModule` in the `app.module.ts`
  ```
  import { NbEvaIconsModule } form '@nebular/eva-icons';

  @NgModule({
    imports: [
    	// ...
      NbEvaIconsModule,
    ],
  })
  ```
  3) Search for all usages of `<span icon="nb-*"` or ``<i icon="nb-*"``and replace with `<nb-icon icon="icon-name"></nb-icon>`. Full icons list https://akveo.github.io/eva-icons/.

  4) Search for `icon: 'nb-*'` references in properties for such components as Menu, Actions, Tabs, etc. Replace those with `icon: 'icon-name'`. Please note, there is no need to specify any icon prefix (such as `eva-` or `nb-`) since prefix is specified when the icon package is registered in Nebular.

  4) Update styles if necessary.

  5) if you have `nebular-icons` installed, remove the package and all references.

  **Continue using nebular-icons**
  This option is also possible, but please note, Nebular Component will still use Eva Icons pack for internal component icons, such as `close`, `arrow-down`, `arrow-up`, etc.

  1) Register nebular-icons as a pack for Nebular in your `app.component.ts`
  ```
    import { NbIconLibraries } from '@nebular/theme';

    constructor(private iconLibraries: NbIconLibraries) {
      this.iconLibraries.registerFontPack('nebular', { iconClassPrefix: 'nb' });
      this.iconLibraries.setDefaultPack('nebular');
    }
  ```

  3) Search for all usages of `<span icon="nb-*"` or ``<i icon="nb-*"`` and replace with `<nb-icon icon="icon-name"></nb-icon>` without the `nb-` prefix  since prefix is specified when the icon package is registered in Nebular.

  4) Search for `icon: 'nb-*'` references in properties for such components as Menu, Actions, Tabs, etc. Replace those with `icon: 'icon-name'` without `nb-` prefix since it is unnecessary and covered under the hood.

  Please open an issue if you have any questions or having difficulties to migrate.
* **menu:** The `NbMenuService` not reply the last click event.

  To Update:
  if you use the knowledge that the last click event is replied you can wrap `onItemClick` stream in the custom stream based on `ReplaySubject`.
* **overlay:** Theme property 'overlay-backdrop-bg' renamed to 'overlay-backdrop-background-color'.
* **menu:** URL fragment no longer affects menu items selection.
  Now we only find matches between path part of the URL and `link` property of menu-item.

<a name="17.0.0"></a>

# [17.0.0](https://github.com/akveo/nebular/compare/v16.0.0...v17.0.0) (2026-01-14)

- update angular to v21 ([#3306](https://github.com/akveo/nebular/issues/3306)) ([379b67f](https://github.com/akveo/nebular/commit/379b67f))

<a name="16.0.0"></a>

# [16.0.0](https://github.com/akveo/nebular/compare/v15.0.0...v16.0.0) (2025-10-01)

- **angular:** update to Angular 20 ([#3293](https://github.com/akveo/nebular/pull/3293)) ([cb07c27](https://github.com/akveo/nebular/commit/cb07c27))

<a name="15.0.0"></a>

# [15.0.0](https://github.com/akveo/nebular/compare/v14.0.2...v15.0.0) (2025-02-16)

- **angular:** update to Angular 19 ([#3280](https://github.com/akveo/nebular/pull/3280)) ([58f0db9](https://github.com/akveo/nebular/commit/58f0db9))

<a name="14.0.2"></a>

## [14.0.2](https://github.com/akveo/nebular/compare/v14.0.1...v14.0.2) (2024-11-05)

### Bug Fixes

- **theme:** sass deprecation warning of strict unary operations ([#3271](https://github.com/akveo/nebular/issues/3271)) ([364d6da](https://github.com/akveo/nebular/commit/364d6da))

<a name="14.0.1"></a>

## [14.0.1](https://github.com/akveo/nebular/compare/v13.0.0...v14.0.1) (2024-10-23)

### Bug Fixes

- **NbTreeGrid:** Add a provide for CDK_TABLE ([#3265](https://github.com/akveo/nebular/issues/3265)) ([63d1d6c](https://github.com/akveo/nebular/commit/63d1d6c))

<a name="14.0.0"></a>

# [14.0.0](https://github.com/akveo/nebular/compare/v13.0.0...v14.0.0) (2024-08-07)

### Features

- **angular:** update to Angular 18 ([#3262](https://github.com/akveo/nebular/pull/3262)) ([b666898](https://github.com/akveo/nebular/commit/b666898))

<a name="13.0.0"></a>

# [13.0.0](https://github.com/akveo/nebular/compare/v12.0.0...v13.0.0) (2024-01-28)

### Features

- **angular:** update to Angular 17 ([#3236](https://github.com/akveo/nebular/issues/3236)) ([bced0eb](https://github.com/akveo/nebular/commit/bced0eb))

<a name="12.0.0"></a>

# [12.0.0](https://github.com/akveo/nebular/compare/v11.0.1...v12.0.0) (2023-11-09)

### Bug Fixes

- **docs:** fix docs deployment ([#3218](https://github.com/akveo/nebular/issues/3218)) ([96968a6](https://github.com/akveo/nebular/commit/96968a6))

### Features

- **angular:** update to Angular 16 ([#3222](https://github.com/akveo/nebular/issues/3222)) ([c19e6bd](https://github.com/akveo/nebular/commit/c19e6bd))
- add firstDayOfWeek to datepickers ([#3220](https://github.com/akveo/nebular/issues/3220)) ([5923384](https://github.com/akveo/nebular/commit/5923384))

<a name="11.0.1"></a>

## [11.0.1](https://github.com/akveo/nebular/compare/v11.0.0...v11.0.1) (2023-09-06)

### Features

- **select-with-autocomplete:** add search when multi ([#3204](https://github.com/akveo/nebular/issues/3204)) ([8792f84](https://github.com/akveo/nebular/commit/8792f84))

<a name="11.0.0"></a>

# [11.0.0](https://github.com/akveo/nebular/compare/v10.0.0...v11.0.0) (2023-03-29)

### Bug Fixes

- **autocomplete:** fix show options for the autocomplete ([#3152](https://github.com/akveo/nebular/issues/3152)) ([a693caf](https://github.com/akveo/nebular/commit/a693caf))
- **docs:** remove bootstrap from docs ([#3164](https://github.com/akveo/nebular/issues/3164)) ([b711f1d](https://github.com/akveo/nebular/commit/b711f1d))

### Features

- update to Angular 15 ([#3163](https://github.com/akveo/nebular/issues/3163)) ([f3098ea](https://github.com/akveo/nebular/commit/f3098ea))

<a name="10.0.0"></a>

# [10.0.0](https://github.com/akveo/nebular/compare/v9.1.0-rc.8...v10.0.0) (2022-12-02)

### BREAKING CHANGES

- **bootstrap:** remove `bootstrap`, `ng-bootstrap` packages, remove `bootstrap` from `playground/without-styles/bootstrap`. `ng-bootstrap` doesn't support Angular v14.2.x ([#3146](https://github.com/akveo/nebular/issues/3146)) ([f3f05ce](https://github.com/akveo/nebular/commit/f3f05ce))

### Features

- update to Angular 14.2.x ([#3143](https://github.com/akveo/nebular/issues/3143)) ([275edf3](https://github.com/akveo/nebular/commit/275edf3))

#### Other

- Minimal required Angular version is `14.2.x`

<a name="9.1.0-rc.8"></a>

# [9.1.0-rc.8](https://github.com/akveo/nebular/compare/v9.1.0-rc.7...v9.1.0-rc.8) (2022-11-17)

### Features

- **menu component:** improve accessibility ([#3136](https://github.com/akveo/nebular/issues/3136)) ([7ce24c0](https://github.com/akveo/nebular/commit/7ce24c0))
- **timepicker:** add disabled state ([#3127](https://github.com/akveo/nebular/issues/3127)) ([7af5a8d](https://github.com/akveo/nebular/commit/7af5a8d))

<a name="9.1.0-rc.7"></a>

# [9.1.0-rc.7](https://github.com/akveo/nebular/compare/v9.1.0-rc.6...v9.1.0-rc.7) (2022-10-10)

### Bug Fixes

- **themes:** fix typo in layout component style ([#3098](https://github.com/akveo/nebular/issues/3098)) ([5740682](https://github.com/akveo/nebular/commit/5740682))

### Features

- **datepicker:** improve date and time inputs combination ([#3117](https://github.com/akveo/nebular/issues/3117)) ([8387967](https://github.com/akveo/nebular/commit/8387967))

<a name="9.1.0-rc.6"></a>

# [9.1.0-rc.6](https://github.com/akveo/nebular/compare/v9.1.0-rc.5...v9.1.0-rc.6) (2022-09-22)

### Bug Fixes

- **select-with-autocomplete:** fix select autocomplete width ([#3113](https://github.com/akveo/nebular/issues/3113)) ([078c9f3](https://github.com/akveo/nebular/commit/078c9f3))

<a name="9.1.0-rc.5"></a>

# [9.1.0-rc.5](https://github.com/akveo/nebular/compare/v9.1.0-rc.4...v9.1.0-rc.5) (2022-09-15)

### Bug Fixes

- **select-with-autocomplete:** improve select open after input changed ([#3110](https://github.com/akveo/nebular/issues/3110)) ([eaa036b](https://github.com/akveo/nebular/commit/eaa036b))

<a name="9.1.0-rc.4"></a>

# [9.1.0-rc.4](https://github.com/akveo/nebular/compare/v9.1.0-rc.3...v9.1.0-rc.4) (2022-09-09)

### Features

- **input:** add more input color options ([#3108](https://github.com/akveo/nebular/issues/3108)) ([54da714](https://github.com/akveo/nebular/commit/54da714))

<a name="9.1.0-rc.3"></a>

# [9.1.0-rc.3](https://github.com/akveo/nebular/compare/v9.1.0-rc.2...v9.1.0-rc.3) (2022-09-08)

### Bug Fixes

- **select-with-autocomplete:** fix first render with disabled autocomplete ([#3104](https://github.com/akveo/nebular/issues/3104)) ([efcd690](https://github.com/akveo/nebular/commit/efcd690))

<a name="9.1.0-rc.2"></a>

# [9.1.0-rc.2](https://github.com/akveo/nebular/compare/v9.1.0-rc.1...v9.1.0-rc.2) (2022-08-31)

### Features

- add keyboad navigation to select with autocomplete ([#3097](https://github.com/akveo/nebular/issues/3097)) ([c52fe3a](https://github.com/akveo/nebular/commit/c52fe3a))

<a name="9.1.0-rc.1"></a>

# [9.1.0-rc.1](https://github.com/akveo/nebular/compare/v9.0.3...v9.1.0-rc.1) (2022-08-04)

### Bug Fixes

- **timepicker:** change position adjustment to "counterclockwise" ([#3085](https://github.com/akveo/nebular/issues/3085)) ([a546295](https://github.com/akveo/nebular/commit/a546295))

### Features

- **select:** options search ([#3091](https://github.com/akveo/nebular/issues/3091)) ([ff4f738](https://github.com/akveo/nebular/commit/ff4f738))

<a name="9.0.3"></a>

## [9.0.3](https://github.com/akveo/nebular/compare/v9.0.2...v9.0.3) (2022-05-26)

### Bug Fixes

- **select:** disable opening disabled select after clicking on content ([#3068](https://github.com/akveo/nebular/issues/3068)) ([1c6ef1b](https://github.com/akveo/nebular/commit/1c6ef1b))

<a name="9.0.2"></a>

## [9.0.2](https://github.com/akveo/nebular/compare/v9.0.1...v9.0.2) (2022-04-07)

### Bug Fixes

- **datepicker:** fix initial value render ([#3050](https://github.com/akveo/nebular/issues/3050)) ([e821643](https://github.com/akveo/nebular/commit/e821643))

<a name="9.0.1"></a>

## [9.0.1](https://github.com/akveo/nebular/compare/v9.0.0...v9.0.1) (2022-01-31)

### Bug Fixes

- **overlay:** take 1 on stable event ([#3013](https://github.com/akveo/nebular/issues/3013)) ([a73351a](https://github.com/akveo/nebular/commit/a73351a))
- **components:** memory leaks ([#3000](https://github.com/akveo/nebular/issues/3000)) ([d6374b1](https://github.com/akveo/nebular/commit/d6374b1))

<a name="9.0.0"></a>

# [9.0.0](https://github.com/akveo/nebular/compare/v8.0.0...v9.0.0) (2021-12-01)

### BREAKING CHANGES

#### Theming

[CSS custom properties mode](https://akveo.github.io/nebular/docs/design-system/enable-css-properties-mode#enable-css-custom-properties-mode) for theming is enabled by default since Angular dropped support for Internet Explorer and also removed the ability to use `node-sass` to compile sass. Read [details and how to opt-out here](https://github.com/akveo/nebular/pull/2965#issuecomment-983725891).
This change doesn't affect users who use prebuilt Nebular themes. For prebult themes users we also ship prebuilt themes with custom properties. See usage guide [here](https://github.com/akveo/nebular/pull/2977#issuecomment-984515416).

#### API changes

- `@nebular/theme/styles/_components.scss` file removed. Replace imports from this files with:
  ```
  @import '@nebular/theme/styles/theming';
  @import '@nebular/theme/styles/themes';
  ```
- `layout-window-mode-max-width`, `tabset-tab-text-hide-breakpoint`, `route-tabset-tab-text-hide-breakpoint` theme properties removed. [Migration guide](https://github.com/akveo/nebular/pull/2965#issuecomment-984410175).
- **overlay trigger:** `NbTriggerStrategyBase`'s `isNotOnHostOrContainer`, `isOnHostOrContainer`, `isOnHost`, `isOnContainer` methods now expect `Element` instead of `Event` as the first parameter. Pass `event.target as Element` instead of `event`.
- **sidebar:**
  - `NbSidebarComponent.toggleResponsive` method removed. Change method call to `sidebar.responsive = !sidebar.responsive`.
  - `STATE_EXPANDED`, `STATE_COLLAPSED`, `STATE_COMPACTED` static properties removed. Use `NbSidebarState` type values (`'expanded'`, `'collapsed'`, `'compacted'`).
  - `RESPONSIVE_STATE_MOBILE`, `RESPONSIVE_STATE_TABLET`, `RESPONSIVE_STATE_PC` static properties removed. Use `NbSidebarResponsiveState` type values (`'mobile'`, `'tablet'`, `'pc'`).
- **router tabset:**
  - `NbRouteTabsetComponent.tabs` property type changed from `any` to `NbRouteTab`.
  - `NbRouteTabsetComponent.changeTab` property type changed from `EventEmitter<any>` to `EventEmitter<NbRouteTab>`.
  - `tab` parameter type of the `NbRouteTabsetComponent.selectTab` method changed from `any` to `NbRouteTab`.
- **infinite list:** `NbScrollableContainerDimentions` class renamed to `NbScrollableContainerDimensions`. Use updated class name.
- **auth:** `NbOAuth2AuthStrategy.buildAuthHeader` return type changed from `any` to `HttpHeaders | undefined`. If the method is overridden in a derived class, update its return type as well.
- **autocomplete:** `focusInputOnValueChange` property removed from `NbAutocompleteDirective` class. Now autocomplete focuses input only when value is selected by option click or via keyboard.
- **range-picker:**
  - `NbRangepickerComponent`'s `min`, `max` properties are expecting `Date` (or `moment` if using moment adapter) type. `filter` function parameter also corrected to `Date`.
  - `NbDatepicker` now a has second generic `D` to use for `min`, `max`, and `filter` arguments. It should be set to `Date` or `moment` type.
- **context menu:** Context menu won't close on menu item click if trigger strategy is set to `noop` (`nbContextMenuTrigger="noop"`).

#### Other

- Minimal required Angular version is `13`

### Features

- **auth:** ability to add additional request headers ([#2825](https://github.com/akveo/nebular/issues/2825)) ([3959848](https://github.com/akveo/nebular/commit/3959848))
- **chat:** ability to provide template as chat title ([#2920](https://github.com/akveo/nebular/issues/2920)) ([9ccec64](https://github.com/akveo/nebular/commit/9ccec64))
- **date-time picker:** ability to remove now button ([#2848](https://github.com/akveo/nebular/issues/2848)) ([a2c9d10](https://github.com/akveo/nebular/commit/a2c9d10))
- **date-time picker:** add `dateTimeChange` output ([#2816](https://github.com/akveo/nebular/issues/2816)) ([73a6b5a](https://github.com/akveo/nebular/commit/73a6b5a))
- **datepicker:** allow to change adjustment ([#2806](https://github.com/akveo/nebular/issues/2806)) ([a3b5ae5](https://github.com/akveo/nebular/commit/a3b5ae5))
- **icon:** add support for ligature icons ([#2951](https://github.com/akveo/nebular/issues/2951)) ([b89339d](https://github.com/akveo/nebular/commit/b89339d))
- **infinite list:** threshold emissions throttling ([#2948](https://github.com/akveo/nebular/issues/2948)) ([718dd0a](https://github.com/akveo/nebular/commit/718dd0a))
- **layout:** add nbLtr and nbRtl directives ([#2927](https://github.com/akveo/nebular/issues/2927)) ([35a7ad1](https://github.com/akveo/nebular/commit/35a7ad1))
- **layout:** added error message if layout not provided ([#2778](https://github.com/akveo/nebular/issues/2778)) ([7c12874](https://github.com/akveo/nebular/commit/7c12874))
- **router tabset:** ability to configure `routerLinkActiveOptions` per tab ([#2907](https://github.com/akveo/nebular/issues/2907)) ([276d610](https://github.com/akveo/nebular/commit/276d610))
- **select, autocomplete:** ability to override options width ([#2874](https://github.com/akveo/nebular/issues/2874)) ([e30e00c](https://github.com/akveo/nebular/commit/e30e00c))
- **stepper:** add step change event ([#2779](https://github.com/akveo/nebular/issues/2779)) ([1b871f4](https://github.com/akveo/nebular/commit/1b871f4))
- **tabset:** ability to provide template as tab label ([#2829](https://github.com/akveo/nebular/issues/2829)) ([d56a492](https://github.com/akveo/nebular/commit/d56a492))
- **theme:** enable CSS custom properties mode by default ([#2965](https://github.com/akveo/nebular/issues/2965)) ([3a88e9b](https://github.com/akveo/nebular/commit/3a88e9b))
- **theme:** add prebuilt themes with custom properties ([#2977](https://github.com/akveo/nebular/issues/2977)) ([ff0b034](https://github.com/akveo/nebular/commit/ff0b034))
- **toastr:** add onclick, onclose events ([#2821](https://github.com/akveo/nebular/issues/2821)) ([3795905](https://github.com/akveo/nebular/commit/3795905))
- **tooltip, popover:** add disabled property ([#2841](https://github.com/akveo/nebular/issues/2841)) ([b7fe861](https://github.com/akveo/nebular/commit/b7fe861))
- **window:** ability to hide close button ([#2952](https://github.com/akveo/nebular/issues/2952)) ([ad64fe2](https://github.com/akveo/nebular/commit/ad64fe2))
- **window:** add component instance property to window ref ([#2858](https://github.com/akveo/nebular/issues/2858)) ([fcf1a08](https://github.com/akveo/nebular/commit/fcf1a08))
- **window:** template as window title ([#2915](https://github.com/akveo/nebular/issues/2915)) ([8eaf460](https://github.com/akveo/nebular/commit/8eaf460))
- **window:** window may return result ([#2869](https://github.com/akveo/nebular/issues/2869)) ([95247a4](https://github.com/akveo/nebular/commit/95247a4))
- update to Angular 13 ([#2944](https://github.com/akveo/nebular/issues/2944)) ([ed8cd04](https://github.com/akveo/nebular/commit/ed8cd04))

### Bug Fixes

- **autocomplete:** handle null and undefined values ([#2814](https://github.com/akveo/nebular/issues/2814)) ([7753027](https://github.com/akveo/nebular/commit/7753027))
- **autocomplete:** input focus behavior on value change ([#2852](https://github.com/akveo/nebular/issues/2852)) ([a86da11](https://github.com/akveo/nebular/commit/a86da11))
- **button:** prevent expression changed error on icon button ([#2846](https://github.com/akveo/nebular/issues/2846)) ([baee608](https://github.com/akveo/nebular/commit/baee608))
- **button group:** prevent unpress in single mode button group ([#2860](https://github.com/akveo/nebular/issues/2860)) ([4b8a430](https://github.com/akveo/nebular/commit/4b8a430))
- **chat:** file drop in firefox ([#2776](https://github.com/akveo/nebular/issues/2776)) ([07db7f5](https://github.com/akveo/nebular/commit/07db7f5))
- **checkbox:** don't style user icons in checkbox ([#2857](https://github.com/akveo/nebular/issues/2857)) ([a94a867](https://github.com/akveo/nebular/commit/a94a867))
- **context menu:** don't close on item click with noop strategy ([#2875](https://github.com/akveo/nebular/issues/2875)) ([a76fccf](https://github.com/akveo/nebular/commit/a76fccf))
- **context menu:** prevent close on expand icon click ([#2923](https://github.com/akveo/nebular/issues/2923)) ([2b7f60c](https://github.com/akveo/nebular/commit/2b7f60c))
- **datapicker:** input update issue with reactive forms ([#2945](https://github.com/akveo/nebular/issues/2945)) ([07527f8](https://github.com/akveo/nebular/commit/07527f8))
- **flip card:** prevent extra whitespace ([#2854](https://github.com/akveo/nebular/issues/2854)) ([e8fa95b](https://github.com/akveo/nebular/commit/e8fa95b))
- **focus trigger strategy:** detect click out via activeElement ([#2865](https://github.com/akveo/nebular/issues/2865)) ([1f8e0cb](https://github.com/akveo/nebular/commit/1f8e0cb))
- **focus trigger strategy clickout:** consider click target ([#2885](https://github.com/akveo/nebular/issues/2885)) ([a5f695a](https://github.com/akveo/nebular/commit/a5f695a))
- **moment date service:** use locale format by default ([#2856](https://github.com/akveo/nebular/issues/2856)) ([491c696](https://github.com/akveo/nebular/commit/491c696))
- **range-picker:** correct type for min, max, filter properties ([#2877](https://github.com/akveo/nebular/issues/2877)) ([73cdec0](https://github.com/akveo/nebular/commit/73cdec0))
- **route tabset:** support icon config object ([#2810](https://github.com/akveo/nebular/issues/2810)) ([ff00a16](https://github.com/akveo/nebular/commit/ff00a16))
- **scroll service:** listen position requests right after layout created ([#2949](https://github.com/akveo/nebular/issues/2949)) ([74d64cf](https://github.com/akveo/nebular/commit/74d64cf))
- **select:** add ellipsis on selection view ([#2809](https://github.com/akveo/nebular/issues/2809)) ([9b525f4](https://github.com/akveo/nebular/commit/9b525f4))
- **select:** correctly handle reset value when multiple is on ([#2815](https://github.com/akveo/nebular/issues/2815)) ([37a0bc2](https://github.com/akveo/nebular/commit/37a0bc2))
- **select:** scroll into selected option on open ([#2859](https://github.com/akveo/nebular/issues/2859)) ([1c02e15](https://github.com/akveo/nebular/commit/1c02e15))
- **select, autocomplete:** don't open overlay without options ([#2930](https://github.com/akveo/nebular/issues/2930)) ([fca5cd1](https://github.com/akveo/nebular/commit/fca5cd1))
- **tabset:** lazy loading ([#2827](https://github.com/akveo/nebular/issues/2827)) ([a51513c](https://github.com/akveo/nebular/commit/a51513c))
- **tag list:** prevent initialisation error in Universal ([#2937](https://github.com/akveo/nebular/issues/2937)) ([e6a8ba0](https://github.com/akveo/nebular/commit/e6a8ba0))
- **theme:** correct custom properties subtraction ([#2932](https://github.com/akveo/nebular/issues/2932)) ([4e63abc](https://github.com/akveo/nebular/commit/4e63abc))
- **theme:** set scrollbars corner color ([#2943](https://github.com/akveo/nebular/issues/2943)) ([1447b15](https://github.com/akveo/nebular/commit/1447b15))
- **tooltip, popover, context menu:** correct physical positions in RTL ([#2819](https://github.com/akveo/nebular/issues/2819)) ([0959935](https://github.com/akveo/nebular/commit/0959935))

### Code Refactoring

- **overlay trigger:** accept element instead event ([#2974](https://github.com/akveo/nebular/issues/2974)) ([2137969](https://github.com/akveo/nebular/commit/2137969))
- **sidebar:** remove deprecated properties ([#2973](https://github.com/akveo/nebular/issues/2973)) ([0ba32cd](https://github.com/akveo/nebular/commit/0ba32cd))

<a name="8.0.0"></a>

# [8.0.0](https://github.com/akveo/nebular/compare/v7.0.0...v8.0.0) (2021-06-27)

### BREAKING CHANGES

- Minimal required Angular version to `12`.
- Minimal required `tslib` version is `2.1.0`.
- `NbTable` and `NbTreeGridComponent`:
  - `_viewRepeater`, `_coalescedStyleScheduler` constructor parameters are now required.
  - New parameters (`_viewportRuler`, `_stickyPositioningListener`) added to the constructor.
- **chat:** `NbChatMessageComponent` constructor now has a second parameter (`NbCustomMessageService`).

### Bug Fixes

- **button:** styling for disabled anchor ([#2649](https://github.com/akveo/nebular/issues/2649)) ([19a5b43](https://github.com/akveo/nebular/commit/19a5b43))
- **chat:** double image preview ([#2766](https://github.com/akveo/nebular/issues/2766)) ([1b3c809](https://github.com/akveo/nebular/commit/1b3c809))
- **context menu:** emit destroy when component got destroyed ([#2767](https://github.com/akveo/nebular/issues/2767)) ([5036b89](https://github.com/akveo/nebular/commit/5036b89))
- **radio:** add setDisabledState hook ([#2717](https://github.com/akveo/nebular/issues/2717)) ([db9e556](https://github.com/akveo/nebular/commit/db9e556))
- **scroll dispatcher:** emit scroll events from cdkScrollable directive ([#2714](https://github.com/akveo/nebular/issues/2714)) ([f715e97](https://github.com/akveo/nebular/commit/f715e97))
- **sidebar:** sidebar state observable ([#2729](https://github.com/akveo/nebular/issues/2729)) ([dd0c88e](https://github.com/akveo/nebular/commit/dd0c88e))
- **sidebar:** update state when responsive setting change ([#2654](https://github.com/akveo/nebular/issues/2654)) ([bf7e2a3](https://github.com/akveo/nebular/commit/bf7e2a3))
- **tag list:** prevent autofocus on initial load ([#2734](https://github.com/akveo/nebular/issues/2734)) ([8d60faf](https://github.com/akveo/nebular/commit/8d60faf))
- **timepicker:** save lastInputValue when changed via form api ([#2718](https://github.com/akveo/nebular/issues/2718)) ([74096d0](https://github.com/akveo/nebular/commit/74096d0))

### Features

- update to Angular 12 ([#2769](https://github.com/akveo/nebular/issues/2769)) ([5e74916](https://github.com/akveo/nebular/commit/5e74916))
- **button group:** add valueChange output ([#2722](https://github.com/akveo/nebular/issues/2722)) ([39c610c](https://github.com/akveo/nebular/commit/39c610c))
- **chat:** add support for custom message template ([#2750](https://github.com/akveo/nebular/issues/2750)) ([d84497c](https://github.com/akveo/nebular/commit/d84497c))
- **chat form:** add output for input change ([#2735](https://github.com/akveo/nebular/issues/2735)) ([1bb0dfb](https://github.com/akveo/nebular/commit/1bb0dfb))
- **route tabset:** add support for NavigationExtras options ([#2753](https://github.com/akveo/nebular/issues/2753)) ([bcf7b65](https://github.com/akveo/nebular/commit/bcf7b65))
- **tabset:** add a tabId data attribute to the tab button ([#2738](https://github.com/akveo/nebular/issues/2738)) ([5aaab17](https://github.com/akveo/nebular/commit/5aaab17))
- **timepicker:** add localization config ([#2719](https://github.com/akveo/nebular/issues/2719)) ([b9c77ce](https://github.com/akveo/nebular/commit/b9c77ce))
- **window:** add window buttons configuration ([#2762](https://github.com/akveo/nebular/issues/2762)) ([9dcd40e](https://github.com/akveo/nebular/commit/9dcd40e))

<a name="7.0.0"></a>

# [7.0.0](https://github.com/akveo/nebular/compare/v6.2.1...v7.0.0) (2021-01-18)

### Bug Fixes

- **autocomplete:** update input element disabled state ([#2555](https://github.com/akveo/nebular/issues/2555)) ([23e59ba](https://github.com/akveo/nebular/commit/23e59ba))
- **radio, select:** prevent updates of destroyed component ([#2617](https://github.com/akveo/nebular/issues/2617)) ([1ead242](https://github.com/akveo/nebular/commit/1ead242))
- **sidebar:** emit state change ([#2645](https://github.com/akveo/nebular/issues/2645)) ([8a35e85](https://github.com/akveo/nebular/commit/8a35e85))
- **toggle:** alignment of toggle switches ([#2561](https://github.com/akveo/nebular/issues/2561)) ([09a7ba1](https://github.com/akveo/nebular/commit/09a7ba1))

### Code Refactoring

- **sidebar:** use OnPush change detection strategy ([#2646](https://github.com/akveo/nebular/issues/2646)) ([59daeea](https://github.com/akveo/nebular/commit/59daeea))
- **auth:** remove redundant \_all.scss theme file ([#2623](https://github.com/akveo/nebular/issues/2623)) ([09c5e91](https://github.com/akveo/nebular/commit/09c5e91))
- **autocomplete:** make renderer constructor parameter required ([#2621](https://github.com/akveo/nebular/issues/2621)) ([2cd2c78](https://github.com/akveo/nebular/commit/2cd2c78))
- **overlay:** add missing component class suffix ([#2622](https://github.com/akveo/nebular/issues/2622)) ([3e20fe4](https://github.com/akveo/nebular/commit/3e20fe4))

### Features

- update to Angular 11 ([#2611](https://github.com/akveo/nebular/issues/2611)) ([847bc99](https://github.com/akveo/nebular/commit/847bc99))
- tag component ([#2565](https://github.com/akveo/nebular/issues/2565)) ([bcdfcd8](https://github.com/akveo/nebular/commit/bcdfcd8))
- button group component ([#2473](https://github.com/akveo/nebular/issues/2473)) ([72bb1b3](https://github.com/akveo/nebular/commit/72bb1b3))
- **deps:** migrate to firebase 8 ([#2584](https://github.com/akveo/nebular/issues/2584)) ([b7a2c6e](https://github.com/akveo/nebular/commit/b7a2c6e))
- **select, autocomplete:** ability to change scroll strategy ([#2567](https://github.com/akveo/nebular/issues/2567)) ([d10275b](https://github.com/akveo/nebular/commit/d10275b))
- **autocomplete, datepicker, select, tooltip:** add ability to customize overlay offset ([#2628](https://github.com/akveo/nebular/issues/2628)) ([c1aafb9](https://github.com/akveo/nebular/commit/c1aafb9))
- **checkbox:** remove deprecated value input ([#2618](https://github.com/akveo/nebular/issues/2618)) ([0380050](https://github.com/akveo/nebular/commit/0380050))
- **select:** add custom comparator input ([#2590](https://github.com/akveo/nebular/issues/2590)) ([1f8a57b](https://github.com/akveo/nebular/commit/1f8a57b))
- **select, autocomplete:** add input to set options list class ([#2560](https://github.com/akveo/nebular/issues/2560)) ([92083e8](https://github.com/akveo/nebular/commit/92083e8))
- **sidebar:** add the ability to determine state and responsiveState ([#1893](https://github.com/akveo/nebular/issues/1893)) ([bac0edc](https://github.com/akveo/nebular/commit/bac0edc))
- **theme:** ability to add custom statuses ([#2625](https://github.com/akveo/nebular/issues/2625)) ([3b2e903](https://github.com/akveo/nebular/commit/3b2e903))
- **toastr:** remove deprecated iconPack property ([#2620](https://github.com/akveo/nebular/issues/2620)) ([77a3519](https://github.com/akveo/nebular/commit/77a3519))
- **tooltip, popover:** remove ability to use falsy adjustment ([#2619](https://github.com/akveo/nebular/issues/2619)) ([32ab00e](https://github.com/akveo/nebular/commit/32ab00e))

### BREAKING CHANGES

- **deps:**

  - Bump Angular version to 11+.
  - `@nebular/fire` requires `@angular/fire` 6.1.0+ and `firebase` 8.0.0+.

- **sidebar:** Added change detector ref constructor parameter.

- **checkbox:** `NbCheckboxComponent.value` and `NbCheckboxComponent.valueChange` properties removed. Use `checked` and `checkedChange` accordingly.

- **autocomplete:** `renderer` constructor parameter is now required.

- **toastr:** `NbToastrConfig.iconPack` property removed. You can set icon pack via `icon` property:

  ```
  const toastrConfig = {
    // ...
    icon: { icon: 'star', pack: 'eva' },
  }
  ```

  `NbToastComponent.iconPack` and `NbToastComponent.iconConfig` properties removed.
  Use `icon` property instead.

- **tooltip, popover:** Falsy adjustment values no longer become converted to `NbAdjustment.NOOP`, pass `NbAdjustment.NOOP` instead.

- **theme:** The document parameter in the NbViewportRulerAdapter and NbScrollDispatcherAdapter constructors is now required.

- **theme:** Empty string won't be converted to `basic` status anymore. If you used to set `status` properties to `''` change it to `'basic'`.

- **theme:** `NbPositionedContainer` renamed to `NbPositionedContainerComponent`.

- **auth:** `~@nebular/auth/styles/all`file removed. Replace `~@nebular/auth/styles/all` imports with `~@nebular/auth/styles/globals`.

- **theme:**:

  - `NbComponentStatus` type replaced with `NbComponentOrCustomStatus` in following properties: `NbActionComponent.badgeStatus`, `NbBadge.status`, `NbBadgeComponent.status`, `NbButtonComponent.status`, `NbAlertComponent.status`, `NbCardComponent.status`, `NbChatFormComponent.status`, `NbChatComponent.status`, `NbCheckboxComponent.status`, `NbFormFieldControl.status$`, `NbFormControlState.status`, `NbInputDirective.status`, `NbInputDirective.status%`, `NbSelectComponent.status`, `NbSelectComponent.status$`, `NbIconConfig.status`, `NbIconComponent.status`, `NbProgressBarComponent.status`, `NbRadioComponent.status`, `NbRadioGroupComponent.status`, `NbSpinnerDirective.spinnerStatus`, `NbSpinnerComponent.status`, `NbTabComponent.badgeStatus`, `NbToastrConfig.status`, `NbToggleComponent.status`, `NbTooltipDirective.status`, `NbTooltipComponent.context.status`, `NbUserComponent.badgeStatus`.
    If you extended listed components replace `NbComponentStatus` in the property type with `NbComponentOrCustomStatus`.
  - `NbBadgeComponent`, `NbButtonComponent`, `NbAlertComponent`, `NbCardComponent`, `NbChatComponent`, `NbCheckboxComponent`, `NbInputDirective`, `NbSelectComponent`, `NbIconComponent`, `NbProgressBarComponent`, `NbRadioComponent`, `NbSpinnerComponent`, `NbToastComponent`, `NbToggleComponent`, `NbTooltipComponent` constructors now require `NbStatusService` as a constructor parameter. If you extended listed components, inject `NbStatusService` and pass it to the base class.

<a name="6.2.1"></a>

## [6.2.1](https://github.com/akveo/nebular/compare/v6.2.0...v6.2.1) (2020-10-01)

### Bug Fixes

- **accordion:** extract inner elements styles outside accordion ([#2536](https://github.com/akveo/nebular/issues/2536)) ([9089690](https://github.com/akveo/nebular/commit/9089690))
- **calendar range cells:** handle unset date or selectedValue ([#2537](https://github.com/akveo/nebular/issues/2537)) ([0f20b9c](https://github.com/akveo/nebular/commit/0f20b9c))

<a name="6.2.0"></a>

# [6.2.0](https://github.com/akveo/nebular/compare/v6.1.0...v6.2.0) (2020-09-25)

### Bug Fixes

- **build:** provide ES5 code in UMD bundles ([#2520](https://github.com/akveo/nebular/issues/2520)) ([e64bac0](https://github.com/akveo/nebular/commit/e64bac0))
- **timepicker:** remove duplicate providers ([#2529](https://github.com/akveo/nebular/issues/2529)) ([7e5e489](https://github.com/akveo/nebular/commit/7e5e489))

### Features

- **datepicker:** export calendar with time component ([#2528](https://github.com/akveo/nebular/issues/2528)) ([f378492](https://github.com/akveo/nebular/commit/f378492))
- add support for TypeScript 4.0 ([#2523](https://github.com/akveo/nebular/issues/2523)) ([7b7f0a4](https://github.com/akveo/nebular/commit/7b7f0a4))

Please note required `@angular/cdk` package version changed to `10.2.1`+.

<a name="6.1.0"></a>

# [6.1.0](https://github.com/akveo/nebular/compare/v6.0.1...v6.1.0) (2020-09-17)

### Bug Fixes

- **auth:** add client_id to the refresh request ([#2350](https://github.com/akveo/nebular/issues/2350)) ([10b01fa](https://github.com/akveo/nebular/commit/10b01fa))
- **radio:** add value reset with undefined ([#2511](https://github.com/akveo/nebular/issues/2511)) ([9ac12c7](https://github.com/akveo/nebular/commit/9ac12c7))
- **rangepicker:** avoid setting month cell to null ([#2330](https://github.com/akveo/nebular/issues/2330)) ([a577b26](https://github.com/akveo/nebular/commit/a577b26))

### Features

- **badge:** dot mode ([#2479](https://github.com/akveo/nebular/issues/2479)) ([afe02b7](https://github.com/akveo/nebular/commit/afe02b7))
- **menu:** support more navigation extras ([#2420](https://github.com/akveo/nebular/issues/2420)) ([03aabfa](https://github.com/akveo/nebular/commit/03aabfa))
- **timepicker:** add timepicker component ([#2402](https://github.com/akveo/nebular/issues/2402)) ([70ee391](https://github.com/akveo/nebular/commit/70ee391))

<a name="6.0.1"></a>

# [6.0.1](https://github.com/akveo/nebular/compare/v6.0.0...v6.0.1) (2020-08-31)

### Bug Fixes

- **dynamic overlay:** prevent multiple onStable subscriptions ([#2494](https://github.com/akveo/nebular/issues/2494)) ([f22e87d](https://github.com/akveo/nebular/commit/f22e87d))

<a name="6.0.0"></a>

# [6.0.0](https://github.com/akveo/nebular/compare/v5.1.0...v6.0.0) (2020-07-31)

### Bug Fixes

- **datepicker:** background and border theming ([#2418](https://github.com/akveo/nebular/issues/2418)) ([381eb00](https://github.com/akveo/nebular/commit/381eb00))
- **form field:** addon alignment ([#2460](https://github.com/akveo/nebular/issues/2460)) ([dc154ab](https://github.com/akveo/nebular/commit/dc154ab))
- **nbButton:** allow specifying custom tabindex ([#2452](https://github.com/akveo/nebular/issues/2452)) ([e9f84be](https://github.com/akveo/nebular/commit/e9f84be))

### Code Refactoring

- **nb-icon:** return null if icon wasn't found ([#2466](https://github.com/akveo/nebular/issues/2466)) ([4af8924](https://github.com/akveo/nebular/commit/4af8924))

### Features

- upgrade to Angular 10 ([#2464](https://github.com/akveo/nebular/issues/2464)) ([540ee46](https://github.com/akveo/nebular/commit/540ee46))

### BREAKING CHANGES

- **nb-icon:** `NbIconLibraries.getSvgIcon` and `NbIconLibraries.getIcon` could return null if icon wasn't found and won't throw. As methods don't throw now, you need to handle possible `null` return value.
- **Angular:** Nebular packages now require Angular 10+. Nebular packages no longer include ESM5 and FESM5 bundles as per Angular Package Format 10.
- **NbBasePicker**: Angular lifecycle methods moved to `NbBasePickerComponent`. If you use `NbBasePicker` as a base class of your custom picker change it to `NbBasePickerComponent`.

<a name="5.1.0"></a>

# [5.1.0](https://github.com/akveo/nebular/compare/v5.0.0...v5.1.0) (2020-06-03)

### Bug Fixes

- **auth:** set correct theme for auth ([#2287](https://github.com/akveo/nebular/issues/2287)) ([c12873d](https://github.com/akveo/nebular/commit/c12873d))
- **popover, tooltip:** template check hint for adjustment ([#2278](https://github.com/akveo/nebular/issues/2278)) ([a77863d](https://github.com/akveo/nebular/commit/a77863d))
- **readme:** fix browser support table ([#2304](https://github.com/akveo/nebular/issues/2304)) ([23dc3be](https://github.com/akveo/nebular/commit/23dc3be))

### Features

- Firebase auth ([#2385](https://github.com/akveo/nebular/issues/2385)) ([2f75ba1](https://github.com/akveo/nebular/commit/2f75ba1))
- **autocomplete:** input for focus on value change ([#2356](https://github.com/akveo/nebular/issues/2356)) ([ab15806](https://github.com/akveo/nebular/commit/ab15806))

<a name="5.0.0"></a>

# [5.0.0](https://github.com/akveo/nebular/compare/v4.6.0...v5.0.0) (2020-03-09)

### Bug Fixes

- **button link:** remove text decoration ([#2190](https://github.com/akveo/nebular/issues/2190)) ([0495259](https://github.com/akveo/nebular/commit/0495259))
- **cdk:** fix cdk mappings duplicates ([#2068](https://github.com/akveo/nebular/issues/2068)) ([8179a02](https://github.com/akveo/nebular/commit/8179a02))
- **focus trigger:** prevent stream destroy on focus out ([#2189](https://github.com/akveo/nebular/issues/2189)) ([42ff4ee](https://github.com/akveo/nebular/commit/42ff4ee))
- **form field:** make form control container take all space ([#2241](https://github.com/akveo/nebular/issues/2241)) ([2e11ec9](https://github.com/akveo/nebular/commit/2e11ec9))
- **input:** use correct status property name ([#2248](https://github.com/akveo/nebular/issues/2248)) ([737ffe2](https://github.com/akveo/nebular/commit/737ffe2))
- **layout:** access view child property after view init ([#2249](https://github.com/akveo/nebular/issues/2249)) ([5bb21a7](https://github.com/akveo/nebular/commit/5bb21a7))
- **menu:** prevent color override in css vars mode ([#2201](https://github.com/akveo/nebular/issues/2201)) ([ac50dae](https://github.com/akveo/nebular/commit/ac50dae))
- **route tabset:** tab icon margin ([#2154](https://github.com/akveo/nebular/issues/2154)) ([f7210b2](https://github.com/akveo/nebular/commit/f7210b2))
- **theme:** prevent transition to initial status ([#2256](https://github.com/akveo/nebular/issues/2256)) ([8e52fc0](https://github.com/akveo/nebular/commit/8e52fc0))
- **trigger:** prevent stream destroy on mouse leave ([#2141](https://github.com/akveo/nebular/issues/2141)) ([7c79d1d](https://github.com/akveo/nebular/commit/7c79d1d))
- **typography:** concat anchor selector with color class ([#2161](https://github.com/akveo/nebular/issues/2161)) ([8c9ed86](https://github.com/akveo/nebular/commit/8c9ed86))
- **typography:** use text theme vars for text color classes ([#2192](https://github.com/akveo/nebular/issues/2192)) ([af2e674](https://github.com/akveo/nebular/commit/af2e674))
- add scroll strategy options to public api ([#2129](https://github.com/akveo/nebular/issues/2129)) ([79ab083](https://github.com/akveo/nebular/commit/79ab083))
- provide Nebular scroll services adapters ([#2140](https://github.com/akveo/nebular/issues/2140)) ([0e0d11c](https://github.com/akveo/nebular/commit/0e0d11c))
- support strict template check ([#2273](https://github.com/akveo/nebular/issues/2273)) ([9b4ff5b](https://github.com/akveo/nebular/commit/9b4ff5b))
- avoid to declare and export NbTable component ([#2126](https://github.com/akveo/nebular/issues/2126)) ([dbf5192](https://github.com/akveo/nebular/commit/dbf5192))

### Code Refactoring

- **auth:** require valid token by default ([#2259](https://github.com/akveo/nebular/issues/2259)) ([bc68d11](https://github.com/akveo/nebular/commit/bc68d11))
- unsubscribe on destroy ([#2112](https://github.com/akveo/nebular/issues/2112)) ([0cab4fc](https://github.com/akveo/nebular/commit/0cab4fc))
- **select:** update option state colors ([#2110](https://github.com/akveo/nebular/issues/2110)) ([1dbddd5](https://github.com/akveo/nebular/commit/1dbddd5))
- use basic as default status ([#2136](https://github.com/akveo/nebular/issues/2136)) ([cc9b47e](https://github.com/akveo/nebular/commit/cc9b47e))
- **mapping** unify state color mapping ([#2075](https://github.com/akveo/nebular/issues/2075)) ([028883a](https://github.com/akveo/nebular/commit/028883a))
- **context menu** extract text alignment to theme property ([#2148](https://github.com/akveo/nebular/issues/2148)) ([011edd1](https://github.com/akveo/nebular/commit/011edd1))
- move focus inset shadow to theme ([#2143](https://github.com/akveo/nebular/issues/2143)) ([ecafd16](https://github.com/akveo/nebular/commit/ecafd16))

### Features

- update to Angular 9 ([#2236](https://github.com/akveo/nebular/issues/2236)) ([899815f](https://github.com/akveo/nebular/commit/899815f))
- **calendar:** Eva 1.3 ([#2120](https://github.com/akveo/nebular/issues/2120)) ([0f03fb5](https://github.com/akveo/nebular/commit/0f03fb5))
- **select:** Eva style ([#2106](https://github.com/akveo/nebular/issues/2106)) ([7355d65](https://github.com/akveo/nebular/commit/7355d65))
- **theme:** autocomplete component ([#1947](https://github.com/akveo/nebular/issues/1947)) ([d67dd6b](https://github.com/akveo/nebular/commit/d67dd6b))
- **theme:** form field component ([#2238](https://github.com/akveo/nebular/issues/2238)) ([aee71a7](https://github.com/akveo/nebular/commit/aee71a7))
- **date fns:** update date-fns to latest version ([#2045](https://github.com/akveo/nebular/issues/2045)) ([1c5323d](https://github.com/akveo/nebular/commit/1c5323d))
- **typography:** add anchor text decoration theme property ([#2169](https://github.com/akveo/nebular/issues/2169)) ([be80661](https://github.com/akveo/nebular/commit/be80661))
- **chat:** date format for messages and support for change placeholders ([#2227](https://github.com/akveo/nebular/issues/2227)) ([b63f004](https://github.com/akveo/nebular/commit/b63f004))

### BREAKING CHANGES

- **auth:** `requireValidToken` set to true by default.
  Now if response contains invalid token `NbAuthIllegalTokenError` is thrown.
  To enable old behavior, set `requireValidToken: false` in the auth strategy method config, e.g.:

```
NbPasswordAuthStrategy.setup({
  // ...
  login: {
    // ...
    requireValidToken: false,
  },
});
```

or

```
NbOAuth2AuthStrategy.setup({
  // ...
  authorize: {
    // ...
    requireValidToken: false,
  },
});
```

- Badge, button, progress bar, toastr components now use basic status as a default.
- **calendar:**

  - `NbCalendarHeaderComponent` removed. Along with that `showHeader` property removed from following components:
  - `NbBaseCalendarComponent`
  - `NbCalendarRangeComponent`
  - `NbCalendarComponent`
  - `NbBasePicker`
  - `NbBasePickerComponent`

  - `medium` and `size-medium` css classes were removed along with `medium`/`isMedium` properties from the following classes:

    - `NbCalendarDayPickerComponent`
    - `NbCalendarMonthPickerComponent`
    - `NbCalendarYearPickerComponent`
    - `NbBaseCalendarComponent`
    - `NbCalendarWeekNumberComponent`

  - Properties `date`, `changeMode`, `isRtl` removed from `NbCalendarPageableNavigationComponent`

  - File `nb-calendar-week-number.component` renamed to `calendar-week-number.component`

  - `YEARS_IN_VIEW, YEARS_IN_ROW` constants removed. Use `NbCalendarYearModelService`s `getYearsInView` and `getRowInView` methods.

  - `NbCalendarNavigationComponent` replaced with `NbCalendarViewModeComponent`.

  - `initYears` method removed from `NbCalendarYearPickerComponent`.

  - `calendar-range-cells.ts` file split into `calendar-range-day-cell.component.ts`, `calendar-range-month-cell.component.ts` and `calendar-range-year-cell.component.ts`.

  - Following theme properties were removed:
    - `calendar-body-height`
    - `calendar-header-text-color`
    - `calendar-header-text-font-family`
    - `calendar-header-title-text-font-size`
    - `calendar-header-title-text-font-weight`
    - `calendar-header-title-text-line-height`
    - `calendar-header-sub-title-text-font-size`
    - `calendar-header-sub-title-text-font-weight`
    - `calendar-header-sub-title-text-line-height`
    - `calendar-navigation-button-width`
    - `calendar-large-body-height`
    - `calendar-cell-in-range-background-color`
    - `calendar-cell-disabled-background-color`
    - `datepicker-text-color`
    - `datepicker-arrow-size`

- **cdk:** NbPlatform and NbScrollStrategyOptions from theme/components/cdk/overlay/mapping.ts removed. Use NbPlatform from theme/components/cdk/platform/platform-service.ts and NbScrollStrategyOptions from theme/components/cdk/adapter/block-scroll-strategy-adapter.ts.
  NbPlatformModule removed.
- **select:** `select-option-*` theme properties renamed to `option-`. `nb-option` and `nb-option-group` components moved to own `options` directory.
- **select:** Generic value type removed from NbSelectComponent.
- **Angular:** Nebular packages now require Angular 9+.
- **tslib:** We no longer have a direct dependency on tslib. Instead it is now listed a peerDependency. This matches Angular framework.
  Users not using the Angular CLI will need to manually install tslib via:

```
yarn add tslib
# or
npm install tslib --save
```

<a name="4.6.0"></a>

# [4.6.0](https://github.com/akveo/nebular/compare/v4.5.0...v4.6.0) (2019-11-26)

### Bug Fixes

- **auth:** use basic status instead deprecated empty string ([#2063](https://github.com/akveo/nebular/issues/2063)) ([a202468](https://github.com/akveo/nebular/commit/a202468))
- **docs:** update links inside install guide page ([#2079](https://github.com/akveo/nebular/issues/2079)) ([cd8cd9d](https://github.com/akveo/nebular/commit/cd8cd9d))
- **hover trigger strategy:** prevent resubscription after destroy ([#2058](https://github.com/akveo/nebular/issues/2058)) ([1e1a293](https://github.com/akveo/nebular/commit/1e1a293))
- **nbIsGranted:** prevent subscription memory leak ([#2087](https://github.com/akveo/nebular/issues/2087)) ([2084356](https://github.com/akveo/nebular/commit/2084356))
- **overlay:** set position when content or context update ([#2081](https://github.com/akveo/nebular/issues/2081)) ([e85830f](https://github.com/akveo/nebular/commit/e85830f))
- **radio:** reverse order of elements in RTL ([#2093](https://github.com/akveo/nebular/issues/2093)) ([2e61d8d](https://github.com/akveo/nebular/commit/2e61d8d))
- **select:** set value from queue when options change ([#2082](https://github.com/akveo/nebular/issues/2082)) ([c934329](https://github.com/akveo/nebular/commit/c934329))
- **toastr:** move toastr overlay in front of other overlays ([#2078](https://github.com/akveo/nebular/issues/2078)) ([906d3c0](https://github.com/akveo/nebular/commit/906d3c0))
- **toggle:** animation in IE11 ([#2062](https://github.com/akveo/nebular/issues/2062)) ([1d52a20](https://github.com/akveo/nebular/commit/1d52a20))
- **toggle:** set correct ARIA role ([#2097](https://github.com/akveo/nebular/issues/2097)) ([dd5f2b6](https://github.com/akveo/nebular/commit/dd5f2b6))
- **universal:** update dependencies to support universal enviro… ([#2057](https://github.com/akveo/nebular/issues/2057)) ([0b22c40](https://github.com/akveo/nebular/commit/0b22c40))

### Features

- **accordion:** toggle via keyboard ([#2085](https://github.com/akveo/nebular/issues/2085)) ([f8a1b32](https://github.com/akveo/nebular/commit/f8a1b32))
- add custom css class on overlays ([#2067](https://github.com/akveo/nebular/issues/2067)) ([147ec2e](https://github.com/akveo/nebular/commit/147ec2e))
- Ivy compatibility ([#2074](https://github.com/akveo/nebular/issues/2074)) ([d84e76b](https://github.com/akveo/nebular/commit/d84e76b))

<a name="4.5.0"></a>

# [4.5.0](https://github.com/akveo/nebular/compare/v4.4.0...v4.5.0) (2019-10-31)

Highlights

Nebular 4.5 introduces a new basic and control component statuses.
Please note, some theme properties were changed. If you use Nebular Theming or have custom themes, check out [updated variables list](https://github.com/akveo/nebular/pull/2047).

### Bug Fixes

- **actions:** icon button alignment ([#1895](https://github.com/akveo/nebular/issues/1895)) ([04d7e33](https://github.com/akveo/nebular/commit/04d7e33))
- **datepicker:** check trigger strategy is defined before destroying ([#2011](https://github.com/akveo/nebular/issues/2011)) ([a678e60](https://github.com/akveo/nebular/commit/a678e60))
- scroll bar theming ([#1890](https://github.com/akveo/nebular/issues/1890)) ([e6b19a5](https://github.com/akveo/nebular/commit/e6b19a5))
- **datepicker, radio:** always call touched callback ([#2026](https://github.com/akveo/nebular/issues/2026)) ([d3a8e44](https://github.com/akveo/nebular/commit/d3a8e44))
- **icon:** fix NULL content render in MS Edge ([#2043](https://github.com/akveo/nebular/issues/2043)) ([f37223a](https://github.com/akveo/nebular/commit/f37223a))
- **list:** vertically center list item content ([#1894](https://github.com/akveo/nebular/issues/1894)) ([7a179bc](https://github.com/akveo/nebular/commit/7a179bc))
- **popover, tooltip:** convert falsy values for adjustments to noop ([#1905](https://github.com/akveo/nebular/issues/1905)) ([3ec69e7](https://github.com/akveo/nebular/commit/3ec69e7))
- **sidebar:** emit expand event when expanded because of menu c… ([#1897](https://github.com/akveo/nebular/issues/1897)) ([a07487d](https://github.com/akveo/nebular/commit/a07487d))
- **toastr:** dispose no longer used overlay container ([#1873](https://github.com/akveo/nebular/issues/1873)) ([4114ad1](https://github.com/akveo/nebular/commit/4114ad1))
- **tooltip:** add angular positions classes ([#2048](https://github.com/akveo/nebular/issues/2048)) ([a15c81d](https://github.com/akveo/nebular/commit/a15c81d))

### Features

- add basic and control statuses ([#2047](https://github.com/akveo/nebular/issues/2047)) ([884dd66](https://github.com/akveo/nebular/commit/884dd66))

<a name="4.4.0"></a>

# [4.4.0](https://github.com/akveo/nebular/compare/v4.3.1...v4.4.0) (2019-10-07)

### Highlights

Nebular 4.4.0 features synchronization with Eva 1.1 adding transparent colors.

### Bug Fixes

- **layout header:** prevent stretching wider than window max width ([#1980](https://github.com/akveo/nebular/issues/1980)) ([c42c880](https://github.com/akveo/nebular/commit/c42c880))

### Features

- add angular adjustments ([#1996](https://github.com/akveo/nebular/issues/1996)) ([d8689c1](https://github.com/akveo/nebular/commit/d8689c1))
- sync with Eva 1.1 ([#1995](https://github.com/akveo/nebular/issues/1995)) ([67d5689](https://github.com/akveo/nebular/commit/67d5689))
- **popover, tooltip:** add shown state api ([#1998](https://github.com/akveo/nebular/issues/1998)) ([6dbce1d](https://github.com/akveo/nebular/commit/6dbce1d))
- **sidebar service:** add compact method ([#1997](https://github.com/akveo/nebular/issues/1997)) ([3c34805](https://github.com/akveo/nebular/commit/3c34805))

<a name="4.3.1"></a>

## [4.3.1](https://github.com/akveo/nebular/compare/v4.3.0...v4.3.1) (2019-09-20)

### Bug Fixes

- **calendar:** use last defined week day to determine week numb… ([#1969](https://github.com/akveo/nebular/issues/1969)) ([ba78d94](https://github.com/akveo/nebular/commit/ba78d94))

<a name="4.3.0"></a>

# [4.3.0](https://github.com/akveo/nebular/compare/v4.2.2...v4.3.0) (2019-09-20)

### Features

- **calendar:** add week number column ([#1963](https://github.com/akveo/nebular/issues/1963)) ([28e7468](https://github.com/akveo/nebular/commit/28e7468))
- **tabset:** add tabid property ([#1919](https://github.com/akveo/nebular/issues/1919)) ([d5bf53a](https://github.com/akveo/nebular/commit/d5bf53a))

<a name="4.2.2"></a>

## [4.2.2](https://github.com/akveo/nebular/compare/v4.2.1...v4.2.2) (2019-09-11)

### Bug Fixes

- **button:** make sure icon has margins when button has html co… ([#1953](https://github.com/akveo/nebular/issues/1953)) ([a17accb](https://github.com/akveo/nebular/commit/a17accb))

<a name="4.2.1"></a>

## [4.2.1](https://github.com/akveo/nebular/compare/v4.2.0...v4.2.1) (2019-08-29)

### Bug Fixes

- **ci:** prevent travis from killing deploy docs job ([#1928](https://github.com/akveo/nebular/issues/1928)) ([0b969cb](https://github.com/akveo/nebular/commit/0b969cb))
- **datepicker:** add missing show header input ([#1889](https://github.com/akveo/nebular/issues/1889)) ([d265991](https://github.com/akveo/nebular/commit/d265991))
- **schematics:** use cli version for schematics/angular package ([#1937](https://github.com/akveo/nebular/issues/1937)) ([4589726](https://github.com/akveo/nebular/commit/4589726))
- **select:** allow initial falsy values ([#1936](https://github.com/akveo/nebular/issues/1936)) ([02080fb](https://github.com/akveo/nebular/commit/02080fb))
- **select:** mark touched on hide trigger only when select is open ([#1878](https://github.com/akveo/nebular/issues/1878)) ([8295c32](https://github.com/akveo/nebular/commit/8295c32))
- **toastr:** call contains on body ([#1872](https://github.com/akveo/nebular/issues/1872)) ([a01ec7a](https://github.com/akveo/nebular/commit/a01ec7a))
- **tree grid:** assert node children is defined before spreading ([#1898](https://github.com/akveo/nebular/issues/1898)) ([26ad5d2](https://github.com/akveo/nebular/commit/26ad5d2))
- **window:** create new window container when overlay container change ([#1867](https://github.com/akveo/nebular/issues/1867)) ([edb6b16](https://github.com/akveo/nebular/commit/edb6b16))

### Features

- accept icon config in components which use nb-icon ([#1935](https://github.com/akveo/nebular/issues/1935)) ([c9b9d32](https://github.com/akveo/nebular/commit/c9b9d32))
- **auth**: add backend api endpoints article ([#1931](https://github.com/akveo/nebular/issues/1931)) ([905029f](https://github.com/akveo/nebular/commit/905029f))

<a name="4.2.0"></a>

# [4.2.0](https://github.com/akveo/nebular/compare/v4.1.3...v4.2.0) (2019-08-22)

### Bug Fixes

- **dynamic overlay:** recreate overlay when overlay container change ([#1913](https://github.com/akveo/nebular/issues/1913)) ([258b75b](https://github.com/akveo/nebular/commit/258b75b))
- **packages smoke:** update webdriver-manager ([#1881](https://github.com/akveo/nebular/issues/1881)) ([e6c4966](https://github.com/akveo/nebular/commit/e6c4966))
- **popover:** add missing start and end positions to positions mapping ([#1904](https://github.com/akveo/nebular/issues/1904)) ([64777a4](https://github.com/akveo/nebular/commit/64777a4))

### Features

- **packages smoke:** add Eva icons package ([#1903](https://github.com/akveo/nebular/issues/1903)) ([8c0683b](https://github.com/akveo/nebular/commit/8c0683b))
- **toggle:** add toggle component ([#1304](https://github.com/akveo/nebular/issues/1304)) ([d86edce](https://github.com/akveo/nebular/commit/d86edce))

<a name="4.1.3"></a>

## [4.1.3](https://github.com/akveo/nebular/compare/v4.1.2...v4.1.3) (2019-07-29)

### Bug Fixes

- **accordion:** prevent styling of projected icons ([#1836](https://github.com/akveo/nebular/issues/1836)) ([a7b55da](https://github.com/akveo/nebular/commit/a7b55da))
- **card:** make two smaller cards same height as one large ([#1821](https://github.com/akveo/nebular/issues/1821)) ([88eb8f7](https://github.com/akveo/nebular/commit/88eb8f7))
- **checkbox:** prevent second click event from input ([#1835](https://github.com/akveo/nebular/issues/1835)) ([115ce08](https://github.com/akveo/nebular/commit/115ce08))
- **dialog:** stop listening for close events when dialog closes ([#1860](https://github.com/akveo/nebular/issues/1860)) ([7ddbfbd](https://github.com/akveo/nebular/commit/7ddbfbd))
- **docs:** custom theme link ([#1832](https://github.com/akveo/nebular/issues/1832)) ([b17f6b4](https://github.com/akveo/nebular/commit/b17f6b4))
- **layout:** set header background color on host element ([#1823](https://github.com/akveo/nebular/issues/1823)) ([34cb370](https://github.com/akveo/nebular/commit/34cb370))
- **menu:** clear typing for NbMenuItem pathMatch property ([#1627](https://github.com/akveo/nebular/issues/1627)) ([49bea48](https://github.com/akveo/nebular/commit/49bea48))
- **select:** prevent opening of disabled select when clicking on toggle ([#1865](https://github.com/akveo/nebular/issues/1865)) ([0542371](https://github.com/akveo/nebular/commit/0542371))
- **select:** remove max width from options list in full width s… ([#1837](https://github.com/akveo/nebular/issues/1837)) ([272cbd3](https://github.com/akveo/nebular/commit/272cbd3))
- **typography:** declare text color classes at the bottom ([#1862](https://github.com/akveo/nebular/issues/1862)) ([1072754](https://github.com/akveo/nebular/commit/1072754))

<a name="4.1.2"></a>

## [4.1.2](https://github.com/akveo/nebular/compare/v4.1.1...v4.1.2) (2019-07-12)

### Bug Fixes

- **auth:** include helpers into public api ([#1754](https://github.com/akveo/nebular/issues/1754)) ([f6f301b](https://github.com/akveo/nebular/commit/f6f301b))
- **docs:** articles grammar ([#1810](https://github.com/akveo/nebular/issues/1810)) ([a0efb6b](https://github.com/akveo/nebular/commit/a0efb6b))
- **layout:** scroll block in with scroll mode ([#1805](https://github.com/akveo/nebular/issues/1805)) ([8958fc9](https://github.com/akveo/nebular/commit/8958fc9))
- **menu:** path fragment comparison ([#1809](https://github.com/akveo/nebular/issues/1809)) ([abbd659](https://github.com/akveo/nebular/commit/abbd659))

<a name="4.1.1"></a>

## [4.1.1](https://github.com/akveo/nebular/compare/v4.1.0...v4.1.1) (2019-07-09)

### Bug Fixes

- **auth:** make social icons bigger ([#1659](https://github.com/akveo/nebular/issues/1659)) ([d596e31](https://github.com/akveo/nebular/commit/d596e31))
- **auth:** two minor typos in auth components ([#1682](https://github.com/akveo/nebular/issues/1682)) ([44225d4](https://github.com/akveo/nebular/commit/44225d4))
- **calendar:** prevent selected day text color override ([#1655](https://github.com/akveo/nebular/issues/1655)) ([e8834d7](https://github.com/akveo/nebular/commit/e8834d7))
- **context menu:** add cursor pointer to menu host ([#1662](https://github.com/akveo/nebular/issues/1662)) ([337cacf](https://github.com/akveo/nebular/commit/337cacf))
- **docs:** wrong NbEvaIconsModule import ([#1623](https://github.com/akveo/nebular/issues/1623)) ([a1c5e0c](https://github.com/akveo/nebular/commit/a1c5e0c))
- **flip card:** add prefixed backface-visibility property ([#1658](https://github.com/akveo/nebular/issues/1658)) ([6373117](https://github.com/akveo/nebular/commit/6373117))
- **icon:** specify vertical align ([#1657](https://github.com/akveo/nebular/issues/1657)) ([8ceb343](https://github.com/akveo/nebular/commit/8ceb343))
- **menu:** icon color should use `text-hint-color` ([#1614](https://github.com/akveo/nebular/issues/1614)) ([dad01b2](https://github.com/akveo/nebular/commit/dad01b2))
- **reveal card:** card shadow being cut off ([#1656](https://github.com/akveo/nebular/issues/1656)) ([6001564](https://github.com/akveo/nebular/commit/6001564))
- **select:** add theme property for open select border ([#1653](https://github.com/akveo/nebular/issues/1653)) ([d16dcba](https://github.com/akveo/nebular/commit/d16dcba))
- **select:** make options list same width as button ([#1650](https://github.com/akveo/nebular/issues/1650)) ([1658ccf](https://github.com/akveo/nebular/commit/1658ccf))
- **select:** prevent empty select height collapsing ([#1643](https://github.com/akveo/nebular/issues/1643)) ([43655c7](https://github.com/akveo/nebular/commit/43655c7))
- update protractor ([#1647](https://github.com/akveo/nebular/issues/1647)) ([8c2046e](https://github.com/akveo/nebular/commit/8c2046e))
- **select:** remove usage of deleted variables ([#1670](https://github.com/akveo/nebular/issues/1670)) ([ff4dc8b](https://github.com/akveo/nebular/commit/ff4dc8b))
- **select:** use new 'checked' input ([#1747](https://github.com/akveo/nebular/issues/1747)) ([4bfd22d](https://github.com/akveo/nebular/commit/4bfd22d))
- **sidebar:** expand when menu with children clicked ([#1750](https://github.com/akveo/nebular/issues/1750)) ([7ad7005](https://github.com/akveo/nebular/commit/7ad7005))
- **smart table:** use primary colors ([#1746](https://github.com/akveo/nebular/issues/1746)) ([82ad5c4](https://github.com/akveo/nebular/commit/82ad5c4))
- **toastr:** icon size shrink ([#1638](https://github.com/akveo/nebular/issues/1638)) ([838d974](https://github.com/akveo/nebular/commit/838d974))

### Features

- **toastr:** add duplicates behavior ([#1628](https://github.com/akveo/nebular/issues/1628)) ([4ab5037](https://github.com/akveo/nebular/commit/4ab5037))
- **toastr:** add toasts limit ([#1637](https://github.com/akveo/nebular/issues/1637)) ([56cac51](https://github.com/akveo/nebular/commit/56cac51))
- update js themes ([#1631](https://github.com/akveo/nebular/issues/1631)) ([4d66419](https://github.com/akveo/nebular/commit/4d66419))
- **typography:** sync with Eva 1 ([#1648](https://github.com/akveo/nebular/issues/1648)) ([a2e20a0](https://github.com/akveo/nebular/commit/a2e20a0))

<a name="4.1.0"></a>

# [4.1.0](https://github.com/akveo/nebular/compare/v4.0.0...v4.1.0) (2019-06-14)

### Bug Fixes

- **layout:** set top position on fixed header ([#1604](https://github.com/akveo/nebular/issues/1604)) ([6b89f73](https://github.com/akveo/nebular/commit/6b89f73))
- **select:** transparent gap between options ([#1563](https://github.com/akveo/nebular/issues/1563)) ([714c45e](https://github.com/akveo/nebular/commit/714c45e))
- **sidebar:** prevent translation to the top when overlay opened ([#1607](https://github.com/akveo/nebular/issues/1607)) ([c2a11fb](https://github.com/akveo/nebular/commit/c2a11fb))
- **checkbox:** don't emit on `value` input change, deprecate `value`, add `checked` ([#1585](https://github.com/akveo/nebular/issues/1585)) ([72cc999](https://github.com/akveo/nebular/commit/72cc999))
- **dev docs:** specify correct lts tag ([#1593](https://github.com/akveo/nebular/issues/1593)) ([f7a8be4](https://github.com/akveo/nebular/commit/f7a8be4))
- **docs:** correct mention of date-fns ([#1572](https://github.com/akveo/nebular/issues/1572)) ([bad91ec](https://github.com/akveo/nebular/commit/bad91ec))
- **docs:** fix incorrect eva-icons/bootstrap readme ([#1611](https://github.com/akveo/nebular/issues/1611)) ([73c5d36](https://github.com/akveo/nebular/commit/73c5d36))
- **docs:** fixed small errors ([#1574](https://github.com/akveo/nebular/issues/1574)) ([03a8085](https://github.com/akveo/nebular/commit/03a8085))
- **docs:** remove concave line and update dark example background ([#1562](https://github.com/akveo/nebular/issues/1562)) ([21a40ee](https://github.com/akveo/nebular/commit/21a40ee))
- **docs:** use primary color for highlight ([#1583](https://github.com/akveo/nebular/issues/1583)) ([e9381c2](https://github.com/akveo/nebular/commit/e9381c2))

### Features

- **docs:** add version select ([#1599](https://github.com/akveo/nebular/issues/1599)) ([3987d76](https://github.com/akveo/nebular/commit/3987d76))

<a name="3.6.2"></a>

## [3.6.2](https://github.com/akveo/nebular/compare/v3.6.1...v3.6.2) (2019-07-19)

### Bug Fixes

- **stepper:** add missing stepper provider ([#1831](https://github.com/akveo/nebular/issues/1831)) ([f3f66b0](https://github.com/akveo/nebular/commit/f3f66b0))

<a name="3.6.1"></a>

## [3.6.1](https://github.com/akveo/nebular/compare/v3.6.0...v3.6.1) (2019-06-14)

### Bug Fixes

- **layout:** set top position on fixed header ([#1605](https://github.com/akveo/nebular/issues/1605)) ([ed780dd](https://github.com/akveo/nebular/commit/ed780dd))
- **sidebar:** prevent translation to the top when overlay opened ([#1608](https://github.com/akveo/nebular/issues/1608)) ([993c325](https://github.com/akveo/nebular/commit/993c325))
- **theme:** deprecation warning of dart sass 2.0.0 ([#1603](https://github.com/akveo/nebular/issues/1603)) ([46ed014](https://github.com/akveo/nebular/commit/46ed014))

### Features

- **docs:** add version switcher ([#1617](https://github.com/akveo/nebular/issues/1617)) ([7d67ee5](https://github.com/akveo/nebular/commit/7d67ee5))

<a name="3.6.0"></a>

# [3.6.0 LTS](https://github.com/akveo/nebular/compare/v3.5.0...v3.6.0) (2019-06-07)

### Bug Fixes

- **overlay:** set context on component portals before first cd run ([#1395](https://github.com/akveo/nebular/issues/1395)) ([36aa416](https://github.com/akveo/nebular/commit/36aa416))
- **select:** allow select to work with empty values in nb-option ([#1282](https://github.com/akveo/nebular/issues/1282)) ([059af4b](https://github.com/akveo/nebular/commit/059af4b))
- **select:** emit array when resetting multiple select ([#1399](https://github.com/akveo/nebular/issues/1399)) ([fbda1d2](https://github.com/akveo/nebular/commit/fbda1d2))
- **tabset:** prevent select call if no active tab found ([#1444](https://github.com/akveo/nebular/issues/1444)) ([c0d27ad](https://github.com/akveo/nebular/commit/c0d27ad))
- **docs:** prefix root css urls with base path ([#1453](https://github.com/akveo/nebular/issues/1453)) ([a9120cf](https://github.com/akveo/nebular/commit/a9120cf))
- add missing components exports to public api ([#1487](https://github.com/akveo/nebular/issues/1487)) ([256e21e](https://github.com/akveo/nebular/commit/256e21e))
- add missing public api entries ([#1545](https://github.com/akveo/nebular/issues/1545)) ([b9f7b86](https://github.com/akveo/nebular/commit/b9f7b86))

### Chores

- update angular ([#1449](https://github.com/akveo/nebular/issues/1449)) ([9b5d221](https://github.com/akveo/nebular/commit/9b5d221))

### Features

- angular package format ([#1474](https://github.com/akveo/nebular/issues/1474)) ([647089e](https://github.com/akveo/nebular/commit/647089e))
- enable ci for 3.6.0 branch ([#1580](https://github.com/akveo/nebular/issues/1580)) ([d77254c](https://github.com/akveo/nebular/commit/d77254c))
- remove Nebular 4 theme breaking notice ([#1426](https://github.com/akveo/nebular/issues/1426)) ([37808be](https://github.com/akveo/nebular/commit/37808be))

### BREAKING CHANGES

- Angular 8+ now required
- **select:** Only `null` and `undefined` option values now considered as reset.
  `false` and falsy values such as `0`, `''`, `NaN` don't reset select
  value anymore.

<a name="4.0.0"></a>

# [4.0.0](https://github.com/akveo/nebular/compare/v4.0.0-rc.8...v4.0.0) (2019-06-03)

### Highlights

Nebular 4.0 is a significant improvement and rework of the previous versions. We believe these changes bring Nebular to the new level of quality and feature-richness with:

- Updated look&feel with Eva Design System;
- New convenient and flexible Theming system;
- Custom CSS properties support in theming;
- Unified component interfaces (`@Input`'s and `@Output`'s);
- New Dark theme;
- Support of SVG Eva Icons.

## Steps To Update

To achieve all of this and allow Nebular to grow faster and better, we had to refactor a lot of internal implementations, as well as _public APIs_.
We hope that next Nebular versions won't receive such significant upgrades and the amount of breaking changes will be kept as low as possible.

[Migration Guide](https://akveo.github.io/nebular/docs/migration/350400-migration#350--400-nebular-migration) is available.
We would appreciate hearing your feedback on the update steps, quality of the guide and if you have any questions or complications - please post a comment here https://github.com/akveo/nebular/issues/1524.

### Bug Fixes

- **accordion:** fix incorrect accordion mapping ([#1535](https://github.com/akveo/nebular/issues/1535)) ([3a0382c](https://github.com/akveo/nebular/commit/3a0382c))
- **bootstrap:** button group, modal and input ([#1540](https://github.com/akveo/nebular/issues/1540)) ([2a177c0](https://github.com/akveo/nebular/commit/2a177c0))
- add missing public api entries ([#1545](https://github.com/akveo/nebular/issues/1545)) ([fe56655](https://github.com/akveo/nebular/commit/fe56655))
- **docs:** change features section background ([#1556](https://github.com/akveo/nebular/issues/1556)) ([c33442b](https://github.com/akveo/nebular/commit/c33442b))
- **docs:** disable custom outline as it breaks Eva components ([#1537](https://github.com/akveo/nebular/issues/1537)) ([c48caaf](https://github.com/akveo/nebular/commit/c48caaf))
- **docs:** example row helper ([#1548](https://github.com/akveo/nebular/issues/1548)) ([c0d404f](https://github.com/akveo/nebular/commit/c0d404f))
- **docs:** fix component styles table ([#1543](https://github.com/akveo/nebular/issues/1543)) ([ab166fd](https://github.com/akveo/nebular/commit/ab166fd))
- **docs:** fix transparent background color ([#1536](https://github.com/akveo/nebular/issues/1536)) ([0aed7b6](https://github.com/akveo/nebular/commit/0aed7b6))
- **docs:** update changed component theme vars link ([#1550](https://github.com/akveo/nebular/issues/1550)) ([ae73257](https://github.com/akveo/nebular/commit/ae73257))
- **radio:** prevent circles distraction ([#1549](https://github.com/akveo/nebular/issues/1549)) ([abb50df](https://github.com/akveo/nebular/commit/abb50df))
- add missing components exports to public api ([#1487](https://github.com/akveo/nebular/issues/1487)) ([2f551aa](https://github.com/akveo/nebular/commit/2f551aa))
- move auth examples to base component without layout ([#1479](https://github.com/akveo/nebular/issues/1479)) ([30e6942](https://github.com/akveo/nebular/commit/30e6942))
- **checkbox:** fix inactive background color ([#1502](https://github.com/akveo/nebular/issues/1502)) ([48966b8](https://github.com/akveo/nebular/commit/48966b8))
- **checkbox:** fix value output ([#1505](https://github.com/akveo/nebular/issues/1505)) ([0ea3167](https://github.com/akveo/nebular/commit/0ea3167))
- **docs:** docs fixes, minimize icons, remove unused fonts ([#1491](https://github.com/akveo/nebular/issues/1491)) ([9334d3e](https://github.com/akveo/nebular/commit/9334d3e))
- **spinner:** ability to set spinner message ([#1508](https://github.com/akveo/nebular/issues/1508)) ([64f94c1](https://github.com/akveo/nebular/commit/64f94c1))
- **theme:** finalize themes with design system ([#1481](https://github.com/akveo/nebular/issues/1481)) ([5673e98](https://github.com/akveo/nebular/commit/5673e98)), closes [#40dc7](https://github.com/akveo/nebular/issues/40dc7) [#ebeef2](https://github.com/akveo/nebular/issues/ebeef2) [#3b5998](https://github.com/akveo/nebular/issues/3b5998) [#55](https://github.com/akveo/nebular/issues/55) [#dd4b39](https://github.com/akveo/nebular/issues/dd4b39) [#0177b5](https://github.com/akveo/nebular/issues/0177b5) [#6b6b6](https://github.com/akveo/nebular/issues/6b6b6) [#2f96e8](https://github.com/akveo/nebular/issues/2f96e8) [#f26798](https://github.com/akveo/nebular/issues/f26798) [#0093](https://github.com/akveo/nebular/issues/0093)
- **themes:** fix get-value not working in component context ([#1493](https://github.com/akveo/nebular/issues/1493)) ([30bc29f](https://github.com/akveo/nebular/commit/30bc29f))
- **theming:** fix nb-theme not working in component mode without nb-i… ([#1503](https://github.com/akveo/nebular/issues/1503)) ([0bc9f07](https://github.com/akveo/nebular/commit/0bc9f07))
- **docs:** 4.0 fixes ([#1465](https://github.com/akveo/nebular/issues/1465)) ([46a022c](https://github.com/akveo/nebular/commit/46a022c))
- **docs:** use new popover trigger input name ([#1462](https://github.com/akveo/nebular/issues/1462)) ([8cf7edb](https://github.com/akveo/nebular/commit/8cf7edb))
- **docs:** prefix root css urls with base path ([#1453](https://github.com/akveo/nebular/issues/1453)) ([d42c896](https://github.com/akveo/nebular/commit/d42c896))
- **docs:** trigger change detection if tab updated ([#1445](https://github.com/akveo/nebular/issues/1445)) ([9679e3a](https://github.com/akveo/nebular/commit/9679e3a))
- **docs:** update examples after Eva migration ([#1448](https://github.com/akveo/nebular/issues/1448)) ([bc2ee49](https://github.com/akveo/nebular/commit/bc2ee49))
- **docs:** use current tab component property ([#1447](https://github.com/akveo/nebular/issues/1447)) ([122585a](https://github.com/akveo/nebular/commit/122585a))
- **schematics:** fix eva-icons schematic ([#1380](https://github.com/akveo/nebular/issues/1380)) ([0c809da](https://github.com/akveo/nebular/commit/0c809da))
- **tabset:** prevent select call if no active tab found ([#1444](https://github.com/akveo/nebular/issues/1444)) ([f738f9d](https://github.com/akveo/nebular/commit/f738f9d))
- **checkbox:** rename variables according to property where it used ([#1372](https://github.com/akveo/nebular/issues/1372)) ([2c02daf](https://github.com/akveo/nebular/commit/2c02daf))
- **menu:** add RTL chevron menu icon ([#1042](https://github.com/akveo/nebular/issues/1042)) ([3f6ca4f](https://github.com/akveo/nebular/commit/3f6ca4f))
- **option group:** propagate disabled state to child options ([#1416](https://github.com/akveo/nebular/issues/1416)) ([54da610](https://github.com/akveo/nebular/commit/54da610))
- add missing modules in examples ([#1424](https://github.com/akveo/nebular/issues/1424)) ([1139848](https://github.com/akveo/nebular/commit/1139848))
- remove empty component file ([#1352](https://github.com/akveo/nebular/issues/1352)) ([e0cc301](https://github.com/akveo/nebular/commit/e0cc301))
- **overlay:** set context on component portals before first cd run ([#1395](https://github.com/akveo/nebular/issues/1395)) ([4ff3816](https://github.com/akveo/nebular/commit/4ff3816))
- **select:** allow select to work with empty values in nb-option ([#1282](https://github.com/akveo/nebular/issues/1282)) ([ca4a1ff](https://github.com/akveo/nebular/commit/ca4a1ff))
- **select:** emit array when resetting multiple select ([#1399](https://github.com/akveo/nebular/issues/1399)) ([526cd0e](https://github.com/akveo/nebular/commit/526cd0e))
- **select:** prevent navigation to disabled option from keyboard ([#1427](https://github.com/akveo/nebular/issues/1427)) ([657d8ae](https://github.com/akveo/nebular/commit/657d8ae))

### Features

- **icons:** new `nb-icon` component, icons library, and [@nebular](https://github.com/nebular)/eva-icons package ([#1319](https://github.com/akveo/nebular/issues/1319)) ([621f461](https://github.com/akveo/nebular/commit/621f461))
- **theme:** css variables support ([#1257](https://github.com/akveo/nebular/issues/1257)) ([da136da](https://github.com/akveo/nebular/commit/da136da)), closes [#46](https://github.com/akveo/nebular/issues/46)
- **accordion:** Eva styles ([#1362](https://github.com/akveo/nebular/issues/1362)) ([98a159c](https://github.com/akveo/nebular/commit/98a159c))
- **actions:** Eva style ([#1397](https://github.com/akveo/nebular/issues/1397)) ([6399fab](https://github.com/akveo/nebular/commit/6399fab))
- **alert:** Eva theme ([#1406](https://github.com/akveo/nebular/issues/1406)) ([8c6c677](https://github.com/akveo/nebular/commit/8c6c677))
- **badge:** Eva theme ([#1407](https://github.com/akveo/nebular/issues/1407)) ([c5799df](https://github.com/akveo/nebular/commit/c5799df))
- **button:** Eva style ([#1359](https://github.com/akveo/nebular/issues/1359)) ([1dbddda](https://github.com/akveo/nebular/commit/1dbddda))
- **calendar:** Eva style ([#1365](https://github.com/akveo/nebular/issues/1365)) ([c5f7ead](https://github.com/akveo/nebular/commit/c5f7ead))
- **calendar:** use nb-icon in navigation buttons ([#1388](https://github.com/akveo/nebular/issues/1388)) ([ab52c0c](https://github.com/akveo/nebular/commit/ab52c0c))
- **card:** Eva style ([#1346](https://github.com/akveo/nebular/issues/1346)) ([cd4972c](https://github.com/akveo/nebular/commit/cd4972c))
- **chat:** Eva style ([#1408](https://github.com/akveo/nebular/issues/1408)) ([3433164](https://github.com/akveo/nebular/commit/3433164))
- **checkbox:** Eva style 💅 ([#1311](https://github.com/akveo/nebular/issues/1311)) ([75498aa](https://github.com/akveo/nebular/commit/75498aa))
- **context menu:** Eva style ([#1423](https://github.com/akveo/nebular/issues/1423)) ([ddfb2ee](https://github.com/akveo/nebular/commit/ddfb2ee))
- **datepicker:** Eva style ([#1366](https://github.com/akveo/nebular/issues/1366)) ([d0c28a0](https://github.com/akveo/nebular/commit/d0c28a0))
- **docs:** Eva update ([#1433](https://github.com/akveo/nebular/issues/1433)) ([e4fb525](https://github.com/akveo/nebular/commit/e4fb525))
- **docs:** new landing ([#1412](https://github.com/akveo/nebular/issues/1412)) ([34166a4](https://github.com/akveo/nebular/commit/34166a4))
- **icon:** Eva theme ([#1404](https://github.com/akveo/nebular/issues/1404)) ([16f2d19](https://github.com/akveo/nebular/commit/16f2d19))
- **icons:** new `nb-icon` component, icons library, and [@nebular](https://github.com/nebular)/eva-icons package ([#1319](https://github.com/akveo/nebular/issues/1319)) ([621f461](https://github.com/akveo/nebular/commit/621f461))
- **input:** Eva style ([#1343](https://github.com/akveo/nebular/issues/1343)) ([c9c288b](https://github.com/akveo/nebular/commit/c9c288b))
- **layout:** Eva style ([#1368](https://github.com/akveo/nebular/issues/1368)) ([c373cfc](https://github.com/akveo/nebular/commit/c373cfc))
- **list:** Eva style ([#1363](https://github.com/akveo/nebular/issues/1363)) ([b280112](https://github.com/akveo/nebular/commit/b280112))
- **menu:** Eva style ([#1421](https://github.com/akveo/nebular/issues/1421)) ([0e032b6](https://github.com/akveo/nebular/commit/0e032b6))
- **popover:** Eva style ([#1349](https://github.com/akveo/nebular/issues/1349)) ([6d11c95](https://github.com/akveo/nebular/commit/6d11c95))
- **progress:** Eva style ([#1361](https://github.com/akveo/nebular/issues/1361)) ([06fccf7](https://github.com/akveo/nebular/commit/06fccf7))
- **radio:** Eva style ([#1344](https://github.com/akveo/nebular/issues/1344)) ([3c9eaa2](https://github.com/akveo/nebular/commit/3c9eaa2))
- **search:** Eva theme ([#1419](https://github.com/akveo/nebular/issues/1419)) ([a7e582f](https://github.com/akveo/nebular/commit/a7e582f))
- **select:** Eva style ([#1391](https://github.com/akveo/nebular/issues/1391)) ([53fb3a6](https://github.com/akveo/nebular/commit/53fb3a6))
- **select:** keyboard support ([#1417](https://github.com/akveo/nebular/issues/1417)) ([f8a5c9c](https://github.com/akveo/nebular/commit/f8a5c9c))
- **sidebar:** Eva theme ([#1367](https://github.com/akveo/nebular/issues/1367)) ([8c16fc4](https://github.com/akveo/nebular/commit/8c16fc4))
- **spinner:** Eva style ([#1351](https://github.com/akveo/nebular/issues/1351)) ([da6cfee](https://github.com/akveo/nebular/commit/da6cfee))
- **stepper:** Eva theme ([#1405](https://github.com/akveo/nebular/issues/1405)) ([2d841d0](https://github.com/akveo/nebular/commit/2d841d0))
- **tabset:** Eva style ([#1348](https://github.com/akveo/nebular/issues/1348)) ([25f30c5](https://github.com/akveo/nebular/commit/25f30c5))
- **theme:** cosmic update ([#1420](https://github.com/akveo/nebular/issues/1420)) ([ee07fbc](https://github.com/akveo/nebular/commit/ee07fbc))
- **theme:** css variables support ([#1257](https://github.com/akveo/nebular/issues/1257)) ([da136da](https://github.com/akveo/nebular/commit/da136da)), closes [#46](https://github.com/akveo/nebular/issues/46)
- remove fields scheduled to be removed in 4.0 ([#1439](https://github.com/akveo/nebular/issues/1439)) ([28778f7](https://github.com/akveo/nebular/commit/28778f7))
- remove Nebular 4 theme breaking notice ([#1426](https://github.com/akveo/nebular/issues/1426)) ([be5665e](https://github.com/akveo/nebular/commit/be5665e))
- **toastr:** Eva style ([#1411](https://github.com/akveo/nebular/issues/1411)) ([e10ab2f](https://github.com/akveo/nebular/commit/e10ab2f))
- **tooltip:** Eva style ([#1345](https://github.com/akveo/nebular/issues/1345)) ([85945ac](https://github.com/akveo/nebular/commit/85945ac))
- **tree-grid:** Eva style ([#1409](https://github.com/akveo/nebular/issues/1409)) ([5fac736](https://github.com/akveo/nebular/commit/5fac736))
- **typography:** Eva style ([#1425](https://github.com/akveo/nebular/issues/1425)) ([66b02e6](https://github.com/akveo/nebular/commit/66b02e6))
- **user:** Eva style ([#1354](https://github.com/akveo/nebular/issues/1354)) ([2d05714](https://github.com/akveo/nebular/commit/2d05714))
- specify next version in install instructions ([#1435](https://github.com/akveo/nebular/issues/1435)) ([99ca0c9](https://github.com/akveo/nebular/commit/99ca0c9))
- update corporate theme ([#1434](https://github.com/akveo/nebular/issues/1434)) ([d564454](https://github.com/akveo/nebular/commit/d564454))
- **docs:** add Eva section ([#1552](https://github.com/akveo/nebular/issues/1552)) ([1209d65](https://github.com/akveo/nebular/commit/1209d65))
- **docs:** add routing loader ([#1533](https://github.com/akveo/nebular/issues/1533)) ([dd33a22](https://github.com/akveo/nebular/commit/dd33a22))
- **schematics:** add dark theme ([#1534](https://github.com/akveo/nebular/issues/1534)) ([c5d15c6](https://github.com/akveo/nebular/commit/c5d15c6))
- **typography:** specify body, paragraph and list styles ([#1546](https://github.com/akveo/nebular/issues/1546)) ([310127b](https://github.com/akveo/nebular/commit/310127b))
- **select:** more border and icon theme properties ([#1468](https://github.com/akveo/nebular/issues/1468)) ([9e1c604](https://github.com/akveo/nebular/commit/9e1c604))
- **bootstrap:** update nebular/bootstrap to Eva ([#1507](https://github.com/akveo/nebular/issues/1507)) ([2ff1171](https://github.com/akveo/nebular/commit/2ff1171))
- **select, input:** add max width theme property ([#1480](https://github.com/akveo/nebular/issues/1480)) ([5a6d506](https://github.com/akveo/nebular/commit/5a6d506))
- angular package format ([#1474](https://github.com/akveo/nebular/issues/1474)) ([bbed8c1](https://github.com/akveo/nebular/commit/bbed8c1))
- **themes:** add new Dark theme! ([#1472](https://github.com/akveo/nebular/issues/1472)) ([3b5ad6c](https://github.com/akveo/nebular/commit/3b5ad6c))

### BREAKING CHANGES

- Angular 8+ now required
- **bootstrap:** Bootstrap checkbox and radio are removed now, use Nebular Checkbox and Nebular Radio with better theming support.
- **theme:** The following sass mixins are removed: `nb-radial-gradient`, `nb-right-gradient`.
- **theme:** Theme variables are refactored
- **themes:** - remove `disabled` status for card

* auth now uses `giant` size buttons and inputs

- **themes:** - `nb-theme` function now throws an error if an unused variable is accessed

* custom auth variables are removed and replaced with @nebular/theme variables
* `nb-install` function moved into `@nebular/theme/styles/theming`
* auth components now use `nb-icon` instead of icon css class
* everything not mentioned in packages `public_api.ts` now private so direct imports from `@nebular/theme/*` will stop working.
* [Properties changed in Nebular 4.0.0](https://github.com/akveo/nebular/tree/master/src/framework/theme/350-400-properties-changes.md)
* [Theme variables change in Nebular 4.0.0](https://github.com/akveo/nebular/tree/master/src/framework/theme/350-400-theme-variables-changes.md)
* [Components variables changes in Nebular 4.0.0](https://github.com/akveo/nebular/tree/master/src/framework/theme/350-400-component-variables-changes.md)

- **icons:** Starting from version 4.0, Nebular introduces new `nb-icon` component and `NbIconLibraries` service to host SVG and Font icon packs. As a breaking change, Nebular moves from `nebular-icons` package to much more popular [Eva Icons pack](https://akveo.github.io/eva-icons/) consisting of 480+ beautiful SVG icons. We believe this will bring more quality and variety to interfaces based on Nebular.

Now all Nebular components internally use `<nb-icon></nb-icon>` component utilizing Eva Icons SVG icons. More details on [nb-icon](https://akveo.github.io/nebular/docs/components/icon) component.

There are two ways to upgrade:
**Migrate to Eva Icons** (recommended):

1. install Eva Icons Nebular package `npm i @nebular/eva-icons`
2. register `NbEvaIconsModule` in the `app.module.ts`

```
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  imports: [
  	// ...
    NbEvaIconsModule,
  ],
})
```

3. Search for all usages of `<span icon="nb-*"` or `<i icon="nb-*"`and replace with `<nb-icon icon="icon-name"></nb-icon>`. Full icons list https://akveo.github.io/eva-icons/.

4. Search for `icon: 'nb-*'` references in properties for such components as Menu, Actions, Tabs, etc. Replace those with `icon: 'icon-name'`. Please note, there is no need to specify any icon prefix (such as `eva-` or `nb-`) since prefix is specified when the icon package is registered in Nebular.

5. Update styles if necessary.

6. if you have `nebular-icons` installed, remove the package and all references.

**Continue using nebular-icons**
This option is also possible, but please note, Nebular Component will still use Eva Icons pack for internal component icons, such as `close`, `arrow-down`, `arrow-up`, etc.

1. Register nebular-icons as a pack for Nebular in your `app.component.ts`

```
  import { NbIconLibraries } from '@nebular/theme';

  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerFontPack('nebular', { iconClassPrefix: 'nb' });
    this.iconLibraries.setDefaultPack('nebular');
  }
```

3. Search for all usages of `<span icon="nb-*"` or `<i icon="nb-*"` and replace with `<nb-icon icon="icon-name"></nb-icon>` without the `nb-` prefix since prefix is specified when the icon package is registered in Nebular.

4. Search for `icon: 'nb-*'` references in properties for such components as Menu, Actions, Tabs, etc. Replace those with `icon: 'icon-name'` without `nb-` prefix since it is unnecessary and covered under the hood.

Please open an issue if you have any questions or having difficulties to migrate.

- **theme:** - calendar - use primary button in cosmic theme

* checkbox - `opacity` instead of `lightning`
* context-menu, popover, datepicker - `calc` instead of `round` and scss calculations
* input - `opacity` for placeholder instead of `lightning`
* tabs - remove gradient for tab bottom separator in cosmic theme
* toastr - use `background-color` instead of the gradient in cosmic theme
* text colors are now used from success/primary/warning/etc colors

### Code Refactoring

- **themes:** make map processing lazy, add variable existence check ([#1471](https://github.com/akveo/nebular/issues/1471)) ([48d8f03](https://github.com/akveo/nebular/commit/48d8f03))
- **tabset:** remove shadow ([#1461](https://github.com/akveo/nebular/issues/1461)) ([2c11768](https://github.com/akveo/nebular/commit/2c11768))
- **datepicker:** remove primary border ([#1466](https://github.com/akveo/nebular/issues/1466)) ([f722a48](https://github.com/akveo/nebular/commit/f722a48))
- **overlay:** use full css property name ([#1403](https://github.com/akveo/nebular/issues/1403)) ([4133058](https://github.com/akveo/nebular/commit/4133058))
- **theme:** remove use of scss functions ([#1256](https://github.com/akveo/nebular/issues/1256)) ([fa8d87f](https://github.com/akveo/nebular/commit/fa8d87f)), closes [#1228](https://github.com/akveo/nebular/issues/1228)

<a name="3.5.0"></a>

# [3.5.0](https://github.com/akveo/nebular/compare/v3.4.2...v3.5.0) (2019-04-12)

### Bug Fixes

- remove scss debug calls ([#1339](https://github.com/akveo/nebular/issues/1339)) ([b9bd521](https://github.com/akveo/nebular/commit/b9bd521))
- **calendar:** fix native date service addMonth date overflow ([#1347](https://github.com/akveo/nebular/issues/1347)) ([ffd386c](https://github.com/akveo/nebular/commit/ffd386c))
- **cdk:** fix scroll blocker for custom `withScroll` mode ([#1364](https://github.com/akveo/nebular/issues/1364)) ([34193cc](https://github.com/akveo/nebular/commit/34193cc)), closes [#1158](https://github.com/akveo/nebular/issues/1158) [#1259](https://github.com/akveo/nebular/issues/1259)
- **month picker:** prevent duplicates ([#1377](https://github.com/akveo/nebular/issues/1377)) ([47aff73](https://github.com/akveo/nebular/commit/47aff73))
- **option:** emit selection change when selection is changed ([#1334](https://github.com/akveo/nebular/issues/1334)) ([788a6d4](https://github.com/akveo/nebular/commit/788a6d4))
- **select:** prevent dispose call on uninitialized properties ([#1340](https://github.com/akveo/nebular/issues/1340)) ([a7a158d](https://github.com/akveo/nebular/commit/a7a158d))

### Features

- **search:** input event ([#1038](https://github.com/akveo/nebular/issues/1038)) ([58fa556](https://github.com/akveo/nebular/commit/58fa556))

<a name="3.4.2"></a>

## [3.4.2](https://github.com/akveo/nebular/compare/v3.4.1...v3.4.2) (2019-03-31)

### Highlights

Fixed [regressing in all overlay components failing](https://github.com/akveo/nebular/issues/1289) to open after host component being destroyed and re-created.

### Bug Fixes

- **cdk:** destroy overlay triggers manually ([#1316](https://github.com/akveo/nebular/pull/1316)) ([77b737](https://github.com/akveo/nebular/commit/77b737)), closes [#1292](https://github.com/akveo/nebular/issues/1292), [#1290](https://github.com/akveo/nebular/issues/1290), [#1273](https://github.com/akveo/nebular/issues/1273), [#1289](https://github.com/akveo/nebular/issues/1289)
- **docs:** keep nb-fs-icon in tree-grid showcase only ([#1330](https://github.com/akveo/nebular/issues/1330)) ([0e1f432](https://github.com/akveo/nebular/commit/0e1f432))
- **menu:** highlight when active anchors ([#1034](https://github.com/akveo/nebular/issues/1034)) ([c14215a](https://github.com/akveo/nebular/commit/c14215a)), closes [#875](https://github.com/akveo/nebular/issues/875)
- **select:** prevent change detection of destroyed option ([#1329](https://github.com/akveo/nebular/issues/1329)) ([9e2245f](https://github.com/akveo/nebular/commit/9e2245f))

<a name="3.4.1"></a>

## [3.4.1](https://github.com/akveo/nebular/compare/v3.4.0...v3.4.1) (2019-03-18)

### Bug Fixes

- **context-menu:** updated context menu arrow left position calculation ([#1268](https://github.com/akveo/nebular/issues/1268)) ([0db8c2c](https://github.com/akveo/nebular/commit/0db8c2c)), closes [#973](https://github.com/akveo/nebular/issues/973)
- **date service:** prevent format calls if date isn't passed ([#1291](https://github.com/akveo/nebular/issues/1291)) ([a3d6035](https://github.com/akveo/nebular/commit/a3d6035))
- **datepicker:** start from date typed in input ([#1300](https://github.com/akveo/nebular/issues/1300)) ([dfc75f0](https://github.com/akveo/nebular/commit/dfc75f0))
- **docs:** add search container class ([#1270](https://github.com/akveo/nebular/issues/1270)) ([e1a84f4](https://github.com/akveo/nebular/commit/e1a84f4))
- **select:** update selected after cd run is finished ([#1299](https://github.com/akveo/nebular/issues/1299)) ([2a1f113](https://github.com/akveo/nebular/commit/2a1f113))
- **window:** Fixed window.component.ts creating incorrect context ([#1266](https://github.com/akveo/nebular/issues/1266)) ([30f4a5d](https://github.com/akveo/nebular/commit/30f4a5d))

### Features

- **playground:** add without-styles folder for bootstrap like use-cases ([#1271](https://github.com/akveo/nebular/issues/1271)) ([8e852ca](https://github.com/akveo/nebular/commit/8e852ca))
- **smoke:** include packages-smoke update into release ([#1258](https://github.com/akveo/nebular/issues/1258)) ([8db4b29](https://github.com/akveo/nebular/commit/8db4b29))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/akveo/nebular/compare/v3.3.0...v3.4.0) (2019-02-25)

### Bug Fixes

- **datepicker:** make it valid in case of empty input ([#1247](https://github.com/akveo/nebular/issues/1247)) ([799b8b8](https://github.com/akveo/nebular/commit/799b8b8)), closes [#1182](https://github.com/akveo/nebular/issues/1182)
- **docs:** fix password strategy link ([#1245](https://github.com/akveo/nebular/issues/1245)) ([c71d9fd](https://github.com/akveo/nebular/commit/c71d9fd))

### Dev Features

- **route-tabset:** configurable routerLinkActiveOptions ([#1239](https://github.com/akveo/nebular/issues/1239)) ([3cf29d8](https://github.com/akveo/nebular/commit/3cf29d8))
- **tree-grid:** allow specify getters for node properties ([#1254](https://github.com/akveo/nebular/issues/1254)) ([a263a2e](https://github.com/akveo/nebular/commit/a263a2e))

<a name="3.3.0"></a>

# [3.3.0](https://github.com/akveo/nebular/compare/v3.2.1...v3.3.0) (2019-02-18)

### Highlights

New [Tree Grid](https://akveo.github.io/nebular/docs/components/tree-grid/overview) component is here! :palm_tree:

### Bug Fixes

- **auth:** allow empty logout endpoint ([#1211](https://github.com/akveo/nebular/issues/1211)) ([564138d](https://github.com/akveo/nebular/commit/564138d))
- **datepicker:** date fns date format ([#1172](https://github.com/akveo/nebular/issues/1172)) ([257eb9a](https://github.com/akveo/nebular/commit/257eb9a))
- **dialog:** accept partial of component in NbDialogService open context ([#1175](https://github.com/akveo/nebular/issues/1175)) ([9a5f4d9](https://github.com/akveo/nebular/commit/9a5f4d9)), closes [#1173](https://github.com/akveo/nebular/issues/1173)
- **docs:** footer email link ([#1206](https://github.com/akveo/nebular/issues/1206)) ([2e44bbc](https://github.com/akveo/nebular/commit/2e44bbc))
- **layout:** typo in basic usage example ([#1213](https://github.com/akveo/nebular/issues/1213)) ([6b21fe3](https://github.com/akveo/nebular/commit/6b21fe3)), closes [#1212](https://github.com/akveo/nebular/issues/1212)
- **menu:** correct example property usage ([#1216](https://github.com/akveo/nebular/issues/1216)) ([87ecccf](https://github.com/akveo/nebular/commit/87ecccf))
- **security:** make config work with strict ts mode ([#1215](https://github.com/akveo/nebular/issues/1215)) ([7c78d6c](https://github.com/akveo/nebular/commit/7c78d6c)), closes [#1166](https://github.com/akveo/nebular/issues/1166)
- **toastr:** recreate container if it's not attached to dom ([#1224](https://github.com/akveo/nebular/issues/1224)) ([3343136](https://github.com/akveo/nebular/commit/3343136)), closes [#1099](https://github.com/akveo/nebular/issues/1099)

### Features

- **context-menu:** add dynamic inputs ([#1221](https://github.com/akveo/nebular/issues/1221)) ([9f8d659](https://github.com/akveo/nebular/commit/9f8d659)), closes [#1101](https://github.com/akveo/nebular/issues/1101) [#1073](https://github.com/akveo/nebular/issues/1073)
- **docs:** [@docs-private](https://github.com/docs-private) support ([#1231](https://github.com/akveo/nebular/issues/1231)) ([dc33127](https://github.com/akveo/nebular/commit/dc33127))
- **theme:** multiple values for nb-(except-)for-theme ([#1218](https://github.com/akveo/nebular/issues/1218)) ([6c9e11c](https://github.com/akveo/nebular/commit/6c9e11c))
- **theme:** add new TreeGrid component ([#1226](https://github.com/akveo/nebular/issues/1226)) ([6c9e11c](https://github.com/akveo/nebular/commit/3d64818))

<a name="3.2.1"></a>

## [3.2.1](https://github.com/akveo/nebular/compare/v3.2.0...v3.2.1) (2019-01-31)

### Bug Fixes

- **popover:** get back default 15px offset ([#1201](https://github.com/akveo/nebular/issues/1201)) ([f7433e7](https://github.com/akveo/nebular/commit/f7433e7))

<a name="3.2.0"></a>

# [3.2.0](https://github.com/akveo/nebular/compare/v3.1.0...v3.2.0) (2019-01-31)

Popover and Tooltip components can accept dynamic :rocket: content through bindings or code.

### Bug Fixes

- **docs:** prevent scrolling when user scroll ([#982](https://github.com/akveo/nebular/issues/982)) ([bc2ab1d](https://github.com/akveo/nebular/commit/bc2ab1d)), closes [#810](https://github.com/akveo/nebular/issues/810)
- **layout:** set document dir directly ([#1164](https://github.com/akveo/nebular/issues/1164)) ([37eaea7](https://github.com/akveo/nebular/commit/37eaea7))
- **popover:** fix template context not being passed, update cdk to 7.2.1 ([#1153](https://github.com/akveo/nebular/issues/1153)) ([c83188c](https://github.com/akveo/nebular/commit/c83188c)), closes [#1084](https://github.com/akveo/nebular/issues/1084) [#848](https://github.com/akveo/nebular/issues/848)
- **router-tabset:** navigate using router link ([#1146](https://github.com/akveo/nebular/issues/1146)) ([cb1c21e](https://github.com/akveo/nebular/commit/cb1c21e)), closes [#188](https://github.com/akveo/nebular/issues/188)
- **search:** emit activate and deactivate events ([#1162](https://github.com/akveo/nebular/issues/1162)) ([67c5718](https://github.com/akveo/nebular/commit/67c5718))
- **tooltip:** fix tooltip not being hide + tests ([#1123](https://github.com/akveo/nebular/issues/1123)) ([9360a4b](https://github.com/akveo/nebular/commit/9360a4b))

### Features

- **action:** provide new attributes for link and title ([#1046](https://github.com/akveo/nebular/issues/1046)) ([30bd394](https://github.com/akveo/nebular/commit/30bd394)), closes [#814](https://github.com/akveo/nebular/issues/814)
- **context-menu:** add `nbContextMenuTrigger` parameter ([#1139](https://github.com/akveo/nebular/issues/1139)) ([27b291e](https://github.com/akveo/nebular/commit/27b291e)), closes [#1112](https://github.com/akveo/nebular/issues/1112)
- **overlay:** add noop trigger strategy ([#1133](https://github.com/akveo/nebular/issues/1133)) ([1e43929](https://github.com/akveo/nebular/commit/1e43929))
- **popover:** add ability for dynamic input ([#1149](https://github.com/akveo/nebular/issues/1149)) ([d427e59](https://github.com/akveo/nebular/commit/d427e59)), closes [#953](https://github.com/akveo/nebular/issues/953) [#1142](https://github.com/akveo/nebular/issues/1142)
- **stepper:** add disable step navigation setting ([#1155](https://github.com/akveo/nebular/issues/1155)) ([e1503cc](https://github.com/akveo/nebular/commit/e1503cc)), closes [#902](https://github.com/akveo/nebular/issues/902)
- **stepper:** add linear mode ([#1151](https://github.com/akveo/nebular/issues/1151)) ([db5d214](https://github.com/akveo/nebular/commit/db5d214)), closes [#1040](https://github.com/akveo/nebular/issues/1040)
- **tabs:** add `disabled` property ([#1141](https://github.com/akveo/nebular/issues/1141)) ([ea7b209](https://github.com/akveo/nebular/commit/ea7b209)), closes [#387](https://github.com/akveo/nebular/issues/387)
- **tooltip:** add new `nbTooltipTrigger` parameter ([#1138](https://github.com/akveo/nebular/issues/1138)) ([113d3b0](https://github.com/akveo/nebular/commit/113d3b0))
- **tooltip:** dynamic inputs support ([#1184](https://github.com/akveo/nebular/issues/1184)) ([9ce7019](https://github.com/akveo/nebular/commit/9ce7019)), closes [#1052](https://github.com/akveo/nebular/issues/1052) [#1159](https://github.com/akveo/nebular/issues/1159)

<a name="3.1.0"></a>

# [3.1.0](https://github.com/akveo/nebular/compare/v3.0.1...v3.1.0) (2018-12-31) :christmas_tree:

Happy New Year!

### Bug Fixes

- **datepicker:** fix datepicker format not available error ([#1117](https://github.com/akveo/nebular/issues/1117)) ([83cda23](https://github.com/akveo/nebular/commit/83cda23)), closes [#1088](https://github.com/akveo/nebular/issues/1088)
- **docs:** add missed backtick ([#1069](https://github.com/akveo/nebular/issues/1069)) ([3324fd5](https://github.com/akveo/nebular/commit/3324fd5))
- **docs:** remove rc version mention ([#1068](https://github.com/akveo/nebular/issues/1068)) ([ba1983c](https://github.com/akveo/nebular/commit/ba1983c))
- **layout:** prevent dom api calls on server ([#1107](https://github.com/akveo/nebular/issues/1107)) ([7511bb0](https://github.com/akveo/nebular/commit/7511bb0)), closes [#1060](https://github.com/akveo/nebular/issues/1060)
- **oauth2:** body requests in x-www-form-urlencoded ([#1066](https://github.com/akveo/nebular/issues/1066)) ([3ee11f2](https://github.com/akveo/nebular/commit/3ee11f2))
- **popover:** null check the ref before disposing ([#1086](https://github.com/akveo/nebular/issues/1086)) ([b3f7d39](https://github.com/akveo/nebular/commit/b3f7d39))
- **select:** options text selection disabled ([#1033](https://github.com/akveo/nebular/issues/1033)) ([fef2a9a](https://github.com/akveo/nebular/commit/fef2a9a))
- **theme:** check ref before detaching ([#1116](https://github.com/akveo/nebular/issues/1116)) ([af58d3f](https://github.com/akveo/nebular/commit/af58d3f))
- **theme:** fix normalize import to not include file type extension ([#1114](https://github.com/akveo/nebular/issues/1114)) ([40fa356](https://github.com/akveo/nebular/commit/40fa356))

### Features

- **menu:** add an option to set skipLocationChange ([#1043](https://github.com/akveo/nebular/issues/1043)) ([3d3ee03](https://github.com/akveo/nebular/commit/3d3ee03)), closes [#1028](https://github.com/akveo/nebular/issues/1028)
- **playground:** components list ([#1106](https://github.com/akveo/nebular/issues/1106)) ([4ab7508](https://github.com/akveo/nebular/commit/4ab7508)), closes [#1077](https://github.com/akveo/nebular/issues/1077)
- **toastr:** show method now returns toast reference ([#1058](https://github.com/akveo/nebular/issues/1058)) ([aeeedf1](https://github.com/akveo/nebular/commit/aeeedf1))

<a name="3.0.1"></a>

## [3.0.1](https://github.com/akveo/nebular/compare/v3.0.0...v3.0.1) (2018-12-13)

### Bug Fixes

- **button:** return text color on focus ([#1030](https://github.com/akveo/nebular/issues/1030)) ([230c83e](https://github.com/akveo/nebular/commit/230c83e))
- **popover:** inner triangle size ([#1020](https://github.com/akveo/nebular/issues/1020)) ([fe078c7](https://github.com/akveo/nebular/commit/fe078c7))
- **select:** disable layout scrolling ([#1012](https://github.com/akveo/nebular/issues/1012)) ([1bd8214](https://github.com/akveo/nebular/commit/1bd8214)), closes [#992](https://github.com/akveo/nebular/issues/992)
- **select:** resubscribe on options changes ([#1009](https://github.com/akveo/nebular/issues/1009)) ([949b050](https://github.com/akveo/nebular/commit/949b050))
- **window:** reattach overlay after window expand ([#1022](https://github.com/akveo/nebular/issues/1022)) ([4b9c648](https://github.com/akveo/nebular/commit/4b9c648))

### Features

- **chat:** add `scrollBottom` chat option ([#1001](https://github.com/akveo/nebular/issues/1001)) ([d393f33](https://github.com/akveo/nebular/commit/d393f33)), closes [#921](https://github.com/akveo/nebular/issues/921)

<a name="3.0.0"></a>

# [3.0.0](https://github.com/akveo/nebular/compare/v2.0.2...v3.0.0) (2018-11-15)

### Bug Fixes

- **overlay:** hover trigger stop fire show if container already exists ([#947](https://github.com/akveo/nebular/issues/947)) ([2988a4b](https://github.com/akveo/nebular/commit/2988a4b))
- **select:** add type button, stop form submitting ([#945](https://github.com/akveo/nebular/issues/945)) ([255fca9](https://github.com/akveo/nebular/commit/255fca9))
- **sidebar:** expand if not compacted or collapsed ([#984](https://github.com/akveo/nebular/issues/984)) ([33a0990](https://github.com/akveo/nebular/commit/33a0990))
- **theme:** provide component factory resolver in tooltip ([#981](https://github.com/akveo/nebular/issues/981)) ([57777f8](https://github.com/akveo/nebular/commit/57777f8)), closes [#979](https://github.com/akveo/nebular/issues/979)
- **toastr:** animations in firefox and edge ([#944](https://github.com/akveo/nebular/issues/944)) ([27e4a6a](https://github.com/akveo/nebular/commit/27e4a6a)), closes [#865](https://github.com/akveo/nebular/issues/865)

### Features

- **datepicker:** throw error when setting format for native date ([#986](https://github.com/akveo/nebular/issues/986)) ([3e9df5d](https://github.com/akveo/nebular/commit/3e9df5d))
- **docs:** add eva icons link in the footer ([#963](https://github.com/akveo/nebular/issues/963)) ([c230986](https://github.com/akveo/nebular/commit/c230986))
- **theme:** ng-add schematic ([#942](https://github.com/akveo/nebular/issues/942)) ([5d5a874](https://github.com/akveo/nebular/commit/5d5a874))

### BREAKING CHANGES

- Angular 7+ now required.

<a name="2.0.2"></a>

## [2.0.2](https://github.com/akveo/nebular/compare/v2.0.1...v2.0.2) (2018-10-23)

### Bug Fixes

- **auth:** don't import child routes as it will rewrite the app routes ([#920](https://github.com/akveo/nebular/issues/920)) ([d054a73](https://github.com/akveo/nebular/commit/d054a73))
- **auth:** don't import http module ([#919](https://github.com/akveo/nebular/issues/919)) ([995de58](https://github.com/akveo/nebular/commit/995de58)), closes [#631](https://github.com/akveo/nebular/issues/631)
- **calendar:** show day in today's date ([#899](https://github.com/akveo/nebular/issues/899)) ([e023aa3](https://github.com/akveo/nebular/commit/e023aa3))
- **checkbox:** hide check mark when unchecked and disabled ([#863](https://github.com/akveo/nebular/issues/863)) ([c7205d4](https://github.com/akveo/nebular/commit/c7205d4)), closes [#862](https://github.com/akveo/nebular/issues/862)
- **docs:** fix dead links and code examples ([#905](https://github.com/akveo/nebular/issues/905)) ([d8307c9](https://github.com/akveo/nebular/commit/d8307c9))
- **form controls:** mark as touched ([#864](https://github.com/akveo/nebular/issues/864)) ([e06d3a7](https://github.com/akveo/nebular/commit/e06d3a7))
- **nbButton:** set disabled DOM property ([#871](https://github.com/akveo/nebular/issues/871)) ([23a709d](https://github.com/akveo/nebular/commit/23a709d))
- **oauth2:** grant_type now sends credentials in x-www-form-urlencoded form ([#832](https://github.com/akveo/nebular/issues/832)) ([57fda28](https://github.com/akveo/nebular/commit/57fda28)), closes [#716](https://github.com/akveo/nebular/issues/716)
- **overlay:** fix click trigger ([#912](https://github.com/akveo/nebular/issues/912)) ([08c2eb6](https://github.com/akveo/nebular/commit/08c2eb6)), closes [#907](https://github.com/akveo/nebular/issues/907)
- **select:** run change detection after setting initial value ([#898](https://github.com/akveo/nebular/issues/898)) ([5cf94f2](https://github.com/akveo/nebular/commit/5cf94f2))
- **theme:** fix sidebar shadow styles for Safari ([#909](https://github.com/akveo/nebular/issues/909)) ([031b1e6](https://github.com/akveo/nebular/commit/031b1e6)), closes [#562](https://github.com/akveo/nebular/issues/562)
- **theme:** remove a fixed content height ([#882](https://github.com/akveo/nebular/issues/882)) ([a85eaf2](https://github.com/akveo/nebular/commit/a85eaf2)), closes [#836](https://github.com/akveo/nebular/issues/836)
- **tabset:** add style incapsulation for tabset components ([#911](https://github.com/akveo/nebular/issues/911)) ([33162af](https://github.com/akveo/nebular/commit/33162af)), closes [#561](https://github.com/akveo/nebular/issues/561)

<a name="2.0.1"></a>

## [2.0.1](https://github.com/akveo/nebular/compare/v2.0.0...v2.0.1) (2018-10-03)

### Bug Fixes

- **datepicker:** fix datepicker spec ([#850](https://github.com/akveo/nebular/issues/850)) ([a69e681](https://github.com/akveo/nebular/commit/a69e681))
- **playground:** use nebular buttons in examples ([#849](https://github.com/akveo/nebular/issues/849)) ([b8c3148](https://github.com/akveo/nebular/commit/b8c3148))
- **theme:** fix overlay components providers import ([#858](https://github.com/akveo/nebular/issues/858)) ([843a6c6](https://github.com/akveo/nebular/commit/843a6c6))
- **theme:** inline cdk styles ([#857](https://github.com/akveo/nebular/issues/857)) ([e218df4](https://github.com/akveo/nebular/commit/e218df4)), closes [#856](https://github.com/akveo/nebular/issues/856)

<a name="2.0.0"></a>

# [2.0.0](https://github.com/akveo/nebular/compare/2.0.0-rc.10...2.0.0) (2018-10-02)

### Highlights

Nebular 2.0 is stable now! After 10 release candidates and a year of work we finally made it with a great help of Nebular community and we cannot be more grateful for all of your contributions! :tada:

### Bug Fixes

- **auth:** fix OAuth2 strategy grant_type password to send username, not email ([#659](https://github.com/akveo/nebular/issues/659)) ([3a708dd](https://github.com/akveo/nebular/commit/3a708dd)), closes [#653](https://github.com/akveo/nebular/issues/653)
- **auth:** fix `isAuthenticatedOrRefresh` to not refresh token with no value ([#708](https://github.com/akveo/nebular/issues/708)) ([b29418f](https://github.com/akveo/nebular/commit/b29418f))
- **button:** fix outline button ([0bcad95](https://github.com/akveo/nebular/commit/0bcad95))
- **calendar:** use nbButton in calendar navigation ([#837](https://github.com/akveo/nebular/issues/837)) ([f460f85](https://github.com/akveo/nebular/commit/f460f85)), closes [#827](https://github.com/akveo/nebular/issues/827)
- **checkbox, radio:** check mark positioning in IE ([#830](https://github.com/akveo/nebular/issues/830)) ([ac52315](https://github.com/akveo/nebular/commit/ac52315)), closes [#743](https://github.com/akveo/nebular/issues/743)
- **docs:**  fix warning `Invalid value for $grid-breakpoints..` ([#736](https://github.com/akveo/nebular/issues/736)) ([23e7804](https://github.com/akveo/nebular/commit/23e7804))
- **docs:** add radio icon ([#748](https://github.com/akveo/nebular/issues/748)) ([9110266](https://github.com/akveo/nebular/commit/9110266))
- **docs:** fix mention of angular-cli.json file to `angular.json` ([#701](https://github.com/akveo/nebular/issues/701)) ([3211c54](https://github.com/akveo/nebular/commit/3211c54))
- **e2e:** add redundance note in protractor.conf.ci.js ([#839](https://github.com/akveo/nebular/issues/839)) ([a7ed638](https://github.com/akveo/nebular/commit/a7ed638))
- **infinite-list:** fix example file path ([60d0d1e](https://github.com/akveo/nebular/commit/60d0d1e))
- **login:** take into account remember me setting ([#644](https://github.com/akveo/nebular/issues/644)) ([d35b65b](https://github.com/akveo/nebular/commit/d35b65b)), closes [#330](https://github.com/akveo/nebular/issues/330)
- **menu:** height calculation ([#621](https://github.com/akveo/nebular/issues/621)) ([7542d5e](https://github.com/akveo/nebular/commit/7542d5e)), closes [#620](https://github.com/akveo/nebular/issues/620) [#369](https://github.com/akveo/nebular/issues/369) [#532](https://github.com/akveo/nebular/issues/532) [#307](https://github.com/akveo/nebular/issues/307) [#444](https://github.com/akveo/nebular/issues/444) [#392](https://github.com/akveo/nebular/issues/392) [akveo/ngx-admin#1703](https://github.com/akveo/ngx-admin/issues/1703) [akveo/ngx-admin#1819](https://github.com/akveo/ngx-admin/issues/1819)
- **modal:** rtl modal header ([#632](https://github.com/akveo/nebular/issues/632)) ([0370abe](https://github.com/akveo/nebular/commit/0370abe)), closes [#419](https://github.com/akveo/nebular/issues/419)
- **overlay:** z-index ([#735](https://github.com/akveo/nebular/issues/735)) ([9c22a52](https://github.com/akveo/nebular/commit/9c22a52))
- **popover:** fix popover component example ([#711](https://github.com/akveo/nebular/issues/711)) ([9980664](https://github.com/akveo/nebular/commit/9980664)), closes [#618](https://github.com/akveo/nebular/issues/618) [#619](https://github.com/akveo/nebular/issues/619)
- **radio:** radio group ngModel doesn't setup initial value ([#842](https://github.com/akveo/nebular/issues/842)) ([92b6f6b](https://github.com/akveo/nebular/commit/92b6f6b))
- **radio:** radio group now has bigger priority when setting value and disabled ([#841](https://github.com/akveo/nebular/issues/841)) ([99acd25](https://github.com/akveo/nebular/commit/99acd25))
- **scripts:** add moment and date-fns bundles ([#818](https://github.com/akveo/nebular/issues/818)) ([c78ae5f](https://github.com/akveo/nebular/commit/c78ae5f))
- **tabset:** removes bold emphasize for hovered tab ([#651](https://github.com/akveo/nebular/issues/651)) ([22e39eb](https://github.com/akveo/nebular/commit/22e39eb)), closes [#540](https://github.com/akveo/nebular/issues/540)
- **theme:** add nebular-icons as peer dependency ([#749](https://github.com/akveo/nebular/issues/749)) ([3e3fe1d](https://github.com/akveo/nebular/commit/3e3fe1d)), closes [#195](https://github.com/akveo/nebular/issues/195)
- **theme:** use existing variable for bootstrap ([#807](https://github.com/akveo/nebular/issues/807)) ([e91f557](https://github.com/akveo/nebular/commit/e91f557)), closes [#739](https://github.com/akveo/nebular/issues/739)

### Code Refactoring

- **auth:** rejects malformed tokens ([#597](https://github.com/akveo/nebular/issues/597)) ([127b5d2](https://github.com/akveo/nebular/commit/127b5d2)), closes [#517](https://github.com/akveo/nebular/issues/517)
- **menu:** emit itemClick event after clicking on item with link ([#728](https://github.com/akveo/nebular/issues/728)) ([94342e0](https://github.com/akveo/nebular/commit/94342e0)), closes [#423](https://github.com/akveo/nebular/issues/423)
- **menu:** replace item click ReplaySubject with plain Subject ([#724](https://github.com/akveo/nebular/issues/724)) ([eb6e74b](https://github.com/akveo/nebular/commit/eb6e74b)), closes [#695](https://github.com/akveo/nebular/issues/695)
- **theme:** refactor popover, context-menu and search components to use overlays ([#684](https://github.com/akveo/nebular/issues/684)) ([d3ba6ab](https://github.com/akveo/nebular/commit/d3ba6ab)), closes [#683](https://github.com/akveo/nebular/issues/683) [#664](https://github.com/akveo/nebular/issues/664) [#668](https://github.com/akveo/nebular/issues/668)
- **theme:** remove angular2-toaster styling ([#721](https://github.com/akveo/nebular/issues/721)) ([026974e](https://github.com/akveo/nebular/commit/026974e))
- **theme:** separate bootstrap styles into [@nebular](https://github.com/nebular)/bootstrap ([#707](https://github.com/akveo/nebular/issues/707)) ([a25f615](https://github.com/akveo/nebular/commit/a25f615)), closes [#230](https://github.com/akveo/nebular/issues/230)

### Features

- **auth:** add new `isAuthenticatedOrRefresh` method, update `NbAuthJWTInterceptor` to refresh the token ([#649](https://github.com/akveo/nebular/issues/649)) ([c8e8964](https://github.com/akveo/nebular/commit/c8e8964))
- **auth:** remove bootstrap, use custom styles ([#738](https://github.com/akveo/nebular/issues/738)) ([b585490](https://github.com/akveo/nebular/commit/b585490))
- **calendar:** add capability to hide header ([#838](https://github.com/akveo/nebular/issues/838)) ([df9b21c](https://github.com/akveo/nebular/commit/df9b21c)), closes [#828](https://github.com/akveo/nebular/issues/828)
- **checkbox:** add outline on focus ([#731](https://github.com/akveo/nebular/issues/731)) ([cc892d5](https://github.com/akveo/nebular/commit/cc892d5))
- **docs:** add groups to components list ([#646](https://github.com/akveo/nebular/issues/646)) ([73cf1b4](https://github.com/akveo/nebular/commit/73cf1b4))
- **docs:** add installation guides ([#740](https://github.com/akveo/nebular/issues/740)) ([d08c4d5](https://github.com/akveo/nebular/commit/d08c4d5))
- **docs:** add star & download badges into the hero section ([#813](https://github.com/akveo/nebular/issues/813)) ([c3c755a](https://github.com/akveo/nebular/commit/c3c755a))
- **docs:** fix typo in security docs ([#717](https://github.com/akveo/nebular/issues/717)) ([fc3b2d4](https://github.com/akveo/nebular/commit/fc3b2d4))
- **docs:** update akveo logo ([#674](https://github.com/akveo/nebular/issues/674)) ([5d79c2a](https://github.com/akveo/nebular/commit/5d79c2a))
- **icons:** add new icons ([#722](https://github.com/akveo/nebular/issues/722)) ([be06906](https://github.com/akveo/nebular/commit/be06906))
- **playground:** automatic refresh token ([#658](https://github.com/akveo/nebular/issues/658)) ([b4fc624](https://github.com/akveo/nebular/commit/b4fc624))
- **sidebar:** add ability fix sidebar container ([#642](https://github.com/akveo/nebular/issues/642)) ([7939344](https://github.com/akveo/nebular/commit/7939344))
- **sidebar:** add ability fix sidebar container on low resolutions ([#645](https://github.com/akveo/nebular/issues/645)) ([efa16ef](https://github.com/akveo/nebular/commit/efa16ef))
- **tabset:** update background fot tabset selected ([#643](https://github.com/akveo/nebular/issues/643)) ([ff8e9b6](https://github.com/akveo/nebular/commit/ff8e9b6))
- **theme:** add cdk ([#679](https://github.com/akveo/nebular/issues/679)) ([b9283d3](https://github.com/akveo/nebular/commit/b9283d3)), closes [#661](https://github.com/akveo/nebular/issues/661) [#660](https://github.com/akveo/nebular/issues/660)
- **theme:** add new DatePicker component ([#732](https://github.com/akveo/nebular/issues/732)) ([c00cc23](https://github.com/akveo/nebular/commit/c00cc23))
- **theme:** add new Dialog component ([#688](https://github.com/akveo/nebular/issues/688)) ([2edd9b3](https://github.com/akveo/nebular/commit/2edd9b3)), closes [#666](https://github.com/akveo/nebular/issues/666) [#665](https://github.com/akveo/nebular/issues/665)
- **theme:** add new Radio component ([#746](https://github.com/akveo/nebular/issues/746)) ([9e04681](https://github.com/akveo/nebular/commit/9e04681))
- **theme:** add new Select component ([#698](https://github.com/akveo/nebular/issues/698)) ([d6a211f](https://github.com/akveo/nebular/commit/d6a211f)), closes [#671](https://github.com/akveo/nebular/issues/671)
- **theme:** add new Toastr component ([#692](https://github.com/akveo/nebular/issues/692)) ([29e4fef](https://github.com/akveo/nebular/commit/29e4fef)), closes [#667](https://github.com/akveo/nebular/issues/667)
- **theme:** add new Tooltip component ([#703](https://github.com/akveo/nebular/issues/703)) ([0e05034](https://github.com/akveo/nebular/commit/0e05034)), closes [#663](https://github.com/akveo/nebular/issues/663)
- **theme:** add new Window component ([#713](https://github.com/akveo/nebular/issues/713)) ([60a65cb](https://github.com/akveo/nebular/commit/60a65cb)), closes [#669](https://github.com/akveo/nebular/issues/669)

### HOW TO UPGRADE/BREAKING CHANGES

#### Steps

This release has introduced a number of changes which may required some manual update steps, depending on your setup:

1. In case if you use Nebular overrides of bootstrap styles - you need to manually install new `@nebular/bootstrap` package. To do that:

- install Nebular Bootstrap `npm i @nebular/bootstrap`
- then add it into your `styles.scss`

```
@import '~@nebular/bootstrap/styles/globals';
// ...

@include nb-install() {
  // ...
  @include nb-bootstrap-global();
}
```

- if you import `~@nebular/theme/styles/global/bootstrap/breakpoints` in your code, replace it with `~@nebular/theme/styles/global/breakpoints`
- if you import `~@nebular/theme/styles/global/bootstrap/*.scss` somewhere in your code, replace it with `~@nebular/bootstrap/styles/*.scss`

2. Nebular 2.0 introduced a new peer dependency - @angular/cdk. A lot of out of the box functionality provided by @angular team gives our components a solid foundation. To do that:

- install @angular/cdk
  `npm i @angular/cdk`

#### Breaking Changes

Here's a list of other possibly breaking changes that you may need to take into account:

- **menu:** `NbMenuComponent` and `NbContextMenuDirective` now fire itemClick even if item with `routerLink` was clicked.
- **menu:** The `NbMenuService` not reply the last click event. To update: if you use the knowledge that the last click event is replied you can wrap `onItemClick` stream in the custom stream based on `ReplaySubject`.
- **theme:** angular2-toaster styles were removed from Nebular.
  Instead, we suggest using our new `NbToastrService`. To update: add `NbToastrModule` into imports of your `app.module`.
  Inject `NbToastrService` into the required component.
  call `NbToastrService.show(...)` to render toasts.
  For more information check [toastr documentation](https://akveo.github.io/nebular/docs/components/toastr).
- **theme:** All bootstrap override styles were moved from the @nebular/theme package to the new @nebular/bootstrap package. If you don't need bootstrap support you can simply no use this package.
  @nebular/theme package introduced a dependency of normalize.css. To update:

  - install Nebular Bootstrap `npm i @nebular/bootstrap`
  - then add it into your `styles.scss`

  ```scss
  @import '~@nebular/bootstrap/styles/globals';
  // ...

  @include nb-install() {
    // ...
    @include nb-bootstrap-global();
  }
  ```

- **theme:** `appendToLayoutTop` and `clearLayoutTop` methods was removed from `NbThemeService`. Instead of this methods, you have to use `NbOverlayService`. It's the extension of @angular/cdk overlays, so, check [documentation](https://material.angular.io/cdk/overlay/overview) first of all. Basic usage of overlays may look like this:

  ```ts
  constructor(protected overlay: NbOverlayService) {
  }

  const overlayRef = overlay.create();
  const overlayComponentPortal = new ComponentPortal(MyOverlayComponent);
  overlayRef.attach(overlayComponentPortal);
  ```

- **tabset:** Possibly a breaking change since tabs won't be bold in hover state.
- **auth:** According to RFC6749 section 4.3.2, the OAuth2 token request body with grant-type='password' must provide `username` to the auth server and not `email`.
- **auth:** `NbAuthJWTInterceptor` now always tries to refresh the token.
  Urls for token sending can be filtered using a filter function:

```
{ provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: (req) => filter(req)},
```

- **auth:** `failWhenNoToken` has been removed from password strategy as it was still not released and becoming redundant

<a name="2.0.0-rc.10"></a>

# [2.0.0-rc.10](https://github.com/akveo/nebular/compare/2.0.0-rc.9...2.0.0-rc.10) (2018-08-08)

### Highlights

- Bunch of new components: Button, Input, Calendar, Chat UI, List, Infinite List, Spinner, Stepper
- New Auth `NbAuthOAuth2JWTToken`
- Icons in tabs, `subheader` header option, and other cool stuff!

### Bug Fixes

- **accordion:** fix accordion border-radius and shadow ([#584](https://github.com/akveo/nebular/issues/584)) ([22ba6ef](https://github.com/akveo/nebular/commit/22ba6ef))
- **auth:** fix token parceler suppressing `getClassByName` errors ([#548](https://github.com/akveo/nebular/issues/548)) ([ac41765](https://github.com/akveo/nebular/commit/ac41765)), closes [#528](https://github.com/akveo/nebular/issues/528)
- **checkbox:** fix disable state with reactive forms ([#599](https://github.com/akveo/nebular/issues/599)) ([7d8beea](https://github.com/akveo/nebular/commit/7d8beea)), closes [#296](https://github.com/akveo/nebular/issues/296)
- **docs:** add a note about new theme ([#504](https://github.com/akveo/nebular/issues/504)) ([872645c](https://github.com/akveo/nebular/commit/872645c))
- **docs:** delay first calculation of examples' height ([#586](https://github.com/akveo/nebular/issues/586)) ([9a74fc1](https://github.com/akveo/nebular/commit/9a74fc1))
- **docs:** fix auth md article formatting ([ac0f668](https://github.com/akveo/nebular/commit/ac0f668))
- **docs:** fix popover examples ([#503](https://github.com/akveo/nebular/issues/503)) ([83061ef](https://github.com/akveo/nebular/commit/83061ef))
- fix peer dependency rxjs version ([#546](https://github.com/akveo/nebular/issues/546)) ([402bca2](https://github.com/akveo/nebular/commit/402bca2)), closes [#514](https://github.com/akveo/nebular/issues/514)
- **docs:** fix widget margin ([ba5def0](https://github.com/akveo/nebular/commit/ba5def0))
- **docs:** live example height on theme change ([57aae1a](https://github.com/akveo/nebular/commit/57aae1a))
- **docs:** update analytics tracking to exclude duplicated events ([#502](https://github.com/akveo/nebular/issues/502)) ([36e2611](https://github.com/akveo/nebular/commit/36e2611))
- **docs:** update articles copy ([f76ce1f](https://github.com/akveo/nebular/commit/f76ce1f))
- **docs:** update concept-theme-system.md ([#602](https://github.com/akveo/nebular/issues/602)) ([95fbe74](https://github.com/akveo/nebular/commit/95fbe74))
- **docs:** update copy ([#587](https://github.com/akveo/nebular/issues/587)) ([d8e8881](https://github.com/akveo/nebular/commit/d8e8881))
- **flipcard:** fix flip card back view in Safari and IE ([0ccb4ab](https://github.com/akveo/nebular/commit/0ccb4ab))
- **menu:** update url-matching helper to include `;` ([#475](https://github.com/akveo/nebular/issues/475)) ([c67ec11](https://github.com/akveo/nebular/commit/c67ec11))
- **tabset:** fix exception, when renders conditionally with \*ngIf directive ([#501](https://github.com/akveo/nebular/issues/501)) ([946e68c](https://github.com/akveo/nebular/commit/946e68c))

### Code Refactoring

- **auth:** make components CD=OnPush, use `nbInput`, `nbButton` ([#595](https://github.com/akveo/nebular/issues/595)) ([e1863ec](https://github.com/akveo/nebular/commit/e1863ec))

### Features

- **alert:** add outline alerts ([#590](https://github.com/akveo/nebular/issues/590)) ([a7b8ff4](https://github.com/akveo/nebular/commit/a7b8ff4))
- **auth:** add a back link to the strategy name in the token ([#571](https://github.com/akveo/nebular/issues/571)) ([1c89636](https://github.com/akveo/nebular/commit/1c89636))
- **auth:** add a new grant type `password` to OAuth2 Strategy ([d8a66a8](https://github.com/akveo/nebular/commit/d8a66a8))
- **auth:** add back button ([#556](https://github.com/akveo/nebular/issues/556)) ([36fc953](https://github.com/akveo/nebular/commit/36fc953))
- **auth:** add new NbAuthOAuth2JWTToken ([#583](https://github.com/akveo/nebular/issues/583)) ([aed2099](https://github.com/akveo/nebular/commit/aed2099))
- **auth:** NbOAuth2AuthStrategy add basic authentication scheme against token endpoints ([#582](https://github.com/akveo/nebular/issues/582)) ([4360a18](https://github.com/akveo/nebular/commit/4360a18)), closes [/tools.ietf.org/html/rfc6749#section-2](https://github.com//tools.ietf.org/html/rfc6749/issues/section-2) [#581](https://github.com/akveo/nebular/issues/581)
- **auth:** use existing refreshToken if it is not repeated by the backend refresh endpoint ([#593](https://github.com/akveo/nebular/issues/593)) ([dffbd59](https://github.com/akveo/nebular/commit/dffbd59))
- **button:** add `fullWidth` mode ([#591](https://github.com/akveo/nebular/issues/591)) ([13014d4](https://github.com/akveo/nebular/commit/13014d4))
- **docs:** add example change animation ([#531](https://github.com/akveo/nebular/issues/531)) ([e7bb266](https://github.com/akveo/nebular/commit/e7bb266))
- **docs:** enable analytics for documentation ([37f2fe0](https://github.com/akveo/nebular/commit/37f2fe0))
- **docs:** set title per tab ([09d71c9](https://github.com/akveo/nebular/commit/09d71c9))
- **header:** add `subheader` mode when header is placed on a side of sidebar ([#555](https://github.com/akveo/nebular/issues/555)) ([4715b04](https://github.com/akveo/nebular/commit/4715b04)), closes [#554](https://github.com/akveo/nebular/issues/554)
- **icons:** add e-commerce icon ([#609](https://github.com/akveo/nebular/issues/609)) ([2ca41cf](https://github.com/akveo/nebular/commit/2ca41cf))
- **icons:** add expand, collapse icons, fix angle double right ([#542](https://github.com/akveo/nebular/issues/542)) ([82a5c93](https://github.com/akveo/nebular/commit/82a5c93))
- **layout:** add scroll & ruler services ([043050a](https://github.com/akveo/nebular/commit/043050a))
- **playground:** update examples to use the new `nbButton` ([#559](https://github.com/akveo/nebular/issues/559)) ([657147b](https://github.com/akveo/nebular/commit/657147b))
- **security:** add ability to assign multiple roles to a user ([#549](https://github.com/akveo/nebular/issues/549)) ([c3402a6](https://github.com/akveo/nebular/commit/c3402a6)), closes [#222](https://github.com/akveo/nebular/issues/222)
- **tabs:** ability to assign an icon ([#607](https://github.com/akveo/nebular/issues/607)) ([b78b8d3](https://github.com/akveo/nebular/commit/b78b8d3)), closes [#288](https://github.com/akveo/nebular/issues/288)
- **theme:** add Accordion component ([3a94f9c](https://github.com/akveo/nebular/commit/3a94f9c))
- **theme:** add new Button component ([#341](https://github.com/akveo/nebular/issues/341)) ([89d429d](https://github.com/akveo/nebular/commit/89d429d))
- **theme:** add new Calendar component & Calendar Kit module ([#598](https://github.com/akveo/nebular/issues/598)) ([8547527](https://github.com/akveo/nebular/commit/8547527))
- **theme:** add new Chat UI components set ([ebfcd0e](https://github.com/akveo/nebular/commit/ebfcd0e))
- **theme:** add new Input directive ([#569](https://github.com/akveo/nebular/issues/569)) ([42c588e](https://github.com/akveo/nebular/commit/42c588e))
- **theme:** add new List and Infinite List components ([#530](https://github.com/akveo/nebular/issues/530)) ([a07c78c](https://github.com/akveo/nebular/commit/a07c78c))
- **theme:** add Spinner component ([8ef7412](https://github.com/akveo/nebular/commit/8ef7412))
- **theme:** add Stepper component ([d474598](https://github.com/akveo/nebular/commit/d474598))
- **theme:** override default bootstrap style for row css class for small screens ([#608](https://github.com/akveo/nebular/issues/608)) ([9be2fcb](https://github.com/akveo/nebular/commit/9be2fcb))
- **theme:** update card border color for corporate theme ([#594](https://github.com/akveo/nebular/issues/594)) ([ff0985e](https://github.com/akveo/nebular/commit/ff0985e))

### BREAKING CHANGES

- **auth:** possibly a breaking change since we don't use bootstrap inputs and buttons anymore
  and use Nebular components instead
  also OnPush added to the components
- **auth:** `nbAuthCreateToken` (token.ts) function now takes a third parameter, which is the `ownerStrategyName`.
  Since `nbAuthCreateToken` is a part of public API this could _potentially_ introduce a breaking change.
- **theme:** bootstrap button class `.btn-tn` renamed to `btn-xs`

<a name="2.0.0-rc.9"></a>

# [2.0.0-rc.9](https://github.com/akveo/nebular/compare/2.0.0-rc.8...2.0.0-rc.9) (2018-06-19) :rocket:

### Highlights

- New design theme **Corporate**
- New components: Progress Bar, Alert
- OAuth2 Strategy with Google Auth example
- New documentation website with live examples
- Auth module refactoring

### Bug Fixes

- **context-menu:** hide on menu item click ([#431](https://github.com/akveo/nebular/issues/431)) ([a5bcd3c](https://github.com/akveo/nebular/commit/a5bcd3c))
- **docs:** add missing operator ([#455](https://github.com/akveo/nebular/issues/455)) ([1cb4993](https://github.com/akveo/nebular/commit/1cb4993))
- **docs:** add progress-bar icon ([#476](https://github.com/akveo/nebular/issues/476)) ([98562f5](https://github.com/akveo/nebular/commit/98562f5))
- **docs:** fix auth install article Closes [#273](https://github.com/akveo/nebular/issues/273) ([180d8f1](https://github.com/akveo/nebular/commit/180d8f1))
- **docs:** update mobile styles ([#487](https://github.com/akveo/nebular/issues/487)) ([6af2694](https://github.com/akveo/nebular/commit/6af2694))
- **docs:** update styles ([#486](https://github.com/akveo/nebular/issues/486)) ([9e44fb8](https://github.com/akveo/nebular/commit/9e44fb8))
- **footer:** use correct footer color variable ([#454](https://github.com/akveo/nebular/issues/454)) ([c2e310d](https://github.com/akveo/nebular/commit/c2e310d))
- **layout:** fix layout height when header is not fixed ([#437](https://github.com/akveo/nebular/issues/437)) ([084391b](https://github.com/akveo/nebular/commit/084391b))
- **popover:** hide when host was removed ([#430](https://github.com/akveo/nebular/issues/430)) ([a07496d](https://github.com/akveo/nebular/commit/a07496d))
- **reveal-card:** fix second card being visible on small screens ([#438](https://github.com/akveo/nebular/issues/438)) ([cad2246](https://github.com/akveo/nebular/commit/cad2246))
- **rtl:** reset bootstrap default styles ([#414](https://github.com/akveo/nebular/issues/414)) ([7634df5](https://github.com/akveo/nebular/commit/7634df5))
- **search:** resolve search field component factory ([#439](https://github.com/akveo/nebular/issues/439)) ([15cf18d](https://github.com/akveo/nebular/commit/15cf18d))
- **theme:** add new variable(btn-outline-focus-fg) for focused outline buttons ([#471](https://github.com/akveo/nebular/issues/471)) ([df31a4c](https://github.com/akveo/nebular/commit/df31a4c))
- **theme:** remove layout-padding for corporate theme, remove unnecessary color from icon ([#496](https://github.com/akveo/nebular/issues/496)) ([49abbb9](https://github.com/akveo/nebular/commit/49abbb9))

### Code Refactoring

- **auth:** provider -> strategy, `setup` method, multiple tokens ([3428ec3](https://github.com/akveo/nebular/commit/3428ec3))

### Features

- **auth:** add OAuth2 example with google auth ([fd95095](https://github.com/akveo/nebular/commit/fd95095))
- **auth:** add OAuth2 strategy ([2f28cbc](https://github.com/akveo/nebular/commit/2f28cbc))
- **card:** option to hide toggle button in reveal/flip cards ([#448](https://github.com/akveo/nebular/issues/448)) ([ef5ebbb](https://github.com/akveo/nebular/commit/ef5ebbb))
- **docs:** update docs design, add playground examples ([f40e78f](https://github.com/akveo/nebular/commit/f40e78f))
- **docs:** update urls to include baseUrl ([#489](https://github.com/akveo/nebular/issues/489)) ([f7fb11a](https://github.com/akveo/nebular/commit/f7fb11a))
- **docs:** use path-location instead of hash ([61d4139](https://github.com/akveo/nebular/commit/61d4139))
- **menu:** add collapseAll function ([#478](https://github.com/akveo/nebular/issues/478)) ([2942bfd](https://github.com/akveo/nebular/commit/2942bfd))
- **sidebar:** breakpoints configuration for compacted states ([#457](https://github.com/akveo/nebular/issues/457)) ([56411db](https://github.com/akveo/nebular/commit/56411db))
- **theme:** add alert component ([ee27fda](https://github.com/akveo/nebular/commit/ee27fda))
- **theme:** add progress-bar component ([#459](https://github.com/akveo/nebular/issues/459)) ([3693494](https://github.com/akveo/nebular/commit/3693494))
- **theme:** corporate - new theme ([#479](https://github.com/akveo/nebular/issues/479)) ([c75eaf7](https://github.com/akveo/nebular/commit/c75eaf7))

### HOW TO UPGRADE/BREAKING CHANGES

Multiple breaking changes introduced to auth module to improve code readability,
follow better naming conventions and for better extensibility in future releases.
More details and update steps: https://github.com/akveo/nebular/blob/master/src/framework/auth/UPGRADE.md#200-rc8-200-rc9

<a name="2.0.0-rc.8"></a>

# [2.0.0-rc.8](https://github.com/akveo/nebular/compare/2.0.0-rc.7...2.0.0-rc.8) (2018-05-10)

### Features

- **auth:** add support for refresh tokens ([#390](https://github.com/akveo/nebular/issues/390)) ([dc57c85](https://github.com/akveo/nebular/commit/dc57c85))
- **theme:** add RTL support ([#343](https://github.com/akveo/nebular/issues/343)) ([0326c1c](https://github.com/akveo/nebular/commit/0326c1c))
- update to angular 6 ([#408](https://github.com/akveo/nebular/issues/408)) ([16314e8](https://github.com/akveo/nebular/commit/16314e8))

<a name="2.0.0-rc.7"></a>

# [2.0.0-rc.7](https://github.com/akveo/nebular/compare/2.0.0-rc.6...2.0.0-rc.7) (2018-04-21)

### Bug Fixes

- **auth:** fix full-name validation error showing password validation text ([d12397b](https://github.com/akveo/nebular/commit/d12397b))
- **auth:** fix jwt interceptor to set Authorization header only if token is valid ([#294](https://github.com/akveo/nebular/issues/294)) ([1e99ff3](https://github.com/akveo/nebular/commit/1e99ff3))
- **buttons:** indicate focus state of outline button just with border-color ([e68a1ea](https://github.com/akveo/nebular/commit/e68a1ea)), closes [#295](https://github.com/akveo/nebular/issues/295)
- **docs:** add context-menu item click handler example ([#371](https://github.com/akveo/nebular/issues/371)) ([96ec81b](https://github.com/akveo/nebular/commit/96ec81b))
- **docs:** fix incorrect component mention ([#375](https://github.com/akveo/nebular/issues/375)) ([3fcbb61](https://github.com/akveo/nebular/commit/3fcbb61)), closes [#286](https://github.com/akveo/nebular/issues/286)
- **docs:** fix typo in auth-guard docs ([#277](https://github.com/akveo/nebular/issues/277)) ([682314d](https://github.com/akveo/nebular/commit/682314d))
- **docs:** return missed section anchors ([#370](https://github.com/akveo/nebular/issues/370)) ([3895c81](https://github.com/akveo/nebular/commit/3895c81))
- **layout:** fix flexbug, same as in bcbfcc0 but works in IE11 too ([#148](https://github.com/akveo/nebular/issues/148)) ([#355](https://github.com/akveo/nebular/issues/355)) ([a432e82](https://github.com/akveo/nebular/commit/a432e82))
- **menu:** apply default values for menuItems ([#344](https://github.com/akveo/nebular/issues/344)) ([674eef5](https://github.com/akveo/nebular/commit/674eef5))
- add polyfills for IE (es7 array & object) ([#361](https://github.com/akveo/nebular/issues/361)) ([3f91898](https://github.com/akveo/nebular/commit/3f91898)), closes [#272](https://github.com/akveo/nebular/issues/272)
- provide browser globals with injection tokens ([#358](https://github.com/akveo/nebular/issues/358)) ([63f4bb8](https://github.com/akveo/nebular/commit/63f4bb8))
- **menu:** avoid DOM elements creation for hidden menu items ([#312](https://github.com/akveo/nebular/issues/312)) ([0c10917](https://github.com/akveo/nebular/commit/0c10917)), closes [#270](https://github.com/akveo/nebular/issues/270)
- **menu:** trigger change detection after setting max-height ([#349](https://github.com/akveo/nebular/issues/349)) ([8c10372](https://github.com/akveo/nebular/commit/8c10372)), closes [#263](https://github.com/akveo/nebular/issues/263)
- **outline-btn-group:** reduce specificity of transparent background ([#313](https://github.com/akveo/nebular/issues/313)) ([eb18ebe](https://github.com/akveo/nebular/commit/eb18ebe)), closes [#295](https://github.com/akveo/nebular/issues/295)
- **popover:** run markForCheck to detect changes if nb-layout has onPush ([#267](https://github.com/akveo/nebular/issues/267)) ([7af0f62](https://github.com/akveo/nebular/commit/7af0f62)), closes [#266](https://github.com/akveo/nebular/issues/266)
- **search:** prevent search from crashing when no layout ([#332](https://github.com/akveo/nebular/issues/332)) ([36dc9dd](https://github.com/akveo/nebular/commit/36dc9dd))
- **styles:** get rid of nested mixins as sass doesn't support this for the time being ([#331](https://github.com/akveo/nebular/issues/331)) ([157b69d](https://github.com/akveo/nebular/commit/157b69d)), closes [#316](https://github.com/akveo/nebular/issues/316)
- **theme:** fix window and document providers to work in AOT ([#345](https://github.com/akveo/nebular/issues/345)) ([0aa898b](https://github.com/akveo/nebular/commit/0aa898b))

### Features

- **docs:** add capability to use playground module in the docs application ([#310](https://github.com/akveo/nebular/issues/310)) ([7676095](https://github.com/akveo/nebular/commit/7676095))
- **docs:** add tabs to docs ([12b18c4](https://github.com/akveo/nebular/commit/12b18c4))
- **menu:** add support for query parameters ([#283](https://github.com/akveo/nebular/issues/283)) ([#324](https://github.com/akveo/nebular/issues/324)) ([bbd86aa](https://github.com/akveo/nebular/commit/bbd86aa))

### BREAKING CHANGES

- **menu:** URL fragment no longer affects menu items selection.
  Now we only find matches between path part of the URL and `link` property of menu-item.

<a name="2.0.0-rc.6"></a>

# [2.0.0-rc.6](https://github.com/akveo/nebular/compare/2.0.0-rc.5...2.0.0-rc.6) (2018-02-22)

### Bug Fixes

- **DEV_DOCS:** add missed line in development on the latest Nebular sources ([#182](https://github.com/akveo/nebular/issues/182)) ([3b84981](https://github.com/akveo/nebular/commit/3b84981))
- **docs:** update font spacing ([#193](https://github.com/akveo/nebular/issues/193)) ([7e2a41a](https://github.com/akveo/nebular/commit/7e2a41a))
- **docs:** update menu component to react to expand (add a relevant class) ([#206](https://github.com/akveo/nebular/issues/206)) ([18ccdf6](https://github.com/akveo/nebular/commit/18ccdf6)), closes [#180](https://github.com/akveo/nebular/issues/180)
- **docs:** use correct tag in usage example ([#186](https://github.com/akveo/nebular/issues/186)) ([b2333a9](https://github.com/akveo/nebular/commit/b2333a9))
- **menu:** don't collapse menu which has a selected item ([#225](https://github.com/akveo/nebular/issues/225)) ([5c489f3](https://github.com/akveo/nebular/commit/5c489f3))
- **menu:** fix items not being prepared when passed through input ([#181](https://github.com/akveo/nebular/issues/181)) ([2e9d14a](https://github.com/akveo/nebular/commit/2e9d14a))
- **search:** fix search not un-subscribing from events ([#185](https://github.com/akveo/nebular/issues/185)) ([691e100](https://github.com/akveo/nebular/commit/691e100))

### Code Refactoring

- **auth:** move token storage out of token service ([c8273da](https://github.com/akveo/nebular/commit/c8273da))
- **theme:** remove user context menu ([#231](https://github.com/akveo/nebular/issues/231)) ([959bd4a](https://github.com/akveo/nebular/commit/959bd4a))

### Features

- **security:** add new security module with acl implementation ([#187](https://github.com/akveo/nebular/issues/187)) ([86b2784](https://github.com/akveo/nebular/commit/a4da28938)), closes [#164](https://github.com/akveo/nebular/issues/164)
- **auth:** ability to configure social link ([#205](https://github.com/akveo/nebular/issues/205)) ([86b2784](https://github.com/akveo/nebular/commit/86b2784)), closes [#171](https://github.com/akveo/nebular/issues/171)
- **bootstrap:** update bootstrap to 4.0.0 release (including ng-bootstrap, angular) ([#226](https://github.com/akveo/nebular/issues/226)) ([f047f14](https://github.com/akveo/nebular/commit/f047f14)), closes [#160](https://github.com/akveo/nebular/issues/160) [#223](https://github.com/akveo/nebular/issues/223) [#224](https://github.com/akveo/nebular/issues/224)
- **checkbox:** expand checkbox variables for easier customization ([6b93924](https://github.com/akveo/nebular/commit/6b93924)), closes [#143](https://github.com/akveo/nebular/issues/143)
- **context-menu:** add context menu component ([13799a5](https://github.com/akveo/nebular/commit/13799a5))
- **popover:** add new awesome `popover` component ([7dbefd6](https://github.com/akveo/nebular/commit/7dbefd6))
- **popover:** add popover-border-radius theme var ([#254](https://github.com/akveo/nebular/issues/254)) ([baf1a61](https://github.com/akveo/nebular/commit/baf1a61))
- **ssr:** add server-side rendering support ([c826187](https://github.com/akveo/nebular/commit/c826187))
- **tabset:** add `lazyLoad` property to `nb-tab` so that it loads content before it is actually shown ([#227](https://github.com/akveo/nebular/issues/227)) ([270995d](https://github.com/akveo/nebular/commit/270995d)), closes [#144](https://github.com/akveo/nebular/issues/144)
- **theme:** add capability append component to the layout top by its factory ([#253](https://github.com/akveo/nebular/issues/253)) ([515636c](https://github.com/akveo/nebular/commit/515636c))
- **user:** allow use base64 images for user picture ([#238](https://github.com/akveo/nebular/issues/238)) ([28338a7](https://github.com/akveo/nebular/commit/28338a7))

### BREAKING CHANGES

- **theme:** NbUserComponent no longer has context menu. We've
  completely moved context menu in the separate component. So, to
  migrate from the previous version you have to remove user menu items

```
<nb-user [menu]="items"></nb-user>
```

and use NbContextMenuDirective:

```
<nb-user [nbContextMenu]="items"></nb-user>
```

- **auth:**

1. `NB_AUTH_TOKEN_WRAPPER_CLASS` renamed to `NB_AUTH_TOKEN_CLASS` and you should use `useValue` instead of `useClass` when providing a token:
   `{ provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: NbAuthJWTToken },` to `{ provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthJWTToken },`

2. `setValue` method removed from `NbAuthSimpleToken`, `NbAuthJWTToken`, tokens only accept read-only value when created through constructor now.

3. Token Storage moved out from `NbTokenService` into a separate `NbTokenStorage`.
   If you need to change the storage behavior or provide your own - just extend your class from basic `NbTokenStorage`
   or `NbTokenLocalStorage` and provide in your `app.module`:

```
  { provide: NbTokenStorage, useClass: NbTokenCustomStorage },
```

- **checkbox:** Checkbox check mark color variable (radio-fg) is expanded.
  There are three variables instead to set a color depending a the checkbox state:

* checkbox-checkmark - base color
* checkbox-checked-checkmark - color when checkbox checked
* checkbox-disabled-checkmark - color when checkbox is disabled

<a name="2.0.0-rc.5"></a>

# [2.0.0-rc.5](https://github.com/akveo/nebular/compare/v2.0.0-rc.4...v2.0.0-rc.5) (2018-01-31)

### Bug Fixes

- **docs:** remove comma between shorthand properties in themes table ([#130](https://github.com/akveo/nebular/issues/130)) ([#133](https://github.com/akveo/nebular/issues/133)) ([b36a409](https://github.com/akveo/nebular/commit/b36a409))
- **docs:** update marked version ([#124](https://github.com/akveo/nebular/issues/124)) ([f4c970e](https://github.com/akveo/nebular/commit/f4c970e))
- **header:** fix layout header test ([#153](https://github.com/akveo/nebular/issues/153)) ([b97ee8f](https://github.com/akveo/nebular/commit/b97ee8f))
- **menu:** remove hardcoded max-height ([#122](https://github.com/akveo/nebular/issues/122)) ([a753bee](https://github.com/akveo/nebular/commit/a753bee)), closes [#65](https://github.com/akveo/nebular/issues/65)
- **menu:** stop sidebar adding display: none to collapsed item span t… ([#155](https://github.com/akveo/nebular/issues/155)) ([4c10d2a](https://github.com/akveo/nebular/commit/4c10d2a))
- **search:** fix tests some time not passing on search ([#176](https://github.com/akveo/nebular/issues/176)) ([254ddd3](https://github.com/akveo/nebular/commit/254ddd3))
- **sidebar:** only expand sidebar when item has children elements ([#158](https://github.com/akveo/nebular/issues/158)) ([3a47dbf](https://github.com/akveo/nebular/commit/3a47dbf)), closes [#23](https://github.com/akveo/nebular/issues/23)
- **travis:** fix karma config for browserstack ([#156](https://github.com/akveo/nebular/issues/156)) ([d5a4873](https://github.com/akveo/nebular/commit/d5a4873))
- **travis:** remove git depth to allow commits comparison ([#150](https://github.com/akveo/nebular/issues/150)) ([4704d9e](https://github.com/akveo/nebular/commit/4704d9e))
- **travis:** stop randomly failing builds ([#126](https://github.com/akveo/nebular/issues/126)) ([3740e08](https://github.com/akveo/nebular/commit/3740e08))

### Features

- **auth:** warn about empty token, return falsy result ([ad8afb0](https://github.com/akveo/nebular/commit/ad8afb0))
- **badge:** add new badge component ([#111](https://github.com/akveo/nebular/issues/111)) ([a9324b4](https://github.com/akveo/nebular/commit/a9324b4))
- **cards:** new card types ([f15470a](https://github.com/akveo/nebular/commit/f15470a)), closes [#139](https://github.com/akveo/nebular/issues/139)
- **search:** add input to be able to customize info label ([#147](https://github.com/akveo/nebular/issues/147)) ([12a55dc](https://github.com/akveo/nebular/commit/12a55dc)), closes [#21](https://github.com/akveo/nebular/issues/21)

### BREAKING CHANGES

- **auth:** now if login/register returns no value for token, unsuccessful NbAuthResult is returned

<a name="2.0.0-rc.4"></a>

# [2.0.0-rc.4](https://github.com/akveo/nebular/compare/2.0.0-rc.3...2.0.0-rc.4) (2017-12-31) :christmas_tree:

This release features an update to angular 5+, rxjs 5.5+. Make sure to update these dependencies in your project.

### Bug Fixes

- **auth:** fix scrollbar cutoff issue with auth ([#87](https://github.com/akveo/nebular/issues/87)) ([893d56a](https://github.com/akveo/nebular/commit/893d56a))
- **auth:** fix typo in request password sub-title ([#105](https://github.com/akveo/nebular/issues/105)) ([336b05e](https://github.com/akveo/nebular/commit/336b05e))
- **theme:** fix an issue when scrollbar didn't reset after a route change ([#91](https://github.com/akveo/nebular/issues/91)) ([9c77dad](https://github.com/akveo/nebular/commit/9c77dad))
- **theme:** remove stock bootstrap box-shadow ([#72](https://github.com/akveo/nebular/issues/72)) ([7d7b3ab](https://github.com/akveo/nebular/commit/7d7b3ab))
- **theme:** scrollbars color in IE ([#66](https://github.com/akveo/nebular/issues/66)) ([b5b500c](https://github.com/akveo/nebular/commit/b5b500c))

### Features

- **logout:** let logout.component use form configs ([#78](https://github.com/akveo/nebular/issues/78)) ([41d0f78](https://github.com/akveo/nebular/commit/41d0f78))
- **dependencies:** update dependencies (angular 5+, rxjs, bootstrap, smart-table) ([#108](https://github.com/akveo/nebular/issues/108))

### BREAKING CHANGES

- **dependencies:** since angular and rxjs are updated please make sure to look through the corresponding changelogs for the details

<a name="2.0.0-rc.3"></a>

# [2.0.0-rc.3](https://github.com/akveo/nebular/compare/2.0.0-RC.2...2.0.0-rc.3) (2017-10-26)

### Bug Fixes

- **auth:** fix auth service isAuthenticated, onAuthenticationChange not returning a boolean, fix [#15](https://github.com/akveo/nebular/issues/15) ([30a1d47](https://github.com/akveo/nebular/commit/30a1d47))
- **buttons:** remove transition from buttons ([7e3f56d](https://github.com/akveo/nebular/commit/7e3f56d))
- **js-theme:** fix defaut font, fix e2e & unit tests ([cff8561](https://github.com/akveo/nebular/commit/cff8561))
- **layout:** prevent layout expansion when some child with overflow:hidden has an element with width larger than layout width ([82e4dfc](https://github.com/akveo/nebular/commit/82e4dfc))
- **user:** fix user component context menu showing an icon not correctly, fix [#25](https://github.com/akveo/nebular/issues/25) ([f723e54](https://github.com/akveo/nebular/commit/f723e54))

### Features

- **dependencies:** update bootstrap & angular, accompanying fixes (angular cli kept as previous due to build issues) ([3660f9a](https://github.com/akveo/nebular/commit/3660f9a)), closes [#42](https://github.com/akveo/nebular/issues/42)
- **font:** update default font value ([5b93759](https://github.com/akveo/nebular/commit/5b93759))
- **theme:** support hidden property ([#31](https://github.com/akveo/nebular/issues/31)) ([f26922a](https://github.com/akveo/nebular/commit/f26922a))

### BREAKING CHANGES

- **dependencies:** since bootstrap is updated please look through the bootstrap release notes (https://github.com/twbs/bootstrap/releases) for proper steps to update your styles
