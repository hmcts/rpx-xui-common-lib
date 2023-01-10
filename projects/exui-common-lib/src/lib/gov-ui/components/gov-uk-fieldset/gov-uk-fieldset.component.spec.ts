import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkFieldsetComponent } from './gov-uk-fieldset.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovUkFieldsetComponent', () => {
  let component: GovUkFieldsetComponent;
  let fixture: ComponentFixture<GovUkFieldsetComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ GovUkFieldsetComponent, RpxTranslateMockPipe ],
      providers: [
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
