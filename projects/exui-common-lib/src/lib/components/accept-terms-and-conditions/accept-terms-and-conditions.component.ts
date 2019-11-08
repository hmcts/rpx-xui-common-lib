import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TCDocument } from '../../models';

@Component({
  selector: 'xuilib-accept-terms-and-conditions',
  templateUrl: './accept-terms-and-conditions.component.html',
  styleUrls: ['./accept-terms-and-conditions.component.scss']
})
export class AcceptTermsAndConditionsComponent {

  @Input() public document: TCDocument;

  @Output() public accept = new EventEmitter<void>();

  constructor() { }

  public onClick(): void {
    this.accept.emit();
  }
}
