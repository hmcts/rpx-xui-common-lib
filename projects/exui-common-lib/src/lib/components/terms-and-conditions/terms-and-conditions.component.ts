import { Component, Input } from '@angular/core';
import { TCDocument } from '../../models';

@Component({
  selector: 'xuilib-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent {

  @Input() public document: TCDocument;

  constructor() { }

}
