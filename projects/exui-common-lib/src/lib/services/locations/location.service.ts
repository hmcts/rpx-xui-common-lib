import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationModel } from '../../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private readonly http: HttpClient) {}

  public getAllLocations(service: string, locationType: string, searchTerm: string): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(`api/locations/getLocations?service=${service}&locationType=${locationType}&searchTerm=${searchTerm}`);
  }
}
