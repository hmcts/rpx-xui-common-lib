import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
/*
* Gov Uk Checkbox Dumb Component responsible for
* displaying checkbox input and hint
*
* */
@Component({
  selector: 'xuilib-gov-checkbox',
  templateUrl: './gov-uk-checkbox.component.html'
})

export class GovUkCheckboxComponent implements OnInit {
  constructor() { }
  @Input() public group: FormGroup;
  @Input() public config: GovUiConfigModel;
  @Input() public isChecked: boolean = false;
  // {value: string, label: string, hint: string; name: string; focusOn: string; id: string; classes: string};

  public id: string;

  public ngOnInit(): void {
    const id =  this.config.focusOn ? this.config.focusOn : this.config.value;
    this.config.id = id;
    this.config.classes = this.config.classes ?
      this.config.classes.concat(' govuk-checkboxes__label') : 'govuk-checkboxes__label';
  }
}
