import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InviteUserFormComponent } from './invite-user-form.component';

@Component({
  selector: 'xuilib-gov-uk-input',
  template: '',
  standalone: false
})
class GovUkInputStubComponent {
  @Input() public config: any;
  @Input() public errorMessage: any;
  @Input() public group: FormGroup;
}

@Component({
  selector: 'xuilib-invite-permission-form',
  template: '',
  standalone: false
})
class InvitePermissionStubComponent {
  @Input() public inviteUserForm: FormGroup;
  @Input() public errorMessages: any;
}

describe('InviteUserFormComponent', () => {
  let component: InviteUserFormComponent;
  let fixture: ComponentFixture<InviteUserFormComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        InviteUserFormComponent,
        GovUkInputStubComponent,
        InvitePermissionStubComponent
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserFormComponent);
    component = fixture.componentInstance;
    component.inviteUserForm = formBuilder.group({
      firstName: null,
      lastName: null,
      email: null,
      roles: formBuilder.group({})
    });
    component.errorMessages = {
      firstName: 'First name error',
      lastName: 'Last name error',
      email: 'Email error',
      roles: 'Roles error'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on submit when the button clicked', waitForAsync(() => {
    spyOn(component, 'onSubmit');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    });
  }));

  it('passes the exact input configurations and validation messages to the child inputs', () => {
    const inputs = fixture.debugElement.queryAll(By.directive(GovUkInputStubComponent))
      .map((debugElement) => debugElement.componentInstance as GovUkInputStubComponent);

    expect(inputs.length).toBe(3);
    expect(inputs.map((input) => input.config)).toEqual([
      {
        label: 'First name',
        hint: 'Include all middle names.',
        name: 'firstName',
        id: 'firstName',
        type: 'text',
        classes: 'testClass'
      },
      { label: 'Last name', name: 'lastName', id: 'lastName', type: 'text' },
      { label: 'Email address', name: 'email', id: 'email', type: 'email' }
    ]);
    expect(inputs.map((input) => input.errorMessage)).toEqual([
      'First name error',
      'Last name error',
      'Email error'
    ]);
    expect(inputs.every((input) => input.group === component.inviteUserForm)).toBeTrue();
  });

  it('passes the roles form and role error to the permission child', () => {
    const permission = fixture.debugElement.query(By.directive(InvitePermissionStubComponent))
      .componentInstance as InvitePermissionStubComponent;

    expect(permission.inviteUserForm).toBe(component.inviteUserForm);
    expect(permission.errorMessages).toBe('Roles error');
  });

  it('uses an empty object when errorMessages is undefined', () => {
    component.errorMessages = undefined;

    expect(component.isInvalid).toEqual({});
  });

  it('emits submitForm without adding an event payload', () => {
    const emit = spyOn(component.submitForm, 'emit');

    component.onSubmit();

    expect(emit).toHaveBeenCalledWith();
  });
});
