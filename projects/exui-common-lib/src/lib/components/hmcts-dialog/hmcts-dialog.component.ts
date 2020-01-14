import {DOCUMENT} from '@angular/common';
import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
/*
* Gov UK Dialog Component
* Responsible for displaying dialog layout
* using ng-content to display content from parent
* */
@Component({
  selector: 'lib-dialog',
  templateUrl: './hmcts-dialog.component.html',
  styleUrls: ['./hmcts-dialog.component.scss']
})
export class HmctsDialogComponent  implements OnInit {

  @Input() public positionTop: string;
  @Output() public close = new EventEmitter();
  constructor(@Inject(DOCUMENT) private document: any) {}

  public ngOnInit(): void {
    const dialogEl = this.document.querySelector(`.gem-c-modal-dialogue__box`);
    dialogEl.focus();
  }

  public onClose(): void {
    this.close.emit();
  }

}
