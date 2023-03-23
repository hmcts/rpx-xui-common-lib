import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { RefDataHMCTSService } from './models/ref-data-htmcs-service.model';
import { RefDataRegion } from './models/ref-data-region.model';
import { RefDataDataAccessService } from './ref-data-data-access/ref-data-data-access.service';
import { RefDataService } from './ref-data.service';

describe('RefDataService', () => {
  let service: RefDataService;
  let dummyHMCTSServices: RefDataHMCTSService[];
  let dummyRegions: RefDataRegion[];

  beforeEach(() => {
    dummyHMCTSServices = [{
      jurisdiction: 'Jurisdiction 1',
      service_id: 1,
      org_unit: 'Org Unit 1',
      business_area: 'Business Area 1',
      sub_business_area: 'Sub Business Area 1',
      service_code: 'Service Code 1',
      service_description: 'Service Description 1',
      service_short_description: 'Service Short Description 1',
      ccd_service_name: 'CCD Service Name 1',
      last_update: 'Last Update 1',
      ccd_case_types: ['CCD Case Type 1'],
    }];

    dummyRegions = [
      { region_id: '1', description: 'Region 1' },
      { region_id: '2', description: 'Region 2' },
    ];
    const spy = jasmine.createSpyObj('RefDataDataAccessService', ['getRegions', 'getServices']);
    spy.getServices.and.returnValue(of(dummyHMCTSServices));
    spy.getRegions.and.returnValue(of(dummyRegions));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RefDataService,
        { provide: RefDataDataAccessService, useValue: spy }
      ]
    });

    service = TestBed.inject(RefDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('regions$', () => {
    it('should return an observable of RefDataRegion[]', () => {
      service.regions$.subscribe((data) => {
        expect(data).toEqual(dummyRegions);
      });
    });
  });

  describe('services$', () => {
    it('should return an observable of RefDataHMCTSService[]', () => {
      service.services$.subscribe((data) => {
        expect(data).toEqual(dummyHMCTSServices);
      });
    });
  });


});
