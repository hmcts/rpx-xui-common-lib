import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'projects/exui-common-lib/src/lib/services/google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'rpx-xui-common-lib';

  constructor(
    private googleAnalytics: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.googleAnalytics.init('UA-151027057-1');
  }
}
