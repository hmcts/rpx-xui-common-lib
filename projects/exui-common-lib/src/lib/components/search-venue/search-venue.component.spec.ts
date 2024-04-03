import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { LocationByEPIMMSModel } from '../../models/location.model';
import { LocationService } from '../../services/locations/location.service';
import { SearchVenueComponent } from './search-venue.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('SearchVenueComponent', () => {
  let component: SearchVenueComponent;
  let fixture: ComponentFixture<SearchVenueComponent>;
  const searchFilterServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations', 'searchLocations']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatAutocompleteModule,
        MatOptionModule,
        RpxTranslationModule.forChild()
      ],
      declarations: [
        SearchVenueComponent,
        RpxTranslateMockPipe
      ],
      providers: [
        {provide: LocationService, useValue: searchFilterServiceMock}
      ],
    }).compileComponents();

    const LOCATION_RESULTS: LocationByEPIMMSModel[] = [
      {
        epimms_id: '219164',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberdeen Tribunal Hearing Centre',
        court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '9',
        region: 'Scotland',
        open_for_public: 'Yes',
        court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test1',
        postcode: 'AB11 6LT'
      },
      {
        epimms_id: '219164',
        is_hearing_location: 'Y',
        is_case_management_location: 'Y',
        site_name: 'Aberdeen Tribunal Hearing Centre',
        court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
        court_status: 'Open',
        region_id: '9',
        region: 'Scotland',
        open_for_public: 'Yes',
        court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test2',
        postcode: 'AB11 6LT'
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
        cluster_id: '11',
        cluster_name: 'Kent',
        open_for_public: 'Yes',
        court_address: 'MARCUS SQUARE',
        postcode: 'TN23 1YB'
      }
    ];

    fixture = TestBed.createComponent(SearchVenueComponent);
    component = fixture.componentInstance;
    const locationService = TestBed.get(LocationService);
    spyOn(component.keyUpSubject$, 'next');
    spyOn(component.keyUpSubject$, 'pipe').and.returnValue(of('MARCUS'));
    component.displayedLocations = LOCATION_RESULTS;
    spyOn(component, 'searchLocations').and.callThrough();
    spyOn(component, 'onFocus').and.callThrough();

    locationService.searchLocations.and.returnValue(of(LOCATION_RESULTS));

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component.searchLocations).toHaveBeenCalled();
  });

  it('should reset location selected form Control', () => {
    [
      { value: '' },
      { value: undefined }
    ].forEach(({ value }) => {
      component.search(value);
      expect(component.findLocationFormGroup.controls.locationSelectedFormControl.dirty).toBeFalse();
    });
  });

  it('should call onFocus when input has focus', async () => {
    const selectedLoction = fixture.debugElement.query(By.css('.autocomplete__input'));
    selectedLoction.nativeElement.dispatchEvent(new Event('focus'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.onFocus).toHaveBeenCalled();
    });
  });

  it('should call filter when input is more than 2 characters', async () => {
    const selectedLoction = fixture.debugElement.query(By.css('.autocomplete__input'));
    selectedLoction.nativeElement.value = 'MARCUS';
    selectedLoction.nativeElement.dispatchEvent(new Event('keyup'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.keyUpSubject$.subscribe(() => {
        expect(component.keyUpSubject$.next).toHaveBeenCalled();
      });
      expect(component.findLocationFormGroup.controls.locationSelectedFormControl.dirty).toBeTrue();
    });
  });

  it('should not filter in input characters are less then three', async () => {
    expect(component.displayedLocations.length).toBeGreaterThan(1);

    const selectedLoction = fixture.debugElement.query(By.css('.autocomplete__input'));
    selectedLoction.nativeElement.value = 'te';
    selectedLoction.nativeElement.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'filter');
      expect(component.filter).not.toHaveBeenCalled();
    });
  });

  it('should reset form control and set to pristine when empty value is given', async () => {
    const selectedLoction = fixture.debugElement.query(By.css('.autocomplete__input'));
    selectedLoction.nativeElement.value = '';
    selectedLoction.nativeElement.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.keyUpSubject$.subscribe(() => {
        expect(component.findLocationFormGroup.controls.locationSelectedFormControl.value).toEqual('');
        expect(component.findLocationFormGroup.controls.locationSelectedFormControl.pristine).toBeTruthy();
      });
    });
  });
});
