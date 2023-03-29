import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BookingCheckType, LocationByEPIMMSModel } from '../../models';
import { RefDataService } from '../../services';
import { LocationService } from '../../services/locations/location.service';
import { SessionStorageService } from '../../services/storage/session-storage/session-storage.service';
import { SearchLocationComponent } from './search-location.component';

describe('SearchLocationComponent', () => {
  let component: SearchLocationComponent;
  let fixture: ComponentFixture<SearchLocationComponent>;
  let locationServiceMock: jasmine.SpyObj<LocationService>;
  let sessionServiceMock: jasmine.SpyObj<SessionStorageService>;
  let refDataServiceMock: jasmine.SpyObj<RefDataService>;
  let dummyLocations: LocationByEPIMMSModel[];

  beforeEach(waitForAsync(() => {
    dummyLocations = [
      {
        site_name: 'Aberdeen Tribunal Hearing Centre',
        court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
        epimms_id: '219164',
        open_for_public: 'Yes',
        region_id: '9',
        region: 'Scotland',
        cluster_id: '1',
        cluster_name: 'Scotland',
        court_status: 'Open',
        court_open_date: '01/01/2010',
        postcode: 'AB11 6LT',
        court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test1',
        phone_number: '01224 555555',
        court_location_code: 'AB1',
        dx_address: 'DX 123456 Aberdeen 1',
        venue_name: 'Aberdeen',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
      },
      {
        site_name: 'Aberdeen Tribunal Hearing Centre',
        court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
        epimms_id: '219164',
        open_for_public: 'Yes',
        region_id: '9',
        region: 'Scotland',
        cluster_id: '1',
        cluster_name: 'Scotland',
        court_status: 'Open',
        court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test2',
        postcode: 'AB11 6LT',
        court_location_code: 'AB1',
        dx_address: 'DX 123456 Aberdeen 1',
        venue_name: 'Aberdeen',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
      },
      {
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test3',
        postcode: 'SY23 1AS '
      },
      {
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test4',
        postcode: 'SY23 1AS '
      },
      {
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test5',
        postcode: 'SY23 1AS '
      },
      {
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test6',
        postcode: 'SY23 1AS '
      },
      {
        epimms_id: '450049',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aldershot Justice Centre',
        court_name: 'ALDERSHOT JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '7',
        region: 'South West',
        venue_name: 'Aldershot',
        cluster_id: '9',
        cluster_name: 'Hampshire, Wiltshire, IOW',
        open_for_public: 'Yes',
        court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test7',
        postcode: 'GU11 1NY'
      },
      {
        epimms_id: '450049',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aldershot Justice Centre',
        court_name: 'ALDERSHOT JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '7',
        region: 'South West',
        venue_name: 'Aldershot',
        cluster_id: '9',
        cluster_name: 'Hampshire, Wiltshire, IOW',
        open_for_public: 'Yes',
        court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test8',
        postcode: 'GU11 1NY'
      },
      {
        epimms_id: '450049',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aldershot Justice Centre',
        court_name: 'ALDERSHOT JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '7',
        region: 'South West',
        venue_name: 'Aldershot',
        cluster_id: '9',
        cluster_name: 'Hampshire, Wiltshire, IOW',
        open_for_public: 'Yes',
        court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test9',
        postcode: 'GU11 1NY'
      },
      {
        epimms_id: '271588',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Amersham Law Courts',
        court_name: 'AMERSHAM LAW COURTS',
        court_status: 'Open',
        region_id: '6',
        region: 'South East',
        venue_name: 'Amersham',
        cluster_id: '17',
        cluster_name: 'Thames Valley',
        open_for_public: 'Yes',
        court_address: 'KING GEORGE V ROAD AMERSHAM BUCKINGHAMSHIRE test10',
        postcode: 'HP6 5AJ'
      },
      {
        epimms_id: '239985',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Ashford Tribunal Hearing Centre',
        court_name: 'ASHFORD TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '6',
        region: 'South East',
        venue_name: 'Ashford',
        cluster_id: '11',
        cluster_name: 'Kent',
        open_for_public: 'Yes',
        court_address: 'COUNTY SQUARE test11',
        postcode: 'TN23 1YB'
      },
      {
        epimms_id: '239985',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Ashford Tribunal Hearing Centre',
        court_name: 'ASHFORD TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '6',
        region: 'South East',
        venue_name: 'Ashford',
        cluster_id: '11',
        cluster_name: 'Kent',
        open_for_public: 'Yes',
        court_address: 'MARCUS SQUARE',
        postcode: 'TN23 1YB'
      }
    ];
    locationServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);
    locationServiceMock.getAllLocations.and.returnValue(of(dummyLocations));

    sessionServiceMock = jasmine.createSpyObj('SessionStorageService', ['getItem']);
    refDataServiceMock = jasmine.createSpyObj('RefDataService', ['getLocationsByServiceCodes']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatAutocompleteModule,
        MatOptionModule,
        HttpClientTestingModule
      ],
      declarations: [
        SearchLocationComponent
      ],
      providers: [
        {provide: LocationService, useValue: locationServiceMock},
        {provide: SessionStorageService, useValue: sessionServiceMock},
        {provide: RefDataService, useValue: refDataServiceMock}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLocationComponent);
    component = fixture.componentInstance;
    component.field = {
      name: 'some-field-name',
      options: [],
      minSelected: 1,
      maxSelected: 999,
      type: 'find-location',
    };

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit value from searchTermFormControl when touching the input', () => {
    component.searchTermFormControl.valueChanges.subscribe(value => {
      expect(value).toBe('MARCUS');
    });
    const selectedLocation = fixture.debugElement.query(By.css('.govuk-input'));
    selectedLocation.nativeElement.value = 'MARCUS';
    selectedLocation.nativeElement.dispatchEvent(new Event('input'));
  });

  it('should emit locationTermSearchInputChanged when filteredList$ emits', fakeAsync(() => {
    spyOn(component.locationTermSearchInputChanged, 'emit');
    component.filteredList$.subscribe(() => {
      expect(component.locationTermSearchInputChanged.emit).toHaveBeenCalledWith('MARCUS');
    });

    component.searchTermFormControl.setValue('MARCUS');
    // @ts-expect-error - private property
    tick(component.debounceTimeInput);
    flush();
  }));

  describe('lookup by jurisdiction (i.e. servicesField does not exist)', () => {
    it('should return false and should not call the api when ' +
      'input characters are less then three', fakeAsync(() => {
      // @ts-expect-error - private property
      const debounceTime = component.debounceTimeInput;

      component.filteredList$.subscribe((result) => {
        expect(result).toBe(false);
      });
      component.searchTermFormControl.setValue('');
      tick(debounceTime);
      flush();
    }));

    it('should call get locations with the correct parameters', () => {
      component.serviceIds = 'IA,SSCS';
      component.bookingCheck = BookingCheckType.NO_CHECK;
      component.getLocations('exampleString');
      expect(locationServiceMock.getAllLocations).toHaveBeenCalledWith('IA,SSCS', '', 'exampleString', undefined);
      // checks that civil added to userLocations as well
      component.serviceIds = 'IA,CIVIL';
      component.bookingCheck = BookingCheckType.BOOKINGS_AND_BASE;
      const bookingsAndBase = [{service: 'IA', locations: [dummyLocations[0]]}, {
        service: 'CIVIL',
        locations: [dummyLocations[1]]
      }];
      const bookingsAndBaseString = JSON.stringify(bookingsAndBase);
      sessionServiceMock.getItem.and.returnValues(bookingsAndBaseString);
      component.getLocations('exampleString2');
      expect(locationServiceMock.getAllLocations).toHaveBeenCalledWith(
        'IA,CIVIL', '', 'exampleString2', [{service: 'IA', locations: [dummyLocations[0]]}, {
          service: 'CIVIL',
          locations: [dummyLocations[1]]
        }]
      );
      // check user locations filtered for bookable correctly
      component.bookingCheck = BookingCheckType.POSSIBLE_BOOKINGS;
      const bookableLocations = [{service: 'IA', locations: [dummyLocations[0]]}, {
        service: 'CIVIL',
        locations: [dummyLocations[1]]
      }];
      const bookableLocationsString = JSON.stringify(bookableLocations);
      sessionServiceMock.getItem.and.returnValues(bookableLocationsString);
      component.getLocations('exampleString2');
      expect(locationServiceMock.getAllLocations).toHaveBeenCalledWith('IA,CIVIL', '', 'exampleString2', bookableLocations);
    });

    describe('lookup by serviceCodes (i.e. servicesField does not exist)', () => {
      let serviceCodesFormControlName: string;
      let serviceCodesValues: string[];

      beforeEach(() => {
        refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of(dummyLocations));
        serviceCodesFormControlName = 'someServicesFieldName';
        serviceCodesValues = ['BFA1', 'AAA7'];
        component.field = {
          ...component.field,
          servicesField: serviceCodesFormControlName,
        };
        component.form = new FormGroup({
          [serviceCodesFormControlName]: new FormControl(
            [{key: serviceCodesValues[0], label: 'some label'}, {key: serviceCodesValues[1], label: 'some other label'}]
          )
        });
        component.ngOnInit();
        fixture.detectChanges();
      });

      describe('filteredList$', () => {
        it('should call getLocationsByServiceCodes as part of the switchMap when subscribing with the service codes from the form', fakeAsync(() => {
          component.form.get(serviceCodesFormControlName)
            .setValue([{key: serviceCodesValues[0], label: 'some label'}, {
              key: serviceCodesValues[1],
              label: 'some other label'
            }]);

          component.filteredList$.subscribe(() => {
            expect(refDataServiceMock.getLocationsByServiceCodes).toHaveBeenCalledWith(serviceCodesValues);
          });

          component.searchTermFormControl.setValue('123');
          tick();
          flush();
        }));

        it('should return false and should not call the api when observable searchTerm valueChanges emits', fakeAsync(() => {
          component.filteredList$.subscribe((result) => {
            expect(result).toBe(false);
          });

          component.searchTermFormControl.setValue('');
          tick();
          flush();
        }));

        it('should get an array when search term is not an empty string', fakeAsync(() => {
          component.filteredList$.subscribe((result) => {
            expect(Array.isArray(result)).toBe(true);
          });

          component.searchTermFormControl.setValue('123');
          tick();
          flush();
        }));

        it('should filter locations based off string value and propertyNameFilter', fakeAsync(() => {
          refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([dummyLocations[0], dummyLocations[1]]));
          component.propertyNameFilter = 'venue_name';
          component.filteredList$.subscribe((result) => {
            expect(result).toEqual([dummyLocations[0]]);
          });

          component.searchTermFormControl.setValue(dummyLocations[0].venue_name);
          tick();
          flush();
        }));

        it('should filter out selected locations', fakeAsync(() => {
          refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([dummyLocations[0], dummyLocations[1]]));
          component.propertyNameFilter = 'venue_name';
          component.selectedLocations = [dummyLocations[0]];

          component.filteredList$.subscribe((result) => {
            expect(result).toEqual([]);
          });

          component.searchTermFormControl.setValue(dummyLocations[0].venue_name);
          tick();
          flush();
        }));

        it('should not display duplicates based off the propertyNameFilter', fakeAsync(() => {
          refDataServiceMock.getLocationsByServiceCodes.and.returnValue(of([dummyLocations[0], dummyLocations[0]]));
          component.propertyNameFilter = 'venue_name';

          component.filteredList$.subscribe((result) => {
            expect(result).toEqual([dummyLocations[0]]);
          });

          component.searchTermFormControl.setValue(dummyLocations[0].venue_name);
          tick();
          flush();
        }));
      });
    });
  });
});
