import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BasicUser } from '../../models/basic-user.model';
import { ShareableCase } from '../../models/shareable-case.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { UserSelectComponent } from '../user-select/user-select.component';

@Component({
  selector: 'xuilib-share-case',
  templateUrl: './share-case.component.html',
  styleUrls: ['./share-case.component.scss']
})
export class ShareCaseComponent implements OnInit {

  @Input() public cases: ShareableCase[] = []; // cases selected for sharing
  @Input() public users: BasicUser[] = []; // users of this organisation the cases can be shared with

  @Output() public unselect = new EventEmitter<ShareableCase>();

  private selectedUser: BasicUser;

  @ViewChild(UserSelectComponent)
  private readonly userSelect: UserSelectComponent;

  constructor(private readonly stateService: CaseSharingStateService) { }

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

  public onSelectedUser(user: BasicUser) {
    this.selectedUser = user;
  }

  public addUser() {
    this.cases.forEach(c => {
      this.stateService.requestShare(c.id, this.selectedUser);
    });
    this.selectedUser = null;
    this.userSelect.clear();
  }

}
