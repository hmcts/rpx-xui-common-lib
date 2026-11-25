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
import { AdvancedFilterDemoComponent } from './coverage-demo/advanced-filter-demo.component';
import { LifecycleDemoComponent } from './coverage-demo/lifecycle-demo.component';
import { SearchDemoComponent } from './coverage-demo/search-demo.component';
import { PrimitivesDemoComponent } from './coverage-demo/primitives-demo.component';
import { LookupsDemoComponent } from './coverage-demo/lookups-demo.component';
import { AccessibilityDemoComponent } from './coverage-demo/accessibility-demo.component';
import { StandaloneComponentsDemoComponent } from './coverage-demo/standalone-components-demo.component';
import { ExtendedControlsDemoComponent } from './coverage-demo/extended-controls-demo.component';
import { SelectedCaseDemoComponent } from './coverage-demo/selected-case-demo.component';
import { PublicContractsDemoComponent } from './coverage-demo/public-contracts-demo.component';
import { ValidatorContractsDemoComponent } from './coverage-demo/validator-contracts-demo.component';
import { ServiceContractADemoComponent } from './coverage-demo/service-contract-a-demo.component';
import { ServiceContractBDemoComponent } from './coverage-demo/service-contract-b-demo.component';
import { RemainingCoverageDemoComponent } from './coverage-demo/remaining-coverage-demo.component';

@Component({
  selector: 'app-root',
  template: `
    <a class="govuk-skip-link" href="#main-content" (click)="focusMainContent($event)">Skip to main content</a>
    <router-outlet></router-outlet>
  `,
  standalone: false
})
export class AppShellComponent {
  public focusMainContent(event: Event): void {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
}

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
    UserManagementDemoComponent,
    AdvancedFilterDemoComponent,
    LifecycleDemoComponent,
    SearchDemoComponent,
    PrimitivesDemoComponent,
    LookupsDemoComponent,
    AccessibilityDemoComponent,
    StandaloneComponentsDemoComponent,
    ExtendedControlsDemoComponent,
    SelectedCaseDemoComponent,
    PublicContractsDemoComponent,
    ValidatorContractsDemoComponent,
    ServiceContractADemoComponent,
    ServiceContractBDemoComponent,
    RemainingCoverageDemoComponent
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
