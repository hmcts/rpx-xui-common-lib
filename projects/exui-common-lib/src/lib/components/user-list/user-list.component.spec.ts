import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    component.users = [{ routerLink: '',
      fullName: 'Test Test',
      email: 'tst@email.com',
      status:  'Active',
      resendInvite: true
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onUserClick when the link clicked', waitForAsync(() => {
    spyOn(component, 'onUserClick');
    fixture.detectChanges();
    const links = fixture.debugElement.nativeElement.querySelector('.govuk-link');
    links.click();
    fixture.whenStable().then(() => {
      expect(component.onUserClick).toHaveBeenCalled();
    });
  }));
});
