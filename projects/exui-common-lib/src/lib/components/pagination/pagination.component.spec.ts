import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationComponent, RpxTranslateMockPipe ],
      imports: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a previousPage event when "Previous page" is clicked', () => {
    spyOn(component, 'onPrevious').and.callThrough();
    spyOn(component.previousPage, 'emit');
    // First record needs to be greater than 1 to display the "Previous page" link
    component.firstRecord = 2;
    fixture.detectChanges();
    const event = { preventDefault: jasmine.createSpy('preventDefault') };
    fixture.debugElement.query(By.css('a[rel="prev"]')).triggerEventHandler('click', event);
    expect(component.onPrevious).toHaveBeenCalled();
    expect(component.previousPage.emit).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should emit a nextPage event when "Next page" is clicked', () => {
    spyOn(component, 'onNext').and.callThrough();
    spyOn(component.nextPage, 'emit');
    // "More items" needs to be true to display the "Next page" link
    component.moreItems = true;
    fixture.detectChanges();
    const event = { preventDefault: jasmine.createSpy('preventDefault') };
    fixture.debugElement.query(By.css('a[rel="next"]')).triggerEventHandler('click', event);
    expect(component.onNext).toHaveBeenCalled();
    expect(component.nextPage.emit).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should omit "Previous page" if first record is less than or equal to 1', () => {
    component.firstRecord = 1;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.govuk-pagination__prev'))).toBeNull();
    expect(fixture.debugElement.query(By.css('a[rel="prev"]'))).toBeNull();
  });

  it('should omit "Next page" if "more items" is false', () => {
    component.moreItems = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.govuk-pagination__next'))).toBeNull();
    expect(fixture.debugElement.query(By.css('a[rel="next"]'))).toBeNull();
  });

  it('should show a pointer cursor on both links, because each one has an href (as GOV.UK does)', () => {
    component.firstRecord = 2;
    component.moreItems = true;
    fixture.detectChanges();
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a.govuk-pagination__link'));
    expect(links.length).toBe(2);
    links.forEach((link) => {
      expect(link.hasAttribute('href')).toBeTrue();
      expect(getComputedStyle(link).cursor).toBe('pointer');
    });
  });

  it('should place the arrow before the title on both links (GOV.UK v6 block variant)', () => {
    component.firstRecord = 2;
    component.moreItems = true;
    fixture.detectChanges();
    const nav = fixture.debugElement.query(By.css('nav.govuk-pagination.govuk-pagination--block'));
    expect(nav).toBeTruthy();
    ['prev', 'next'].forEach((type) => {
      const link: HTMLElement = fixture.debugElement.query(By.css(`a[rel="${type}"]`)).nativeElement;
      expect(link.firstElementChild.classList).toContain(`govuk-pagination__icon--${type}`);
      expect(link.lastElementChild.classList).toContain('govuk-pagination__link-title--decorated');
    });
  });
});
