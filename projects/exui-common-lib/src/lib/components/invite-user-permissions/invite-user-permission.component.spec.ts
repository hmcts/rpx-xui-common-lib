import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InviteUserPermissionComponent } from './invite-user-permission.component';

@Component({
  selector: 'xuilib-gov-uk-form-group-wrapper',
  template: '<ng-content></ng-content>',
  standalone: false
})
class FormGroupWrapperStubComponent {
  @Input() public config: any;
  @Input() public formGroupName: string;
  @Input() public error: any;
}

@Component({
  selector: 'xuilib-gov-checkbox',
  template: '',
  standalone: false
})
class GovCheckboxStubComponent {
  @Input() public group: any;
  @Input() public isChecked: boolean;
  @Input() public config: any;
}

describe('InviteUserPermissionComponent', () => {
  let component: InviteUserPermissionComponent;
  let fixture: ComponentFixture<InviteUserPermissionComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        InviteUserPermissionComponent,
        FormGroupWrapperStubComponent,
        GovCheckboxStubComponent
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserPermissionComponent);
    component = fixture.componentInstance;
    component.inviteUserForm = formBuilder.group({ roles: new FormGroup({
      'pui-case-manager': new FormControl(''),
      'pui-user-manager': new FormControl(''),
      'pui-organisation-manager': new FormControl(''),
      'pui-finance-manager': new FormControl('')
    }) });
    component.errorMessages = { isInvalid: false, messages: ['Error'] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('passes the permissions group configuration and error object to the wrapper', () => {
    const wrapper = fixture.debugElement.query(By.directive(FormGroupWrapperStubComponent)).componentInstance;

    expect(wrapper.config).toEqual({
      hint: 'Choose what the user will be able to do. You can change this later.',
      legend: 'Permissions',
      key: 'roles'
    });
    expect(wrapper.formGroupName).toBe('roles');
    expect(wrapper.error).toBe(component.errorMessages);
  });

  it('renders the three enabled permission choices with their exact values and labels', () => {
    const checkboxes = fixture.debugElement.queryAll(By.directive(GovCheckboxStubComponent))
      .map((debugElement) => debugElement.componentInstance as GovCheckboxStubComponent);

    expect(checkboxes.length).toBe(3);
    expect(checkboxes.map((checkbox) => checkbox.config.value)).toEqual([
      'pui-case-manager',
      'pui-user-manager',
      'pui-organisation-manager'
    ]);
    expect(checkboxes.map((checkbox) => checkbox.config.label)).toEqual([
      'Manage Cases',
      'Manage Users',
      'Manage Organisation'
    ]);
  });

  it('passes each role selection flag to the matching checkbox', () => {
    component.isPuiCaseManager = true;
    component.isPuiUserManager = true;
    component.isPuiOrganisationManager = false;
    fixture.detectChanges();

    const checkboxes = fixture.debugElement.queryAll(By.directive(GovCheckboxStubComponent))
      .map((debugElement) => debugElement.componentInstance as GovCheckboxStubComponent);

    expect(checkboxes.map((checkbox) => checkbox.isChecked)).toEqual([true, true, false]);
    expect(checkboxes.every((checkbox) => checkbox.group === component.inviteUserForm.controls.roles)).toBeTrue();
  });

});
