import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefDataHMCTSService } from '../models/ref-data-htmcs-service.model';
import { RefDataLocation } from '../models/ref-data-location.model';
import { RefDataRegion } from '../models/ref-data-region.model';
import {
  RefDataLocationsByServiceCodeResponse
} from './models/ref-data-locations-by-service-code-response.model';

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

    return this.http.get<RefDataLocationsByServiceCodeResponse>(`${RefDataDataAccessService.refDataUrl}/locations-by-service-code`, { params: httpParams });
  }

  public getLocations() {
    return this.http.get<RefDataLocation[]>(`${RefDataDataAccessService.refDataUrl}/locations`);
  }
}
