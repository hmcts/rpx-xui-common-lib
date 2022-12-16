import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DateBadgeColour } from '../../models/due-date.model';
import { DueDateComponent } from './due-date.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('DueDateComponent', () => {
  let component: DueDateComponent;
  let fixture: ComponentFixture<DueDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DueDateComponent, RpxTranslationMockPipe ],
      imports: [],
      providers: []
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(DueDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show if there is a dueDate set', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    component.dueDate = new Date();
    component.highUrgencyCutoff = 1;
    component.mediumUrgencyCutoff = 3;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeDefined();
  });

  it('should do no setup if there is no dueDate', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    expect(component.label).toBeUndefined();
    expect(component.badge).toBeUndefined();
    component.highUrgencyCutoff = 1; // Change from the default of 0.
    component.mediumUrgencyCutoff = 3; // Change from the default of 2.
    component.ngOnChanges();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeDefined();
    expect(component.label).toBeUndefined();
    expect(component.badge).toBeUndefined();
  });

  it('should setup correctly for TODAY', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    component.dueDate = new Date();
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.label).toBe('TODAY');
    expect(component.accessibleLabel).toBe('This task is due to be completed today');
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');
    expect(element.textContent.trim()).toBe('TODAY');
    expect(element.getAttribute('aria-label')).toBe('This task is due to be completed today');

    // Default for TODAY is MEDIUM urgency.
    expect(component.badge).toBe(DateBadgeColour.ORANGE);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.ORANGE);
  });

  it('should setup correctly for due date of yesterday', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    const YESTERDAY: Date = new Date();
    YESTERDAY.setDate(YESTERDAY.getDate() - 1); // Due yesterday
    component.dueDate = YESTERDAY;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.label).toBe('+1 day');
    expect(component.accessibleLabel).toBe('This task is 1 day past its due date');
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');
    expect(element.textContent.trim()).toBe('+1 day'); // Uppercased by the badge.
    expect(element.getAttribute('aria-label')).toBe('This task is 1 day past its due date');

    // Overdue so definitely "HIGH" urgency.
    expect(component.badge).toBe(DateBadgeColour.RED);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.RED);
  });

  it('should setup correctly for due date of 3 days ago', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    const THREE_DAYS_AGO: Date = new Date();
    THREE_DAYS_AGO.setDate(THREE_DAYS_AGO.getDate() - 3); // Due 3 days ago
    component.dueDate = THREE_DAYS_AGO;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.label).toBe('+3 days');
    expect(component.accessibleLabel).toBe('This task is 3 days past its due date');
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');
    expect(element.textContent.trim()).toBe('+3 days'); // Uppercased by the badge.
    expect(element.getAttribute('aria-label')).toBe('This task is 3 days past its due date');

    // Overdue so definitely "HIGH" urgency.
    expect(component.badge).toBe(DateBadgeColour.RED);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.RED);
  });

  it('should setup correctly for tomorrow', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    const TOMORROW: Date = new Date();
    TOMORROW.setDate(TOMORROW.getDate() + 1); // Due tomorrow
    component.dueDate = TOMORROW;
    component.ngOnChanges();
    fixture.detectChanges();
    const EXPECTED_LABEL: string = formatDate(TOMORROW, 'd MMM', 'en-GB');
    expect(component.label).toBe(EXPECTED_LABEL);
    const EXPECTED_ACCESSIBLE_LABEL: string = `This task is due to be completed by ${formatDate(TOMORROW, 'd MMMM y', 'en-GB')}`;
    expect(component.accessibleLabel).toBe(EXPECTED_ACCESSIBLE_LABEL);
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');
    expect(element.textContent.trim()).toBe(EXPECTED_LABEL); // Uppercased by the badge.
    expect(element.getAttribute('aria-label')).toBe(EXPECTED_ACCESSIBLE_LABEL);

    // Default for MEDIUM urgency is 2, which means tomorrow is MEDIUM.
    expect(component.badge).toBe(DateBadgeColour.ORANGE);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.ORANGE);
  });

  it('should setup correctly for the day after tomorrow', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    const DAY_AFTER_TOMORROW: Date = new Date();
    DAY_AFTER_TOMORROW.setDate(DAY_AFTER_TOMORROW.getDate() + 2); // Due tomorrow
    component.dueDate = DAY_AFTER_TOMORROW;
    component.ngOnChanges();
    fixture.detectChanges();
    const EXPECTED_LABEL: string = formatDate(DAY_AFTER_TOMORROW, 'd MMM', 'en-GB');
    expect(component.label).toBe(EXPECTED_LABEL);
    const EXPECTED_ACCESSIBLE_LABEL: string = `This task is due to be completed by ${formatDate(DAY_AFTER_TOMORROW, 'd MMMM y', 'en-GB')}`;
    expect(component.accessibleLabel).toBe(EXPECTED_ACCESSIBLE_LABEL);
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');
    expect(element.textContent.trim()).toBe(EXPECTED_LABEL); // Uppercased by the badge.
    expect(element.getAttribute('aria-label')).toBe(EXPECTED_ACCESSIBLE_LABEL);

    // Default for MEDIUM urgency is 2, which means the day after tomorrow is LOW.
    expect(component.badge).toBe(DateBadgeColour.GREEN);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.GREEN);
  });

  it('should handle updated highUrgencyCutoff for TODAY', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    component.dueDate = new Date();
    component.highUrgencyCutoff = 1; // Should include TODAY.
    component.ngOnChanges();
    fixture.detectChanges();
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');

    // Should make TODAY have a HIGH urgency.
    expect(component.highUrgencyCutoff).toBe(1);
    expect(component.badge).toBe(DateBadgeColour.RED);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.RED);

    // Set highUrgencyCutoff back to zero (default).
    component.highUrgencyCutoff = 0;
    component.ngOnChanges();
    fixture.detectChanges();

    // And make sure it's updated again.
    expect(component.highUrgencyCutoff).toBe(0);
    expect(component.badge).toBe(DateBadgeColour.ORANGE);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.ORANGE);
  });

  it('should handle updated mediumUrgencyCutoff for the day after tomorrow', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    const DAY_AFTER_TOMORROW: Date = new Date();
    DAY_AFTER_TOMORROW.setDate(DAY_AFTER_TOMORROW.getDate() + 2); // Due tomorrow
    component.dueDate = DAY_AFTER_TOMORROW;
    component.mediumUrgencyCutoff = 3;
    component.ngOnChanges();
    fixture.detectChanges();
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');

    // Should make the day after tomorrow have a MEDIUM urgency.
    expect(component.mediumUrgencyCutoff).toBe(3);
    expect(component.badge).toBe(DateBadgeColour.ORANGE);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.ORANGE);

    // Set highUrgencyCutoff back to 2 (default).
    component.mediumUrgencyCutoff = 2;
    component.ngOnChanges();
    fixture.detectChanges();

    // Should go back to LOW urgency.
    expect(component.badge).toBe(DateBadgeColour.GREEN);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.GREEN);
  });

  it('should handle an update to dueDate', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.due-date')).toBeNull();
    const TODAY: Date = new Date();
    component.dueDate = TODAY;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.label).toBe('TODAY');
    expect(component.accessibleLabel).toBe('This task is due to be completed today');
    const element: HTMLElement = fixture.debugElement.nativeElement.querySelector('.due-date');
    expect(element.textContent.trim()).toBe('TODAY');
    expect(element.getAttribute('aria-label')).toBe('This task is due to be completed today');

    // Default for TODAY is MEDIUM urgency.
    expect(component.badge).toBe(DateBadgeColour.ORANGE);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.ORANGE);

    // Now change the dueDate to make it overdue.
    TODAY.setDate(TODAY.getDate() - 1);
    component.dueDate = TODAY;
    component.ngOnChanges();
    fixture.detectChanges();

    // The labels should have changed, as should the badge and urgency.
    expect(component.label).toBe('+1 day');
    expect(component.accessibleLabel).toBe('This task is 1 day past its due date');
    expect(element.textContent.trim()).toBe('+1 day'); // Uppercased by the badge.
    expect(element.getAttribute('aria-label')).toBe('This task is 1 day past its due date');

    // Overdue so definitely "HIGH" urgency.
    expect(component.badge).toBe(DateBadgeColour.RED);
    expect(element.getAttribute('class')).toContain(DateBadgeColour.RED);
  });
});
