RPX XUI COMMON LIBRARY
======================

```ts

```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.9.
This Project is used for EXUI team as a common library.
All the common libraries are located at `projects/exui-common-lib`.

@hmcts/rpx-xui-common-lib is a shared Angular library for EXUI applications.
The library source is in projects/exui-common-lib and is consumed by XUI
applications that need common components, services, directives and utilities.

The repository also contains:

- A demo application under src/.
- Angular library source under projects/exui-common-lib/.
- End-to-end tests under e2e/.
- Playwright configuration and custom reporters.
- Documentation generation with Compodoc.
- Build, audit and publishing scripts.

The current package version is defined in package.json. The published package
name is:

## Build

Run `ng build exui-common-lib` (or `yarn build`) to build the exui-common-lib project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test exui-common-lib` (or `yarn test`) to execute the unit tests via [Karma](https://karma-runner.github.io).
It will run the tests for exui-common-lib.

## Running end-to-end tests

The Playwright tests in `e2e/src/` exercise the demo host (`src/`) in Chromium, Firefox and WebKit locally. Default CI runs the Chromium functional suite; Firefox and WebKit run through the separate on-demand cross-browser workflow. Discovery lists 204 distinct functional scenarios (612 browser executions when all three projects run), including six existing ticketed skips per browser. Accessibility-only hint associations run in the separate advisory lane, not the functional gate. This is a scenario count, not a pass rate or percentage of library functionality. Run `yarn playwright test --list --reporter=list` to inspect the current inventory without execution reporters and use the matching run's reports for its actual results.

The functional inventory now adds the first credited browser contracts for FindPerson, SearchJudicials, plural ServiceMessages, location/venue lookups and work-type/task-name lookups, plus additional Advanced Filter, primitive form/layout behaviour, accessibility-statement endpoint variants, the exported page wrapper, grouped GovUK radio/checkbox contracts, direct GovUK input and multi-checkbox state, service autocomplete filtering and lower-level address-input validation. The remaining-gap batches add direct selected-case, SearchLocation, InviteUserPermission, GOV.UK label, controlled HTTP-failure, selected-case synchronization, direct composed-component, service-state, directive/pipe and validator-edge contracts. Feature Toggle remains outside this follow-up scope. All six existing ticketed skips remain unchanged. Every touched component remains partially tested; scenario count is not converted into a percentage of CommonLib functionality. Services, exhaustive input combinations, live integrations and manual assistive-technology testing remain separate gaps; neither browser repetition nor automated scanning closes them.

## Coverage estimate

The public component API has 61 export lines representing 60 unique component selectors (the `user-select` export is duplicated). A source-level host scan found 43 of those selectors mounted directly by the existing demo routes before the previous batch; that work took the narrow host-mount estimate to 51/60 (about 85%), and the follow-up batches add direct mounts for selected-case, selected-case-list, selected-case-confirm, SearchLocation, InviteUserPermission, GOV.UK label, terms display variants and the share confirmation component. This is 100% family presence for the families targeted by the demo routes, but not 100% branch coverage: calendar-invalid dates, date-validity restoration after direct edits, radio groups with no controls or disabled controls, checkbox minimum-count values greater than one, dynamic control changes and non-boolean values still require explicit state matrices. Several remaining selectors are intentionally exercised indirectly inside higher-level components, while services and HTTP integrations need their own contracts.

The practical route is to keep the browser suite focused on consumer-visible contracts, then close the remaining gap with service/directive/validator tests and consumer integration tests. Reaching a defensible near-100% figure would require a maintained matrix of public exports × meaningful states, explicit branch evidence for each stateful component, failure and retry contracts for each service, and live or contract-controlled integration evidence. Browser scenario counts alone cannot provide that percentage.

The additional `/coverage/*` routes are explicitly demo/test-host code. They compose real exported library components and expose parent form values and emitted events for assertions; they do not replace library implementations. Production library code under `projects/exui-common-lib/` is unchanged.

| Demo route | Contracts exercised | Boundary |
| --- | --- | --- |
| `/home`, `/coverage` | Existing checkbox, date badge, loading, contact, filter, pagination, cookies, navigation, terms, feedback and session-dialog scenarios | Session-dialog markup is not authenticated session-expiry coverage |
| `/coverage/invitation` | Exact submitted form/permissions, parent-provided errors and correction | No email delivery or live invitation API |
| `/coverage/form-controls` | Select/textarea values and error relationships, date validity, file chooser clear/reselect | Parent forms are demo-owned; file selection is not upload or drag/drop |
| `/coverage/service-selection` | Filtering, keyboard selection, exact values, removal/replacement, disabled inputs | Synthetic local service options |
| `/coverage/case-sharing` | Pending additions/removals, duplicate protection, cancellation, validation and confirmation state continuity | Real sharing state service; no persisted CCD access change |
| `/coverage/address` | Postcode normalization, parsed lookup selection, empty results and manual/international controls | Real address service with synthetic intercepted HTTP responses |
| `/coverage/users` | 50/1 pagination, user selection, permission/action visibility and click/keyboard event payloads | Synthetic users; no live suspension or invitation delivery |
| `/coverage/advanced-filter` | Conditional field visibility and local-setting persistence isolated by user and configuration key | Demo-owned filter configuration and synthetic browser storage; no authenticated consumer or backend persistence |
| `/coverage/searches` | Exact person/judicial request bodies, role domains, selected-identity exclusion, keyboard selection and emitted/control values | Synthetic identities and intercepted HTTP responses; no live user or judicial API integration |
| `/coverage/lookups` | Exact location/work-type/task-name requests, venue query mapping, single/multi selection, parent form/output state, cache reuse and empty-result recovery | Synthetic lookup records and intercepted HTTP responses; no live reference-data or work-allocation integration |
| `/coverage/accessibility`, `/coverage/accessibility/manage-case` | Accessibility statement service links, contact links and Manage Organisation/Manage Cases endpoint-specific content | Static statement markup and URL-derived endpoint mode; no assistive-technology conformance claim |
| `/coverage/standalone` | Exported page wrapper title/caption/back-link branches, grouped radios and errors, standalone checkbox focus id/optional hint and parent form values | Synthetic host state; no live consumer routing or submission |
| `/coverage/extended-controls` | Direct GovUK input errors/value binding, multi-checkbox rows and values, service autocomplete filtering/selection/no-results and lower-level UK/international address-input branches | Synthetic host state; no live service search or address API |
| `/coverage/lifecycle` | Bilingual service-message sanitization, keyboard dismissal/cookie persistence and feature disable/re-enable lifecycle | Synthetic message and feature streams; dynamic feature-key rebinding remains a ticket-linked EXUI-5377 skip |
| `/coverage/primitives` | Parent-form binding, supplied errors, disabled-control re-enable, projected fieldsets, table headers/links/dates, identity visibility, main-wrapper back events and pagination boundaries | Synthetic demo state; no live consumer form, data service or persisted navigation |
| `/coverage/selected-cases` | Direct selected-case/list/confirmation rendering, no-user state, pending additions, change link and unselect output | Synthetic case-sharing state; no persisted CCD access change |
| `/coverage/public-contracts` | Direct SearchService, SearchLocation, InviteUserPermission and GOV.UK label contracts | Synthetic options and intercepted lookup responses; no live user or reference-data integration |
| `/coverage/validators` | Date, radio-group and checkbox validator contracts, including malformed values and threshold states | Validator behaviour is observed through demo forms; production validator code is unchanged |
| `/coverage/service-contract-a`, `/coverage/service-contract-b` | Direct HTTP service contracts, 4xx/5xx handling, timeout messaging, cancellation, cache reuse/invalidation and concurrent lookup behaviour | Intercepted responses only; no live downstream service or network resilience evidence |
| `/coverage/remaining` | Direct terms/share-confirmation composition, address/person/location service states, cookie/loading/filter/case-sharing transitions, LetDirective, CapitalizePipe and validator edge states | Synthetic host state and intercepted responses; Feature Toggle and production CommonLib changes are out of scope |

These tests do not imply 100% coverage of CommonLib's APIs, behavior or consumer journeys. Library unit tests still run separately through `yarn test`. A failing intended-contract test is evidence to investigate, not permission to change the library or weaken the assertion.

 

- `yarn e2e` (`ng e2e`) - Angular starts the demo dev server and passes its URL to Playwright via `PLAYWRIGHT_TEST_BASE_URL`, so Playwright does not start a second server.
- `yarn playwright test` - Playwright starts the demo itself (`yarn start:no-open` on http://localhost:4200), reusing an already running server outside CI. Add `--ui` for UI mode.
- `yarn test:e2e:typecheck` - typecheck the Playwright config and test sources without starting a browser.
- `PLAYWRIGHT_TEST_BASE_URL=<url> yarn playwright test` - run against an already running host; no server is started.
- `PLAYWRIGHT_REPORTERS=list,html,junit,odhin` - choose reporters (default `list,odhin` locally and `dot,odhin` in CI; JUnit is written to `test-results/junit.xml`).
- Odhín writes its HTML index to `test-results/odhin/common-lib-playwright.html` and keeps assets/attachments beside it. Set `PW_ODHIN_OUTPUT`, `PW_ODHIN_INDEX`, `PW_ODHIN_TITLE`, `PW_ODHIN_ENV`, `PW_ODHIN_PROJECT` or `PW_ODHIN_RELEASE` to override metadata and output paths.
- GitHub Actions keeps Odhín history on the `odhin-reports` peer branch. The read-only `Node.js Package` workflow runs Chromium functional coverage and publishes the exact report after same-repository PR, `master`, or `Release` runs at `reports/<branch-slug>/runs/<run-id>-attempt-<attempt>/`. A failed functional suite still publishes if dashboard verification succeeds; cancelled runs, missing artifacts, and fork pull requests remain unpublished.
- Firefox and WebKit are off by default and run only on demand. In **Actions**, choose **CommonLib cross-browser (advisory)**, select `master` under **Use workflow from**, set `ref` to the branch, tag, or commit SHA you want to test, then choose **Run workflow**. `master` selects the trusted workflow definition; `ref` selects the code under test. Only dispatch a same-repository ref that you trust: the generated Odhín report is published to the existing public report history. The separate trusted publisher records the requested ref and exact checked-out SHA at `reports/<branch-slug>/cross-browser/runs/<run-id>-attempt-<attempt>/`. Valid reports from failed browser tests publish; cancelled, setup, report, verifier, or artifact failures do not.
- Accessibility is also off by default. In **Actions**, choose **CommonLib accessibility (advisory)**, select `master` under **Use workflow from**, set `ref` to the branch, tag, or commit SHA you want to test, then choose **Run workflow**. Its successful reports publish at `reports/<branch-slug>/accessibility/runs/<run-id>-attempt-<attempt>/`. From the CLI, use `gh workflow run accessibility-odhin.yml -R hmcts/rpx-xui-common-lib --ref master -f ref=feature/my-branch`; `--ref master` selects the trusted workflow definition and `-f ref=...` selects the code under test. For an exact commit use `-f ref=<40-character-sha>`.
- Each report type has its own immutable branch history on the `odhin-reports` peer branch. GitHub Pages publishes the current run only, keeping its deployment below the platform size limit; the Actions summary links to both the public report and its immutable archive. Archive history links directly to another report type only when both were produced from the exact same commit SHA; otherwise they say that no matching report exists. This prevents functional, cross-browser, and accessibility evidence from being confused.
- To re-publish an exact report, open **Actions** → **Publish CommonLib Odhín evidence**, keep **Use workflow from** on `master`, enter the numeric source workflow run ID from its Actions URL, then choose **Run workflow**. The publisher validates that the source run belongs to this repository and is one of the supported functional, accessibility, or cross-browser workflows before it can deploy; the source run may be from any same-repository branch. GitHub requires a manually dispatchable workflow to exist on `master` first. Automatic `workflow_run` publication also loads its workflow definition from `master`, so a publisher fix on a pull request cannot be deployed automatically before merge.
- Downloads are separate: the functional workflow uploads `common-lib-functional-report`, the manual cross-browser workflow uploads `common-lib-cross-browser-report`, and the manual accessibility workflow uploads `common-lib-accessibility-report`. Open `common-lib-playwright.html` for functional/cross-browser reports and `index.html` for accessibility. Extract the complete ZIP so external assets work. The corresponding `*-evidence` artifacts retain raw diagnostics.
- `yarn playwright show-report` - view the last HTML report.
  
   You can also run Playwright tests directly:
- `npx playwright test` - Run all tests
- `npx playwright test --ui` - Run tests with UI mode
- `npx playwright show-report` - View the last test report

 

Install the browsers once with `yarn playwright install chromium firefox webkit`.

## Accessibility evidence

The separate accessibility lane reuses the WebApp combined Odhín reporting approach: page/state summaries, axe results, WAVE-like DOM checks, screen-reader heuristics and scoped Lighthouse audits. Findings link to their HTML/JSON evidence and screenshots; these assets remain separate from the report index. WAVE-like checks are not the WebAIM WAVE service, and screen-reader heuristics do not execute NVDA, JAWS or VoiceOver. Automated checks cannot establish accessibility conformance.

- `yarn test:a11y` runs the strict accessibility lane. Product findings remain visible as failed tests.
- `yarn test:a11y --list --reporter=list` lists accessibility scenarios without running the execution reporters.
- `yarn test:a11y:advisory` permits complete product-finding evidence, as explicitly agreed for this test-only work. Setup, scanner, missing-evidence and reporting errors remain blocking; an absent result is never a pass.
- `yarn test:a11y:self-check` verifies the scanner against a clean synthetic page; `yarn test:a11y:report` checks report classification and evidence integrity.
- `yarn node e2e/reporters/presentation/accessibility.browser-check.cjs` verifies the reused report UI with synthetic records. These checks validate reporting, not CommonLib functionality.
- `yarn node e2e/accessibility/verify-report.cjs <report-directory>` opens an actual generated accessibility report and checks its linked evidence. In CI it runs after the advisory scan, so a scanner/setup/report/evidence fault fails the manual workflow even though product findings remain advisory.
- Accessibility findings, including EXUI-5358's missing textarea hint association, are advisory and do not fail functional acceptance. Scanner/setup/reporting errors remain execution failures, not accessibility findings. Local runs reserve their own output directory to avoid stale or overwritten evidence.

Existing library findings must remain visible and be tracked as defects. Only demo-owned markup may be repaired in this work; no library rules are disabled and no library DOM is rewritten to manufacture a clean scan.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Timeout Notification Service

- Node.js 24.x or a later version accepted by package.json.
- Yarn 4.5.3, managed through the repository's Yarn configuration.
- Chromium, Firefox and WebKit when running the full Playwright suite.
- Git Bash or WSL on Windows for shell commands that use Unix-style syntax.

Install dependencies from the repository root:

    corepack enable
    yarn install --immutable

The repository uses the node-modules linker. Do not commit node_modules,
dist/, coverage/, docs/ or generated browser-test results.

* Step 1. Import the TimeoutNotificationsService from rpx-xui-common-lib

```ts
import { TimeoutNotificationsService } from '@hmcts/rpx-xui-common-lib';
```

* Step 2. Add the TimeoutNotificationService to the constructor.

```html
  constructor(
    private readonly timeoutNotificationsService: TimeoutNotificationsService
  ) {
```

* Step 3. Add a Handler, to handle the TimeoutNotificationService events.

```groovy
public timeoutNotificationEventHandler(event) {
	switch (event.eventType) {
	  case 'countdown': {
	  	// Implement application countdown logic, here we are using
	  	// our timeout modal, which is another re-usable UI component.
	    this.updateTimeoutModal(event.readableCountdown, true);
	    return;
	  }
	  case 'sign-out': {
	  	// Implement application signout logic
	    this.updateTimeoutModal(undefined, false);
	    return;
	  }
	  case 'keep-alive': {
	  	// Implement application keep alive logic
	    return;
	  }
	  default: {
	    throw new Error('Invalid Timeout Notification Event');
	  }
	}
}
```

* Step 4. Listen for the TimeoutNotificationService events, and send them onto the Handler.

```ts
this.timeoutNotificationsService.notificationOnChange().subscribe(event => {
  this.timeoutNotificationEventHandler(event);
});
```

* Step 5. Create a configuration object and pass the object to configure the service.

```ts
/**
 * Timeout Notification Config
 * 
 * Note that idleModalDisplayTime and totalIdleTime should be passed in
 * in milliseconds.
 */
