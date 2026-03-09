import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Caseworker,
  JudicialUserModel,
  Person,
  PersonRole,
  RoleCategory,
  SearchOptions
} from '../../models';
import { SessionStorageService } from '../storage/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FindAPersonService {
  public static caseworkersKey: string = 'caseworkers';
  public userId: string;
  public assignedUser: string | string[] = [];

  constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) {
  }

  public find(searchOptions: SearchOptions): Observable<Person[]> {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr && !searchOptions.userIncluded) {
      const userInfo = JSON.parse(userInfoStr);
      this.userId = userInfo.id ? userInfo.id : userInfo.uid;
    }
    this.assignedUser = searchOptions.assignedUser ? searchOptions.assignedUser : [];
    let assignedUserToCompare = this.assignedUser;
    if (typeof(this.assignedUser) === 'string') {
      assignedUserToCompare = [this.assignedUser];
    }
    return this.http.post<Person[]>('/workallocation/findPerson', { searchOptions })
      .pipe(map((judiciary) => judiciary.filter((judge) => !(assignedUserToCompare.includes(judge.id)))));
    // Removed the current user id to fix EUI-8465.
  }

  public findCaseworkers(searchOptions: SearchOptions): Observable<Person[]> {
    const userInfoStr = this.sessionStorageService.getItem('userDetails');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      this.userId = userInfo.id ? userInfo.id : userInfo.uid;
    }
    this.assignedUser = searchOptions.assignedUser ? searchOptions.assignedUser : [];
    const fullServices = searchOptions.services;
    return this.http.post<Caseworker[]>('/workallocation/caseworker/getUsersByServiceName', { services: fullServices, term: searchOptions.searchTerm }).pipe(
      map((caseworkers) => {
        return this.searchInCaseworkers(caseworkers, searchOptions);
      })
    );
  }

  public mapCaseworkers(caseworkers: Caseworker[], roleCategory: string): Person[] {
    const people: Person[] = [];
    caseworkers.forEach((caseworker) => {
      const thisPerson: Person = {
        email: caseworker.email,
        name: `${caseworker.firstName} ${caseworker.lastName}`,
        id: caseworker.idamId,
        // TODO(EXUI-2073): Decision needed for roleCategory === <NEW_CATEGORY>.
        // QUESTION: Should <NEW_CATEGORY> map to an existing PersonRole label or get its own label?
        // CONTEXT: This is the transformation point from backend Caseworker.roleCategory to UI Person.domain.
        // CONTEXT: Current ternary preserves only LEGAL_OPERATIONS; ADMIN/CTSC/JUDICIAL/PROFESSIONAL/CITIZEN/unknown map to Admin.
        // CONTEXT: Person.domain is used by UI display/branching, so category collapse can hide distinct behaviour and wording.
        domain: caseworker.roleCategory === RoleCategory.LEGAL_OPERATIONS ? PersonRole.LEGAL_OPERATIONS : PersonRole.ADMIN
        // knownAs can be added if required
      };
      // TODO(EXUI-2073): Decision needed for roleCategory filtering for <NEW_CATEGORY>.
      // QUESTION: Should <NEW_CATEGORY> be included only on exact match, with RoleCategory.ALL, or never in this journey?
      // CONTEXT: Inclusion is decided here by OR-logic: exact roleCategory match, broad RoleCategory.ALL match, or current-user idamId match.
      // CONTEXT: The current-user bypass can include a person even when their roleCategory does not match the selected filter.
      // CONTEXT: There is no explicit deny/exclude branch by category, so <NEW_CATEGORY> behaviour depends entirely on these three paths.
      if (caseworker.roleCategory === roleCategory || roleCategory === RoleCategory.ALL || caseworker.idamId === this.userId) {
        people.push(thisPerson);
      }
    });
    return people;
  }

  public searchInCaseworkers(caseworkers: Caseworker[], searchOptions: SearchOptions): Person[] {
    let roleCategory = RoleCategory.ALL;
    // TODO(EXUI-2073): Decision needed for PersonRole -> RoleCategory mapping for <NEW_CATEGORY>.
    // QUESTION: Should UI expose <NEW_CATEGORY> as a selectable PersonRole, and which RoleCategory should be sent?
    // CONTEXT: roleCategory starts as ALL and is narrowed only for explicit PersonRole branches below.
    // CONTEXT: JUDICIAL and any unhandled PersonRole currently keep RoleCategory.ALL (broad caseworker category match).
    // CONTEXT: If <NEW_CATEGORY> is selectable but not mapped here, caseworker filtering may be broader than intended.
    if (!(searchOptions.userRole === PersonRole.ALL)) {
      if (searchOptions.userRole === PersonRole.LEGAL_OPERATIONS) {
        roleCategory = RoleCategory.LEGAL_OPERATIONS;
      } else if (searchOptions.userRole === PersonRole.ADMIN) {
        roleCategory = RoleCategory.ADMIN;
      } else if (searchOptions.userRole === PersonRole.CTSC) {
        roleCategory = RoleCategory.CTSC;
      }
    }
    const searchTerm = searchOptions && searchOptions.searchTerm ? searchOptions.searchTerm.toLowerCase() : '';
    const people = caseworkers ? this.mapCaseworkers(caseworkers, roleCategory) : [];
    const finalPeopleList = people.filter((person) => person && person.name && person.name.toLowerCase().includes(searchTerm));

    if (typeof(this.assignedUser) === 'string') {
      return finalPeopleList.filter((person) => person && person.id !== this.assignedUser);
    }
    return finalPeopleList.filter((person) => person && !this.assignedUser.includes(person.id));
  }

  public searchJudicial(value: string, serviceId: string): Observable<JudicialUserModel[]> {
    return this.http.post<JudicialUserModel[]>('api/prd/judicial/getJudicialUsersSearch',
      { searchString: value, serviceCode: serviceId });
  }
}
