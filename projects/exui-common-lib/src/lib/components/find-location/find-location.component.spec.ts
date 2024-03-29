import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { Subject, Subscription } from 'rxjs';
import { LocationService } from '../../services/locations/location.service';
import { SearchLocationComponent } from '../search-location/search-location.component';
import { FindLocationComponent } from './find-location.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('FindLocationComponent', () => {
  let component: FindLocationComponent;
  let fixture: ComponentFixture<FindLocationComponent>;
  const searchFilterServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);

  const LOCATION = {
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
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule,
        HttpClientTestingModule
      ],
      declarations: [
        FindLocationComponent,
        SearchLocationComponent,
        RpxTranslateMockPipe
      ],
      providers: [
        { provide: LocationService, useValue: searchFilterServiceMock }
      ]
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
    component.tempSelectedLocation = LOCATION;
    component.addLocation();
    fixture.detectChanges();
    const selectedLocation = fixture.nativeElement.querySelector('.hmcts-filter__tag');
    expect(selectedLocation.textContent.trim()).toEqual(LOCATION.site_name);
  });

  it('should remove locations from the selected list', () => {
    component.tempSelectedLocation = LOCATION;
    component.addLocation();
    fixture.detectChanges();
    const selectedLocation = fixture.nativeElement.querySelector('.hmcts-filter__tag');
    expect(selectedLocation.textContent.trim()).toEqual(LOCATION.site_name);
    selectedLocation.click();
    fixture.detectChanges();
    const selectedLocationAfterRemove = fixture.nativeElement.querySelector('.hmcts-filter__tag');
    expect(selectedLocationAfterRemove).toBeNull();
  });

  it('should emit an event when formControl gets a new value', () => {
    spyOn(component.locationFieldChanged, 'emit');
    component.onSearchInputChanged();
    expect(component.locationFieldChanged.emit).toHaveBeenCalled();
  });

  describe('resetting term search', () => {
    beforeEach(() => {
      component.formSubmissionEvent$ = new Subject();
      component.ngOnInit();
    });

    it('should reset the search term on each formSubmissionEvent$', () => {
      spyOn(component.searchLocationComponent, 'resetSearchTerm').and.callThrough();
      component.formSubmissionEvent$.next();
      expect(component.searchLocationComponent.resetSearchTerm).toHaveBeenCalled();
    });

    it('should unsubscribe on ngOnDestroy', () => {
      // @ts-expect-error private property
      spyOn<Subscription>(component.formSubmissionEventSubscription, 'unsubscribe');
      component.ngOnDestroy();
      // @ts-expect-error private property
      expect(component.formSubmissionEventSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
