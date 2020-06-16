import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasicUser } from '../../models/basic-user.model';
import { ShareableCase } from '../../models/shareable-case.model';

@Component({
  selector: 'xuilib-share-case',
  templateUrl: './share-case.component.html',
  styleUrls: ['./share-case.component.scss']
})
export class ShareCaseComponent implements OnInit {

  @Input() public cases: ShareableCase[] = []; // cases selected for sharing
  @Input() public users: BasicUser[] = []; // users of this organisation the cases can be shared with

  @Output() public unselect = new EventEmitter<ShareableCase>();

  constructor() { }

  public ngOnInit() {
  }

  public onUnselect(c: ShareableCase): void {
    this.unselect.emit(c);
    for (let i = 0, l = this.cases.length; i < l; i++) {
      if (this.cases[i].id === c.id) {
        this.cases.splice(i, 1);
        return;
      }
    }
  }

}
