import {Component, Input} from '@angular/core';
import {CheckboxesModel} from '../../models/checkboxesModel';
/*
* Radios component - state less
* Responsible for displaying a list of gov-uk-radio components
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of error stings
* */
@Component({
  selector: 'lib-gov-uk-radios',
  templateUrl: './gov-uk-radios.component.html'
})
export class GovUkRadiosComponent {

  @Input() public options: CheckboxesModel;
  @Input() public errors: string[];

}
