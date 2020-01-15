import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HmctsDialogComponent } from './hmcts-dialog.component';

describe('HMCTS Dialog Component', () => {
  let component: HmctsDialogComponent;
  let fixture: ComponentFixture<HmctsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsDialogComponent);
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
