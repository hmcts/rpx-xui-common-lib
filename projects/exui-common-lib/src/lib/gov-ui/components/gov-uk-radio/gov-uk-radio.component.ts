import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
/*
* Gov Uk Radio state-less  Component responsible for
* displaying radios input and hint
*
* */
@Component({
  selector: 'xuilib-gov-radio',
  templateUrl: './gov-uk-radio.component.html'
})
export class GovUkRadioComponent implements OnInit{
  constructor() { }
  @Input() public group: FormGroup;
  @Input() public config: GovUiConfigModel;
  // {value: string, label: string, hint: string; name: string; focusOn: string; id: string; classes: string}; // TODO create interface

  public id: string;
  /*
   * ngOnInIt
   * needed to manage the focus id if passed on in config
   * si it can focus on element when user clicks on error message in the header.
   **/
  public ngOnInit(): void {
    const id =  this.config.focusOn ? this.config.focusOn : this.config.value;
    this.config.id = id;
    this.config.classes = this.config.classes ?
      this.config.classes.concat(' govuk-radios__label') : 'govuk-radios__label';
  }

}
