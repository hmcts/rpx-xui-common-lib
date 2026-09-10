
import { AfterViewInit, Component, Inject, Input, OnChanges, SimpleChanges, DOCUMENT } from '@angular/core';
/*
  Error Summary component
  State Less component
  @property errorMessages that is array of messages.
  Component is also responsible for scrolling. Up and Down the page when user click on links
*/
export interface HmctsErrorMessage {
  id: string;
  message: string;
}

@Component({
  selector: 'xuilib-hmcts-error-summary',
  templateUrl: './hmcts-error-summary.component.html',
  standalone: false
})
export class HmctsErrorSummaryComponent implements AfterViewInit, OnChanges {
  @Input() public set errorMessages(value: HmctsErrorMessage[]) {
    this.messages = value || [];
  }
  @Input() public header: string;
  @Input() public showWarningMessage: boolean;
  public messages: HmctsErrorMessage[] = [];

  constructor(@Inject(DOCUMENT) private readonly document: any) { }

  public ngAfterViewInit(): void {
    this.scrollTo('errorSummary');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages) {
      this.scrollTo('errorSummary');
      this.updatePageTitle();
    }
  }

  private updatePageTitle(): void {
    const hasErrors = !this.showWarningMessage && this.messages && this.messages.length > 0;
    if (hasErrors && !this.document.title.startsWith('Error:')) {
      this.document.title = `Error: ${this.document.title}`;
    } else if (!hasErrors && this.document.title.startsWith('Error:')) {
      this.document.title = this.document.title.replace(/^Error:\s*/, '');
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
