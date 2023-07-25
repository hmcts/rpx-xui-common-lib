import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovUkCheckboxesComponent } from './gov-uk-checkboxes.component';

describe('GovUkCheckboxesComponent', () => {
  let component: GovUkCheckboxesComponent;
  let fixture: ComponentFixture<GovUkCheckboxesComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkCheckboxesComponent ],
      providers: [
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkCheckboxesComponent);
    component = fixture.componentInstance;
    component.group = new UntypedFormGroup({
      item: new UntypedFormControl()
    });
    component.config = {hint: 'hint', legend: 'legend', id: 'id', name: 'item'};
    component.items = [{id: 'item', value: 'item', label: 'Item'}];
    component.errorMessage = {isInvalid: false, messages: ['Error']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
