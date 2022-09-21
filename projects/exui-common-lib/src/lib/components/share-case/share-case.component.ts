import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase, SharedCaseErrorMessages } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { UserSelectComponent } from '../user-select/user-select.component';

@Component({
  selector: 'xuilib-share-case',
  templateUrl: './share-case.component.html',
  styleUrls: ['./share-case.component.scss']
})
export class ShareCaseComponent implements OnInit {

  public shareCases: SharedCase[] = []; // cases selected for sharing

  @Input() public removeUserFromCaseToggleOn: boolean = false;

  @Input() public shareCases$: Observable<SharedCase[]>;
  @Input() public users: UserDetails[] = []; // users of this organisation the cases can be shared with

  @Input() public confirmLink: string = '';
  @Input() public addUserLabel: string;
  @Input() public showRemoveUsers: boolean = false;
  @Input() public fnTitle: string = '';
  @Input() public title: string = '';

  @Output() public unselect = new EventEmitter<SharedCase>();
  @Output() public synchronizeStore = new EventEmitter<any>();

  private selectedUser: UserDetails;

  @ViewChild(UserSelectComponent)
  private readonly userSelect: UserSelectComponent;

  public validationErrors: { id: string, message: string }[] = [];
  public shareCaseErrorMessage = '';

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.shareCases$.subscribe(shareCases => {
      this.shareCases = shareCases;
      this.stateService.setCases(shareCases);
    });
    this.shareCases$ = this.stateService.state;
  }

  public onUnselect(c: SharedCase): void {
    this.validationErrors = [];
    if (this.stateService.getCases().length === 1) {
      this.validationErrors.push({ id: 'cases', message: SharedCaseErrorMessages.OneCaseMustBeSelected });
      this.shareCaseErrorMessage = SharedCaseErrorMessages.OneCaseMustBeSelected;
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      this.unselect.emit(c);
      this.stateService.removeCase(c.caseId);
    }
  }

  public onSynchronizeStore(event: any): void {
    this.synchronizeStore.emit(event);
  }

  public onSelectedUser(user: UserDetails) {
    this.selectedUser = user;
  }

  public addUser() {
    const newSharedCases = this.stateService.requestShare(this.selectedUser);
    this.selectedUser = null;
    if (this.userSelect) { this.userSelect.clear(); }
    this.synchronizeStore.emit(newSharedCases);
  }

  public isDisabledAdd() {
    return this.selectedUser === null || this.shareCases.length === 0;
  }

  public onDeselect(sharedCase: SharedCase): void {
    if (sharedCase !== null) {
      const updated = [];
      for (const element of this.shareCases) {
        if (element.caseId !== sharedCase.caseId) {
          updated.push(element);
        }
      }
      this.shareCases = updated;
    }
    this.stateService.setCases(this.shareCases);
  }
}
