import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';
import { RefDataHMCTSService } from './models/ref-data-htmcs-service.model';
import { RefDataLocation } from './models/ref-data-location.model';
import { RefDataRegion } from './models/ref-data-region.model';
import {
  RefDataLocationsByServiceCodeResponse
} from './ref-data-data-access/models/ref-data-locations-by-service-code-response.model';
import { RefDataDataAccessService } from './ref-data-data-access/ref-data-data-access.service';
import { RefDataService } from './ref-data.service';

describe('RefDataService', () => {
  let service: RefDataService;
  let dummyHMCTSServices: RefDataHMCTSService[];
  let dummyRegions: RefDataRegion[];
  let dummyLocations: RefDataLocation[];
  let refDataDataAccessServiceMock: jasmine.SpyObj<RefDataDataAccessService>;

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
      {region_id: '1', description: 'Region 1'},
      {region_id: '2', description: 'Region 2'},
    ];

    dummyLocations = [{
      closed_date: '2021-01-01',
      cluster_id: '1',
      cluster_name: 'Cluster 1',
      court_address: 'Court Address 1',
      court_location_code: 'Court Location Code 1',
      court_name: 'Court Name 1',
      court_open_date: '2021-01-01',
      court_status: 'Court Status 1',
      court_type: 'Court Type 1',
      court_type_id: '1',
      court_venue_id: '1',
      dx_address: 'DX Address 1',
      epimms_id: '1',
      is_case_management_location: '1',
      is_hearing_location: '1',
      open_for_public: '1',
      phone_number: 'Phone Number 1',
      postcode: 'Postcode 1',
      region: 'Region 1',
      region_id: '1',
      site_name: 'Site Name 1',
      venue_name: 'Venue Name 1',
      welsh_court_address: 'Welsh Court Address 1',
      welsh_site_name: 'Welsh Site Name 1',
    },
    {
      closed_date: '2021-01-01',
      cluster_id: '2',
      cluster_name: 'Cluster 2',
      court_address: 'Court Address 2',
      court_location_code: 'Court Location Code 2',
      court_name: 'Court Name 2',
      court_open_date: '2021-01-01',
      court_status: 'Court Status 2',
      court_type: 'Court Type 2',
      court_type_id: '2',
      court_venue_id: '2',
      dx_address: 'DX Address 2',
      epimms_id: '2',
      is_case_management_location: '2',
      is_hearing_location: '2',
      open_for_public: '2',
      phone_number: 'Phone Number 2',
      postcode: 'Postcode 2',
      region: 'Region 2',
      region_id: '2',
      site_name: 'Site Name 2',
      venue_name: 'Venue Name 2',
      welsh_court_address: 'Welsh Court Address 2',
      welsh_site_name: 'Welsh Site Name 2'
    }];

    refDataDataAccessServiceMock = jasmine.createSpyObj('RefDataDataAccessService',
      ['getRegions', 'getServices', 'getLocationsByServiceCode', 'getLocations']);
    refDataDataAccessServiceMock.getServices.and.returnValue(of(dummyHMCTSServices));
    refDataDataAccessServiceMock.getRegions.and.returnValue(of(dummyRegions));
    refDataDataAccessServiceMock.getLocations.and.returnValue(of(dummyLocations));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RefDataService,
        { provide: RefDataDataAccessService, useValue: refDataDataAccessServiceMock }
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

  describe('locations$', () => {
    it('should return an observable of RefDataLocation[]', () => {
      service.locations$.subscribe((data) => {
        expect(data).toEqual(dummyLocations);
      });
    });
  });

  describe('getLocationsByServiceCodes', () => {
    it('should retrieve locations by service codes', (done) => {
      const serviceCodes = ['code1', 'code2'];
      refDataDataAccessServiceMock.getLocationsByServiceCode.withArgs('code1').and.returnValue(
        of({court_venues: [dummyLocations[0]]} as RefDataLocationsByServiceCodeResponse)
      );
      refDataDataAccessServiceMock.getLocationsByServiceCode.withArgs('code2').and.returnValue(
        of({court_venues: [dummyLocations[1]]} as RefDataLocationsByServiceCodeResponse)
      );

      service.getLocationsByServiceCodes([serviceCodes[0]]).subscribe((locations) => {
        expect(locations).toBeDefined();
        expect(locations.length).toBe(1);
        expect(locations[0]).toEqual(dummyLocations[0]);
        done();
      });

      service.getLocationsByServiceCodes(serviceCodes).subscribe((locations) => {
        expect(locations).toBeDefined();
        expect(locations.length).toBe(2);
        expect(locations[0]).toEqual(dummyLocations[0]);
        expect(locations[1]).toEqual(dummyLocations[1]);
        done();
      });
    });

    it('should add the observables in the locationsByServiceCodesCache grouped by serviceCodes', (done) => {
      const serviceCodes = ['code1', 'code2'];
      refDataDataAccessServiceMock.getLocationsByServiceCode.withArgs('code1').and.returnValue(
        of({court_venues: [dummyLocations[0]]} as RefDataLocationsByServiceCodeResponse)
      );
      refDataDataAccessServiceMock.getLocationsByServiceCode.withArgs('code2').and.returnValue(
        of({court_venues: [dummyLocations[1]]} as RefDataLocationsByServiceCodeResponse)
      );

      service.getLocationsByServiceCodes([serviceCodes[0]]).subscribe(() => {
        done();
      });

      service.getLocationsByServiceCodes(serviceCodes).subscribe(() => {
        done();
      });

      // @ts-expect-error -- accessing private property
      expect(Object.keys(service.locationsByServiceCodesCache)).toEqual(serviceCodes);
    });



    it('should return an empty array when an error occurs', (done) => {
      const serviceCodes = ['invalid_code'];
      refDataDataAccessServiceMock.getLocationsByServiceCode.withArgs('invalid_code').and.returnValue(throwError(null));

      service.getLocationsByServiceCodes(serviceCodes).subscribe((locations) => {
        expect(locations).toBeDefined();
        expect(locations.length).toBe(0);
        done();
      });
    });
  });
});
