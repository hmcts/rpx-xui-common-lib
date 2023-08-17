import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkRadioComponent } from './gov-uk-radio.component';

describe('GovUkRadioComponent', () => {
  let component: GovUkRadioComponent;
  let fixture: ComponentFixture<GovUkRadioComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkRadioComponent ],
      providers: [
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkRadioComponent);
    component = fixture.componentInstance;
    component.group = formBuilder.group({ name: null});
    component.config = { label: 'label', hint: 'hint', name: 'name', id: 'id', type: 'type', isPageHeading: true, classes: '', value: 'value', focusOn: 'focuson'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input element', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });
});
