import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InviteUserFormComponent } from './invite-user-form.component';

describe('InviteUserFormComponent', () => {
  let component: InviteUserFormComponent;
  let fixture: ComponentFixture<InviteUserFormComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ InviteUserFormComponent ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
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

  it('should call on submit when the button clicked', async(() => {
    spyOn(component, 'onSubmit');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    });
  }));
});
