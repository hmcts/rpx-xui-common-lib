import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { SearchLocationComponent } from './search-location.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationModel } from '../../models/location.model';
import { of } from 'rxjs';
import { LocationService } from '../../services/locations/location.service';

fdescribe('SearchLocationComponent', () => {
  let component: SearchLocationComponent;
  let fixture: ComponentFixture<SearchLocationComponent>;
  const SearchFilterServiceMock = jasmine.createSpyObj('LocationService', [
    'getAllLocations'
  ]);

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
      providers: [{ provide: LocationService, useValue: SearchFilterServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLocationComponent);
    component = fixture.componentInstance;
    const locationService = TestBed.get(LocationService);
    spyOn(component, 'filter');

    locationService.getAllLocations.and.returnValue(of([
      {
        "court_venue_id": "100",
        "epims_id": "219164",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aberdeen Tribunal Hearing Centre",
        "court_name": "ABERDEEN TRIBUNAL HEARING CENTRE",
        "court_status": "Open",
        "region_id": "9",
        "region": "Scotland",
        "court_type_id": "17",
        "court_type": "Employment Tribunal",
        "open_for_public": "Yes",
        "court_address": "AB1, 48 HUNTLY STREET, ABERDEEN test1",
        "postcode": "AB11 6LT"
      },
      {
        "court_venue_id": "101",
        "epims_id": "219164",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aberdeen Tribunal Hearing Centre",
        "court_name": "ABERDEEN TRIBUNAL HEARING CENTRE",
        "court_status": "Open",
        "region_id": "9",
        "region": "Scotland",
        "court_type_id": "31",
        "court_type": "Social Security and Child Support Tribunal",
        "open_for_public": "Yes",
        "court_address": "AB1, 48 HUNTLY STREET, ABERDEEN test2",
        "postcode": "AB11 6LT"
      },
      {
        "court_venue_id": "102",
        "epims_id": "827534",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aberystwyth Justice Centre",
        "court_name": "ABERYSTWYTH JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "8",
        "region": "Wales",
        "court_type_id": "25",
        "court_type": "Magistrates Court",
        "open_for_public": "Yes",
        "court_address": "TREFECHAN test3",
        "postcode": "SY23 1AS "
      },
      {
        "court_venue_id": "103",
        "epims_id": "827534",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aberystwyth Justice Centre",
        "court_name": "ABERYSTWYTH JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "8",
        "region": "Wales",
        "court_type_id": "10",
        "court_type": "County Court",
        "open_for_public": "Yes",
        "court_address": "TREFECHAN test4",
        "postcode": "SY23 1AS "
      },
      {
        "court_venue_id": "104",
        "epims_id": "827534",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aberystwyth Justice Centre",
        "court_name": "ABERYSTWYTH JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "8",
        "region": "Wales",
        "court_type_id": "18",
        "court_type": "Family Court",
        "open_for_public": "Yes",
        "court_address": "TREFECHAN test5",
        "postcode": "SY23 1AS "
      },
      {
        "court_venue_id": "105",
        "epims_id": "827534",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aberystwyth Justice Centre",
        "court_name": "ABERYSTWYTH JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "8",
        "region": "Wales",
        "court_type_id": "31",
        "court_type": "Social Security and Child Support Tribunal",
        "open_for_public": "Yes",
        "court_address": "TREFECHAN test6",
        "postcode": "SY23 1AS "
      },
      {
        "court_venue_id": "106",
        "epims_id": "450049",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aldershot Justice Centre",
        "court_name": "ALDERSHOT JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "7",
        "region": "South West",
        "court_type_id": "25",
        "court_type": "Magistrates Court",
        "cluster_id": "9",
        "cluster_name": "Hampshire, Wiltshire, IOW",
        "open_for_public": "Yes",
        "court_address": "THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test7",
        "postcode": "GU11 1NY"
      },
      {
        "court_venue_id": "107",
        "epims_id": "450049",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aldershot Justice Centre",
        "court_name": "ALDERSHOT JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "7",
        "region": "South West",
        "court_type_id": "10",
        "court_type": "County Court",
        "cluster_id": "9",
        "cluster_name": "Hampshire, Wiltshire, IOW",
        "open_for_public": "Yes",
        "court_address": "THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test8",
        "postcode": "GU11 1NY"
      },
      {
        "court_venue_id": "108",
        "epims_id": "450049",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Aldershot Justice Centre",
        "court_name": "ALDERSHOT JUSTICE CENTRE",
        "court_status": "Open",
        "region_id": "7",
        "region": "South West",
        "court_type_id": "31",
        "court_type": "Social Security and Child Support Tribunal",
        "cluster_id": "9",
        "cluster_name": "Hampshire, Wiltshire, IOW",
        "open_for_public": "Yes",
        "court_address": "THE COURT HOUSE, CIVIC CENTRE, WELLINGTON AVENUE test9",
        "postcode": "GU11 1NY"
      },
      {
        "court_venue_id": "109",
        "epims_id": "271588",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Amersham Law Courts",
        "court_name": "AMERSHAM LAW COURTS",
        "court_status": "Open",
        "region_id": "6",
        "region": "South East",
        "court_type_id": "15",
        "court_type": "Crown Court",
        "cluster_id": "17",
        "cluster_name": "Thames Valley",
        "open_for_public": "Yes",
        "court_address": "KING GEORGE V ROAD AMERSHAM BUCKINGHAMSHIRE test10",
        "postcode": "HP6 5AJ"
      },
      {
        "court_venue_id": "110",
        "epims_id": "239985",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Ashford Tribunal Hearing Centre",
        "court_name": "ASHFORD TRIBUNAL HEARING CENTRE",
        "court_status": "Open",
        "region_id": "6",
        "region": "South East",
        "court_type_id": "17",
        "court_type": "Employment Tribunal",
        "cluster_id": "11",
        "cluster_name": "Kent",
        "open_for_public": "Yes",
        "court_address": "COUNTY SQUARE test11",
        "postcode": "TN23 1YB"
      },
      {
        "court_venue_id": "111",
        "epims_id": "239985",
        "is_hearing_location": "Y",
        "is_case_management_location": "Y",
        "site_name": "Ashford Tribunal Hearing Centre",
        "court_name": "ASHFORD TRIBUNAL HEARING CENTRE",
        "court_status": "Open",
        "region_id": "6",
        "region": "South East",
        "court_type_id": "31",
        "court_type": "Social Security and Child Support Tribunal",
        "cluster_id": "11",
        "cluster_name": "Kent",
        "open_for_public": "Yes",
        "court_address": "MARCUS SQUARE",
        "postcode": "TN23 1YB"
      }]));

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter locations on address based on input value', fakeAsync ((done) => {
    component.locations$.subscribe(x => {
      expect(x.length).toBeGreaterThan(1);
      done
    });

    const selectedLoction = fixture.debugElement.query(By.css('#input-selected-location'));
    selectedLoction.nativeElement.value = 'MARCUS';
    selectedLoction.nativeElement.dispatchEvent(new Event('input'));
    tick();
    fixture.whenStable().then(() => { 
      fixture.detectChanges();
      component.locations$.subscribe(x => {
        expect(x.length).toEqual(1);
        done;
      });
    });
  }))

  it('should filter no more than 10 locations', async (done) => {
    component.locations$.subscribe(x => {
      expect(x.length).toBeGreaterThan(1);
      done
    });

    const selectedLoction = fixture.debugElement.query(By.css('#input-selected-location'));
    selectedLoction.nativeElement.value = 'test';
    selectedLoction.nativeElement.dispatchEvent(new Event('input'));
    tick();
    fixture.whenStable().then(() => { 
      fixture.detectChanges();
      component.locations$.subscribe(x => {
        expect(x.length).toEqual(10);
        done();
      });
    });
  })

  it('should not filter in input characters are less then three', async (done) => {
    component.locations$.subscribe(x => {
      expect(x.length).toBeGreaterThan(1);
      done();
    });

    const selectedLoction = fixture.debugElement.query(By.css('#input-selected-location'));
    selectedLoction.nativeElement.value = 'te';
    selectedLoction.nativeElement.dispatchEvent(new Event('input'));
    tick();
    fixture.whenStable().then(() => { 
      fixture.detectChanges();
      expect(component.filter).not.toHaveBeenCalled();
    });
  })

  it('should display selection in selection list', async (done) => {
    const location = { 
      "court_venue_id": "100",
      "epims_id": "219164",
      "is_hearing_location": "Y",
      "is_case_management_location": "Y",
      "site_name": "Aberdeen Tribunal Hearing Centre",
      "court_name": "ABERDEEN TRIBUNAL HEARING CENTRE",
      "court_status": "Open",
      "region_id": "9",
      "region": "Scotland",
      "court_type_id": "17",
      "court_type": "Employment Tribunal",
      "open_for_public": "Yes",
      "court_address": "AB1, 48 HUNTLY STREET, ABERDEEN",
      "postcode": "AB11 6LT"
    } as LocationModel;
    component.selectedLocation = location;
    component.addSelection();
    fixture.detectChanges();
    done();
    const selectedLoctions = fixture.debugElement.queryAll(By.css('.location-selection'));
    expect(selectedLoctions.length).toBeGreaterThan(0);
  })

  it('should remove selection in selection list', async (done) => {
    const location = {
      "court_venue_id": "100",
      "epims_id": "219164",
      "is_hearing_location": "Y",
      "is_case_management_location": "Y",
      "site_name": "Aberdeen Tribunal Hearing Centre",
      "court_name": "ABERDEEN TRIBUNAL HEARING CENTRE",
      "court_status": "Open",
      "region_id": "9",
      "region": "Scotland",
      "court_type_id": "17",
      "court_type": "Employment Tribunal",
      "open_for_public": "Yes",
      "court_address": "AB1, 48 HUNTLY STREET, ABERDEEN",
      "postcode": "AB11 6LT"
    } as LocationModel;

    component.selectedLocation = location;
    component.addSelection();
    fixture.detectChanges();
    done();

    const selectedLoctions = fixture.debugElement.queryAll(By.css('.location-selection'));
    expect(selectedLoctions.length).toBeGreaterThan(0);
    const button =  fixture.debugElement.query(By.css('.remove-loation-button'));
    button.nativeElement.dispatchEvent(new Event('click'));
    tick();

    fixture.whenStable().then(() => { 
      fixture.detectChanges();
      const selectedLoctionsAfterClick = fixture.debugElement.queryAll(By.css('.location-selection'));
      expect(selectedLoctionsAfterClick.length).toEqual(0);
    });
  })
});
