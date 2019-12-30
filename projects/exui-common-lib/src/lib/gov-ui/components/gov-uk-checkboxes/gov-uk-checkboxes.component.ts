import {Component, Input} from '@angular/core';
import { ErrorMessagesModel } from '../../models';
import {CheckboxesModel} from '../../models/checkboxes-model';
/*
* CheckBox component - state less
* Responsible for displaying a list of gov-uk-checkboxes
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of error stings
* */
@Component({
  selector: 'xuilib-gov-uk-checkboxes',
  templateUrl: './gov-uk-checkboxes.component.html'
})

export class GovUkCheckboxesComponent {

  @Input() public options: CheckboxesModel;
  @Input() public errors: ErrorMessagesModel;

}
