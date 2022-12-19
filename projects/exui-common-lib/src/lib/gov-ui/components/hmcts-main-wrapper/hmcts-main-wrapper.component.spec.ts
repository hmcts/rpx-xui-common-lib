import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsMainWrapperComponent } from './hmcts-main-wrapper.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsMainWrapperComponent', () => {
  let component: HmctsMainWrapperComponent;
  let fixture: ComponentFixture<HmctsMainWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsMainWrapperComponent, RpxTranslationMockPipe ],
      imports: [
        RouterTestingModule
      ],
      providers: []
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
