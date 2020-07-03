import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';

@Component({
  selector: 'xuilib-selected-case',
  templateUrl: './selected-case.component.html',
  styleUrls: ['./selected-case.component.scss']
})
export class SelectedCaseComponent {

  @Input() public case: SharedCase;
  @Input() public selectedUser: UserDetails;
  @Input() public opened = false;

  @Output() public unselect = new EventEmitter<SharedCase>();
  @Output() public removeUserFromCase = new EventEmitter<any>();
  @Output() public cancelUserRemovalFromCase = new EventEmitter<any>();
  @Output() public cancelAddRemovalFromCase = new EventEmitter<any>();


  constructor() { }

  public onUnselect(): void {
    this.unselect.emit(this.case);
  }

  public onDeselect(c: SharedCase): void {
    this.unselect.emit(c);
  }

  public trackByUserId(user: UserDetails): string {
    return user.idamId;
  }

  public onRemoveUserFromCase(user: UserDetails, sharedCase: SharedCase): void {
    const payload = {
      user,
      sharedCase
    };
    console.log('in common lib onRemoveUserFromCase' + payload.user.email);
    this.removeUserFromCase.emit(payload);
  }

  public onCancelRemovalUserFromCase(user: UserDetails, c: SharedCase): void {
    const payload = {
      user,
      sharedCase: c
    };
    console.log('in common lib cancel remove user');
    this.cancelUserRemovalFromCase.emit(payload);
  }

  public onCancelAddUserFromCase(user: UserDetails, c: SharedCase): void {
    const payload = {
      user,
      sharedCase: c
    };
    this.cancelAddRemovalFromCase.emit(payload);
  }




}
