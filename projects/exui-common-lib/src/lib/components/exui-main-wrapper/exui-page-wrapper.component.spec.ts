import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiPageWrapperComponent } from './exui-page-wrapper.component';

@Pipe({
  name: 'rpxTranslate',
  standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ExuiPageWrapperComponent', () => {
  let component: ExuiPageWrapperComponent;
  let fixture: ComponentFixture<ExuiPageWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ExuiPageWrapperComponent, RpxTranslateMockPipe],
      imports: [RouterTestingModule],
      providers: []
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

  it('does not render a back link when backLink is not supplied', () => {
    expect(fixture.debugElement.query(By.css('.govuk-back-link'))).toBeNull();
  });

  it('does not render a heading when title is not supplied', () => {
    expect(fixture.debugElement.query(By.css('.govuk-heading-xl'))).toBeNull();
  });

  it('binds the exact backLink value to the router link', () => {
    component.backLink = '/case-list';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.govuk-back-link').getAttribute('href')).toBe('/case-list');
  });

  it('does not render a functional caption without a title', () => {
    component.fnTitle = 'Caption without heading';
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.govuk-caption-xl'))).toBeNull();
  });
});
