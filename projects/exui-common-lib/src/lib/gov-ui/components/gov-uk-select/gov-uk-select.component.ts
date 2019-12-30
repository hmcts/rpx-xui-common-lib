import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { ErrorMessagesModel } from '../../models';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper';
/*
* Gov Uk Select Dumb Component responsible for
* dropdown input.
* */
@Component({
  selector: 'xuilib-gov-select',
  templateUrl: './gov-uk-select.component.html'
})
export class GovUkSelectComponent {
  constructor() {}
  @Input() public errorMessage: ErrorMessagesModel;
  @Input() public group: FormGroup;
  @Input() public config: GovUiConfigModel;
  // {hint: string; name: string; id: string,  isPageHeading: boolean, classes: string };
  @Input() public items: {label: string, value: string; id: string}[];

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }

}
