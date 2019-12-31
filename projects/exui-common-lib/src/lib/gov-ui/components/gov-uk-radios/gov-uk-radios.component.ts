import {Component, Input} from '@angular/core';
import { ErrorMessagesModel } from '../../models';
import {CheckboxesModel} from '../../models/checkboxes-model';
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

  @Input() public options: CheckboxesModel;
  @Input() public errors: ErrorMessagesModel;

}
