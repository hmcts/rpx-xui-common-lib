import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { HmctsPaginationComponent } from '../../gov-ui/components/hmcts-pagination/hmcts-pagination.component';
import { UserListComponent } from './user-list.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxPaginationModule],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UserListComponent, HmctsPaginationComponent, RpxTranslateMockPipe],
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

  it('should render a keyboard-accessible button when no route is provided', waitForAsync(() => {
    spyOn(component, 'onUserClick');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button.govuk-link');

    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
    expect(button.getAttribute('href')).toBeNull();

    button.click();
    fixture.whenStable().then(() => {
      expect(component.onUserClick).toHaveBeenCalled();
    });
  }));

  it('should render a link when a route is provided', () => {
    component.users = [{
      routerLink: '/users/123',
      fullName: 'Test Test',
      email: 'tst@email.com',
      status: 'Active'
    }];
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector('a.govuk-link');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/users/123');
  });
});
