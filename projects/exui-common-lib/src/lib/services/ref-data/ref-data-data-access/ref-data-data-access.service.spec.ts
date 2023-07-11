import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RefDataHMCTSService } from '../models/ref-data-htmcs-service.model';
import { RefDataRegion } from '../models/ref-data-region.model';
import { RefDataDataAccessService } from './ref-data-data-access.service';

describe('RefDataDataAccessService', () => {
  let service: RefDataDataAccessService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RefDataDataAccessService],
    });
    service = TestBed.inject(RefDataDataAccessService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getServices', () => {
    it('should return an observable of RefDataHMCTSService[]', () => {
      const dummyData: RefDataHMCTSService[] = [
        {
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
        }
      ];

      service.getServices().subscribe((data) => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${RefDataDataAccessService.refDataUrl}/services`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });

  describe('getRegions', () => {
    it('should return an observable of RefDataRegion[]', () => {
      const dummyData: RefDataRegion[] = [
        { region_id: '1', description: 'Region 1' },
        { region_id: '2', description: 'Region 2' },
      ];

      service.getRegions().subscribe((data) => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${RefDataDataAccessService.refDataUrl}/regions`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });
});
