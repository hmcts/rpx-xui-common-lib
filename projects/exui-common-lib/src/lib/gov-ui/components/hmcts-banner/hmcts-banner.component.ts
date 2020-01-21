import {Component, Input} from '@angular/core';

/*
* Hmcts Banner
* Responsible for displaying prominent message and related actions
* @prop message to display
* @prop type
* */
@Component({
  selector: 'xuilib-hmcts-banner',
  templateUrl: './hmcts-banner.component.html'
})
export class HmctsBannerComponent {
  constructor() { }
  @Input() public type: string;
  @Input() public message: string;
}
