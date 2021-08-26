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
    mockFindAPersonService = jasmine.createSpyObj('FindAPersonService', ['find']);
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
    component.findPersonControl.setValue('test');
    fixture.detectChanges();
    expect(mockFindAPersonService.find).toHaveBeenCalled();
  });

  it('selection change emits change with person', () => {
    const mockPerson: Person = {
      id: 'p1',
      name: 'Person 1',
      email: 'person@email.com',
      domain: 'Both'
    };
    spyOn(component.personSelected, 'emit');
    component.onSelectionChange(null);
    expect(component.personSelected.emit).toHaveBeenCalledWith(null);
    component.onSelectionChange(mockPerson);
    expect(component.personSelected.emit).toHaveBeenCalledWith(null);
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


});
