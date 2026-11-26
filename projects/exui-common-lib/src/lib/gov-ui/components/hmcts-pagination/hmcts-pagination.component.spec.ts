import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule, PaginationControlsDirective, PaginationService } from 'ngx-pagination';
import { HmctsPaginationComponent } from './hmcts-pagination.component';

@Pipe({
  name: 'rpxTranslate',
  standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsPaginationComponent', () => {
  let component: HmctsPaginationComponent;
  let fixture: ComponentFixture<HmctsPaginationComponent>;
  let paginationService: PaginationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxPaginationModule],
      declarations: [HmctsPaginationComponent, RpxTranslateMockPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    paginationService = TestBed.inject(PaginationService);
    paginationService.register({
      id: 'test-pagination',
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 25
    });
    fixture = TestBed.createComponent(HmctsPaginationComponent);
    component = fixture.componentInstance;
    component.id = 'test-pagination';
    fixture.detectChanges();
  });

  function paginationControls(): PaginationControlsDirective {
    return fixture.debugElement.query(By.directive(PaginationControlsDirective)).injector
      .get(PaginationControlsDirective);
  }

  it('creates with the documented default inputs', () => {
    expect(component.maxSize).toBe(7);
    expect(component.pageSize).toBe(10);
    expect(component.showPageNumbers).toBeTrue();
    expect(component.showResultCount).toBeTrue();
  });

  it('passes the pagination id and maximum size to the pagination directive', () => {
    component.maxSize = 5;
    fixture.detectChanges();

    expect(paginationControls().id).toBe('test-pagination');
    expect(paginationControls().maxSize).toBe(5);
  });

  it('renders the current result range and navigation links', () => {
    const results = fixture.nativeElement.querySelector('[data-pagination-results]').textContent.replace(/\s+/g, ' ').trim();

    expect(results).toContain('Showing 1 to 10 of 25 results');
    expect(fixture.nativeElement.querySelector('.govuk-pagination__prev a')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-pagination__next a')).not.toBeNull();
  });

  it('renders the updated range and previous link on a later page', () => {
    paginationService.setCurrentPage('test-pagination', 2);
    fixture.detectChanges();

    const results = fixture.nativeElement.querySelector('[data-pagination-results]').textContent.replace(/\s+/g, ' ').trim();
    expect(results).toContain('Showing 11 to 20 of 25 results');
    expect(fixture.nativeElement.querySelector('.govuk-pagination__prev a')).not.toBeNull();
  });

  it('hides page number links when showPageNumbers is false', () => {
    component.showPageNumbers = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.govuk-pagination__item').length).toBe(0);
    expect(fixture.nativeElement.querySelector('nav.govuk-pagination--block')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-pagination__next a .govuk-pagination__link-title--decorated'))
      .not.toBeNull();
  });

  it('hides the result count when showResultCount is false', () => {
    component.showResultCount = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-pagination-results]')).toBeNull();
  });

  it('forwards a page change with its exact page number', () => {
    spyOn(component.pageChange, 'emit');

    paginationControls().setCurrent(3);

    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('forwards a page bounds correction with its exact page number', () => {
    spyOn(component.pageBoundsCorrection, 'emit');

    paginationControls().pageBoundsCorrection.emit(2);

    expect(component.pageBoundsCorrection.emit).toHaveBeenCalledWith(2);
  });
  /** Clicks the element and returns whether the default (href="#") navigation was prevented. */
  function click(selector: string): boolean {
    const event = new MouseEvent('click', { cancelable: true });
    fixture.nativeElement.querySelector(selector).dispatchEvent(event);
    fixture.detectChanges();
    return event.defaultPrevented;
  }

  it('renders GOV.UK v6 pagination markup with the current page marked', () => {
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav.govuk-pagination');
    expect(nav).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
    expect(nav.classList).not.toContain('govuk-pagination--block');

    const items = fixture.nativeElement.querySelectorAll('.govuk-pagination__item');
    expect(items.length).toBe(3);
    const current: HTMLElement = fixture.nativeElement.querySelector('.govuk-pagination__item--current a');
    expect(current.textContent.trim()).toBe('1');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.getAttribute('aria-label')).toBe('Page 1');
    expect(fixture.nativeElement.querySelectorAll('[aria-current]').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.hmcts-pagination')).toBeNull();
  });

  it('shows a pointer cursor on every link, because each one has an href (as GOV.UK does)', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('.govuk-pagination__link'));
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.hasAttribute('href')).toBeTrue();
      expect(getComputedStyle(link).cursor).toBe('pointer');
    });
  });

  it('renders an ellipsis item, not a link, when pages are truncated', () => {
    paginationService.register({ id: 'many-pages', itemsPerPage: 10, currentPage: 1, totalItems: 200 });
    fixture = TestBed.createComponent(HmctsPaginationComponent);
    fixture.componentInstance.id = 'many-pages';
    fixture.componentInstance.maxSize = 5;
    fixture.detectChanges();

    const ellipsis: HTMLElement = fixture.nativeElement.querySelector('.govuk-pagination__item--ellipsis');
    expect(ellipsis).not.toBeNull();
    expect(ellipsis.querySelector('a')).toBeNull();
    expect(ellipsis.textContent.trim()).toBe('⋯'); // &ctdot;
  });

  it('moves one page per click on next/previous and prevents the default navigation', () => {
    paginationService.setCurrentPage('test-pagination', 2);
    fixture.detectChanges();
    spyOn(component.pageChange, 'emit');

    expect(click('.govuk-pagination__next a')).toBeTrue();
    expect(component.pageChange.emit).toHaveBeenCalledOnceWith(3);

    expect(click('.govuk-pagination__prev a')).toBeTrue();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    expect(component.pageChange.emit).toHaveBeenCalledTimes(2);
  });

  it('changes page when a page number is clicked, but not when the current page is clicked', () => {
    spyOn(component.pageChange, 'emit');

    click('.govuk-pagination__item--current a');
    expect(component.pageChange.emit).not.toHaveBeenCalled();

    const links = fixture.nativeElement.querySelectorAll('.govuk-pagination__item a');
    links[2].dispatchEvent(new MouseEvent('click', { cancelable: true }));
    expect(component.pageChange.emit).toHaveBeenCalledOnceWith(3);
  });

  it('does not render the navigation when there is only one page', () => {
    paginationService.register({ id: 'single-page', itemsPerPage: 10, currentPage: 1, totalItems: 5 });
    fixture = TestBed.createComponent(HmctsPaginationComponent);
    fixture.componentInstance.id = 'single-page';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-pagination-results]').textContent.replace(/\s+/g, ' '))
      .toContain('Showing 1 to 5 of 5 results');
  });
});
