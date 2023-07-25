import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkFormGroupWrapperComponent } from './gov-uk-form-group-wrapper.component';

describe('GovUkFormGroupWrapperComponent', () => {
  let component: GovUkFormGroupWrapperComponent;
  let fixture: ComponentFixture<GovUkFormGroupWrapperComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkFormGroupWrapperComponent ],
      providers: [
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkFormGroupWrapperComponent);
    component = fixture.componentInstance;
    component.group = 'group';
    component.config = {hint: 'hint', legend: 'legend', key: 'key', isPageHeading: true, id: 'id'};
    component.error = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form group element', () => {
    const formGroup = fixture.debugElement.query(By.css('.govuk-form-group'));
    expect(formGroup).toBeTruthy();
  });

});
