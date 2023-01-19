import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BookingCheckType } from '../../models';
import { LocationService } from '../../services/locations/location.service';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { SearchLocationComponent } from './search-location.component';

describe('SearchLocationComponent', () => {
  let component: SearchLocationComponent;
  let fixture: ComponentFixture<SearchLocationComponent>;
  const locationServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);
  const sessionServiceMock = jasmine.createSpyObj('SessionStorageService', ['getItem']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatAutocompleteModule,
        MatOptionModule,
      ],
      declarations: [
        SearchLocationComponent
      ],
      providers: [{ provide: LocationService, useValue: locationServiceMock },
                  { provide: SessionStorageService, useValue: sessionServiceMock}],
    }).compileComponents();

    const LOCATION_RESULTS = [
      {
        court_venue_id: '100',
        epimms_id: '219164',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberdeen Tribunal Hearing Centre',
        court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '9',
        region: 'Scotland',
        court_type_id: '17',
        court_type: 'Employment Tribunal',
        venue_name: 'Aberdeen',
        open_for_public: 'Yes',
        court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test1',
        postcode: 'AB11 6LT'
      },
      {
        court_venue_id: '101',
        epimms_id: '219164',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberdeen Tribunal Hearing Centre',
        court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '9',
        region: 'Scotland',
        court_type_id: '31',
        court_type: 'Social Security and Child Support Tribunal',
        venue_name: 'Aberdeen',
        open_for_public: 'Yes',
        court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test2',
        postcode: 'AB11 6LT'
      },
      {
        court_venue_id: '102',
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        court_type_id: '25',
        court_type: 'Magistrates Court',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test3',
        postcode: 'SY23 1AS '
      },
      {
        court_venue_id: '103',
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        court_type_id: '10',
        court_type: 'County Court',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test4',
        postcode: 'SY23 1AS '
      },
      {
        court_venue_id: '104',
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        court_type_id: '18',
        court_type: 'Family Court',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test5',
        postcode: 'SY23 1AS '
      },
      {
        court_venue_id: '105',
        epimms_id: '827534',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberystwyth Justice Centre',
        court_name: 'ABERYSTWYTH JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '8',
        region: 'Wales',
        court_type_id: '31',
        court_type: 'Social Security and Child Support Tribunal',
        venue_name: 'Aberystwyth',
        open_for_public: 'Yes',
        court_address: 'TREFECHAN test6',
        postcode: 'SY23 1AS '
      },
      {
        court_venue_id: '106',
        epimms_id: '450049',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aldershot Justice Centre',
        court_name: 'ALDERSHOT JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '7',
        region: 'South West',
        court_type_id: '25',
        court_type: 'Magistrates Court',
        venue_name: 'Aldershot',
        cluster_id: '9',
        cluster_name: 'Hampshire, Wiltshire, IOW',
        open_for_public: 'Yes',
        court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test7',
        postcode: 'GU11 1NY'
      },
      {
        court_venue_id: '107',
        epimms_id: '450049',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aldershot Justice Centre',
        court_name: 'ALDERSHOT JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '7',
        region: 'South West',
        court_type_id: '10',
        court_type: 'County Court',
        venue_name: 'Aldershot',
        cluster_id: '9',
        cluster_name: 'Hampshire, Wiltshire, IOW',
        open_for_public: 'Yes',
        court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test8',
        postcode: 'GU11 1NY'
      },
      {
        court_venue_id: '108',
        epimms_id: '450049',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aldershot Justice Centre',
        court_name: 'ALDERSHOT JUSTICE CENTRE',
        court_status: 'Open',
        region_id: '7',
        region: 'South West',
        court_type_id: '31',
        court_type: 'Social Security and Child Support Tribunal',
        venue_name: 'Aldershot',
        cluster_id: '9',
        cluster_name: 'Hampshire, Wiltshire, IOW',
        open_for_public: 'Yes',
        court_address: 'THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test9',
        postcode: 'GU11 1NY'
      },
      {
        court_venue_id: '109',
        epimms_id: '271588',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Amersham Law Courts',
        court_name: 'AMERSHAM LAW COURTS',
        court_status: 'Open',
        region_id: '6',
        region: 'South East',
        court_type_id: '15',
        court_type: 'Crown Court',
        venue_name: 'Amersham',
        cluster_id: '17',
        cluster_name: 'Thames Valley',
        open_for_public: 'Yes',
        court_address: 'KING GEORGE V ROAD AMERSHAM BUCKINGHAMSHIRE test10',
        postcode: 'HP6 5AJ'
      },
      {
        court_venue_id: '110',
        epimms_id: '239985',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Ashford Tribunal Hearing Centre',
        court_name: 'ASHFORD TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '6',
        region: 'South East',
        court_type_id: '17',
        court_type: 'Employment Tribunal',
        venue_name: 'Ashford',
        cluster_id: '11',
        cluster_name: 'Kent',
        open_for_public: 'Yes',
        court_address: 'COUNTY SQUARE test11',
        postcode: 'TN23 1YB'
      },
      {
        court_venue_id: '111',
        epimms_id: '239985',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Ashford Tribunal Hearing Centre',
        court_name: 'ASHFORD TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '6',
        region: 'South East',
        court_type_id: '31',
        court_type: 'Social Security and Child Support Tribunal',
        venue_name: 'Ashford',
        cluster_id: '11',
        cluster_name: 'Kent',
        open_for_public: 'Yes',
        court_address: 'MARCUS SQUARE',
        postcode: 'TN23 1YB'
      }
    ];

    fixture = TestBed.createComponent(SearchLocationComponent);
    component = fixture.componentInstance;
    const locationService = TestBed.get(LocationService);
    component.locations = LOCATION_RESULTS;
    spyOn(component, 'getLocations').and.callThrough();

    locationService.getAllLocations.and.returnValue(of(LOCATION_RESULTS));

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call filter when input is more than 3 characters', async () => {
    const selectedLocation = fixture.debugElement.query(By.css('.govuk-input'));
    selectedLocation.nativeElement.value = 'MARCUS';
    selectedLocation.nativeElement.dispatchEvent(new Event('keyup'));
    component.form.controls.searchTerm.valueChanges.subscribe(value => {
      expect(value).toBe('MARCUS');
    });
  });

  it('should not filter in input characters are less then three', async () => {
    expect(component.locations.length).toBeGreaterThan(1);

    const selectedLocation = fixture.debugElement.query(By.css('.govuk-input'));
    selectedLocation.nativeElement.value = 'te';
    selectedLocation.nativeElement.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.filter).not.toHaveBeenCalled();
    });
  });

  it('should reset form control and set to pristine when empty value is given', async () => {
    const selectedLocation = fixture.debugElement.query(By.css('.govuk-input'));
    selectedLocation.nativeElement.value = '';
    selectedLocation.nativeElement.dispatchEvent(new Event('input'));
    component.form.controls.searchTerm.valueChanges.subscribe(value => {
      expect(value).toBe('');
    });
  });

  it('should emit an event when search location emits an event to the component', () => {
    spyOn(component.searchLocationChanged, 'emit');
    component.onInput();
    expect(component.searchLocationChanged.emit).toHaveBeenCalled();
  });

  it('should call get locations with the correct parameters', () => {
    component.serviceIds = 'IA,SSCS';
    component.bookingCheck = BookingCheckType.NO_CHECK;
    component.getLocations('exampleString');
    expect(locationServiceMock.getAllLocations).toHaveBeenCalledWith('IA,SSCS', '', 'exampleString', undefined, undefined);
    // checks that civil added to userLocations as well
    component.serviceIds = 'IA,CIVIL';
    component.bookingCheck = BookingCheckType.BOOKINGS_AND_BASE;
    sessionServiceMock.getItem.and.returnValues(`[["IA"], []]`, `["12345"]`, '["CIVIL"]');
    component.getLocations('exampleString2');
    expect(locationServiceMock.getAllLocations).toHaveBeenCalledWith('IA,CIVIL', '', 'exampleString2', [['IA'], [], {service: 'CIVIL', locations: [], bookable: true}], ['12345']);
    // check user locations filtered for bookable correctly
    component.bookingCheck = BookingCheckType.POSSIBLE_BOOKINGS;
    const bookableLocationString = JSON.stringify([{service: 'IA', locations: ['12345'], bookable: true}, {service: 'CIVIL', locations: ['32456'], bookable: false}]);
    sessionServiceMock.getItem.and.returnValues(bookableLocationString, `["SSCS", "IA"]`, '[]');
    component.getLocations('exampleString2');
    expect(locationServiceMock.getAllLocations).toHaveBeenCalledWith('IA,CIVIL', '', 'exampleString2', [{service: 'IA', locations: ['12345'], bookable: true}], undefined);
  });
});
