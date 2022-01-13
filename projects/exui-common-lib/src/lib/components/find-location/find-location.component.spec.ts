import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatOptionModule} from '@angular/material';
import {LocationService} from '../../services/locations/location.service';
import {SearchLocationComponent} from '../search-location/search-location.component';

import {FindLocationComponent} from './find-location.component';

describe('FindLocationComponent', () => {
  let component: FindLocationComponent;
  let fixture: ComponentFixture<FindLocationComponent>;
  const searchFilterServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);

  const LOCATION = {
    court_venue_id: '100',
    epims_id: '219164',
    is_hearing_location: 'Y',
    is_case_management_location: 'Y',
    site_name: 'Aberdeen Tribunal Hearing Centre',
    court_name: 'ABERDEEN TRIBUNAL HEARING CENTRE',
    court_status: 'Open',
    region_id: '9',
    region: 'Scotland',
    court_type_id: '17',
    court_type: 'Employment Tribunal',
    open_for_public: 'Yes',
    court_address: 'AB1, 48 HUNTLY STREET, ABERDEEN test1',
    postcode: 'AB11 6LT'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule],
      declarations: [FindLocationComponent, SearchLocationComponent],
      providers: [{provide: LocationService, useValue: searchFilterServiceMock}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindLocationComponent);
    component = fixture.componentInstance;
    component.field = {
      type: 'find-location',
      name: 'location',
      options: [],
      minSelected: 1,
      maxSelected: null
    };
    component.form = new FormGroup({
      location: new FormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display find location title', () => {
    const title = fixture.nativeElement.querySelector('#input-selected-location-label');
    expect(title.textContent.trim()).toEqual('Search for a location by name');
  });

  it('should add location to the selected location list', () => {
    component.locationsForm.push(new FormControl(LOCATION));
    const button = fixture.nativeElement.querySelector('.govuk-button');
    button.click();
    fixture.detectChanges();
    const selectedLocation = fixture.nativeElement.querySelector('.hmcts-filter__tag');
    expect(selectedLocation.textContent.trim()).toEqual(LOCATION.court_name);
  });

  it('should remove locations from the selected list', () => {
    component.locationsForm.push(new FormControl(LOCATION));
    const button = fixture.nativeElement.querySelector('.govuk-button');
    button.click();
    fixture.detectChanges();
    const selectedLocation = fixture.nativeElement.querySelector('.hmcts-filter__tag');
    expect(selectedLocation.textContent.trim()).toEqual(LOCATION.court_name);
    selectedLocation.click();
    fixture.detectChanges();
    const selectedLocationAfterRemove = fixture.nativeElement.querySelector('.hmcts-filter__tag');
    expect(selectedLocationAfterRemove).toBeNull();
  });

});