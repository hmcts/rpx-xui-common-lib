import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserDetails } from '../../models/user-details.model';
import { UserSelectComponent } from './user-select.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('UserSelectComponent', () => {
  let component: UserSelectComponent;
  let fixture: ComponentFixture<UserSelectComponent>;

  const testUsers: UserDetails[] = [
    {
      idamId: '111111',
      firstName: 'Geddy',
      lastName: 'Lee',
      email: 'g.lee@rush.band',
      userAccessTypes: [
        {
          jurisdictionId: '12345',
          organisationProfileId: '12345',
          accessTypeId: '1234',
          enabled: true
        }
      ]
    },
    {
      idamId: '222222',
      firstName: 'Alex',
      lastName: 'Lifeson',
      email: 'a.lifeson@rush.band',
      userAccessTypes: [
        {
          jurisdictionId: '12345',
          organisationProfileId: '12345',
          accessTypeId: '1234',
          enabled: true
        }
      ]
    },
    {
      idamId: '333333',
      firstName: 'Neil',
      lastName: 'Peart',
      email: 'n.peart@rush.band',
      userAccessTypes: [
        {
          jurisdictionId: '12345',
          organisationProfileId: '12345',
          accessTypeId: '1234',
          enabled: true
        }
      ]
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserSelectComponent, RpxTranslateMockPipe],
      imports: [MatAutocompleteModule, ReactiveFormsModule],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create correct displayValue', () => {
    expect(component.displayValue(testUsers[0])).toEqual(
      'Geddy Lee - g.lee@rush.band'
    );
  });

  it('should emit exactly the matching user for neil', () => {
    component.users = testUsers;
    const emissions: UserDetails[][] = [];
    const subscription = component.filteredUsers.subscribe(filtered => emissions.push(filtered));
    component.control.setValue('neil');
    subscription.unsubscribe();

    expect(emissions.length).toBe(1);
    expect(emissions).toEqual([[testUsers[2]]]);
  });

  it('should clear filter users when value is empty', () => {
    component.users = testUsers;
    const emissions: UserDetails[][] = [];
    const subscription = component.filteredUsers.subscribe(filtered => emissions.push(filtered));
    component.control.setValue('');
    subscription.unsubscribe();

    expect(emissions.length).toBe(1);
    expect(emissions).toEqual([[]]);
  });
});
