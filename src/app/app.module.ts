import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExuiCommonLibModule } from 'projects/exui-common-lib/src/public-api';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoverageDemoComponent } from './coverage-demo/coverage-demo.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: false
})
export class AppShellComponent { }

@NgModule({
  declarations: [
    AppShellComponent,
    AppComponent,
    CoverageDemoComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ExuiCommonLibModule,
    RpxTranslationModule.forRoot({
      baseUrl: '',
      debounceTimeMs: 300,
      validity: {
        days: 1
      },
      testMode: true
    })
  ],
  providers: [],
  bootstrap: [AppShellComponent]
})
export class AppModule { }
