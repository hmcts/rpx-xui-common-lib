import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { UserSelectComponent } from '../user-select/user-select.component';

@Component({
  selector: 'xuilib-share-case',
  templateUrl: './share-case.component.html',
  styleUrls: ['./share-case.component.scss']
})
export class ShareCaseComponent implements OnInit {

  @Input() public cases: SharedCase[] = []; // cases selected for sharing
  @Input() public users: UserDetails[] = []; // users of this organisation the cases can be shared with

  @Output() public unselect = new EventEmitter<SharedCase>();
  @Output() public removeUserFromCase = new EventEmitter<SharedCase>();
  @Output() public cancelUserRemovalFromCase = new EventEmitter<SharedCase>();

  public state$: Observable<SharedCase[]>;

  private selectedUser: UserDetails;

  @ViewChild(UserSelectComponent)
  private readonly userSelect: UserSelectComponent;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.state$ = this.stateService.state;
    this.stateService.setCases('0', this.cases);
  }

  public onUnselect(c: SharedCase): void {
    this.unselect.emit(c);
    this.stateService.removeCase(c.caseId);
  }

  public onRemoveUserFromCase(event: any): void {
    this.removeUserFromCase.emit(event);
  }

  public onCancelUserRemovalFromCase(event: any): void {
    this.cancelUserRemovalFromCase.emit(event);
  }

  public onSelectedUser(user: UserDetails) {
    this.selectedUser = user;
  }

  public addUser() {
    this.cases.forEach(c => {
      this.stateService.requestShare(c.caseId, this.selectedUser);
    });
    this.selectedUser = null;
    this.userSelect.clear();
  }

  public isDisabledAdd() {
    return (this.selectedUser == null);

  }

  public isDisabledContinue(): boolean {
    let isDisabled: boolean = true;
    this.state$.subscribe(casesState => {
      for (const caseState of casesState) {
        if (caseState.pendingShares && caseState.pendingShares.length > 0) {
          isDisabled = false;
          break;
        }
        if (caseState.pendingUnshares && caseState.pendingUnshares.length > 0) {
          isDisabled = false;
          break;
        }
      }
    });
    return isDisabled;
  }

  public onDeselect(sharedCase: SharedCase): void {
    if (sharedCase !== null) {
      const updated = [];
      for (const element of this.cases) {
        if (element.caseId !== sharedCase.caseId) {
          updated.push(element);
        }
      }
      this.cases = updated;
    }
    this.stateService.setCases('0', this.cases);
  }
}
