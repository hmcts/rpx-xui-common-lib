import {Component, Input} from '@angular/core';
import { ErrorMessagesModel } from '../../models';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper';
/*
* Gov Uk Fieldset Component
* Used to wrap group fieldset elements
* it can conditionally display h1 tag
* @param config
* @param isHeading
* @param errorMessage - used for aria tag
* */
@Component({
    selector: 'xuilib-gov-uk-fieldset',
    templateUrl: './gov-uk-fieldset.component.html',
    standalone: false
})
export class GovUkFieldsetComponent {
  constructor() { }
  @Input() public config: GovUiConfigModel;
  // {legend: string; classes: string, id: string, hint: string, key: string, isPageHeading: boolean};
  // @Input() public isPageHeading: boolean;
  @Input() public errorMessage: ErrorMessagesModel;

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
