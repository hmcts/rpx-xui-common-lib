import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { HmctsPaginationComponent } from '../../gov-ui/components/hmcts-pagination/hmcts-pagination.component';
import { UserListComponent } from './user-list.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
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
      declarations: [ UserListComponent, HmctsPaginationComponent, RpxTranslationMockPipe],
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
