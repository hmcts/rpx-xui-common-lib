import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedCase } from '../../models/case-share.module';

@Component({
  selector: 'xuilib-selected-case-list',
  templateUrl: './selected-case-list.component.html',
  styleUrls: ['./selected-case-list.component.scss']
})
export class SelectedCaseListComponent implements OnInit {

  @Input() public cases: SharedCase[] = [];

  @Output() public unselect = new EventEmitter<SharedCase>();

  constructor() { }

  public ngOnInit() {
  }

  public onUnselect(c: SharedCase): void {
    this.unselect.emit(c);
  }

}
