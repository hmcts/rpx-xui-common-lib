import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';

import { BadgeColour, SECONDS_IN_A_DAY } from '../../models/due-date.model';

@Component({
  selector: 'xuilib-due-date',
  templateUrl: 'due-date.component.html',
  styleUrls: ['due-date.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DueDateComponent implements OnChanges {

  /**
   * The due date to use as the basis for rendering this component. It is
   * compared to the current date and displayed accordingly.
   */
  @Input() public dueDate: Date;

  /**
   * This should be considered HIGH urgency if there are fewer than this
   * many days until the due date.
   *    * Set to 0 if you want it to show HIGH if it was due yesterday.
   *    * Set to 1 if you want it to show HIGH if it's due today.
   *    * Set to 2 if you want it to show HIGH if it's due tomorrow.
   *
   * Defaults to 0 (ZERO), which means it won't show as HIGH urgency until the
   * due date is in the past.
   *
   * NOTE: If this is higher than the mediumUrgencyCutoff value, MEDIUM urgency
   * will never be shown.
   *
   * ALSO NOTE: Anything overdue is automatically considered HIGH urgency.
   */
  @Input() public highUrgencyCutoff: number = 0; // Default

  /**
   * This should be considered MEDIUM urgency if there are fewer than this
   * many days until the due date.
   *    * Set to 1 if you want it to show MEDIUM if it's due today.
   *    * Set to 2 if you want it to show MEDIUM if it's due tomorrow.
   *    * Set to 3 if you want it to show MEDIUM if it's due the day after tomorrow.
   *
   * Defaults to 2, which means it won't show as MEDIUM urgency unless the
   * due date is today or tomorrow.
   *
   * NOTE: If this is lower than the highUrgencyCutoff value, MEDIUM urgency
   * will never be shown.
   */
  @Input() public mediumUrgencyCutoff: number = 2;

  // The HMCTS badge class, used for colouration.
  private pBadge: string;
  public get badge(): string {
    return this.pBadge;
  }

  // The textual label to display in the component.
  private pLabel: string;
  public get label(): string {
    return this.pLabel;
  }

  // The accessible label, which is also used for the tooltip.
  private pAccessibleLabel: string;
  public get accessibleLabel(): string {
    return this.pAccessibleLabel;
  }

  // How many days the dueDate varies from today.
  private pDaysDiff: number;
  public get daysDiff(): number {
    return this.pDaysDiff;
  }

  // Catch any changes to any of the Input() properties.
  public ngOnChanges(): void {
    this.handleInputChanges();
  }

  // Set up the label, urgency class, and accessibility fields.
  private handleInputChanges() {
    // If we don't have a dueDate, skip out of here.
    if (!this.dueDate) {
      return;
    }

    // How many days from today is the due date?
    // Already happened means daysDiff > 0;
    // Today means daysDiff = 0;
    // Yet to come means daysDiff < 0;
    this.pDaysDiff = this.getDaysDifference(this.dueDate, new Date());

    // Is it overdue?
    if (this.daysDiff > 0) {
      this.pBadge = BadgeColour.RED;
      const daysLabel = this.daysDiff === 1 ? 'day' : 'days';
      this.pLabel = `+${this.daysDiff} ${daysLabel}`;
      this.pAccessibleLabel = `This task is ${this.daysDiff} ${daysLabel} past its due date`;
    } else {
      // Special label for "Today".
      if (this.daysDiff === 0) {
        this.pLabel = 'TODAY';
        this.pAccessibleLabel = 'This task is due to be completed today';
      } else {
        this.pLabel = `${formatDate(this.dueDate, 'd MMM', 'en-GB')}`;
        this.pAccessibleLabel = `This task is due to be completed by ${formatDate(this.dueDate, 'd MMMM y', 'en-GB')}`;
      }
      if (this.daysDiff + this.highUrgencyCutoff > 0) {
        this.pBadge = BadgeColour.RED;
      } else if (this.daysDiff + this.mediumUrgencyCutoff > 0) {
        this.pBadge = BadgeColour.ORANGE;
      } else {
        this.pBadge = BadgeColour.GREEN;
      }
    }
  }

  // This will return the difference between two dates.
  // If fromDate is BEFORE toDate, it will be a positive number.
  // If fromDate is AFTER toDate, it will be a negative number.
  private getDaysDifference(fromDate: Date, toDate: Date): number {
    const fromEpoch = fromDate.getTime();
    const toEpoch = toDate.getTime();
    const diffSecs = Math.floor((toEpoch - fromEpoch) / 1000);
    return Math.floor(diffSecs / SECONDS_IN_A_DAY);
  }
}
