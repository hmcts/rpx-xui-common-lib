import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';

@Component({
  selector: 'xuilib-selected-case-confirm',
  templateUrl: './selected-case-confirm.component.html',
  styleUrls: ['./selected-case-confirm.component.scss']
})
export class SelectedCaseConfirmComponent {

  @Input() public case: SharedCase;
  @Input() public opened = false;
  @Input() public changeLink: string = '';

  @Output() public unselect = new EventEmitter<SharedCase>();

  constructor() { }

  public trackByUserId(user: UserDetails): string {
    return user.idamId;
  }
}
