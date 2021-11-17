import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xuilib-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() public moreItems: boolean;
  @Input() public firstRecord: number;
  @Output() public previousPage: EventEmitter<any> = new EventEmitter();
  @Output() public nextPage: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public onPrevious(): void {
    this.previousPage.emit(null);
  }

  public onNext(): void {
    this.nextPage.emit(null);
  }
}
