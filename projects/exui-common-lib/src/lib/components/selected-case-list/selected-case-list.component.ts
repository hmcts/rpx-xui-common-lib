import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShareableCase } from '../../models/shareable-case.model';

@Component({
  selector: 'xuilib-selected-case-list',
  templateUrl: './selected-case-list.component.html',
  styleUrls: ['./selected-case-list.component.scss']
})
export class SelectedCaseListComponent implements OnInit {

  @Input() public cases: ShareableCase[] = [];

  @Output() public unselect = new EventEmitter<ShareableCase>();

  constructor() { }

  public ngOnInit() {
  }

  public onUnselect(c: ShareableCase): void {
    this.unselect.emit(c);
  }

}
