import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { GovUkFieldsetComponent } from './gov-uk-fieldset.component';

describe('GovUkFieldsetComponent', () => {
  let component: GovUkFieldsetComponent;
  let fixture: ComponentFixture<GovUkFieldsetComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RpxTranslationModule.forChild()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [  GovUkFieldsetComponent ],
      providers: [
        RpxTranslationConfig, RpxTranslationService,
        { provide: FormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkFieldsetComponent);
    component = fixture.componentInstance;
    component.config = {legend: 'legend', classes: '', id: 'id', hint: 'hint', key: 'key', isPageHeading: true};
    // component.isPageHeading = true;
    component.errorMessage = { isInvalid: false, messages: ['Error1', 'Error2']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have h1 component when its a page heading', () => {
    component.config.isPageHeading = true;
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('h1'));
    expect(header).toBeTruthy();
  });

  it('should have no h1 component when its a page heading is false', () => {
    component.config.isPageHeading = false;
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('h1'));
    expect(header).toBeFalsy();
  });

});
