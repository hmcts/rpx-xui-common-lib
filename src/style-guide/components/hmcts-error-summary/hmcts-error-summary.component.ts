import {DOCUMENT} from '@angular/common';
import {AfterViewInit, Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
/*
  Error Summary component
  State Less component
  @property errorMessages that is array of messages.
  Component is also responsible for scrolling. Up and Down the page when user click on links
*/
@Component({
  selector: 'app-hmcts-error-summary',
  template: `<div id="errorSummary" class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1"
                  data-module="error-summary">
              <h2 class="govuk-error-summary__title" id="error-summary-title">
                {{header}}
              </h2>
              <div class="govuk-error-summary__body">
                <ul class="govuk-list govuk-error-summary__list">
                  <li *ngFor="let message of messages">
                    <a (click)="scrollTo(message['id'])" [routerLink]="" [fragment]="message['id']"
                      *ngIf="hasElement(message['id'])">{{message['message']}}</a>
                    <span *ngIf="!hasElement(message['id'])">{{message['message']}}</span>
                  </li>
                </ul>
              </div>
            </div>
  `
})
export class HmctsErrorSummaryComponent implements AfterViewInit, OnChanges {

  @Input() public set errorMessages(value: any) {
    this.messages = value;
  }

  @Input() public header: string;

  public messages: object[];

  constructor(@Inject(DOCUMENT) private readonly document: any) { }

  public ngAfterViewInit(): void {
    this.scrollTo('errorSummary');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages) {
      this.scrollTo('errorSummary');
    }
  }

  public scrollTo(selector: any) {
    if (this.document.querySelector(`#${selector}`)) {
      const el = this.document.querySelector(`#${selector}`);

      el.focus();
    }
  }

  public hasElement(selector: any) {
    return this.document.querySelector(`#${selector}`);
  }

}
