import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkRadiosComponent } from './gov-uk-radios.component';

describe('GovUkRadiosComponent', () => {
  let component: GovUkRadiosComponent;
  let fixture: ComponentFixture<GovUkRadiosComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkRadiosComponent ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkRadiosComponent);
    component = fixture.componentInstance;
    component.options = { key: 'key', group: null, config: {hint: 'hint', legend: 'legend', id: 'id'}, errors: null, items: []};
    component.errors = { isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input element', () => {
    const input = fixture.debugElement.query(By.css('.govuk-radios'));
    expect(input).toBeTruthy();
  });

});
