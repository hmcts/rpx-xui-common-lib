import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';

@Component({
  selector: 'xuilib-selected-case',
  templateUrl: './selected-case.component.html',
  styleUrls: ['./selected-case.component.scss']
})
export class SelectedCaseComponent implements OnInit {

  @Input() public sharedCase: SharedCase;
  @Input() public selectedUser: UserDetails;
  @Input() public opened = false;

  @Output() public unselect = new EventEmitter<SharedCase>();
  @Output() public synchronizeStore = new EventEmitter<any>();

  public shareCases: SharedCase[];
  public shareCases$: Observable<SharedCase[]>;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.shareCases$ = this.stateService.state;
    this.shareCases$.subscribe(shareCases => this.shareCases = shareCases);
  }

  public onUnselect(): void {
    this.unselect.emit(this.sharedCase);
  }

  public onDeselect(c: SharedCase): void {
    this.unselect.emit(c);
  }

  public trackByUserId(user: UserDetails): string {
    return user.idamId;
  }

  public canRemove(caseId: string, user: UserDetails): boolean {
    let canRemove = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingUnshares && aCase.pendingUnshares.includes(user)) {
            canRemove = false;
            break;
          }
          if (aCase.sharedWith && aCase.sharedWith.includes(user)) {
            canRemove = true;
            break;
          }
        }
      }
    });
    return canRemove;
  }

  public canCancel(caseId: string, user: UserDetails): boolean {
    let canCancel = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingShares && aCase.pendingShares.includes(user)) {
            canCancel = true;
            break;
          }
          if (aCase.pendingUnshares && aCase.pendingUnshares.includes(user)) {
            canCancel = true;
            break;
          }
        }
      }
    });
    return canCancel;
  }

  public isToBeRemoved(caseId: string, user: UserDetails): boolean {
    let isToBeRemoved = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingUnshares && aCase.pendingUnshares.includes(user)) {
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
          if (aCase.pendingShares && aCase.pendingShares.includes(user)) {
            isToBeAdded = true;
            break;
          }
        }
      }
    });
    return isToBeAdded;
  }

  public onRemove(user: UserDetails, sharedCase: SharedCase): void {
    this.stateService.requestUnshare(sharedCase.caseId, user);
    this.synchronizeStore.emit(this.shareCases);
  }

  public onCancel(user: UserDetails, sharedCase: SharedCase): void {
    this.stateService.requestCancel(sharedCase.caseId, user);
    this.synchronizeStore.emit(this.shareCases);
  }

}
