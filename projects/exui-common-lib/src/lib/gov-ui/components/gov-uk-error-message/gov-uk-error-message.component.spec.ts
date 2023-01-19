import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkErrorMessageComponent } from './gov-uk-error-message.component';

describe('GovUkErrorMessageComponent', () => {
  let component: GovUkErrorMessageComponent;
  let fixture: ComponentFixture<GovUkErrorMessageComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [  GovUkErrorMessageComponent ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkErrorMessageComponent);
    component = fixture.componentInstance;
    component.config = { id: 'id'};
    component.errorMessage = {isInvalid: false, messages: ['Error1', 'Error2']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the error element', () => {
    const error = fixture.debugElement.query(By.css('#id-error'));
    expect(error).toBeTruthy();
  });

  it('should have the error messages', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('Error1');
    expect(fixture.debugElement.nativeElement.textContent).toContain('Error2');
  });

});
