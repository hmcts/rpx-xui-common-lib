import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { of } from 'rxjs';
import { Person, PersonRole } from '../../models';
import { FindAPersonService } from '../../services/find-person/find-person.service';
import { FindPersonComponent } from './find-person.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('FindPersonComponent', () => {
  let component: FindPersonComponent;
  let fixture: ComponentFixture<FindPersonComponent>;
  let mockFindAPersonService: any;

  beforeEach(() => {
    mockFindAPersonService = jasmine.createSpyObj('FindAPersonService', ['find', 'findCaseworkers']);
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule,
      ],
      declarations: [
        FindPersonComponent,
        RpxTranslateMockPipe
      ],
      providers: [
        {provide: FindAPersonService, useValue: mockFindAPersonService}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FindPersonComponent);

    component = fixture.componentInstance;
    component.findPersonGroup = new FormGroup({});
    component.findPersonGroup.addControl('findPersonControl', new FormControl());
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('is Truthy', () => {
    expect(component).toBeTruthy();
  });

  it('input element changes triggers search', waitForAsync(() => {
    mockFindAPersonService.find.and.returnValue(of([]));
    mockFindAPersonService.findCaseworkers.and.returnValue(of([]));
    component.findPersonControl.setValue('test');
    fixture.detectChanges();
    setTimeout(() => {
      expect(mockFindAPersonService.find).toHaveBeenCalled();
      expect(mockFindAPersonService.findCaseworkers).toHaveBeenCalled();
    }, 500);
  }));

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

  it('getDisplayName Non Judicial with email', () => {
    const nonJudicialPerson = {
      id: 'someId',
      name: 'First Last',
      email: 'first.last@email.com',
      domain: PersonRole.JUDICIAL
    };
    const displayName = component.getDisplayName(nonJudicialPerson);
    expect(displayName).toEqual('First Last (first.last@email.com)');
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
      knownAs: 'Lead Judge',
      fullName: 'Lead Judge First Last'
    };
    const displayName = component.getDisplayName(judicial);
    expect(displayName).toEqual('Lead Judge First Last (first.last@email.com)');
  });

  it('getDisplayName Judicial with no full name', () => {
    const judicial = {
      id: 'someId',
      name: 'First Last',
      email: 'first.last@email.com',
      domain: PersonRole.JUDICIAL
    };
    const displayName = component.getDisplayName(judicial);
    expect(displayName).toEqual('First Last (first.last@email.com)');
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
      domain: PersonRole.LEGAL_OPERATIONS
    };
    const mockPersonThree: Person = {
      id: 'p3',
      name: 'Third Last',
      email: 'person@email.com',
      domain: PersonRole.ADMIN
    };
    mockFindAPersonService.find.and.returnValue(of([mockPersonOne]));
    mockFindAPersonService.findCaseworkers.and.returnValue(of([mockPersonTwo, mockPersonThree]));
    component.filter('ast').subscribe(result => expect(result).toEqual([mockPersonOne, mockPersonTwo, mockPersonThree]));
    component.filter('').subscribe(result => expect(result.length).toBe(0));
  });

  it('should emit an event when search person emits an event to the component', () => {
    spyOn(component.personFieldChanged, 'emit');
    component.onInput();
    expect(component.personFieldChanged.emit).toHaveBeenCalled();
  });
});