const timeoutNotificationConfig: any = {
  idleModalDisplayTime: idleModalDisplayTimeInMilliseconds,
  totalIdleTime: totalIdleTimeInMilliseconds,
  idleServiceName: 'idleSession'
};

Repository layout
-----------------

    projects/exui-common-lib/     Shared Angular library source
    src/                          Demo and test-host application
    e2e/                          Playwright end-to-end tests and reporters
    scripts/                      Package synchronisation and helper scripts
    docs/                         Generated Compodoc output
    dist/                         Generated package output
    angular.json                  Angular workspace configuration
    package.json                  Workspace scripts and package metadata

The library's public entry point is defined by the project configuration in
projects/exui-common-lib/.


Run the demo application
------------------------

Start the Angular demo without automatically opening a browser:

    yarn start:no-open

The demo is normally available at:

    http://localhost:4200/

`totalIdleTime` is the total amount of time in milliseconds that the User is idle for. ie.
A User is working, they then stop interacting with the page. When the User stops interacting
with the page is when the totalIdleTime begins.

    yarn start

`idleModalDisplayTime` is the total amount of time in milliseconds to display a Session Timeout Modal.
Note that our xui re-usable Session Timeout Modal can be used.


Build the library
-----------------

Build the library and synchronise the generated package output:

