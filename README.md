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

The Playwright tests in `e2e/` exercise the demo host (`src/`) in Chromium, Firefox and WebKit locally and in CI. There are 51 distinct scenarios (153 browser executions): 34 for the existing home demo and 17 for the `/coverage` demo. The additional examples cover generic-filter validation, persistence and cancellation; pagination boundaries and events; cookie choices; user selection; terms confirmation; primary and secondary navigation; banners and error summaries; and the session dialog. The `/coverage` page is demo/test-host code only: no production library implementation under `projects/exui-common-lib/` was changed for this expansion. These browser tests do not imply 100% coverage of CommonLib's APIs or consumer journeys; library unit tests still run separately through `yarn test`.

- `yarn e2e` (`ng e2e`) - Angular starts the demo dev server and passes its URL to Playwright via `PLAYWRIGHT_TEST_BASE_URL`, so Playwright does not start a second server.
- `yarn playwright test` - Playwright starts the demo itself (`yarn start:no-open` on http://localhost:4200), reusing an already running server outside CI. Add `--ui` for UI mode.
- `yarn test:e2e:typecheck` - typecheck the Playwright config and test sources without starting a browser.
- `PLAYWRIGHT_TEST_BASE_URL=<url> yarn playwright test` - run against an already running host; no server is started.
- `PLAYWRIGHT_REPORTERS=list,html,junit,odhin` - choose reporters (default `list,odhin` locally and `dot,odhin` in CI; JUnit is written to `test-results/junit.xml`).
- Odhín writes its HTML index to `test-results/odhin/common-lib-playwright.html` and keeps assets/attachments beside it. Set `PW_ODHIN_OUTPUT`, `PW_ODHIN_INDEX`, `PW_ODHIN_TITLE`, `PW_ODHIN_ENV`, `PW_ODHIN_PROJECT` or `PW_ODHIN_RELEASE` to override metadata and output paths.
- GitHub Actions publishes Odhín reports to a persistent `odhin-reports` peer branch and deploys one GitHub Pages site with separate history paths. The root index lists branches; `reports/master/` is the branch history index, and `reports/<branch-slug>/runs/<run-id>-attempt-<attempt>/` is an immutable Odhín dashboard. The workflow summary opens the latest immutable dashboard first, then links the branch history and the downloadable `common-lib-playwright-evidence` artifact. Fork pull requests remain artifact-only and are not copied to the public report-history branch.
- `yarn playwright show-report` - view the last HTML report.

Install the browsers once with `yarn playwright install chromium firefox webkit`.

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
