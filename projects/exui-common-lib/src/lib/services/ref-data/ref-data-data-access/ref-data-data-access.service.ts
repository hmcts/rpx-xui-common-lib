import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefDataHMCTSService } from '../models/ref-data-htmcs-service.model';
import { RefDataRegion } from '../models/ref-data-region.model';
import { RefDataLocation } from '../models/ref-data-location.model';

@Injectable({
  providedIn: 'root'
})
export class RefDataDataAccessService {
  public static refDataUrl: string = '/api/ref-data';
  public constructor(private readonly http: HttpClient) {}

  public getServices(): Observable<RefDataHMCTSService[]> {
    return this.http.get<RefDataHMCTSService[]>(`${RefDataDataAccessService.refDataUrl}/services`);
  }

  public getRegions(): Observable<RefDataRegion[]> {
    return this.http.get<RefDataRegion[]>(`${RefDataDataAccessService.refDataUrl}/regions`);
  }

  public getLocationsByServiceCode(serviceCode: string) {
    const httpParams = new HttpParams()
      .append('service_code', serviceCode);

    return this.http.get<{
      court_type: string;
      court_type_id: string;
      court_venues: RefDataLocation[];
      service_code: string;
      welsh_court_type: string;
    }>(`${RefDataDataAccessService.refDataUrl}/locations-by-service-code`, { params: httpParams });
  }
}
