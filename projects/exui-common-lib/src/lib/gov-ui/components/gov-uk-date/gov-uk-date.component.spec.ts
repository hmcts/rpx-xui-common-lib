import {  NO_ERRORS_SCHEMA } from '@angular/core';
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
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
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
    component.formGroup = formBuilder.group({ day: null, month: null, year: null});
    component.config = { id: 'id'};
    component.errorMessage = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input for  day, month and year element', () => {
    const day = fixture.debugElement.query(By.css('#id'));
    expect(day).toBeTruthy();
    const month = fixture.debugElement.query(By.css('#id-month'));
    expect(month).toBeTruthy();
    const year = fixture.debugElement.query(By.css('#id-year'));
    expect(year).toBeTruthy();
  });

});
