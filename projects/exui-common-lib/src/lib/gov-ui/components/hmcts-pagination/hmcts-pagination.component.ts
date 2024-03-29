import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xuilib-hmcts-pagination',
  templateUrl: './hmcts-pagination.component.html',
  styleUrls: ['./hmcts-pagination.component.scss']
})
export class HmctsPaginationComponent {

  @Input() public id: string;
  @Input() public maxSize: number = 7;
  @Input() public pageSize: number = 10;
  @Input() public showPageNumbers: boolean = true;
  @Input() public showResultCount: boolean = true;
  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() public pageBoundsCorrection: EventEmitter<number> = new EventEmitter<number>();

}
