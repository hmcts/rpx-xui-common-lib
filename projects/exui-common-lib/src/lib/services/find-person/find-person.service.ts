import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  getAllCaseworkersFromServices,
  getSessionStorageKeyForServiceId,
  setCaseworkers
} from '../../gov-ui/util/session-storage/session-storage-utils';
import {
  Caseworker,
  CaseworkersByService,
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
      .pipe(map(judiciary => judiciary.filter(judge => !(assignedUserToCompare.includes(judge.id)))));
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
    const storedServices = [];
    const newServices: string[] = [];
    const storedCaseworkersByService: CaseworkersByService[] = [];
    fullServices.forEach(serviceId => {
      const serviceKey = getSessionStorageKeyForServiceId(serviceId);
      if (this.sessionStorageService.getItem(serviceKey)) {
        storedServices.push(serviceId);
        storedCaseworkersByService.push({ service: serviceId, caseworkers: JSON.parse(this.sessionStorageService.getItem(serviceKey)) });
      } else {
        newServices.push(serviceId);
      }
    });
    // if all services are stored then return the stored caseworkers by service
    if (storedServices.length === fullServices.length) {
      const storedCaseworkers = getAllCaseworkersFromServices(storedCaseworkersByService);
      return of(this.searchInCaseworkers(storedCaseworkers, searchOptions));
    }
    // all serviceIds passed in as node layer getting used anyway and caseworkers also stored there
    return this.http.post<CaseworkersByService[]>('/workallocation/retrieveCaseWorkersForServices', { fullServices }).pipe(
      tap(caseworkersByService => {
        caseworkersByService.forEach(caseworkerListByService => {
          // for any new service, ensure that they are then stored in the session
          if (newServices.includes(caseworkerListByService.service)) {
            setCaseworkers(caseworkerListByService.service, caseworkerListByService.caseworkers, this.sessionStorageService);
          }
        });
      }),
      map(caseworkersByService => {
        const givenCaseworkers = getAllCaseworkersFromServices(caseworkersByService);
        return this.searchInCaseworkers(givenCaseworkers, searchOptions);
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
        domain: caseworker.roleCategory === RoleCategory.CASEWORKER ? PersonRole.CASEWORKER : PersonRole.ADMIN,
        // knownAs can be added if required
      };
      if (caseworker.roleCategory === roleCategory || roleCategory === RoleCategory.ALL) {
        people.push(thisPerson);
      }
    });
    return people;
  }

  public searchInCaseworkers(caseworkers: Caseworker[], searchOptions: SearchOptions): Person[] {
    let roleCategory = RoleCategory.ALL;
    if (!(searchOptions.userRole === PersonRole.ALL)) {
      if (searchOptions.userRole === PersonRole.CASEWORKER) {
        roleCategory = RoleCategory.CASEWORKER;
      } else if (searchOptions.userRole === PersonRole.ADMIN) {
        roleCategory = RoleCategory.ADMIN;
      } else if (searchOptions.userRole === PersonRole.CTSC) {
        roleCategory = RoleCategory.CTSC;
      }
    }
    const searchTerm = searchOptions && searchOptions.searchTerm ? searchOptions.searchTerm.toLowerCase() : '';
    const people = caseworkers ? this.mapCaseworkers(caseworkers, roleCategory) : [];
    const finalPeopleList = people.filter(person => person && person.name && person.name.toLowerCase().includes(searchTerm));
    if (typeof(this.assignedUser) === 'string') {
      return searchOptions.userIncluded ? finalPeopleList.filter(person => person && person.id !== this.assignedUser)
        : finalPeopleList.filter(person => person && person.id !== this.userId && person.id !== this.assignedUser);
    } else {
      return searchOptions.userIncluded ? finalPeopleList.filter(person => person && person.id !== this.assignedUser)
        : finalPeopleList.filter(person => person && person.id !== this.userId && !this.assignedUser.includes(person.id));
    }
  }

  public searchJudicial(value: string, serviceId: string): Observable<JudicialUserModel[]> {
    return this.http.post<JudicialUserModel[]>('api/prd/judicial/getJudicialUsersSearch',
      { searchString: value, serviceCode: serviceId });
  }
}

