import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
      declarations: [ ExuiPageWrapperComponent, RpxTranslateMockPipe ],
      imports: [],
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
});
