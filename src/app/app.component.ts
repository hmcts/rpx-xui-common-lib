import { Component, OnInit } from '@angular/core';
import { TCDocument, GetHelpDetailsDataModel, BadgeColour } from 'projects/exui-common-lib/src';
import { GoogleAnalyticsService } from 'projects/exui-common-lib/src/lib/services/google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
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

  public getHelpDetailsData: GetHelpDetailsDataModel = {
    title: 'Get Help Details Component',
      badgeColour: BadgeColour.BADGE_RED,
      badgeText: 'PRIVATE BETA',
      email: 'test@justice.gov.uk',
      phone: '1111111',
      openingTimes: 'bla bla bla'
  };

  constructor(
    private readonly googleAnalytics: GoogleAnalyticsService
  ) { }

  public ngOnInit() {
    this.googleAnalytics.init('UA-151027057-1');
  }
}
