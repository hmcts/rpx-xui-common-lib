import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LocationByEPIMMSModel} from '../../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private readonly http: HttpClient) {
  }

  /**
   * @description getAllLocations from service Ids/location type/search term
   * @param serviceIds: SSCS | SSCS,IA split with ','
   * @param locationType: optional | hearing | case_management
   * @param searchTerm: any search term for postcode | site name | venue name |court name | court address etc.
   * @return Observable<LocationByEPIMMSModel[]>: Array of locationModel in Observable
   */
  public getAllLocations(serviceIds: string, locationType: string, searchTerm: string): Observable<LocationByEPIMMSModel[]> {
    if (locationType === 'hearing') {
      return this.http.get<LocationByEPIMMSModel[]>(`api/prd/location/getLocations?serviceIds=${serviceIds}&locationType=${locationType}&searchTerm=${searchTerm}`);
    }
    return this.http.get<LocationByEPIMMSModel[]>(`api/locations/getLocations?serviceIds=${serviceIds}&locationType=${locationType}&searchTerm=${searchTerm}`);
  }
}
