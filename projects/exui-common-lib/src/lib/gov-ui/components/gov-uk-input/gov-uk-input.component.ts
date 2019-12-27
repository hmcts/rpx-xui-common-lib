import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { ErrorMessagesModel } from '../../models';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper'
/*
* Gov UK Input component
* Responsible for displaying input, hint and error messages
* @prop errorMessages - array of messages
* @prop focusOn - passing the FormGroup
* @prop config - adding configuration
* */
@Component({
  selector: 'xuilib-gov-uk-input',
  templateUrl: './gov-uk-input.component.html'
})
export class GovUkInputComponent implements OnInit {
  constructor() { }
  @Input() public errorMessage: ErrorMessagesModel;
  @Input() public group: FormGroup;
  @Input() public config: { label: string, hint: string; name: string; id: string, type: string; isPageHeading: boolean, classes: string };

  public ngOnInit(): void {
    this.config.classes = 'govuk-label--m';
  }

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
