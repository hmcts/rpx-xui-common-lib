import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Person } from '../../models/person.model';
import { SearchOptions } from '../../models/search-options.model';

@Injectable({
  providedIn: 'root'
})
export class FindAPersonService {
  constructor(private readonly http: HttpClient) { }

  public find(searchOptions: SearchOptions): Observable<Person[]> {
    return this.http.post<Person[]>('/workallocation2/findPerson', { searchOptions });
  }
}
