import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkDateComponent } from './gov-uk-date.component';

describe('GovUkDateComponent', () => {
  let component: GovUkDateComponent;
  let fixture: ComponentFixture<GovUkDateComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ GovUkDateComponent ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
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

  it('should validation pass for valid date', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new FormGroup({
      id_day: new FormControl('', dateValidator),
      id_month: new FormControl('', null),
      id_year: new FormControl('', null)
    });
    component.formGroup.get('id_day').patchValue('01');
    component.formGroup.get('id_month').patchValue('01');
    component.formGroup.get('id_year').patchValue('2021');
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('VALID');
  });

  it('should validation not pass for invalid date', () => {
    const dateValidator = component.DateValidator();
    component.formGroup = new FormGroup({
      id_day: new FormControl('', dateValidator),
      id_month: new FormControl('', null),
      id_year: new FormControl('', null)
    });
    fixture.detectChanges();
    component.formGroup.get('id_day').patchValue('01');
    component.formGroup.get('id_month').patchValue('13');
    component.formGroup.get('id_year').patchValue('2021');
    fixture.detectChanges();

    expect(component.formGroup.status).toBe('INVALID');
  });
});
