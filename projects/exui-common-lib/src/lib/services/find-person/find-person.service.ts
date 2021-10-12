import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Caseworker, Person, PersonRole } from '../../models/person.model';
import { SearchOptions } from '../../models/search-options.model';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FindAPersonService {

  public static caseworkersKey: string = 'caseworkers';

  constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) { }

  public find(searchOptions: SearchOptions): Observable<Person[]> {
    return this.http.post<Person[]>('/workallocation2/findPerson', { searchOptions });
  }

  public findCaseworkers(searchOptions: SearchOptions): Observable<Person[]> {
    if (!this.sessionStorageService.getItem(FindAPersonService.caseworkersKey)) {
      this.http.get<Caseworker[]>('/workallocation2/caseworker').pipe(
        tap(caseworkerList => this.sessionStorageService.setItem(FindAPersonService.caseworkersKey, JSON.stringify(caseworkerList)))
      );
    }
    const caseworkers = JSON.parse(this.sessionStorageService.getItem(FindAPersonService.caseworkersKey));
    const people = caseworkers ? this.mapCaseworkers(caseworkers) : [];
    const searchTerm = searchOptions && searchOptions.searchTerm ? searchOptions.searchTerm.toLowerCase() : '';
    return of(people.filter(person => person && person.name && person.name.toLowerCase().includes(searchTerm)));
  }

  public mapCaseworkers(caseworkers: Caseworker[]): Person[] {
    const people: Person[] = [];
    caseworkers.forEach((caseworker) => {
      const thisPerson: Person = {
        email: caseworker.email,
        name: `${caseworker.firstName} ${caseworker.lastName}`,
        id: caseworker.idamId,
        domain: PersonRole.CASEWORKER,
        // knownAs can be added if required
      };
      people.push(thisPerson);
    });
    return people;
  }
}

