import {Component, Input} from '@angular/core';

/*
* Gov UK Label component
* Responsible for displaying label tag
* @prop isPageHading - boolean to display h1
* @prop config - obj with properties
* */
@Component({
    selector: 'xuilib-gov-label',
    templateUrl: './gov-uk-label.component.html',
    styleUrls: ['./gov-uk-label.component.scss'],
    standalone: false
})
export class GovUkLabelComponent {
  constructor() { }
  @Input() public config: { label: string, name: string; id: string, isPageHeading: boolean, classes: string, optional?: string };

}
