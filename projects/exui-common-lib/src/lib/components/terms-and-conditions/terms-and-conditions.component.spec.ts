import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { TCDocument } from '../../models';
import { TcDisplayHtmlComponent } from './tc-display/tc-display-html/tc-display-html.component';
import { TcDisplayPlainComponent } from './tc-display/tc-display-plain/tc-display-plain.component';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('TermsAndConditionsComponent', () => {
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;

  const testData: TCDocument = {
    content: 'Test',
    version: 1,
    mimeType: 'text/plain'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsComponent, TcDisplayPlainComponent, TcDisplayHtmlComponent, RpxTranslateMockPipe ],
      imports: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    component.document = testData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize html content', () => {
    const sanitizer = TestBed.inject(DomSanitizer);
    const input = '<script>alert(1)</script><p>Safe</p>';

    spyOn(sanitizer, 'sanitize').and.returnValue('<p>Safe</p>');

    const result = component.sanitizeHtml(input);

    expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, input);
    expect(result).toBe('<p>Safe</p>');
  });
});
