RPX XUI COMMON LIBRARY
======================

Overview
--------

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

    @hmcts/rpx-xui-common-lib


Prerequisites
-------------

- Node.js 24.x or a later version accepted by package.json.
- Yarn 4.5.3, managed through the repository's Yarn configuration.
- Chromium, Firefox and WebKit when running the full Playwright suite.
- Git Bash or WSL on Windows for shell commands that use Unix-style syntax.

Install dependencies from the repository root:

    corepack enable
    yarn install --immutable

The repository uses the node-modules linker. Do not commit node_modules,
dist/, coverage/, docs/ or generated browser-test results.


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

Start the demo and open it automatically:

    yarn start

The demo is a development and test host. It is not a production deployment of
the common library.


Build the library
-----------------

Build the library and synchronise the generated package output:

    yarn build

The explicit production library build is:

    yarn build:library

Build continuously while editing library source:

    yarn build:library:watch

The build also generates the condition parser from its Peggy grammar. The
generated condition-parser.generated.ts file must not be edited by hand; edit
the source grammar and run the generation task instead:

    yarn generate:condition-parser

Generated package output is written below:

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
