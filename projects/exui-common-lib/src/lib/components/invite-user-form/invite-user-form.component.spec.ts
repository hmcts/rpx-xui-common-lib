import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InviteUserFormComponent } from './invite-user-form.component';

describe('InviteUserFormComponent', () => {
  let component: InviteUserFormComponent;
  let fixture: ComponentFixture<InviteUserFormComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ InviteUserFormComponent ],
      providers: [
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserFormComponent);
    component = fixture.componentInstance;
    component.inviteUserForm = formBuilder.group({ name: null});
    component.errorMessages = {isInvalid: false, messages: ['Error']};
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
});
