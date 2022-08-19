import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { ExuiPageWrapperComponent } from './exui-page-wrapper.component';

describe('ExuiPageWrapperComponent', () => {
  let component: ExuiPageWrapperComponent;
  let fixture: ComponentFixture<ExuiPageWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ ExuiPageWrapperComponent ],
      imports: [
        RpxTranslationModule.forChild()
      ],
      providers: [
        RpxTranslationService, RpxTranslationConfig
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExuiPageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show back link', () => {
    component.backLink = '/back';
    fixture.detectChanges();
    const backLink = fixture.nativeElement.querySelectorAll('.govuk-back-link');
    expect(backLink.length).toEqual(1);
    expect(backLink[0].textContent).toEqual('Back');
  });

  it('should show title', () => {
    component.title = 'Share a case';
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelectorAll('.govuk-heading-xl');
    expect(title.length).toEqual(1);
    expect(title[0].textContent).toContain('Share a case');
  });

  it('should show functional title', () => {
    component.title = 'Share a case';
    component.fnTitle = 'Add recipient';
    fixture.detectChanges();
    const fntitle = fixture.nativeElement.querySelectorAll('.govuk-caption-xl');
    expect(fntitle.length).toEqual(1);
    expect(fntitle[0].textContent).toEqual('Add recipient');
  });
});
