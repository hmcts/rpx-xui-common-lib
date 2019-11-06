import { NgModule } from '@angular/core';
import { WindowToken, windowProvider } from './window';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: WindowToken, useFactory: windowProvider }
  ],
  exports: [
  ]
})
export class ExuiCommonLibModule { }
