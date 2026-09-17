import { CUSTOM_ELEMENTS_SCHEMA, DOCUMENT, Pipe, PipeTransform, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsErrorSummaryComponent } from './hmcts-error-summary.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsErrorSummaryComponent', () => {
  let component: HmctsErrorSummaryComponent;
  let fixture: ComponentFixture<HmctsErrorSummaryComponent>;

  const originalTitle = document.title;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsErrorSummaryComponent, RpxTranslateMockPipe ],
      imports: [
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsErrorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have h2 element when there is header', () => {
    component.header = 'header';
    component.messages = [{id: 'id1', message: '1'}, {id: 'id2', message: '2'}];
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('h2'));
    expect(input).toBeTruthy();
  });

  it('should prefix document title with "Error:" when errors are set', () => {
    const doc = TestBed.inject(DOCUMENT) as any;
    doc.title = 'Add recipient';
    const messages = [{id: 'cases', message: 'Select at least one change'}];
    component.messages = messages;
    component.ngOnChanges({ errorMessages: new SimpleChange([], messages, false) });
    expect(doc.title).toBe('Error: Add recipient');
  });

  it('should remove "Error:" prefix from document title when errors are cleared', () => {
    const doc = TestBed.inject(DOCUMENT) as any;
    doc.title = 'Error: Add recipient';
    component.messages = [];
    component.ngOnChanges({ errorMessages: new SimpleChange([{id: 'cases', message: 'err'}], [], false) });
    expect(doc.title).toBe('Add recipient');
  });
});
