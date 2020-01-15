import {Component, EventEmitter, Input, Output} from '@angular/core';
/*
* Gov UK Dialog Component
* Responsible for displaying dialog layout
* using ng-content to display content from parent
* */
@Component({
  selector: 'xuilib-session-dialog',
  templateUrl: './hmcts-session-dialog.component.html',
  styleUrls: ['./hmcts-session-dialog.component.scss']
})
export class HmctsSessionDialogComponent  {

  @Input() public positionTop: string;
  @Output() public close = new EventEmitter();
  constructor() {}

  public onClose(): void {
    this.close.emit();
  }

}
