import {Component, Input} from '@angular/core';
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
  templateUrl: './gov-uk-fieldset.component.html'
})
export class GovUkFieldsetComponent {
  constructor() { }
  @Input() public config: {legend: string; classes: string, id: string, hint: string, key: string};
  @Input() public isHeading: boolean;
  @Input() public errorMessage: string[];

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
