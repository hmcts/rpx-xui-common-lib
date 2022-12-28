import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsErrorSummaryComponent } from './hmcts-error-summary.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsErrorSummaryComponent', () => {
  let component: HmctsErrorSummaryComponent;
  let fixture: ComponentFixture<HmctsErrorSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsErrorSummaryComponent, RpxTranslateMockPipe ],
      imports: [
        RouterTestingModule,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsErrorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
