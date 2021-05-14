import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InviteUserPermissionComponent } from './invite-user-permission.component';

describe('InviteUserPermissionComponent', () => {
  let component: InviteUserPermissionComponent;
  let fixture: ComponentFixture<InviteUserPermissionComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ InviteUserPermissionComponent ],
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
    })});
    component.errorMessages = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
