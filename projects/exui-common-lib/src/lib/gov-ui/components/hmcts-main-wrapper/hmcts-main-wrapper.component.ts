import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HmctsBannerInfo } from '../hmcts-banner/hmcts-banner-info.interface';
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
    templateUrl: './hmcts-main-wrapper.component.html',
    standalone: false
})
export class HmctsMainWrapperComponent implements OnInit {
  public bannerData: HmctsBannerInfo;

  @Input() public backLink: string;
  @Input() public title: string;
  @Input() public summaryErrors: {header: string; isFromValid: boolean; items: { id: string; message: any; }[]};
  @Input() public set banner(value: HmctsBannerInfo) {
    this.bannerData = value;
  }
  @Input() public actionButtons: {name: string, class: string, action(): {}}[];
  @Input() public showWarningMessage: boolean;

  @Output() public backEvent = new EventEmitter<void>();
  public hasBackLink: boolean;

  constructor() {
  }

  public ngOnInit() {
    this.hasBackLink = this.backLink !== undefined || this.backEvent.observers.length > 0;
  }

  public onGoBack() {
    this.backEvent.emit();
  }
}
