import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BasicUser } from '../../models/basic-user.model';
import { UserSelectComponent } from './user-select.component';

describe('UserSelectComponent', () => {
  let component: UserSelectComponent;
  let fixture: ComponentFixture<UserSelectComponent>;

  const testUsers: BasicUser[] = [
    {
      fullName: 'Geddy Lee',
      email: 'g.lee@rush.band'
    },
    {
      fullName: 'Alex Lifeson',
      email: 'a.lifeson@rush.band'
    },
    {
      fullName: 'Neil Peart',
      email: 'n.peart@rush.band'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSelectComponent ],
      imports: [ MatAutocompleteModule, ReactiveFormsModule ]
    })
    .compileComponents();
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
    expect(component.displayValue(testUsers[0])).toEqual('Geddy Lee - g.lee@rush.band');
  });

  it('should filter users correctly', async(() => {
    component.users = testUsers;
    component.control.setValue('neil');
    fixture.detectChanges();
    component.filteredUsers.subscribe(filtered => {
      expect(filtered.length).toBe(1);
      expect(filtered[0].fullName).toEqual('Neil Peart');
    });
    fixture.detectChanges();
  }));
});
