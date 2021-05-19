import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsErrorSummaryComponent } from './hmcts-error-summary.component';

describe('HmctsErrorSummaryComponent', () => {
  let component: HmctsErrorSummaryComponent;
  let fixture: ComponentFixture<HmctsErrorSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsErrorSummaryComponent ],
      imports: [
        RouterTestingModule
      ]
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
