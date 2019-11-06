import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ExuiCommonLibModule } from 'projects/exui-common-lib/src/public-api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ExuiCommonLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
