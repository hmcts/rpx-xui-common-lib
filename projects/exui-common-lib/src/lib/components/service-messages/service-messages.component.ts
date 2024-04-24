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
    let beginDate = null;
    let endDate = null;

    if (!isNaN(Date.parse(msg.begin))) {
      beginDate = new Date(msg.begin);
    }
    if (!isNaN(Date.parse(msg.end))) {
      endDate = new Date(msg.end);
    }

    const beginDateOK = !msg.begin || (beginDate && beginDate < currentDateTime);
    const endDateOK = !msg.end || (endDate && endDate >= currentDateTime);
    return beginDateOK && endDateOK
  }

  public hideMessage(msg: ServiceMessages): void {
    this.filteredMessages = this.filteredMessages.filter(f => f.index !== msg.index)
    this.hiddenBanners.push(msg.message_en);
    window.sessionStorage.setItem(this.serviceMessageCookie, JSON.stringify(this.hiddenBanners));
  }
}
