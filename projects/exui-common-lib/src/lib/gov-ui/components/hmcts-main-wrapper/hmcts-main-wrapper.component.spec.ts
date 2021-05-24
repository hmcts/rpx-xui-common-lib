import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsMainWrapperComponent } from './hmcts-main-wrapper.component';

describe('HmctsMainWrapperComponent', () => {
  let component: HmctsMainWrapperComponent;
  let fixture: ComponentFixture<HmctsMainWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsMainWrapperComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsMainWrapperComponent);
    component = fixture.componentInstance;
    component.backLink = 'back';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the govuk-main-wrapper element', () => {
    const main = fixture.debugElement.query(By.css('.govuk-main-wrapper'));
    expect(main).toBeTruthy();
  });

  it('should have the back link when the backlink is available', () => {
    const back = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(back).toBeTruthy();
  });

  it('should have the title when title value is assigned', () => {
    component.title = 'title';
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title).toBeTruthy();
  });

});
