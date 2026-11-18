import {Component, Input} from '@angular/core';
import { ErrorMessagesModel } from '../../models';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
/*
* Gov UK Error Message
* Responsible for displaying in-line error messages
* @prop config - obj with properties
* @prop errorMessage - all error bject with messages property that is arry of strings.
* */
@Component({
    selector: ' xuilib-gov-uk-error-message',
    templateUrl: './gov-uk-error-message.component.html',
    standalone: false
})
export class GovUkErrorMessageComponent {
  constructor() { }
  @Input() public config: GovUiConfigModel;
  // { id: string };
  @Input() public errorMessage: ErrorMessagesModel;
}
