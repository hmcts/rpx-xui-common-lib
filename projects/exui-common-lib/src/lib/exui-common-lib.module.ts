import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { HmctsSessionDialogComponent } from './components/hmcts-session-dialog/hmcts-session-dialog.component';
import { TcConfirmComponent } from './components/tc-confirm/tc-confirm.component';
import { TcDisplayHtmlComponent } from './components/terms-and-conditions/tc-display/tc-display-html/tc-display-html.component';
import { TcDisplayPlainComponent } from './components/terms-and-conditions/tc-display/tc-display-plain/tc-display-plain.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { FeatureToggleDirective } from './directives/feature-toggle/feature-toggle.directive';
import { LetDirective } from './directives/let/let.directive';
import { GovUkCheckboxComponent } from './gov-ui/components/gov-uk-checkbox/gov-uk-checkbox.component';
import { GovUkCheckboxesComponent } from './gov-ui/components/gov-uk-checkboxes/gov-uk-checkboxes.component';
import { GovUkDateComponent } from './gov-ui/components/gov-uk-date/gov-uk-date.component';
import { GovUkErrorMessageComponent } from './gov-ui/components/gov-uk-error-message/gov-uk-error-message.component';
import { GovUkFieldsetComponent } from './gov-ui/components/gov-uk-fieldset/gov-uk-fieldset.component';
import { GovUkFileUploadComponent } from './gov-ui/components/gov-uk-file-upload/gov-uk-file-upload.component';
import { GovUkFormGroupWrapperComponent } from './gov-ui/components/gov-uk-form-group-wrapper/gov-uk-form-group-wrapper.component';
import { GovUkInputComponent } from './gov-ui/components/gov-uk-input/gov-uk-input.component';
import { GovUkLabelComponent } from './gov-ui/components/gov-uk-label/gov-uk-label.component';
import { GovUkRadioComponent } from './gov-ui/components/gov-uk-radio/gov-uk-radio.component';
import { GovUkRadiosComponent } from './gov-ui/components/gov-uk-radios/gov-uk-radios.component';
import { GovUkSelectComponent } from './gov-ui/components/gov-uk-select/gov-uk-select.component';
import { GovukTableComponent } from './gov-ui/components/gov-uk-table/gov-uk-table.component';
import { GovUkTextareaComponent } from './gov-ui/components/gov-uk-textarea/gov-uk-textarea.component';
import { HmctsBannerComponent } from './gov-ui/components/hmcts-banner/hmcts-banner.component';
import { HmctsErrorSummaryComponent } from './gov-ui/components/hmcts-error-summary/hmcts-error-summary.component';
import { HmctsIdentityBarComponent } from './gov-ui/components/hmcts-identity-bar/hmcts-identity-bar.component';
import { HmctsMainWrapperComponent } from './gov-ui/components/hmcts-main-wrapper/hmcts-main-wrapper.component';
import { HmctsPrimaryNavigationComponent } from './gov-ui/components/hmcts-primary-navigation/hmcts-primary-navigation.component';
import { HmctsSubNavigationComponent } from './gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { RemoveHostDirective } from './gov-ui/directives/remove-host.directive';
import { FeatureToggleService } from './services/feature-toggle/feature-toggle.service';
import { LAUNCHDARKLYKEY, LaunchDarklyService } from './services/feature-toggle/launch-darkly.service';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { ManageSessionServices } from './services/manage-session/manage-session.services';
import { windowProvider, windowToken } from './window';

export const COMMON_LIB_ROOT_GUARD = new InjectionToken<void>('COMMON_LIB_ROOT_GUARD');

export class ExuiCommonLibModuleOptions {
  public launchDarklyKey?: string;
}

export const GOV_UI_COMPONENTS = [
  HmctsIdentityBarComponent,
  HmctsSubNavigationComponent,
  HmctsPrimaryNavigationComponent,
  HmctsErrorSummaryComponent,
  HmctsMainWrapperComponent,
  HmctsBannerComponent,
  GovukTableComponent,
  GovUkInputComponent,
  GovUkCheckboxComponent,
  GovUkFormGroupWrapperComponent,
  GovUkLabelComponent,
  GovUkErrorMessageComponent,
  GovUkFieldsetComponent,
  GovUkDateComponent,
  GovUkCheckboxesComponent,
  GovUkRadioComponent,
  GovUkRadiosComponent,
  GovUkSelectComponent,
  GovUkTextareaComponent,
  GovUkFileUploadComponent,
  RemoveHostDirective
];

@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    TcDisplayHtmlComponent,
    TcDisplayPlainComponent,
    TcConfirmComponent,
    ContactDetailsComponent,
    FeatureToggleDirective,
    LetDirective,
    HmctsSessionDialogComponent,
    UserListComponent,
    UserDetailsComponent,
    ...GOV_UI_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([])
  ],
  providers: [
    { provide: windowToken, useFactory: windowProvider },
    { provide: FeatureToggleService, useClass: LaunchDarklyService }
  ],
  exports: [
    TermsAndConditionsComponent,
    TcConfirmComponent,
    ContactDetailsComponent,
    FeatureToggleDirective,
    LetDirective,
    HmctsSessionDialogComponent,
    UserListComponent,
    UserDetailsComponent,
    ...GOV_UI_COMPONENTS
  ]
})
export class ExuiCommonLibModule {

  constructor(@Optional() @Inject(COMMON_LIB_ROOT_GUARD) public guard: any) { }

  public static forRoot(options: ExuiCommonLibModuleOptions): ModuleWithProviders {
    return {
      ngModule: ExuiCommonLibModule,
      providers: [
        GoogleAnalyticsService,
        ManageSessionServices,
        {
          provide: COMMON_LIB_ROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[GoogleAnalyticsService, new Optional(), new SkipSelf()]]
        },
        { provide: FeatureToggleService, useClass: LaunchDarklyService },
        { provide: LAUNCHDARKLYKEY, useValue: options.launchDarklyKey }
      ]
    };
  }

  public static forChild(): ModuleWithProviders {
    return {
      ngModule: ExuiCommonLibModule,
      providers: []
    };
  }
}

export function provideForRootGuard(service: GoogleAnalyticsService): any {
  if (service) {
    throw new Error(`ExuiCommonLibModule.forRoot() called twice. Lazy loaded modules should use forChild() instead.`);
  }
  return 'guarded';
}
