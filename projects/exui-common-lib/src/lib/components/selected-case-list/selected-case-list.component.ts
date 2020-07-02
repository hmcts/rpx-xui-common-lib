import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';


@Component({
  selector: 'xuilib-selected-case-list',
  templateUrl: './selected-case-list.component.html',
  styleUrls: ['./selected-case-list.component.scss']
})
export class SelectedCaseListComponent {

  @Input() public cases: SharedCase[] = [];

  @Output() public unselect = new EventEmitter<SharedCase>();
  @Output() public removeUserFromCase = new EventEmitter<SharedCase>();
  @Output() public cancelUserRemovalFromCase = new EventEmitter<SharedCase>();

  constructor() { }

  public onUnselect(sharedCase: SharedCase): void {
    this.unselect.emit(sharedCase);
  }

  public onRemoveUserFromCase(event: any): void {
    this.removeUserFromCase.emit(event);
  }

  public onCancelUserRemovalFromCase(event: any): void {
    this.removeUserFromCase.emit(event);
  }

  public trackByCaseId(sharedCase: SharedCase): string {
    return sharedCase.caseId;
  }
}
