import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { UserDetails } from '../../models/user-details.model';
import { UserSelectComponent } from './user-select.component';

describe('UserSelectComponent', () => {
  let component: UserSelectComponent;
  let fixture: ComponentFixture<UserSelectComponent>;

  const testUsers: UserDetails[] = [
    {
      idamId: '111111',
      firstName: 'Geddy',
      lastName: 'Lee',
      email: 'g.lee@rush.band'
    },
    {
      idamId: '222222',
      firstName: 'Alex',
      lastName: 'Lifeson',
      email: 'a.lifeson@rush.band'
    },
    {
      idamId: '333333',
      firstName: 'Neil',
      lastName: 'Peart',
      email: 'n.peart@rush.band'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSelectComponent ],
      imports: [ MatAutocompleteModule, ReactiveFormsModule, RpxTranslationModule.forChild() ],
      providers: [RpxTranslationConfig, RpxTranslationService],
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
      expect(filtered[0].firstName).toEqual('Neil');
      expect(filtered[0].lastName).toEqual('Peart');
    });
    fixture.detectChanges();
  }));

  it('should clear filter users when value is empty', () => {
    component.users = testUsers;
    component.control.setValue('');
    fixture.detectChanges();
    component.filteredUsers.subscribe(filtered => {
      expect(filtered.length).toBe(0);
    });
    fixture.detectChanges();
  });

});
