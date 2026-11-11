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
    const results = fixture.nativeElement.querySelector('.hmcts-pagination__results').textContent.replace(/\s+/g, ' ').trim();

    expect(results).toContain('Showing 1 to 10 of 25 results');
    expect(fixture.nativeElement.querySelector('.hmcts-pagination__item--prev a')).toBeNull();
    expect(fixture.nativeElement.querySelector('.hmcts-pagination__item--next a')).not.toBeNull();
  });

  it('renders the updated range and previous link on a later page', () => {
    paginationService.setCurrentPage('test-pagination', 2);
    fixture.detectChanges();

    const results = fixture.nativeElement.querySelector('.hmcts-pagination__results').textContent.replace(/\s+/g, ' ').trim();
    expect(results).toContain('Showing 11 to 20 of 25 results');
    expect(fixture.nativeElement.querySelector('.hmcts-pagination__item--prev a')).not.toBeNull();
  });

  it('hides page number links when showPageNumbers is false', () => {
    component.showPageNumbers = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll(
      '.hmcts-pagination__item:not(.hmcts-pagination__item--prev):not(.hmcts-pagination__item--next)'
    ).length).toBe(0);
  });

  it('hides the result count when showResultCount is false', () => {
    component.showResultCount = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.hmcts-pagination__results')).toBeNull();
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
});
