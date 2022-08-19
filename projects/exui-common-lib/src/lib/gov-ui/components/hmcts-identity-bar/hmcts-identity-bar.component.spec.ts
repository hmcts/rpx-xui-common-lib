import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { HmctsIdentityBarComponent } from './hmcts-identity-bar.component';

describe('HmctsIdentityBarComponent', () => {
  let component: HmctsIdentityBarComponent;
  let fixture: ComponentFixture<HmctsIdentityBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsIdentityBarComponent ],
      imports: [
        RpxTranslationModule.forChild()
      ],
      providers: [
        RpxTranslationConfig,
        RpxTranslationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsIdentityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show anything when there is no content', () => {
    const main = fixture.debugElement.query(By.css('.hmcts-identity-bar'));
    expect(main).toBeFalsy();
  });

  it('should have identity bar when there is content', () => {
    component.content = { name: 'name'};
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('.hmcts-identity-bar'));
    expect(main).toBeTruthy();
  });

  it('should have contained value', () => {
    component.content = { name: 'name'};
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('name');
  });

});
