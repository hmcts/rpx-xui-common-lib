import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { LocationByEPIMMSModel } from '../../models/location.model';
import { LocationService } from '../../services/locations/location.service';
import { SearchVenueComponent } from './search-venue.component';

@Pipe({
  name: 'rpxTranslate',
  standalone: false
})
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
    spyOn(component.keyUpSubject$, 'next').and.callThrough();
    component.displayedLocations = LOCATION_RESULTS;
    spyOn(component, 'searchLocations').and.callThrough();

    searchFilterServiceMock.searchLocations.and.returnValue(of(LOCATION_RESULTS));
    searchFilterServiceMock.searchLocations.calls.reset();

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    component.keyUpSubject$.complete();
  });

  it('should wait for input before searching locations', () => {
    expect(component.searchLocations).not.toHaveBeenCalled();
    expect(component.displayedLocations).toEqual([]);
    expect(component.findLocationFormGroup.controls.locationSelectedFormControl.pristine).toBeTrue();
  });

  it('should reset the selected control when the search value is undefined', () => {
    const selectedControl = component.findLocationFormGroup.controls.locationSelectedFormControl;
    selectedControl.setValue('selected venue');
    selectedControl.markAsDirty();
    component.search(undefined);
    expect(selectedControl.value).toBeNull();
    expect(selectedControl.pristine).toBeTrue();
  });

  it('should filter the emitted term after a valid keyup', fakeAsync(() => {
    const filterSpy = spyOn(component, 'filter').and.callThrough();
    const searchSpy = spyOn(component, 'search').and.callThrough();
    const selectedControl = component.findLocationFormGroup.controls.locationSelectedFormControl;
    const input = fixture.debugElement.query(By.css('#searchVenueLocation')).nativeElement;
    expect(selectedControl.pristine).toBeTrue();
    expect(component.showAutocomplete).toBeFalse();
    input.value = 'MARCUS';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'M', code: 'KeyM' }));

    expect(component.keyUpSubject$.next).toHaveBeenCalledOnceWith('MARCUS');
    expect(searchSpy).not.toHaveBeenCalled();
    tick(500);

    expect(searchSpy).toHaveBeenCalledOnceWith('MARCUS');
    expect(filterSpy).toHaveBeenCalledOnceWith('MARCUS');
    expect(component.searchLocations).toHaveBeenCalledOnceWith('MARCUS');
    expect(searchFilterServiceMock.searchLocations).toHaveBeenCalledOnceWith('', '', 'MARCUS');
    expect(selectedControl.dirty).toBeTrue();
    expect(component.showAutocomplete).toBeTrue();
    expect(component.displayedLocations.length).toBe(12);
  }));

  it('should search but not filter a short term after keyup', fakeAsync(() => {
    const filterSpy = spyOn(component, 'filter').and.callThrough();
    const searchSpy = spyOn(component, 'search').and.callThrough();
    const input = fixture.debugElement.query(By.css('#searchVenueLocation')).nativeElement;
    input.value = 'te';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', code: 'KeyE' }));
    tick(500);

    expect(component.keyUpSubject$.next).toHaveBeenCalledOnceWith('te');
    expect(searchSpy).toHaveBeenCalledOnceWith('te');
    expect(filterSpy).not.toHaveBeenCalled();
    expect(searchFilterServiceMock.searchLocations).not.toHaveBeenCalled();
    expect(component.showAutocomplete).toBeFalse();
  }));

  it('should reset a dirty selected control to null and pristine on direct search(\'\')', () => {
    const selectedControl = component.findLocationFormGroup.controls.locationSelectedFormControl;
    selectedControl.setValue('selected venue');
    selectedControl.markAsDirty();

    component.search('');

    expect(selectedControl.value).toBeNull();
    expect(selectedControl.pristine).toBeTrue();
  });
});
