import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
/*
* Gov Uk Checkbox Dumb Component responsible for
* displaying checkbox input and hint
*
* */
@Component({
  selector: 'lib-gov-checkbox',
  templateUrl: './gov-uk-checkbox.component.html'
})

export class GovUkCheckboxComponent implements OnInit {
  constructor() { }
  @Input() public group: FormGroup;
  @Input() public config: {value: string, label: string, hint: string; name: string; focusOn: string; id: string; classes: string};

  public id: string;
/**
* ngOnInIt
 * needed to manage the focus id if passed on in config
 * si it can focus on element when user clicks on error message in the header.
* */
  public ngOnInit(): void {
    const id =  this.config.focusOn ? this.config.focusOn : this.config.value;
    this.config.id = id;
    this.config.classes = this.config.classes ?
      this.config.classes.concat(' govuk-checkboxes__label') : 'govuk-checkboxes__label';
  }
}
