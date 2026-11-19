import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'xuilib-hmcts-pagination',
    templateUrl: './hmcts-pagination.component.html',
    styleUrls: ['./hmcts-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
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

}
