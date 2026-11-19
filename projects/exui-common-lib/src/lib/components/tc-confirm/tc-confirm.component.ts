import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'xuilib-tc-confirm',
    templateUrl: './tc-confirm.component.html',
    styleUrls: ['./tc-confirm.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TcConfirmComponent {

  @Input() public buttonText: string;
  @Output() public confirm = new EventEmitter<void>();

  constructor() {}

  public onClick(): void {
    this.confirm.emit();
  }

}
