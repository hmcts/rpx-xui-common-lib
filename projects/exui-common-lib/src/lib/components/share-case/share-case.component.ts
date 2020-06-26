import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.module';
import { UserDetails } from '../../models/user-details.module';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { UserSelectComponent } from '../user-select/user-select.component';

@Component({
  selector: 'xuilib-share-case',
  templateUrl: './share-case.component.html',
  styleUrls: ['./share-case.component.scss']
})
export class ShareCaseComponent implements OnInit {

  @Input() public cases: SharedCase[] = []; // cases selected for sharing
  @Input() public users: UserDetails[] = []; // users of this organisation the cases can be shared with

  @Output() public unselect = new EventEmitter<SharedCase>();

  public state$: Observable<SharedCase[]>;

  private selectedUser: UserDetails;

  @ViewChild(UserSelectComponent)
  private readonly userSelect: UserSelectComponent;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.state$ = this.stateService.state;
    this.stateService.setCases('0', this.cases);
  }

  public onUnselect(c: SharedCase): void {
    this.unselect.emit(c);
    this.stateService.removeCase(c.caseId);
  }

  public onSelectedUser(user: UserDetails) {
    this.selectedUser = user;
  }

  public addUser() {
    this.cases.forEach(c => {
      this.stateService.requestShare(c.caseId, this.selectedUser);
    });
    this.selectedUser = null;
    this.userSelect.clear();
  }

  public isDisalbedAdd() {
    return true;
  }

  public isDisalbedContinue() {
    return true;
  }

  public onDeselect(c: SharedCase): void {
    console.log('on deselect event')
    if (c != null) {
      let updated = [];
      for (let el of this.cases) {
        if (el.caseId !== c.caseId) {
          updated.push(el);
        }
      }
      this.cases = updated;
    }
    this.stateService.setCases('0', this.cases);
  }
}
