import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';

@Component({
  selector: 'xuilib-selected-case-list',
  templateUrl: './selected-case-list.component.html',
  styleUrls: ['./selected-case-list.component.scss']
})
export class SelectedCaseListComponent {

  @Input() public cases: SharedCase[] = [];

  @Input() public toConfirm: boolean = false;

  @Input() public changeLink: string = '';

  @Output() public unselect = new EventEmitter<SharedCase>();

  constructor() { }

  public onUnselect(sharedCase: SharedCase): void {
    this.unselect.emit(sharedCase);
  }

  public trackByCaseId(sharedCase: SharedCase): string {
    return sharedCase.caseId;
  }
}