This would lead to:

1. On the User being idle for 1 minute, 'countdown' events are thrown.
2. When the User is Idle for 2 minutes a 'sign-out' event is thrown.
3. If the User interacts with the page within this time a 'keep-alive' event is thrown.
4. By default when the User is idle for under 1 minute, countdown events are thrown each second.

The explicit production library build is:

    yarn build:library

Build continuously while editing library source:

    yarn build:library:watch

The build also generates the condition parser from its Peggy grammar. The
generated condition-parser.generated.ts file must not be edited by hand; edit
the source grammar and run the generation task instead:

    yarn generate:condition-parser

```html
<xuilib-session-dialog positionTop="300px" *ngIf="timeoutModalConfig.isVisible" (close)="staySignedInHandler()">
  <h3 class="govuk-heading-m">We are about to sign you out</h3>
  <p class="govuk-body">For your security, we will sign you out of your account in
    <strong>{{timeoutModalConfig.countdown}}</strong>
  </p>
  <p>Any information you have not saved will be lost</p>
  <button type="submit" class="govuk-button" (click)="staySignedInHandler()">
    Stay signed in
  </button>
  <div>
    <a (click)="signOutHandler()" [routerLink]="">Sign out</a>
  </div>
</xuilib-session-dialog>
```

    dist/rpx-xui-common-lib/

