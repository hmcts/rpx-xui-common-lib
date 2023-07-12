import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovUkCheckboxesComponent } from './gov-uk-checkboxes.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovUkCheckboxesComponent', () => {
  let component: GovUkCheckboxesComponent;
  let fixture: ComponentFixture<GovUkCheckboxesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkCheckboxesComponent, RpxTranslateMockPipe ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkCheckboxesComponent);
    component = fixture.componentInstance;
    component.group = new FormGroup({
      item: new FormControl()
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
