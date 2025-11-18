import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { GovUkErrorMessageComponent } from './gov-uk-error-message.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovUkErrorMessageComponent', () => {
  let component: GovUkErrorMessageComponent;
  let fixture: ComponentFixture<GovUkErrorMessageComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RpxTranslationModule.forChild()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkErrorMessageComponent, RpxTranslateMockPipe ],
      providers: [
        RpxTranslationConfig,
        RpxTranslationService,
        { provide: FormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkErrorMessageComponent);
    component = fixture.componentInstance;
    component.config = { id: 'id'};
    component.errorMessage = {isInvalid: false, messages: ['Error1', 'Error2']};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the error element', () => {
    const error = fixture.debugElement.query(By.css('#id-error'));
    expect(error).toBeTruthy();
  });

  it('should have the error messages', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('Error1');
    expect(fixture.debugElement.nativeElement.textContent).toContain('Error2');
  });
});
