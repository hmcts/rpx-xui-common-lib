import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { GovUkSelectComponent } from './gov-uk-select.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovUkSelectComponent', () => {
  let component: GovUkSelectComponent;
  let fixture: ComponentFixture<GovUkSelectComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RpxTranslationModule.forChild()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkSelectComponent, RpxTranslateMockPipe ],
      providers: [
        RpxTranslationConfig,
        RpxTranslationService,
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkSelectComponent);
    component = fixture.componentInstance;
    component.group = formBuilder.group({ id: null});
    component.config = { label: 'label', hint: 'hint', name: 'name', id: 'id', type: 'type', isPageHeading: true, classes: '' };
    component.errorMessage = {isInvalid: false, messages: ['Error']};
    component.items = [{label: 'label-item', value: 'value-item', id: 'id-item'}];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have select element', () => {
    const input = fixture.debugElement.query(By.css('select'));
    expect(input).toBeTruthy();
  });

  it('should have option element', () => {
    const input = fixture.debugElement.query(By.css('option'));
    expect(input).toBeTruthy();
  });

  it('should have content of the option item label element', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('label-item');
  });
});
