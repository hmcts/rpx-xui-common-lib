import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocationByEPIMMSModel, LocationsByService } from '../../models/location.model';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST all location criteria to the supplied URL', () => {
    const locationUrl = '/api/locations/search';
    const userLocations: LocationsByService[] = [
      { serviceCode: 'SSCS', bookable: true, locations: [{ epimms_id: 'epimms-1' }] }
    ];
    const response: LocationByEPIMMSModel[] = [{ epimms_id: 'epimms-2', site_name: 'Court site' }];
    let result: LocationByEPIMMSModel[] | undefined;

    service.getAllLocations(locationUrl, 'SSCS,IA', 'hearing', 'Court', userLocations)
      .subscribe(locations => result = locations);

    const request = httpMock.expectOne(locationUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      serviceIds: 'SSCS,IA',
      locationType: 'hearing',
      searchTerm: 'Court',
      userLocations
    });
    request.flush(response);

    expect(result).toEqual(response);
  });

  it('should GET locations with the exact service, type and search query', () => {
    const response: LocationByEPIMMSModel[] = [{ epimms_id: 'epimms-1' }];
    let result: LocationByEPIMMSModel[] | undefined;

    service.searchLocations('SSCS,IA', 'case_management', 'SW1A2AA')
      .subscribe(locations => result = locations);

    const request = httpMock.expectOne(
      'api/prd/location/getLocations?serviceIds=SSCS,IA&locationType=case_management&searchTerm=SW1A2AA'
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);

    expect(result).toEqual(response);
  });
});
