import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkDateComponent } from './gov-uk-date.component';

describe('GovUkDateComponent', () => {
  let component: GovUkDateComponent;
  let fixture: ComponentFixture<GovUkDateComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ GovUkDateComponent ],
      providers: [
        { provide: UntypedFormBuilder, useValue: formBuilder }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkDateComponent);
    component = fixture.componentInstance;
    component.formGroup = formBuilder.group({id_day: null, id_month: null, id_year: null});
    component.config = {id: 'id', name: 'id', label: 'Date field', hint: 'This is a hint'};
    component.errorMessage = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input for day, month and year elements', () => {
    const day = fixture.debugElement.query(By.css('#id'));
    expect(day).toBeTruthy();
    const month = fixture.debugElement.query(By.css('#id-month'));
    expect(month).toBeTruthy();
    const year = fixture.debugElement.query(By.css('#id-year'));
    expect(year).toBeTruthy();
  });

  it('should set the label and hint text correctly', () => {
    // Check that the correct config parameters have been passed to the fieldset element
    const fieldsetElement = fixture.debugElement.query(By.css('xuilib-gov-uk-fieldset'));
    expect(fieldsetElement.properties.config.legend).toEqual('Date field');
    expect(fieldsetElement.properties.config.hint).toEqual('This is a hint');
  });

  it('should pass validation for a valid date', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    component.formGroup.get('id_day').patchValue('01');
    component.formGroup.get('id_month').patchValue('01');
    component.formGroup.get('id_year').patchValue('2021');
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('VALID');
  });

  it('should not pass validation for an invalid date', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    component.formGroup.get('id_day').patchValue('01');
    component.formGroup.get('id_month').patchValue('13');
    component.formGroup.get('id_year').patchValue('2021');
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('INVALID');
  });

  it('should fail validation if the day is blank (empty string)', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    component.formGroup.get('id_month').patchValue('01');
    component.formGroup.get('id_year').patchValue('2021');
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('INVALID');
  });

  it('should fail validation if the month is blank (null)', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    component.formGroup.get('id_day').patchValue('01');
    component.formGroup.get('id_month').patchValue(null);
    component.formGroup.get('id_year').patchValue('2021');
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('INVALID');
  });

  it('should fail validation if the year is blank (null)', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    component.formGroup.get('id_day').patchValue('01');
    component.formGroup.get('id_month').patchValue('01');
    component.formGroup.get('id_year').patchValue(null);
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('INVALID');
  });

  it('should pass validation if the date is optional and day, month, and year are all empty (month is undefined)', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    // Check that null and undefined are treated as empty values
    component.formGroup.get('id_day').patchValue(null);
    component.formGroup.get('id_month').patchValue(undefined);
    component.isOptional = true;
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('VALID');
  });

  it('should pass validation if the date is optional and day, month, and year are all empty (month is null)', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    // Check month is treated as empty if value is null - remember that a -1 offset is applied!
    component.formGroup.get('id_month').patchValue(null);
    component.isOptional = true;
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('VALID');
  });

  it('should pass validation if the date is optional and day, month, and year are all empty (month is empty string)', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    // Check month is treated as empty if value is empty string - remember that a -1 offset is applied!
    component.isOptional = true;
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('VALID');
  });

  it('should fail validation if the date is optional but day, month, or year are not empty', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new UntypedFormGroup({
      id_day: new UntypedFormControl('', dateValidator),
      id_month: new UntypedFormControl('', null),
      id_year: new UntypedFormControl('', null)
    });
    // Check that null and undefined are treated as empty values
    component.formGroup.get('id_day').patchValue(null);
    component.formGroup.get('id_month').patchValue(undefined);
    component.formGroup.get('id_year').patchValue('2021');
    component.isOptional = true;
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('INVALID');
  });
});
