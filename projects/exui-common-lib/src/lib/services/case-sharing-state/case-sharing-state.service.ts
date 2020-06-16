import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BasicUser } from '../../models/basic-user.model';
import { ShareableCaseState } from '../../models/shareable-case-state.model';
import { ShareableCase } from '../../models/shareable-case.model';

@Injectable({
  providedIn: 'root'
})
export class CaseSharingStateService {

  private caseState: ShareableCaseState[] = [];
  private readonly subject = new BehaviorSubject<ShareableCaseState[]>(this.caseState);

  public get state() {
    return this.subject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  constructor() { }

  public setCases(orgId: string, cases: ShareableCase[]): void {
    // TODO: check organisation policy against orgId
    parseInt(orgId, 10); // do something with orgId for now to stop linting errors
    this.caseState = [];
    cases.forEach(c => {
      this.caseState.push({ case: c, addedUsers: [], removedUsers: [] });
    });
    this.subject.next(this.caseState);
  }

  public requestShare(caseId: string, user: BasicUser): void {
    for (let i = 0, l = this.caseState.length; i < l; i++) {
      const cs = this.caseState[i];
      const c = cs.case;
      if (c.id === caseId) {
        // case 1 user doesn't have access yet
        if (!this.userHasAccess(c, user)) {
          if (!cs.addedUsers.some(u => u.email === user.email)) {
            cs.addedUsers.push(user);
          }
        } else {
          // user already has access. Check if user is on remove list
          for (let u = 0, ul = cs.removedUsers.length; u < ul; u++) {
            if (cs.removedUsers[u].email === user.email) {
              cs.removedUsers.splice(u, 1);
            }
          }
        }
        // done dealing with this case, so exit early
        this.subject.next(this.caseState);
        return;
      }
    }
  }

  public requestUnshare(caseId: string, user: BasicUser): void {
    for (let i = 0, l = this.caseState.length; i < l; i++) {
      const cs = this.caseState[i];
      const c = cs.case;
      if (c.id === caseId) {
        if (this.userHasAccess(c, user)) {
          if (!cs.removedUsers.some(u => u.email === user.email)) {
            cs.removedUsers.push(user);
          }
        } else {
          for (let u = 0, ul = cs.addedUsers.length; u < ul; u++) {
            if (cs.addedUsers[u].email === user.email) {
              cs.addedUsers.splice(u, 1);
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
      if (this.caseState[i].case.id === caseId) {
        this.caseState.splice(i, 1);
        this.subject.next(this.caseState);
        return;
      }
    }
  }

  private userHasAccess(c: ShareableCase, user: BasicUser): boolean {
    if (!c.users) {
      return false;
    }
    for (let i = 0, l = c.users.length; i < l; i++) {
      if (c.users[i].email === user.email) {
        return true;
      }
    }
    return false;
  }
}
