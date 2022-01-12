import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {RouterModule} from '@angular/router';
import {AccessibilityComponent, CheckboxListComponent, ContactDetailsComponent, CookieBannerComponent, DueDateComponent, FindLocationComponent, GenericFilterComponent, HmctsSessionDialogComponent, InviteUserFormComponent, InviteUserPermissionComponent, LoadingSpinnerComponent, PaginationComponent, SearchLocationComponent, SelectedCaseComponent, SelectedCaseConfirmComponent, SelectedCaseListComponent, ServiceMessageComponent, ServiceMessagesComponent, ShareCaseComponent, ShareCaseConfirmComponent, TabComponent, TcConfirmComponent, TcDisplayHtmlComponent, TcDisplayPlainComponent, TermsAndConditionsComponent, UserDetailsComponent, UserListComponent} from './components';
import {ExuiPageWrapperComponent} from './components/exui-main-wrapper/exui-page-wrapper.component';
import {FindPersonComponent} from './components/find-person/find-person.component';
import {UserSelectComponent} from './components/user-select/user-select.component';
import {FeatureToggleDirective, LetDirective} from './directives';
import {HmctsSubNavigationComponent} from './gov-ui';
import {GovUkCheckboxComponent} from './gov-ui/components/gov-uk-checkbox/gov-uk-checkbox.component';
import {GovUkCheckboxesComponent} from './gov-ui/components/gov-uk-checkboxes/gov-uk-checkboxes.component';
import {GovUkDateComponent} from './gov-ui/components/gov-uk-date/gov-uk-date.component';
import {GovUkErrorMessageComponent} from './gov-ui/components/gov-uk-error-message/gov-uk-error-message.component';
import {GovUkFieldsetComponent} from './gov-ui/components/gov-uk-fieldset/gov-uk-fieldset.component';
import {GovUkFileUploadComponent} from './gov-ui/components/gov-uk-file-upload/gov-uk-file-upload.component';
import {GovUkFormGroupWrapperComponent} from './gov-ui/components/gov-uk-form-group-wrapper/gov-uk-form-group-wrapper.component';
import {GovUkInputComponent} from './gov-ui/components/gov-uk-input/gov-uk-input.component';
import {GovUkLabelComponent} from './gov-ui/components/gov-uk-label/gov-uk-label.component';
import {GovUkRadioComponent} from './gov-ui/components/gov-uk-radio/gov-uk-radio.component';
import {GovUkRadiosComponent} from './gov-ui/components/gov-uk-radios/gov-uk-radios.component';
import {GovUkSelectComponent} from './gov-ui/components/gov-uk-select/gov-uk-select.component';
import {GovukTableComponent} from './gov-ui/components/gov-uk-table/gov-uk-table.component';
import {GovUkTextareaComponent} from './gov-ui/components/gov-uk-textarea/gov-uk-textarea.component';
import {HmctsBannerComponent} from './gov-ui/components/hmcts-banner/hmcts-banner.component';
import {HmctsErrorSummaryComponent} from './gov-ui/components/hmcts-error-summary/hmcts-error-summary.component';
import {HmctsIdentityBarComponent} from './gov-ui/components/hmcts-identity-bar/hmcts-identity-bar.component';
import {HmctsMainWrapperComponent} from './gov-ui/components/hmcts-main-wrapper/hmcts-main-wrapper.component';
import {HmctsPrimaryNavigationComponent} from './gov-ui/components/hmcts-primary-navigation/hmcts-primary-navigation.component';
import {RemoveHostDirective} from './gov-ui/directives/remove-host.directive';
import {windowProvider, windowToken} from './window';

export const COMMON_COMPONENTS = [
  ExuiPageWrapperComponent,
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
  InviteUserPermissionComponent,
  InviteUserFormComponent,
  ShareCaseComponent,
  ShareCaseConfirmComponent,
  SelectedCaseListComponent,
  SelectedCaseComponent,
  SelectedCaseConfirmComponent,
  UserSelectComponent,
  TabComponent,
  AccessibilityComponent,
  DueDateComponent,
  CheckboxListComponent,
  ServiceMessageComponent,
  ServiceMessagesComponent,
  LoadingSpinnerComponent,
  GenericFilterComponent,
  CookieBannerComponent,
  FindPersonComponent,
  FindLocationComponent,
  SearchLocationComponent,
  PaginationComponent
];

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
    ...COMMON_COMPONENTS,
    ...GOV_UI_COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    MatAutocompleteModule,
    MatTabsModule
  ],
  providers: [
    {provide: windowToken, useFactory: windowProvider}
  ],
  exports: [
    ...COMMON_COMPONENTS,
    ...GOV_UI_COMPONENTS
  ]
})
export class ExuiCommonLibModule {
}
