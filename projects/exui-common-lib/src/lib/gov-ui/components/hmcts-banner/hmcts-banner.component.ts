import { Component, Input } from '@angular/core';

@Component({
    selector: 'xuilib-hmcts-banner',
    templateUrl: './hmcts-banner.component.html',
    styleUrls: ['./hmcts-banner.component.scss'],
    standalone: false
})
export class HmctsBannerComponent {
  @Input() public message: string;
  @Input() public type: 'warning' | 'success' | 'information';
  @Input() public title?: string = '';
  @Input() public showMessageIcon?: boolean = false;
  @Input() public messageBoldText?: boolean = false;
}