Create the compressed elements bundle when required:

    yarn package


Use the library in an Angular application
-----------------------------------------

Install the published package in the consuming application using the approved
package version and compatible Angular peer dependencies.

Import the module with forRoot in the application's root module:

    import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';

    @NgModule({
      imports: [
        ExuiCommonLibModule.forRoot()
      ]
    })

Import the module with forChild in lazy-loaded modules:

    import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';

    @NgModule({
      imports: [
        ExuiCommonLibModule.forChild()
      ]
    })

When adding a public component, service, directive, pipe or model, update the
library public exports and add focused unit tests.


Optional integrations
---------------------

Google Analytics

Inject GoogleAnalyticsService and initialise it with the approved application
configuration value:

    export class AppComponent {
      constructor(private googleAnalyticsService: GoogleAnalyticsService) {
        this.googleAnalyticsService.init(config.googleAnalyticsKey);
      }
    }

Terms and Conditions

Import the common module and provide a document that conforms to the exported
TCDocument interface:

    <xuilib-terms-and-conditions
      [document]="your_tc_document">
    </xuilib-terms-and-conditions>

Follow the consuming application's content, accessibility and configuration
requirements when using these integrations.


Timeout Notification Service
----------------------------

TimeoutNotificationsService notifies an application when a user is nearing
the end of an idle session. The consuming application must subscribe to the
events and decide how to display the countdown, keep the user signed in or
sign the user out.

