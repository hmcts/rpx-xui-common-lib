import {Component, Input} from '@angular/core';
import { ErrorMessagesModel } from '../../models';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
/*
* Gov Uk Form Group Wrapper
* Used to wrap group form elements in html tags below such as
* gov-uk-checkboxes and radio buttons
* and errorMessage messages
* */
@Component({
  selector: 'xuilib-gov-uk-form-group-wrapper',
  templateUrl: './gov-uk-form-group-wrapper.component.html'
})
export class GovUkFormGroupWrapperComponent {
  constructor() { }
  @Input() public error: ErrorMessagesModel;
  @Input() public group: string;
  @Input() public config: GovUiConfigModel;
  // {hint: string; legend: string, key: string, isPageHeading: boolean;}; // TODO create a global interface

}

