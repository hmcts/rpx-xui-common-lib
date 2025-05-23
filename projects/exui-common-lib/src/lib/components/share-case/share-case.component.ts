import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  public assignedUsers: UserDetails[];
  public selectedUserToRemove: UserDetails = null;

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

  @ViewChild(UserSelectComponent, { static: true })
  private readonly userSelect: UserSelectComponent;

  public validationErrors: { id: string, message: string }[] = [];
  public shareCaseErrorMessage: ErrorMessagesModel;

  constructor(private readonly stateService: CaseSharingStateService,
              private readonly router: Router) { }

  public ngOnInit() {
    this.shareCases$
      .pipe(tap(sharedCases => {
        // Update the list of users assigned to at least one case
        this.getAssignedUsers(sharedCases.filter(sharedCase => sharedCase.sharedWith && sharedCase.sharedWith.length > 0));
      }))
      .subscribe(shareCases => {
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
    // Update the list of assigned users (which includes pending users)
    this.getAssignedUsers(newSharedCases);
  }

  public removeUser() {
    if (this.selectedUserToRemove) {
      const newSharedCases = this.stateService.requestUnshare(this.selectedUserToRemove);
      this.synchronizeStore.emit(newSharedCases);
    }
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
      // Check that no case is left unassigned; a user can be removed only if there is another current user, or if at
      // least one user is to be added. Prevent navigation to confirmation page if there is at least one case left in
      // an unassigned state
      if (this.hasCasesLeftUnassigned(this.shareCases)) {
        this.validationErrors = [];
        this.validationErrors.push({ id: 'cases', message: SharedCaseErrorMessages.OnePersonMustBeAssigned });
        this.shareCaseErrorMessage = { isInvalid: true, messages: [SharedCaseErrorMessages.OnePersonMustBeAssigned] };
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        this.router.navigate([this.confirmLink]);
      }
    }
  }

  /**
   * Gets a unique list of all users that have been assigned, or are pending assigment to, at least one case
   * @param sharedCases The list of shared cases from which to get users these are shared with, or are to be shared with
   */
  public getAssignedUsers(sharedCases: SharedCase[]): void {
    const users: UserDetails[] = [];
    sharedCases.forEach(sharedCase => {
      if (sharedCase.sharedWith) {
        sharedCase.sharedWith.forEach(user => {
          if (!users.some(existingUser => user.idamId === existingUser.idamId)) {
            users.push(user);
          }
        });
      }
      if (sharedCase.pendingShares) {
        sharedCase.pendingShares.forEach(user => {
          if (!users.some(existingUser => user.idamId === existingUser.idamId)) {
            users.push(user);
          }
        });
      }
    });
    this.assignedUsers = users;
  }

  /**
   * Checks if any shared cases have been left unassigned. This occurs if a shared case has a number of pending
   * unshares equal to the number of current shares, and there are no pending shares.
   * @param sharedCases The array of shared cases to check
   * @returns `true` if at least one case has the condition described above; `false` otherwise
   */
  public hasCasesLeftUnassigned(sharedCases: SharedCase[]): boolean {
    return sharedCases.some(sharedCase => {
      return sharedCase.pendingUnshares && sharedCase.sharedWith &&
        sharedCase.pendingUnshares.length === sharedCase.sharedWith.length &&
        (!sharedCase.pendingShares || sharedCase.pendingShares.length === 0);
    });
  }

  // TEST-TODO
  // Another place where ngModel use is removed for Angular best practice
  // May cause issues but based on understanding should work
  // TODO: Confirm this works correctly after Angular 18 upgrade
  public onSelectedUserToRemoveChanged(value: string): void {
    this.selectedUserToRemove = this.assignedUsers.find(user => `${user.firstName} ${user.lastName} - ${user.email}` === value) || null;
  }
}
