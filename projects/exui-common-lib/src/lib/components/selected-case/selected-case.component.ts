import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedCase } from '../../models/case-share.module';

@Component({
  selector: 'xuilib-selected-case',
  templateUrl: './selected-case.component.html',
  styleUrls: ['./selected-case.component.scss']
})
export class SelectedCaseComponent implements OnInit {

  @Input() public case: SharedCase;
  @Input() public opened = false;

  @Output() public unselect = new EventEmitter<SharedCase>();

  constructor() { }

  public ngOnInit() {
  }

  public onUnselect(): void {
    this.unselect.emit(this.case);
  }

}
