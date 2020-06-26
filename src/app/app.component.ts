import { Component, OnInit } from '@angular/core';
import { BadgeColour, ContactDetailsDataModel, TCDocument } from 'projects/exui-common-lib/src';
import { GoogleAnalyticsService } from 'projects/exui-common-lib/src/lib/services/google-analytics/google-analytics.service';
import { Observable, of } from 'rxjs';

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

  public contactDetailsData: ContactDetailsDataModel = {
    title: 'Contact Details Component',
    badgeColour: BadgeColour.BADGE_RED,
    badgeText: 'PRIVATE BETA',
    email: 'test@justice.gov.uk',
    phone: '1111111',
    openingTimes: 'bla bla bla'
  };

  public testUsers = [{"idamId":"u111111","firstName":"Joe","lastName":"Elliott","email":"joe.elliott@woodford.com"},{"idamId":"u222222","firstName":"Steve","lastName":"Harrison","email":"steve.harrison@woodford.com"},{"idamId":"u333333","firstName":"James","lastName":"Priest","email":"james.priest@woodford.com"},{"idamId":"u444444","firstName":"Shaun","lastName":"Coldwell","email":"shaun.coldwell@woodford.com"}];

  public testObservable: Observable<string[]> = of(['this', 'is', 'a', 'test']);

  constructor(
    private readonly googleAnalytics: GoogleAnalyticsService
  ) { }

  public ngOnInit() {
    this.googleAnalytics.init('UA-151027057-1');
  }
}
