import { Component, Input, OnInit } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'xuilib-selected-case-confirm',
  templateUrl: './selected-case-confirm.component.html',
  styleUrls: ['./selected-case-confirm.component.scss']
})
export class SelectedCaseConfirmComponent implements OnInit {

  @Input() public sharedCase: SharedCase;
  @Input() public changeLink: string = '';

  public shareCases: SharedCase[];
  public shareCases$: Observable<SharedCase[]>;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.shareCases$ = this.stateService.state;
    this.shareCases$.subscribe(shareCases => this.shareCases = shareCases);
  }

  public trackByUserId(user: UserDetails): string {
    return user.idamId;
  }

  public isToBeRemoved(caseId: string, user: UserDetails): boolean {
    let isToBeRemoved = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingUnshares &&  aCase.pendingUnshares.some(u => u.idamId === user.idamId)) {
            isToBeRemoved = true;
            break;
          }
        }
      }
    });
    return isToBeRemoved;
  }

  public isToBeAdded(caseId: string, user: UserDetails): boolean {
    let isToBeAdded = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingShares &&  aCase.pendingShares.some(u => u.idamId === user.idamId)) {
            isToBeAdded = true;
            break;
          }
        }
      }
    });
    return isToBeAdded;
  }
}
