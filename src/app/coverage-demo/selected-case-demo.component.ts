import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CaseSharingStateService } from 'projects/exui-common-lib/src/lib/services/case-sharing-state/case-sharing-state.service';
import { SharedCase } from 'projects/exui-common-lib/src/lib/models';
import { sharingCases, sharingUsers } from './case-sharing-demo.data';

@Component({
  selector: 'app-selected-case-demo',
  templateUrl: './selected-case-demo.component.html',
  providers: [CaseSharingStateService],
  standalone: false
})
export class SelectedCaseDemoComponent {
  public readonly cases$: BehaviorSubject<SharedCase[]>;
  public readonly directCase: SharedCase;
  public readonly mode: string;
  public readonly labelConfig = {
    id: 'selected-case-label', label: 'Selected cases', name: 'selected-cases', isPageHeading: false, classes: '', optional: 'optional'
  };

  public unselected: SharedCase[] = [];
  public synchronized: SharedCase[] = [];

  constructor(route: ActivatedRoute, private readonly state: CaseSharingStateService) {
    this.mode = route.snapshot.queryParamMap.get('mode') || 'list';
    const cases = sharingCases();
    if (this.mode === 'no-user') {
      cases[0].sharedWith = [];
    }
    if (this.mode === 'pending' || this.mode === 'confirm' || this.mode === 'confirm-direct') {
      cases[0].pendingShares = [sharingUsers[1]];
    }
    this.state.setCases(cases);
    this.directCase = cases[0];
    this.cases$ = new BehaviorSubject(this.state.getCases());
  }

  public unselectCase(sharedCase: SharedCase): void {
    this.unselected.push(sharedCase);
    this.state.removeCase(sharedCase.caseId);
    this.cases$.next(this.state.getCases());
  }

  public synchronize(cases: SharedCase[]): void {
    this.synchronized = cases;
    this.cases$.next(cases);
  }
}
