import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorMessagesModel, GovUiConfigModel } from '../../gov-ui/models';
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
  public selectedCasesErrorMessageConfig: GovUiConfigModel;
  public continueAllowed = false;

  @Input() public removeUserFromCaseToggleOn: boolean = false;

  @Input() public shareCases$: Observable<SharedCase[]>;
  @Input() public users: UserDetails[] = []; // users of this organisation the cases can be shared with

  @Input() public confirmLink: string = '';
  @Input() public cancelLink: string = '';
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
  public shareCaseErrorMessage: ErrorMessagesModel;

  constructor(private readonly stateService: CaseSharingStateService,
              private readonly router: Router) { }

  public ngOnInit() {
    this.shareCases$.subscribe(shareCases => {
      this.shareCases = shareCases;
      this.stateService.setCases(shareCases);
      // Set the config to be used by the xuilib-gov-uk-error-message component, in particular the element ID to
      // which the error message is associated
      if (shareCases) {
        this.selectedCasesErrorMessageConfig = {
          id: shareCases.length > 0 ? 'cases' : 'noCaseDisplay'
        };
      }
    });
    this.shareCases$ = this.stateService.state;
    this.shareCaseErrorMessage = { isInvalid: false, messages: [] };
  }

  public onUnselect(c: SharedCase): void {
    this.validationErrors = [];
    if (this.stateService.getCases().length === 1) {
      this.validationErrors.push({ id: 'cases', message: SharedCaseErrorMessages.OneCaseMustBeSelected });
      this.shareCaseErrorMessage = { isInvalid: true, messages: [SharedCaseErrorMessages.OneCaseMustBeSelected] };
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

  /**
   * Function originally used to set disabled state of "Continue" button, now called by the button click handler to
   * control whether navigation to the confirmation page is allowed. It is prevented if no changes have been made
   */
  public setContinueAllowed(): void {
    // Always start with continueAllowed = false. This covers the scenario where a user might add someone for sharing
    // a case (so, continueAllowed = true), then removes the same user before trying to continue. This would
    // erroneously leave continueAllowed as true
    this.continueAllowed = false;
    this.shareCases$.subscribe(shareCases => {
      for (const caseState of shareCases) {
        if (caseState.pendingShares && caseState.pendingShares.length > 0) {
          this.continueAllowed = true;
          break;
        }
        if (caseState.pendingUnshares && caseState.pendingUnshares.length > 0) {
          this.continueAllowed = true;
          break;
        }
      }
    });
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

  public onContinue(): void {
    this.setContinueAllowed();
    // If continuation is not allowed, set an error message
    if (!this.continueAllowed) {
      this.validationErrors = [];
      this.validationErrors.push({ id: 'cases', message: SharedCaseErrorMessages.NoChangesRequested });
      this.shareCaseErrorMessage = { isInvalid: true, messages: [SharedCaseErrorMessages.NoChangesRequested] };
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    // Navigate to confirmation page only if allowed to continue
    if (this.continueAllowed) {
      this.router.navigate([this.confirmLink]);
    }
  }
}
