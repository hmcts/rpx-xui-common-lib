import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorMessagesModel } from '../../models';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
import { HtmlTemplatesHelper } from '../../util/helpers/html-templates.helper';
/*
* Gov UK Input component
* Responsible for displaying input, hint and error messages
* @prop errorMessages - array of messages
* @prop focusOn - passing the FormGroup
* @prop config - adding configuration
* */
@Component({
  selector: 'xuilib-gov-uk-input',
  templateUrl: './gov-uk-input.component.html',
  styleUrls: ['./gov-uk-input.component.scss']
})
export class GovUkInputComponent implements OnInit {
  constructor() { }
  @Input() public errorMessage: ErrorMessagesModel;
  @Input() public group: FormGroup;
  @Input() public config: GovUiConfigModel;
  // { label: string, hint: string; name: string; id: string, type: string; isPageHeading: boolean, classes: string };

  public ngOnInit(): void {
    this.config.classes = typeof(this.config.classes) === 'string' ? this.config.classes : 'govuk-label govuk-label--m';
  }

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
