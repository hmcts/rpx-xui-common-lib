import { Component, Input } from '@angular/core';
import { ErrorMessagesModel } from '../../models';
import { RadioButtonsModel } from '../../models/radio-buttons.model';
/*
* Radios component - state less
* Responsible for displaying a list of gov-uk-radio components
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of error stings
* */
@Component({
  selector: 'xuilib-gov-uk-radios',
  templateUrl: './gov-uk-radios.component.html'
})

export class GovUkRadiosComponent {

  @Input() public options: RadioButtonsModel;
  @Input() public errors: ErrorMessagesModel;

}
