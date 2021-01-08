import { Component, Input, OnInit } from '@angular/core';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';

export interface ServiceMessages {
  [key: string]: string;
}

@Component({
  selector: 'xuilib-service-messages',
  templateUrl: './service-messages.component.html'
})
export class ServiceMessagesComponent implements OnInit {
  public hiddenBanners: string[];
  public filteredMessages = new Map<string, string>();

  @Input() public userRoles: string[];
  @Input() public featureToggleKey: string;
  @Input() public serviceMessageCookie: string;

  constructor(private readonly featureToggleService: FeatureToggleService) { }

  public ngOnInit() {
    this.getServiceMessages();
  }

  public getServiceMessages(): void {
    this.featureToggleService.getValue<ServiceMessages>(this.featureToggleKey, null)
      .subscribe(messages => {
        if (!!messages) {
          this.createFilteredMessages(messages);
        }
      });
  }

  private createFilteredMessages(messages: ServiceMessages): void {
    this.hiddenBanners = JSON.parse(window.sessionStorage.getItem(this.serviceMessageCookie)) || [];
    Object.keys(messages).forEach(key => {
      const regEx = new RegExp(key);
      if (this.userRoles.some(e => regEx.test(e)) && this.hiddenBanners.indexOf(key) === -1) {
        this.filteredMessages.set(key, messages[key]);
      }
    });
  }

  public hideMessage(key: string): void {
    this.filteredMessages.delete(key);
    this.hiddenBanners.push(key);
    window.sessionStorage.setItem(this.serviceMessageCookie, JSON.stringify(this.hiddenBanners));
  }
}
