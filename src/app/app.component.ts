import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'projects/exui-common-lib/src/lib/services/google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public title = 'rpx-xui-common-lib';

  constructor(
    private readonly googleAnalytics: GoogleAnalyticsService
  ) { }

  public ngOnInit() {
    this.googleAnalytics.init('UA-151027057-1');
  }
}
