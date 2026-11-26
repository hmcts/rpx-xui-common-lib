import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationControlsDirective } from 'ngx-pagination';

@Component({
  selector: 'xuilib-hmcts-pagination',
  templateUrl: './hmcts-pagination.component.html',
  styleUrls: ['./hmcts-pagination.component.scss'],
  standalone: false
})
export class HmctsPaginationComponent {
  @Input() public id: string;
  @Input() public maxSize: number = 7;
  @Input() public pageSize: number = 10;
  @Input() public showPageNumbers: boolean = true;
  @Input() public showResultCount: boolean = true;
  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() public pageBoundsCorrection: EventEmitter<number> = new EventEmitter<number>();

  public onPrevious(event: Event, api: PaginationControlsDirective): void {
    event.preventDefault();
    api.previous();
  }

  public onNext(event: Event, api: PaginationControlsDirective): void {
    event.preventDefault();
    api.next();
  }

  public onPage(event: Event, api: PaginationControlsDirective, page: number): void {
    event.preventDefault();
    if (api.getCurrent() !== page) {
      api.setCurrent(page);
    }
  }

  public firstItemOnPage(api: PaginationControlsDirective): number {
    return (api.getCurrent() * this.pageSize) - this.pageSize + 1;
  }

  public lastItemOnPage(api: PaginationControlsDirective): number {
    return Math.min(api.getCurrent() * this.pageSize, api.getTotalItems());
  }
}
