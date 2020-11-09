import { Component, OnInit } from '@angular/core';
import { BadgeColour, ContactDetailsDataModel, TCDocument } from 'projects/exui-common-lib/src';
import { GoogleTagManagerService } from 'projects/exui-common-lib/src/lib/services/google-tag-manager/google-tag-manager.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private readonly googleTagManagerService: GoogleTagManagerService
  ) { }
  public title = 'rpx-xui-common-lib';

  public testDocumentPlain: TCDocument = {
    version: 1,
    content: 'Test Document Content',
    mimeType: 'text/plain'
  };

  public testDocumentHtml: TCDocument = {
    version: 2,
    content: `<h1>HTML Test</h1><p>Document to test <b>HTML</b> content</p>`,
    mimeType: 'text/html'
  };

  public contactDetailsData: ContactDetailsDataModel = {
    title: 'Contact Details Component',
    badgeColour: BadgeColour.BADGE_RED,
    badgeText: 'PRIVATE BETA',
    email: 'test@justice.gov.uk',
    phone: '1111111',
    openingTimes: 'bla bla bla'
  };

  public tabItems = [{
    text: 'Tab1'
  }, {
    text: 'Tab2'
  }];

  // START: Due Date Component.
  public dueDate: Date = new Date();
  public dueDateText: string = this.dueDate.toLocaleDateString();
  public highUrgencyCutoff: number = 0;
  public highUrgencyCutoffText: string = '0';
  public mediumUrgencyCutoff: number = 2;
  public mediumUrgencyCutoffText: string = '2';
  // END: Due Date Component.

  public testObservable: Observable<string[]> = of(['this', 'is', 'a', 'test']);
  public updateDueDate(value: string): void {
    const parts: string[] = value.split('/');
    if (parts.length == 3) {
      const parsedDate: number = Date.parse(parts.reverse().join('-'));
      if (isNaN(parsedDate) == false) {
        this.dueDate = new Date(parsedDate);
      }
    }
  }
  public updateHighUrgencyCutoff(value: string): void {
    this.highUrgencyCutoff = parseInt(value, 10);
  }
  public updateMediumUrgencyCutoff(value: string): void {
    this.mediumUrgencyCutoff = parseInt(value, 10);
  }

  public tabChangeEvent(eventObject: any) {
    console.log(eventObject);
  }

  public ngOnInit() {
    // TODO: gtm key here will give 404 as it doesn't have a container
    this.googleTagManagerService.init('GTM-1234');
  }
}
