import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InviteUserPermissionComponent } from './invite-user-permission.component';

describe('InviteUserPermissionComponent', () => {
  let component: InviteUserPermissionComponent;
  let fixture: ComponentFixture<InviteUserPermissionComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ InviteUserPermissionComponent ],
      providers: [
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserPermissionComponent);
    component = fixture.componentInstance;
    component.inviteUserForm = formBuilder.group({ roles: new UntypedFormGroup({
      'pui-case-manager': new UntypedFormControl(''),
      'pui-user-manager': new UntypedFormControl(''),
      'pui-organisation-manager': new UntypedFormControl(''),
      'pui-finance-manager': new UntypedFormControl('')
    })});
    component.errorMessages = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
