import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HmctsSessionDialogComponent } from './hmcts-session-dialog.component';

describe('HMCTS Dialog Component', () => {
  let component: HmctsSessionDialogComponent;
  let fixture: ComponentFixture<HmctsSessionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsSessionDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have onClose', () => {
    expect(component.onClose).toBeDefined();
  });

});
