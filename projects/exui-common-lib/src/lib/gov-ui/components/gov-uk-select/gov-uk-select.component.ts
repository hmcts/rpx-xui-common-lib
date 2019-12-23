import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
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
  @Input() public errorMessage: any;
  @Input() public group: FormGroup;
  @Input() public config: {hint: string; name: string; id: string,  sPageHeading: boolean, classes: string };
  @Input() public items: {label: string, value: string; id: string}[];

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }

}
