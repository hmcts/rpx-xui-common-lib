import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper';
/*
* CheckBox component - state less
* Responsible for displaying a list of gov-uk-checkboxes
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of errorMessage
* */
@Component({
  selector: 'lib-gov-uk-textarea',
  templateUrl: './gov-uk-textarea.component.html'
})
export class GovUkTextareaComponent {
  @Input() public config: {label: string; classes: string; hint: string; key: string; rows: number, id: string};
  @Input() public errorMessage: any;
  @Input() public group: FormGroup;

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }

}
