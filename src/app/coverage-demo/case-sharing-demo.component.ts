import { Component } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { SharedCase } from 'projects/exui-common-lib/src/lib/models';
import { CaseSharingStateService } from 'projects/exui-common-lib/src/lib/services/case-sharing-state/case-sharing-state.service';
import { sharingCases, sharingUsers } from './case-sharing-demo.data';

@Component({
  selector: 'app-case-sharing-demo',
  template: '<main id="main-content" tabindex="-1" class="govuk-width-container"><router-outlet></router-outlet></main>',
  providers: [CaseSharingStateService],
  standalone: false
})
export class CaseSharingDemoComponent {
  constructor(state: CaseSharingStateService) {
    state.setCases(sharingCases());
  }
}

@Component({
  selector: 'app-case-sharing-edit-demo',
  templateUrl: './case-sharing-demo.component.html',
  standalone: false
})
export class CaseSharingEditDemoComponent {
  public readonly users = sharingUsers;
  public readonly initialCases$;
  public synchronized: SharedCase[] = [];
  public unselected: SharedCase[] = [];

  constructor(public readonly state: CaseSharingStateService) {
    this.initialCases$ = new BehaviorSubject(state.getCases());
  }

  public synchronize(cases: SharedCase[]): void {
    this.synchronized = cases;
    this.initialCases$.next(cases);
  }
}

@Component({
  selector: 'app-case-sharing-confirm-demo',
  template: `
    <h1 class="govuk-heading-xl">Check case sharing changes</h1>
    <xuilib-share-case-confirm [shareCases$]="cases$"
      changeLink="/coverage/case-sharing" completeLink="/coverage"></xuilib-share-case-confirm>
    <a class="govuk-link" routerLink="/coverage/case-sharing">Cancel confirmation</a>
  `,
  standalone: false
})
export class CaseSharingConfirmDemoComponent {
  public readonly cases$;

  constructor(state: CaseSharingStateService) {
    this.cases$ = of(state.getCases());
  }
}
