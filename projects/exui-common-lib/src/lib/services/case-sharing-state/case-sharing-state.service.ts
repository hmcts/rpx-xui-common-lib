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

  public setCases(orgId: string, cases: SharedCase[]): void {
    // TODO: check organisation policy against orgId
    parseInt(orgId, 10); // do something with orgId for now to stop linting errors
    this.caseState = [];
    cases.forEach(c => {
      this.caseState.push({ caseId: c.caseId, caseTitle: c.caseTitle, roles: c.roles, sharedWith: c.sharedWith, pendingShares: c.pendingShares, pendingUnshares: c.pendingUnshares });
    });
    this.subject.next(this.caseState);
  }

  public requestShare(caseId: string, user: UserDetails): void {
    for (let i = 0, l = this.caseState.length; i < l; i++) {
      const cs = this.caseState[i];
      if (cs.caseId === caseId) {
        // case 1 user doesn't have access yet
        if (!this.userHasAccess(cs, user)) {
          if (!cs.pendingShares.some(u => u.email === user.email)) {
            cs.pendingShares.push(user);
          }
        } else {
          // user already has access. Check if user is on remove list
          for (let u = 0, ul = cs.pendingUnshares.length; u < ul; u++) {
            if (cs.pendingUnshares[u].email === user.email) {
              cs.pendingUnshares.splice(u, 1);
            }
          }
        }
        // done dealing with this case, so exit early
        this.subject.next(this.caseState);
        return;
      }
    }
  }

  public requestUnshare(caseId: string, user: UserDetails): void {
    for (let i = 0, l = this.caseState.length; i < l; i++) {
      const cs = this.caseState[i];
      if (cs.caseId === caseId) {
        if (this.userHasAccess(cs, user)) {
          if (!cs.pendingUnshares.some(u => u.email === user.email)) {
            cs.pendingUnshares.push(user);
          }
        } else {
          for (let u = 0, ul = cs.pendingShares.length; u < ul; u++) {
            if (cs.pendingShares[u].email === user.email) {
              cs.pendingShares.splice(u, 1);
            }
          }
        }
        this.subject.next(this.caseState);
        return;
      }
    }
  }

  public removeCase(caseId: string): void {
    for (let i = 0, l = this.caseState.length; i < l; i++) {
      if (this.caseState[i].caseId === caseId) {
        this.caseState.splice(i, 1);
        this.subject.next(this.caseState);
        return;
      }
    }
  }

  private userHasAccess(c: SharedCase, user: UserDetails): boolean {
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
