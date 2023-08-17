import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { GovUkFileUploadComponent } from './gov-uk-file-upload.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovUkFileUploadComponent', () => {
  let component: GovUkFileUploadComponent;
  let fixture: ComponentFixture<GovUkFileUploadComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RpxTranslationModule.forChild()],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GovUkFileUploadComponent, RpxTranslateMockPipe ],
      providers: [
        RpxTranslationConfig, RpxTranslationService,
        { provide: UntypedFormBuilder, useValue: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkFileUploadComponent);
    component = fixture.componentInstance;
    component.group = formBuilder.group({ id: null});
    component.config = { label: 'label', hint: 'hint', name: 'name', id: 'id', type: 'type', isPageHeading: true, classes: '' };
    component.errorMessage = {isInvalid: false, messages: ['Error']};
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
