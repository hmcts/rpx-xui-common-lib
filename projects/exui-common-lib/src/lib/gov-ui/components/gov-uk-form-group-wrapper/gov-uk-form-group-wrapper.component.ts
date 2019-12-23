import {Component, Input} from '@angular/core';
/*
* Gov Uk Form Group Wrapper
* Used to wrap group form elements in html tags below such as
* gov-uk-checkboxes and radio buttons
* and errorMessage messages
* */
@Component({
  selector: 'xuilib-gov-uk-form-group-wrapper',
  templateUrl: './gov-uk-form-group-wrapper.component.html'
})
export class GovUkFormGroupWrapperComponent {
  constructor() { }
  @Input() public error: {isInvalid: boolean; messages: string}; // todo add interface
  @Input() public group: string;
  @Input() public config: {hint: string; legend: string, key: string, isHeading: boolean;}; // TODO create a global interface

}

