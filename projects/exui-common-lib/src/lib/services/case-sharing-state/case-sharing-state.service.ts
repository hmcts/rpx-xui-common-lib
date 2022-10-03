import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';

@Injectable({
  providedIn: 'root'
})
export class CaseSharingStateService {

  private caseState: SharedCase[] = [];
  private readonly subject = new BehaviorSubject<SharedCase[]>(this.caseState);

  public get state() {
    return this.subject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  constructor() { }

  public setCases(cases: SharedCase[]): void {
    this.caseState = [];
    cases.forEach(aCase => {
      this.caseState.push({ caseId: aCase.caseId, caseTitle: aCase.caseTitle, caseTypeId: aCase.caseTypeId, roles: aCase.roles,
        sharedWith: aCase.sharedWith, pendingShares: aCase.pendingShares, pendingUnshares: aCase.pendingUnshares });
    });
    this.subject.next(this.caseState);
  }

  public getCases(): SharedCase[] {
    return this.caseState;
  }

  public requestShare(user: UserDetails): SharedCase[] {
    const oldSharedCases: SharedCase[] = this.caseState.slice();
    const newSharedCases: SharedCase[] = [];
    for (const sharedCase of oldSharedCases) {
      if (!sharedCase.pendingShares) {
        sharedCase.pendingShares = [];
      }
      const newPendingShares = sharedCase.pendingShares.slice();
      if (!sharedCase.pendingUnshares) {
        sharedCase.pendingUnshares = [];
      }
      const newPendingUnshares = sharedCase.pendingUnshares.slice();
      if (!this.userHasAccess(sharedCase, user)) {
        if (!newPendingShares.some(u => u.email === user.email)) {
          newPendingShares.push(user);
        }
      } else {
        for (let u = 0, ul = newPendingUnshares.length; u < ul; u++) {
          if (newPendingUnshares[u].email === user.email) {
            newPendingUnshares.splice(u, 1);
            break;
          }
        }
      }
      const newSharedCase = {
        ...sharedCase,
        pendingUnshares: newPendingUnshares,
        pendingShares: newPendingShares
      };
      newSharedCases.push(newSharedCase);
    }
    this.subject.next(newSharedCases);
    return newSharedCases;
  }

  public requestUnshare(user: UserDetails, caseId?: string): SharedCase[] {
    const newSharedCases: SharedCase[] = [];
    for (const sharedCase of this.caseState) {
      // If no caseId, then request unshare from all shared cases
      if (caseId === undefined || sharedCase.caseId === caseId) {
        if (!sharedCase.pendingUnshares) {
          sharedCase.pendingUnshares = [];
        }
        const newPendingUnshares = sharedCase.pendingUnshares.slice();
        // If the user is pending shared access, just remove them from pendingShares
        let newPendingShares;
        let indexOfPreviouslyAddedUser = -1;
        if (sharedCase.pendingShares) {
          indexOfPreviouslyAddedUser = sharedCase.pendingShares.findIndex(u => u.idamId === user.idamId);
          if (indexOfPreviouslyAddedUser > -1) {
            newPendingShares = sharedCase.pendingShares.slice();
            newPendingShares.splice(indexOfPreviouslyAddedUser, 1);
          }
        }
        // If the user does not exist in pendingShares, and already has shared access (i.e. exists in sharedWith),
        // request removal of shared access
        if (indexOfPreviouslyAddedUser === -1 && sharedCase.sharedWith && sharedCase.sharedWith.findIndex(
          u => u.idamId === user.idamId) > -1) {
          if (!newPendingUnshares.some(u => u.email === user.email)) {
            newPendingUnshares.push(user);
          }
        }
        const newSharedCase = {
          ...sharedCase,
          pendingUnshares: newPendingUnshares,
          ...(newPendingShares && {
            pendingShares: newPendingShares
          })
        };
        newSharedCases.push(newSharedCase);
      } else {
        newSharedCases.push(sharedCase);
      }
    }
    this.subject.next(newSharedCases);
    return newSharedCases;
  }

  public requestCancel(caseId: string, user: UserDetails): void {
    const newSharedCases: SharedCase[] = [];
    for (const sharedCase of this.caseState) {
      if (sharedCase.caseId === caseId) {
        if (!sharedCase.pendingUnshares) {
          sharedCase.pendingUnshares = [];
        }
        const newPendingUnshares = sharedCase.pendingUnshares.slice();
        for (let iPendingUnshares = 0; iPendingUnshares < newPendingUnshares.length; iPendingUnshares++) {
          if (newPendingUnshares[iPendingUnshares].email === user.email) {
            newPendingUnshares.splice(iPendingUnshares, 1);
            break;
          }
        }
        if (!sharedCase.pendingShares) {
          sharedCase.pendingShares = [];
        }
        const newPendingShares = sharedCase.pendingShares.slice();
        for (let iPendingShares = 0; iPendingShares < newPendingShares.length; iPendingShares++) {
          if (newPendingShares[iPendingShares].email === user.email) {
            newPendingShares.splice(iPendingShares, 1);
            break;
          }
        }
        const newSharedCase = {
          ...sharedCase,
          pendingUnshares: newPendingUnshares,
          pendingShares: newPendingShares
        };
        newSharedCases.push(newSharedCase);
      } else {
        newSharedCases.push(sharedCase);
      }
    }
    this.subject.next(newSharedCases);
    return;
  }

  public removeCase(caseId: string): void {
    if (this.caseState.length > 1) {
      for (let i = 0, l = this.caseState.length; i < l; i++) {
        if (this.caseState[i].caseId === caseId) {
          this.caseState.splice(i, 1);
          this.subject.next(this.caseState);
          return;
        }
      }
    }
  }

  public userHasAccess(c: SharedCase, user: UserDetails): boolean {
    if (!c.sharedWith) {
      return false;
    }
    for (let i = 0, l = c.sharedWith.length; i < l; i++) {
      if (c.sharedWith[i].email === user.email) {
        return true;
      }
    }
    return false;
  }
}
