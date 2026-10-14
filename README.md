# RpxXuiCommonLib

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.9.
This Project is used for EXUI team as a common library.
All the common libraries are located at `projects/exui-common-lib`.

## Development server

Run `ng serve` (or `yarn start:no-open`) for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
The main project is only a base to run `projects/exui-common-lib`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build exui-common-lib` (or `yarn build`) to build the exui-common-lib project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test exui-common-lib` (or `yarn test`) to execute the unit tests via [Karma](https://karma-runner.github.io).
It will run the tests for exui-common-lib.

## Running end-to-end tests

The Playwright tests in `e2e/src/` exercise the demo host (`src/`) in Chromium, Firefox and WebKit locally and in CI. Discovery lists 100 distinct functional scenarios (300 browser executions): the original 51 scenarios plus 49 additional contracts. Accessibility-only hint associations run in the separate advisory lane, not the functional gate. This is a scenario count, not a pass rate or percentage of library functionality. Run `yarn playwright test --list` to inspect the current inventory and use the matching run's reports for its actual results.

The functional inventory now adds the first credited browser contracts for FindPerson, SearchJudicials and plural ServiceMessages, plus additional Advanced Filter and FeatureToggle behaviour. Every touched component remains partially tested; scenario count is not converted into a percentage of CommonLib functionality. Examples still without a credited functional browser contract include location/work-type/venue/task lookups, the accessibility statement and page wrapper. Services, directives, exhaustive input combinations, live integrations and manual assistive-technology testing are separate gaps; neither browser repetition nor automated scanning closes them.

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
| `/coverage/lifecycle` | Bilingual service-message sanitization, keyboard dismissal/cookie persistence and feature disable/re-enable lifecycle | Synthetic message and feature streams; dynamic feature-key rebinding remains a ticket-linked EXUI-5377 skip |

These tests do not imply 100% coverage of CommonLib's APIs, behavior or consumer journeys. Library unit tests still run separately through `yarn test`. A failing intended-contract test is evidence to investigate, not permission to change the library or weaken the assertion.

- `yarn e2e` (`ng e2e`) - Angular starts the demo dev server and passes its URL to Playwright via `PLAYWRIGHT_TEST_BASE_URL`, so Playwright does not start a second server.
- `yarn playwright test` - Playwright starts the demo itself (`yarn start:no-open` on http://localhost:4200), reusing an already running server outside CI. Add `--ui` for UI mode.
- `yarn test:e2e:typecheck` - typecheck the Playwright config and test sources without starting a browser.
- `PLAYWRIGHT_TEST_BASE_URL=<url> yarn playwright test` - run against an already running host; no server is started.
- `PLAYWRIGHT_REPORTERS=list,html,junit,odhin` - choose reporters (default `list,odhin` locally and `dot,odhin` in CI; JUnit is written to `test-results/junit.xml`).
- Odhín writes its HTML index to `test-results/odhin/common-lib-playwright.html` and keeps assets/attachments beside it. Set `PW_ODHIN_OUTPUT`, `PW_ODHIN_INDEX`, `PW_ODHIN_TITLE`, `PW_ODHIN_ENV`, `PW_ODHIN_PROJECT` or `PW_ODHIN_RELEASE` to override metadata and output paths.
- GitHub Actions keeps Odhín history on the `odhin-reports` peer branch. Functional reports are uploaded by the read-only `Node.js Package` workflow and published by the separate trusted `Publish CommonLib Odhín evidence` `workflow_run` after a same-repository PR, `master`, or `Release` run when the exact report artifact was produced, at `reports/<branch-slug>/runs/<run-id>-attempt-<attempt>/`. This includes failed functional runs whose dashboard verifier succeeded; cancelled runs, missing artifacts, and fork pull requests remain unpublished.
- Accessibility is off by default and runs only on demand. In **Actions**, choose **CommonLib accessibility (advisory)**, set `ref` to the branch, tag, or commit SHA you want to test, then choose **Run workflow**. The manual workflow uploads exact evidence only; the separate trusted `Publish CommonLib Odhín evidence` run publishes successful results at `reports/<branch-slug>/accessibility/runs/<run-id>-attempt-<attempt>/`. From the CLI, use `gh workflow run accessibility-odhin.yml -R hmcts/rpx-xui-common-lib --ref master -f ref=feature/my-branch`; `--ref master` selects the trusted workflow definition and `-f ref=...` selects the code under test. For an exact commit use `-f ref=<40-character-sha>`.
- Each report type has its own immutable branch history. A history page links directly to the other report only when both were produced from the exact same commit SHA; otherwise it says that no matching report exists. This prevents a functional report from being presented as the counterpart of a different accessibility run.
- Downloads are separate: the functional workflow uploads `common-lib-functional-report` (open `common-lib-playwright.html`) and the manual accessibility workflow uploads `common-lib-accessibility-report` (open `index.html`). Extract the complete ZIP so external assets work. `common-lib-playwright-evidence` retains the raw functional diagnostics.
- `yarn playwright show-report` - view the last HTML report.

Install the browsers once with `yarn playwright install chromium firefox webkit`.

## Accessibility evidence

The separate accessibility lane reuses the WebApp combined Odhín reporting approach: page/state summaries, axe results, WAVE-like DOM checks, screen-reader heuristics and scoped Lighthouse audits. Findings link to their HTML/JSON evidence and screenshots; these assets remain separate from the report index. WAVE-like checks are not the WebAIM WAVE service, and screen-reader heuristics do not execute NVDA, JAWS or VoiceOver. Automated checks cannot establish accessibility conformance.

- `yarn test:a11y` runs the strict accessibility lane. Product findings remain visible as failed tests.
- `yarn test:a11y:advisory` permits complete product-finding evidence, as explicitly agreed for this test-only work. Setup, scanner, missing-evidence and reporting errors remain blocking; an absent result is never a pass.
- `yarn test:a11y:self-check` verifies the scanner against a clean synthetic page; `yarn test:a11y:report` checks report classification and evidence integrity.
- `yarn node e2e/reporters/presentation/accessibility.browser-check.cjs` verifies the reused report UI with synthetic records. These checks validate reporting, not CommonLib functionality.
- `yarn node e2e/accessibility/verify-report.cjs <report-directory>` opens an actual generated accessibility report and checks its linked evidence. In CI it runs after the advisory scan, so a scanner/setup/report/evidence fault fails the manual workflow even though product findings remain advisory.
- Accessibility findings, including EXUI-5358's missing textarea hint association, are advisory and do not fail functional acceptance. Scanner/setup/reporting errors remain execution failures, not accessibility findings. Local runs reserve their own output directory to avoid stale or overwritten evidence.

Existing library findings must remain visible and be tracked as defects. Only demo-owned markup may be repaired in this work; no library rules are disabled and no library DOM is rewritten to manufacture a clean scan.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Timeout Notification Service

The Timeout Notification Service allows your application to receive notifications
when a User is approaching the the total time that a User has been idle for.

This can be set by your application using the Timeout Notification Config object.

Your application will then have to listen to events coming from the Timeout Notification Service,
and handle these events within your application.

### How to implement the Timeout Notification Service

* Step 1. Import the TimeoutNotificationsService from rpx-xui-common-lib
```
import { TimeoutNotificationsService } from '@hmcts/rpx-xui-common-lib';
```
* Step 2. Add the TimeoutNotificationService to the constructor.
```
  constructor(
    private readonly timeoutNotificationsService: TimeoutNotificationsService
  ) {
```
* Step 3. Add a Handler, to handle the TimeoutNotificationService events.
```
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
```
this.timeoutNotificationsService.notificationOnChange().subscribe(event => {
  this.timeoutNotificationEventHandler(event);
});
```
* Step 5. Create a configuration object and pass the object to configure the service.
```
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

this.timeoutNotificationsService.initialise(timeoutNotificationConfig);
```

@see app.component.ts
@see https://github.com/hmcts/rpx-xui-webapp
@see https://github.com/hmcts/rpx-xui-manage-organisations

### What Timeout Notification Service Events should I handle?

The Timeout Notification Service currently has three events that you can handle. These are:

The 'countdown' event. This event dispatches a readable countdown timer in it's event payload. the countdown
timer is a readable version of the countdown time ie. '10 seconds' or '1 minute'. Note that this dispatches
once per second when the timer has reached less than 60 seconds till the 'sign-out' event is fired.

If the 'countdown' timer is above a minute this event is dispatched every minute.

The 'keep-alive' event dispatches when the User has interacted with the page again.

The 'sign-out' event dispatches when the countdown timer has come to an end - when the User
should be signed out.

### What does totalIdleTime and idleModalDisplayTime mean?

```totalIdleTime``` is the total amount of time in milliseconds that the User is idle for. ie.
A User is working, they then stop interacting with the page. When the User stops interacting 
with the page is when the totalIdleTime begins.

The Users Total Idle Time, includes the time in which we show the Timeout Modal to a User.

```idleModalDisplayTime``` is the total amount of time in milliseconds to display a Session Timeout Modal.
Note that our xui re-usable Session Timeout Modal can be used.

*Important note*: The idleModalDisplayTime IS PART of the totalIdleTime. The idleModalDisplayTime does not get added to the end of the totalIdleTime.

An example:
`totalIdleTime: 120000`
`idleModalDisplayTime: 60000`,

totalIdleTime is 2 minutes.
idleModalDisplayTime is 1 minute.

This would lead to:
1. On the User being idle for 1 minute, 'countdown' events are thrown.
2. When the User is Idle for 2 minutes a 'sign-out' event is thrown. 
3. If the User interacts with the page within this time a 'keep-alive' event is thrown.
4. By default when the User is idle for under 1 minute, countdown events are thrown each second. 

### What happens when the User is in the final minute of being idle?

When the User is in the final minute of them being idle,
countdown events are thrown every second. So that you can display
a 60 second countdown, within your modal dialog.

## Timeout Notification Service Modal

To implement the XUI Timeout Notification Service Modal, which is the view that goes along with the Timeout Notification Service.

Step 1. Add the latest '@hmcts/rpx-xui-common-lib' into your project.

Step 2. Add the following component into any parent Angular component where you wish to see the modal dialog. Within the XUI projects we've added this into our app.component.html file.

```
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

@see app.component.html
@see app.component.ts
@see https://github.com/hmcts/rpx-xui-webapp
@see https://github.com/hmcts/rpx-xui-manage-organisations

END
