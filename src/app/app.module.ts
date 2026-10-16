import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ExuiCommonLibModule } from 'projects/exui-common-lib/src/public-api';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoverageDemoComponent } from './coverage-demo/coverage-demo.component';
import { InvitationDemoComponent } from './coverage-demo/invitation-demo.component';
import { FormControlsDemoComponent } from './coverage-demo/form-controls-demo.component';
import { ServiceSelectionDemoComponent } from './coverage-demo/service-selection-demo.component';
import { CaseSharingDemoComponent, CaseSharingEditDemoComponent, CaseSharingConfirmDemoComponent } from './coverage-demo/case-sharing-demo.component';
import { AddressDemoComponent } from './coverage-demo/address-demo.component';
import { UserManagementDemoComponent } from './coverage-demo/user-management-demo.component';

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
    CoverageDemoComponent,
    InvitationDemoComponent,
    FormControlsDemoComponent,
    ServiceSelectionDemoComponent,
    CaseSharingDemoComponent,
    CaseSharingEditDemoComponent,
    CaseSharingConfirmDemoComponent,
    AddressDemoComponent,
    UserManagementDemoComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
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
