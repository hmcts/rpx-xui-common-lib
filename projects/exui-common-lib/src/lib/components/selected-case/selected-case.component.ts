import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShareableCase } from '../../models/shareable-case.model';

@Component({
  selector: 'xuilib-selected-case',
  templateUrl: './selected-case.component.html',
  styleUrls: ['./selected-case.component.scss']
})
export class SelectedCaseComponent implements OnInit {

  @Input() public case: ShareableCase;
  @Input() public opened = false;

  @Output() public unselect = new EventEmitter<ShareableCase>();

  constructor() { }

  public ngOnInit() {
  }

  public onUnselect(): void {
    this.unselect.emit(this.case);
  }

}