Import the service:

    import { TimeoutNotificationsService } from '@hmcts/rpx-xui-common-lib';

Inject it into the component:

    constructor(
      private readonly timeoutNotificationsService: TimeoutNotificationsService
    ) {}

Handle the service events:

    public timeoutNotificationEventHandler(event) {
      switch (event.eventType) {
        case 'countdown':
          this.updateTimeoutModal(event.readableCountdown, true);
          return;
        case 'sign-out':
          this.updateTimeoutModal(undefined, false);
          return;
        case 'keep-alive':
          return;
        default:
          throw new Error('Invalid Timeout Notification Event');
      }
    }

Subscribe to event changes:

    this.timeoutNotificationsService
      .notificationOnChange()
      .subscribe(event => this.timeoutNotificationEventHandler(event));

Initialise the service with a configuration object. Times are milliseconds:

    const timeoutNotificationConfig = {
      idleModalDisplayTime: idleModalDisplayTimeInMilliseconds,
      totalIdleTime: totalIdleTimeInMilliseconds,
      idleServiceName: 'idleSession'
    };

    this.timeoutNotificationsService.initialise(timeoutNotificationConfig);

The timeout modal display period is included within totalIdleTime. It is not
added after totalIdleTime.

For example:

    totalIdleTime: 120000
    idleModalDisplayTime: 60000

