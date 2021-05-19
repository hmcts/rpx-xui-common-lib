import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkTextareaComponent } from './gov-uk-textarea.component';

describe('GovUkSelectComponent', () => {
  let component: GovUkTextareaComponent;
  let fixture: ComponentFixture<GovUkTextareaComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkTextareaComponent ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkTextareaComponent);
    component = fixture.componentInstance;
    component.group = formBuilder.group({ name: null});
    component.config = { label: 'label', hint: 'hint', name: 'name', id: 'id', key: 'name', isPageHeading: true, classes: '', rows: 3 };
    component.errorMessage = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have textarea element', () => {
    const input = fixture.debugElement.query(By.css('textarea'));
    expect(input).toBeTruthy();
  });
});
