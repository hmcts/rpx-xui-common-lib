import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { FeatureToggleService } from '../../services';
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

  constructor(private readonly stateService: CaseSharingStateService,
              private readonly featureToggleService: FeatureToggleService) { }

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

  public getFeatureToggleFlag(): Observable<boolean> {
    return this.featureToggleService.getValue('remove-user-from-case', false);
  }

  public canRemove(caseId: string, user: UserDetails): boolean {
    let removeUserFromCaseToggleOn = false;
    this.getFeatureToggleFlag().subscribe(flag => removeUserFromCaseToggleOn = flag);
    let canRemove = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingUnshares &&  aCase.pendingUnshares.some(u => u.idamId === user.idamId)) {
            canRemove = false;
            break;
          }
          if (aCase.sharedWith &&  aCase.sharedWith.some(u => u.idamId === user.idamId)) {
            canRemove = true;
            break;
          }
        }
      }
    });
    return removeUserFromCaseToggleOn && canRemove;
  }

  public canCancel(caseId: string, user: UserDetails): boolean {
    let canCancel = false;
    this.shareCases$.subscribe(cases => {
      for (const aCase of cases) {
        if (aCase.caseId === caseId) {
          if (aCase.pendingShares &&  aCase.pendingShares.some(u => u.idamId === user.idamId)) {
            canCancel = true;
            break;
          }
          if (aCase.pendingUnshares &&  aCase.pendingUnshares.some(u => u.idamId === user.idamId)) {
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

  public onRemove(user: UserDetails, sharedCase: SharedCase): void {
    this.stateService.requestUnshare(sharedCase.caseId, user);
    this.synchronizeStore.emit(this.shareCases);
  }

  public onCancel(user: UserDetails, sharedCase: SharedCase): void {
    this.stateService.requestCancel(sharedCase.caseId, user);
    this.synchronizeStore.emit(this.shareCases);
  }

  public showNoUsersAccessInfo(): boolean {
    // A user is added to a case
    if (this.sharedCase.pendingShares) {
      if (this.sharedCase.pendingShares.length > 0) {
        return false;
      }
    }
    // A case has 0 users with access to it
    if (this.sharedCase.sharedWith) {
      if (this.sharedCase.sharedWith.length === 0) {
        return true;
      }
    }
    // Access to the last user is removed
    if (this.sharedCase.sharedWith && this.sharedCase.pendingUnshares) {
      if (this.sharedCase.pendingUnshares.length > 0
        && this.sharedCase.sharedWith.length === this.sharedCase.pendingUnshares.length) {
        return true;
      }
    }
    return false;
  }

  public showUserHasAccessInfo(): boolean {
    return !this.showNoUsersAccessInfo();
  }

  public showUserAccessTable(): boolean {
    if (this.sharedCase.pendingShares) {
      if (this.sharedCase.pendingShares.length > 0) {
        return true;
      }
    }
    if (this.sharedCase.sharedWith) {
      if (this.sharedCase.sharedWith.length > 0) {
        return true;
      }
    }
    return false;
  }
}
