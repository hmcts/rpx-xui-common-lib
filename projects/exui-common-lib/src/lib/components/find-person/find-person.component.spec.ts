
import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { of } from 'rxjs';
import { Person, PersonRole } from '../../models';

import { FindAPersonService } from '../../services/find-person/find-person.service';
import { FindPersonComponent } from './find-person.component';

describe('FindPersonComponent', () => {
  let component: FindPersonComponent;
  let fixture: ComponentFixture<FindPersonComponent>;
  let mockFindAPersonService: any;

  beforeEach(() => {
    mockFindAPersonService = jasmine.createSpyObj('FindAPersonService', ['find', 'getSpecificCaseworkers']);
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule
      ],
      declarations: [
        FindPersonComponent
      ],
      providers: [
        { provide: FindAPersonService, useValue: mockFindAPersonService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FindPersonComponent);

    component = fixture.componentInstance;
    component.findPersonGroup = new FormGroup({});
    component.findPersonGroup.addControl('findPersonControl', new FormControl());
    fixture.detectChanges();
  });

  it('is Truthy', () => {
    expect(component).toBeTruthy();
  });

  it('input element changes triggers search', () => {
    mockFindAPersonService.find.and.returnValue(of([]));
    mockFindAPersonService.getSpecificCaseworkers.and.returnValue(of([]));
    component.findPersonControl.setValue('test');
    fixture.detectChanges();
    expect(mockFindAPersonService.find).toHaveBeenCalled();
    expect(mockFindAPersonService.getSpecificCaseworkers).toHaveBeenCalled();
  });

  it('selection change emits change with person', () => {
    const mockPerson: Person = {
      id: 'p1',
      name: 'Person 1',
      email: 'person@email.com',
      domain: PersonRole.JUDICIAL
    };
    spyOn(component.personSelected, 'emit');
    component.onSelectionChange(null);
    expect(component.personSelected.emit).toHaveBeenCalledWith(null);
    component.onSelectionChange(mockPerson);
    expect(component.personSelected.emit).toHaveBeenCalledWith(mockPerson);
  });

  it('should set auto complete boolean correctly', () => {
    component.updatedVal(undefined);
    expect(component.showAutocomplete).toBe(false);
    component.updatedVal('lf');
    expect(component.showAutocomplete).toBe(false);
    component.updatedVal('caseworker');
    expect(component.showAutocomplete).toBe(true);
  });

  it('getDisplayName Non Judicial with email', () => {
    const nonJudicialPerson = {
      id: 'someId',
      name: 'First Last',
      email: 'first.last@email.com',
      domain: PersonRole.JUDICIAL
    };
    const displayName = component.getDisplayName(nonJudicialPerson);
    expect(displayName).toEqual('First Last(first.last@email.com)');
  });
  it('getDisplayName Non Judicial with no email', () => {
    const nonJudicialPerson = {
      id: 'someId',
      name: 'First Last',
      domain: PersonRole.JUDICIAL
    };
    const displayName = component.getDisplayName(nonJudicialPerson);
    expect(displayName).toEqual('First Last');
  });
  it('getDisplayName Judicial', () => {
    const judicial = {
      id: 'someId',
      name: 'First Last',
      email: 'first.last@email.com',
      domain: PersonRole.JUDICIAL,
      knownAs: 'Lead Judge'
    };
    const displayName = component.getDisplayName(judicial);
    expect(displayName).toEqual('Lead Judge(first.last@email.com)');
  });

  it('getDisplayName Judicial with no KnownAs', () => {
    const judicial = {
      id: 'someId',
      name: 'First Last',
      email: 'first.last@email.com',
      domain: PersonRole.JUDICIAL
    };
    const displayName = component.getDisplayName(judicial);
    expect(displayName).toEqual('First Last(first.last@email.com)');
  });

  it('can switch domain on changes', () => {
    const changes: SimpleChanges = {
      domain: {
        firstChange: false,
        previousValue: 'All',
        currentValue: 'Judicial',
        isFirstChange: () => false
      }
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.findPersonControl.value).toBe(null);
    expect(component.selectedPerson).toBe(null);
  });

  it('can filter through both judicial and caseworkers', () => {
    const mockPersonOne = {
      id: 'p1',
      name: 'First Last',
      email: 'first.last@email.com',
      domain: PersonRole.JUDICIAL
    };
    const mockPersonTwo: Person = {
      id: 'p2',
      name: 'Second Last',
      email: 'person@email.com',
      domain: PersonRole.CASEWORKER
    };
    const mockPersonThree: Person = {
      id: 'p3',
      name: 'Third Last',
      email: 'person@email.com',
      domain: PersonRole.ADMIN
    };
    mockFindAPersonService.find.and.returnValue(of([mockPersonOne]));
    mockFindAPersonService.getSpecificCaseworkers.and.returnValue(of([mockPersonTwo, mockPersonThree]));
    fixture.detectChanges();
    component.filter('ast').subscribe(result => expect(result).toEqual([mockPersonOne, mockPersonTwo, mockPersonThree]));
    component.filter('').subscribe(result => expect(result).toBe(null));
  });

});
