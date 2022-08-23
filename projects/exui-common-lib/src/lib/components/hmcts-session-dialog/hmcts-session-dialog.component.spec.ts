import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { HmctsSessionDialogComponent } from './hmcts-session-dialog.component';

describe('HMCTS Dialog Component', () => {
  let component: HmctsSessionDialogComponent;
  let fixture: ComponentFixture<HmctsSessionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsSessionDialogComponent ],
      imports: [
        RpxTranslationModule.forChild()
      ],
      providers: [
        RpxTranslationService, RpxTranslationConfig
      ]
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
