import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptTermsAndConditionsComponent } from './accept-terms-and-conditions.component';

describe('AcceptTermsAndConditionsComponent', () => {
  let component: AcceptTermsAndConditionsComponent;
  let fixture: ComponentFixture<AcceptTermsAndConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptTermsAndConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
