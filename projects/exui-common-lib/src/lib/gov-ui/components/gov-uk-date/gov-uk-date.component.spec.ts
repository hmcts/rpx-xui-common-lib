import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    component.config = {id: 'id', label: 'Date field', hint: 'This is a hint'};
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
});
