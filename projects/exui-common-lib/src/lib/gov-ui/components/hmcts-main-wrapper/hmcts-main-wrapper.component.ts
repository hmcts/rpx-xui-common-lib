import {Component, Input} from '@angular/core';
/*
* Main Content wrapper
* Responsible for:
 * Wrapping content within the gov-uk html elements bellow
 * @prop showBackLink - switch for back link
 * @prop title = title
 * @prop summaryErrors list of errors
* @prop back link, title (title), summaryErrors (array of errors)
* */
@Component({
  selector: 'xuilib-hmcts-main-wrapper',
  templateUrl: './hmcts-main-wrapper.component.html'
})
export class HmctsMainWrapperComponent  {

  @Input() public backLink: string;
  @Input() public title: string;
  @Input() public summaryErrors: {header: string; isFromValid: boolean; items: { id: string; message: any; }[]};

  constructor() { }

}
