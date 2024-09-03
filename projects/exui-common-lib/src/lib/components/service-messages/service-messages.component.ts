import { Component, Input, OnInit } from '@angular/core';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';
import { ServiceMessages } from '../../models/service-message.model';


@Component({
  selector: 'xuilib-service-messages',
  templateUrl: './service-messages.component.html'
})
export class ServiceMessagesComponent implements OnInit {
  public hiddenBanners: string[];
  public filteredMessages: ServiceMessages[] = [];
  public isBannerError: boolean;
  public bannerErrorMsgs: { message: string, index: number }[] = [];
  public originalMessages: ServiceMessages[] = [];

  @Input() public userRoles: string[];
  @Input() public featureToggleKey: string;
  @Input() public serviceMessageCookie: string;

  constructor(private readonly featureToggleService: FeatureToggleService) { }

  public ngOnInit() {
    this.getServiceMessages();
  }

  public getServiceMessages(): void {
    this.featureToggleService.getValue<ServiceMessages[]>(this.featureToggleKey, null)
      .subscribe(messages => {
        this.originalMessages = messages;
        if (!!messages) {
          this.createFilteredMessages(messages);
        }
      });
  }

  private createFilteredMessages(messages: ServiceMessages[]): void {
    this.hiddenBanners = JSON.parse(window.sessionStorage.getItem(this.serviceMessageCookie)) || [];

    messages.forEach(key => {
      const regEx = new RegExp(key.roles);
      if (this.userRoles.some(e => regEx.test(e))) {
        this.filteredMessages = messages.filter(msg => !this.hiddenBanners.includes(msg.message_en)
          && this.compareDates(msg));
      }
    });
  }

  private compareDates(msg: ServiceMessages): boolean {
    let currentDateTime = new Date();
    let beginDate: Date | null = null;
    let endDate: Date | null = null;
    this.bannerErrorMsgs = [];

    // Parse beginDate if msg.begin is present and valid
    if (msg.begin && !isNaN(Date.parse(msg.begin))) {
      beginDate = new Date(msg.begin);
    }

    if (msg.end && !isNaN(Date.parse(msg.end))) {
      endDate = new Date(msg.end);
    }
    this.originalMessages.forEach(msg => {
      // Only check for errors if both beginDate and endDate are present and valid
      if ((msg.begin && !isNaN(Date.parse(msg.end))) && (msg.end && !isNaN(Date.parse(msg.end))) && new Date(msg.begin) > new Date(msg.end)) {
        this.isBannerError = true;
        this.bannerErrorMsgs.push({
          message: `The start date is greater than the end date. Message index: ${msg.index}`,
          index: msg.index
        });
      }
      
      // Check for invalid beginDate or endDate separately, if they are present
      if (msg.begin && isNaN(Date.parse(msg.begin))) {
        this.isBannerError = true;
        this.bannerErrorMsgs.push({
          message: `Invalid start date. Message index: ${msg.index}`,
          index: msg.index
        });
      }
      if (msg.end && isNaN(Date.parse(msg.end))) {
        this.isBannerError = true;
        this.bannerErrorMsgs.push({
          message: `Invalid end date. Message index: ${msg.index}`,
          index: msg.index
        });
      }
    });

    const beginDateOK = !msg.begin || (beginDate && beginDate < currentDateTime);
    const endDateOK = !msg.end || (endDate && endDate >= currentDateTime);

    return beginDateOK && endDateOK;
  }

  public hideMessage(msg: ServiceMessages): void {
    this.filteredMessages = this.filteredMessages.filter(f => f.index !== msg.index)
    this.hiddenBanners.push(msg.message_en);
    window.sessionStorage.setItem(this.serviceMessageCookie, JSON.stringify(this.hiddenBanners));
  }
}
