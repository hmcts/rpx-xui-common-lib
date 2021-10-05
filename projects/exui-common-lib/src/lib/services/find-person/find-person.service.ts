import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Caseworker, Person, PersonRole } from '../../models/person.model';
import { SearchOptions } from '../../models/search-options.model';

@Injectable({
  providedIn: 'root'
})
export class FindAPersonService {
  constructor(private readonly http: HttpClient) { }

  public find(searchOptions: SearchOptions): Observable<Person[]> {
    return this.http.post<Person[]>('/workallocation2/findPerson', { searchOptions });
  }

  public findCaseworkers(searchOptions: SearchOptions): Observable<Person[]> {
    return this.http.get<any[]>('/workallocation2/caseworker').pipe(map(caseworkers => {
      const people = this.mapCaseworkers(caseworkers);
      return people.filter(person => person && person.name && person.name.toLowerCase().includes(searchOptions.searchTerm.toLowerCase()));
    }));
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

