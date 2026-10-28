import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserDetailsComponent } from './user-details.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UserDetailsComponent, RpxTranslateMockPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    component.user = { routerLink: '',
      fullName: 'Test Test',
      email: 'tst@email.com',
      status:  'Active',
      resendInvite: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show warning Title when there is warning title', () => {
    component.warningTitle = 'Test Warning Title';
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.govuk-warning-text__text');
    expect(title.textContent).toContain('Test Warning Title');
  });

  it('should show reinvite button as user.resendInvite is true', () => {
    component.user.resendInvite = true;
    fixture.detectChanges();
    const resend = fixture.nativeElement.querySelector('#resend-invite-button');
    expect(resend).toBeTruthy();
  });

  it('emits the exact invited user once on click', () => {
    const emitted = spyOn(component.reinvite, 'emit');
    const button = fixture.nativeElement.querySelector('#resend-invite-button');
    button.click();
    expect(emitted).toHaveBeenCalledOnceWith(component.user);
    expect(emitted.calls.first().args[0]).toBe(component.user);
  });

  it('should show suspend user button when showSuspendUserButton is true', () => {
    component.showSuspendUserButton = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('emits the exact suspended user once on click', () => {
    component.showSuspendUserButton = true;
    const emitted = spyOn(component.suspendUserEvent, 'emit');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(emitted).toHaveBeenCalledOnceWith(component.user);
    expect(emitted.calls.first().args[0]).toBe(component.user);
  });

  it('should verify if user has specific role', () => {
    component.user.roles = ['pui-finance-manager'];
    let userHasRole = component.userHasRole('pui-finance-manager');
    expect(userHasRole).toBeTruthy();
    userHasRole = component.userHasRole('pui-caa');
    expect(userHasRole).toBeFalsy();
  });
});
