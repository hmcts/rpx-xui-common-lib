import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';
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
  private readonly locationsByServiceCodesCache: {[serviceCode: string]: Observable<RefDataLocation[]>} = {};

  constructor(private readonly refDataDataAccessService: RefDataDataAccessService) {
    this.regions$ = this.refDataDataAccessService.getRegions().pipe(shareReplay());
    this.services$ = this.refDataDataAccessService.getServices().pipe(shareReplay());
  }

  public getLocationsByServiceCodes(serviceCodes: string[]): Observable<RefDataLocation[]> {
    const observables: Observable<RefDataLocation[]>[] = [];

    serviceCodes.forEach(serviceCode => {
      if (!this.locationsByServiceCodesCache[serviceCode]) {
        this.locationsByServiceCodesCache[serviceCode] = this.refDataDataAccessService.getLocationsByServiceCode(serviceCode).pipe(
          catchError(() => of({ court_venues: [] })),
          map(responseData => responseData.court_venues),
          shareReplay()
        );
      }

      observables.push(this.locationsByServiceCodesCache[serviceCode]);
    });

    return forkJoin(observables).pipe(
      map((values) => values.reduce((acc, val) => acc.concat(val)), []),
      take(1)
    );
  }
}
