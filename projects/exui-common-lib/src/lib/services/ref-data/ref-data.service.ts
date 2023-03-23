import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RefDataHMCTSService } from './models/ref-data-htmcs-service.model';
import { RefDataLocation } from './models/ref-data-location.model';
import { RefDataRegion } from './models/ref-data-region.model';
import { RefDataDataAccessService } from './ref-data-data-access/ref-data-data-access.service';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {
  public regions$: Observable<RefDataRegion[]>;
  public services$: Observable<RefDataHMCTSService[]>;

  private locationsByServiceCodes: {[serviceCode: string]: Observable<any>} = {};

  constructor(private refDataDataAccessService: RefDataDataAccessService) {
    this.regions$ = this.refDataDataAccessService.getRegions().pipe(shareReplay());
    this.services$ = this.refDataDataAccessService.getServices().pipe(shareReplay());
  }

  public getLocationsByServiceCodes(serviceCodes: string[]): Promise<RefDataLocation[]> {
    const observables: Observable<RefDataLocation[]>[] = [];

    serviceCodes.forEach(serviceCode => {
      if (!this.locationsByServiceCodes[serviceCode]) {
        this.locationsByServiceCodes[serviceCode] = this.refDataDataAccessService.getLocationsByServiceCode(serviceCode).pipe(
          map(responseData => responseData.court_venues),
          shareReplay()
        );
      }
      observables.push(this.locationsByServiceCodes[serviceCode]);
    });

    return forkJoin(observables).pipe(
      map((values) => values.reduce((acc, val) => acc.concat(val)), []),
    ).toPromise();
  }
}
