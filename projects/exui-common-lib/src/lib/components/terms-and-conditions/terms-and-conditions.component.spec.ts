import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TCDocument } from '../../models';
import { TcDisplayHtmlComponent } from './tc-display/tc-display-html/tc-display-html.component';
import { TcDisplayPlainComponent } from './tc-display/tc-display-plain/tc-display-plain.component';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsComponent, TcDisplayPlainComponent, TcDisplayHtmlComponent, RpxTranslationMockPipe ],
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
});