This means that countdown events begin after approximately one minute of
inactivity and the sign-out event is emitted after two minutes. If the user
interacts with the page, a keep-alive event is emitted.

During the final minute, countdown events are emitted every second. Before the
final minute, countdown events are emitted less frequently according to the
service implementation.


Timeout modal component
-----------------------

The reusable session dialog can display the timeout state:

    <xuilib-session-dialog
      positionTop="300px"
      *ngIf="timeoutModalConfig.isVisible"
      (close)="staySignedInHandler()">
      <h3 class="govuk-heading-m">We are about to sign you out</h3>
      <p class="govuk-body">
        For your security, we will sign you out of your account in
        <strong>{{timeoutModalConfig.countdown}}</strong>
      </p>
      <p>Any information you have not saved will be lost</p>
      <button class="govuk-button" (click)="staySignedInHandler()">
        Stay signed in
      </button>
      <a (click)="signOutHandler()" [routerLink]="">Sign out</a>
    </xuilib-session-dialog>

The consuming application remains responsible for the final sign-out action,
unsaved-data warning and accessible modal behaviour.


Unit tests and coverage
-----------------------

Run library unit tests:

    yarn test

Run them in watch mode:

    yarn test:watch

The Angular test command generates coverage output according to the workspace
test configuration.


Playwright tests
----------------

Install the required browsers:

    yarn playwright install chromium firefox webkit

Run the end-to-end suite. The runner starts the demo application when
PLAYWRIGHT_TEST_BASE_URL is not set:

    yarn playwright test

Run the suite against an already running host:

    PLAYWRIGHT_TEST_BASE_URL=http://localhost:4200 yarn playwright test

Run type checks without opening a browser:

    yarn test:e2e:typecheck

The configured browsers are Chromium, Firefox and WebKit. Tests use the demo
host, synthetic data and the configured Playwright base URL. They do not prove
that every consuming application or deployed service is compatible.

Useful reporter settings include:

    PLAYWRIGHT_REPORTERS=list,html,junit,odhin
    PW_ODHIN_OUTPUT=test-results/odhin
    PW_ODHIN_INDEX=common-lib-playwright.html
    PW_ODHIN_TITLE=RPX XUI CommonLib Playwright
    PW_ODHIN_ENV=local
    PW_ODHIN_PROJECT=RPX XUI CommonLib
    PW_ODHIN_RELEASE=<release>

Main local output locations include:

    test-results/junit.xml
    test-results/odhin/common-lib-playwright.html
    test-results/                  screenshots and traces on failure

Run the last HTML report with:

    yarn playwright show-report

Generated reports can contain test data and should be treated as potentially
sensitive. Do not commit them.


Linting, documentation and CI checks
-------------------------------------

Run the library lint checks:

    yarn lint

Generate Compodoc documentation:

    yarn docs

Run Playwright reporter checks where required:

    yarn lint:playwright:reporting

Run the dependency audit against the known-audit baseline:

    yarn test:audit

Run the main local CI sequence:

    yarn ci

The CI command runs lint, unit tests, the library build and documentation
generation.


Development workflow
--------------------

1. Create a focused branch.
2. Install dependencies with yarn install --immutable.
3. Start the demo with yarn start:no-open when working on a consumer view.
4. Build the library with yarn build:library:watch while developing library
   source.
5. Run targeted unit and Playwright tests.
6. Run yarn lint and yarn test.
7. Run yarn ci for broad changes or before a release.
8. Review dist/, coverage/, docs/ and test output before committing.
9. Confirm that no credentials or sensitive test artefacts are staged.


Publishing and release checks
-----------------------------

The package is published with public access configured in package.json. Use
the approved release and CI process.

Before publishing:

- Confirm the package version and release notes.
- Run yarn ci.
- Run the relevant Playwright and consumer checks.
- Review the generated dist/ package contents.
- Check Angular peer dependency compatibility.
- Confirm that generated reports and local configuration are excluded.


Troubleshooting
---------------

The demo does not start

- Check the Node.js and Yarn versions.
- Run corepack enable and yarn install --immutable.
- Check that port 4200 is free.
- Check the Angular workspace configuration.

Library changes are not visible in a consumer

- Run yarn build:library:watch.
- Confirm that the consumer resolves the intended package or workspace
  output.
- Check peer dependency versions.
- Restart the consumer development server if its module cache is stale.

The condition parser build fails

- Run yarn generate:condition-parser.
- Check the source condition grammar.
- Do not edit the generated parser file manually.

Playwright cannot start

- Install Chromium, Firefox and WebKit.
- Check that port 4200 is free.
- Run yarn test:e2e:typecheck.
- Set PLAYWRIGHT_TEST_BASE_URL only when the target host is already running.
- Retain failure traces and screenshots before starting another run.

The timeout modal behaves unexpectedly

- Confirm that all timeout values are in milliseconds.
- Confirm that idleModalDisplayTime is included in totalIdleTime.
- Confirm that the application subscribes to notificationOnChange().
- Check that countdown, keep-alive and sign-out events are handled.


UK English and technical terminology
-------------------------------------

Use UK English in documentation, test descriptions, examples and user-facing
content. Preferred spellings include:

    organisation / organisations
    authorise / authorisation
    behaviour
    centre
    colour
    customise / customisation
    licence (noun) / license (verb)
    analyse / analysed
    catalogue
    prioritise

Keep package names, Angular selectors, TypeScript identifiers, route names,
event names and other technical contracts unchanged.


Licence
-------

This project is licensed under the MIT Licence. See LICENCE for the full
licence text.
