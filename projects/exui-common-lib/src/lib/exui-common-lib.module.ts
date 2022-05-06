import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AccessibilityComponent } from './components/accessibility/accessibility.component';
import { CheckboxListComponent } from './components/checkbox-list/checkbox-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { DueDateComponent } from './components/due-date/due-date.component';
import { ExuiPageWrapperComponent } from './components/exui-main-wrapper/exui-page-wrapper.component';
import { FindLocationComponent } from './components/find-location/find-location.component';
import { FindPersonComponent } from './components/find-person/find-person.component';
import { GenericFilterComponent } from './components/generic-filter/generic-filter.component';
import { HmctsSessionDialogComponent } from './components/hmcts-session-dialog/hmcts-session-dialog.component';
import { InviteUserFormComponent } from './components/invite-user-form/invite-user-form.component';
import { InviteUserPermissionComponent } from './components/invite-user-permissions/invite-user-permission.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchJudicialsComponent } from './components/search-judicials/search-judicials.component';
import { SearchLocationComponent } from './components/search-location/search-location.component';
import { SearchVenueComponent } from './components/search-venue/search-venue.component';
import { SelectedCaseConfirmComponent } from './components/selected-case-confirm/selected-case-confirm.component';
import { SelectedCaseListComponent } from './components/selected-case-list/selected-case-list.component';
import { SelectedCaseComponent } from './components/selected-case/selected-case.component';
import { ServiceMessageComponent } from './components/service-message/service-message.component';
import { ServiceMessagesComponent } from './components/service-messages/service-messages.component';
import { ShareCaseConfirmComponent } from './components/share-case-confirm/share-case-confirm.component';
import { ShareCaseComponent } from './components/share-case/share-case.component';
import { TabComponent } from './components/tab/tab.component';
import { TcConfirmComponent } from './components/tc-confirm/tc-confirm.component';
import {
  TcDisplayHtmlComponent
} from './components/terms-and-conditions/tc-display/tc-display-html/tc-display-html.component';
import {
  TcDisplayPlainComponent
} from './components/terms-and-conditions/tc-display/tc-display-plain/tc-display-plain.component';
import {TermsAndConditionsComponent} from './components/terms-and-conditions/terms-and-conditions.component';
import {UserDetailsComponent} from './components/user-details/user-details.component';
import {UserListComponent} from './components/user-list/user-list.component';
import {UserSelectComponent} from './components/user-select/user-select.component';
import {FeatureToggleDirective} from './directives/feature-toggle/feature-toggle.directive';
import {LetDirective} from './directives/let/let.directive';
import {GovUkCheckboxComponent} from './gov-ui/components/gov-uk-checkbox/gov-uk-checkbox.component';
import {GovUkCheckboxesComponent} from './gov-ui/components/gov-uk-checkboxes/gov-uk-checkboxes.component';
import {GovUkDateComponent} from './gov-ui/components/gov-uk-date/gov-uk-date.component';
import {GovUkErrorMessageComponent} from './gov-ui/components/gov-uk-error-message/gov-uk-error-message.component';
import {GovUkFieldsetComponent} from './gov-ui/components/gov-uk-fieldset/gov-uk-fieldset.component';
import {GovUkFileUploadComponent} from './gov-ui/components/gov-uk-file-upload/gov-uk-file-upload.component';
import {
  GovUkFormGroupWrapperComponent
} from './gov-ui/components/gov-uk-form-group-wrapper/gov-uk-form-group-wrapper.component';
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
import {
  HmctsPrimaryNavigationComponent
} from './gov-ui/components/hmcts-primary-navigation/hmcts-primary-navigation.component';
import {HmctsSubNavigationComponent} from './gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
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
  SearchJudicialsComponent,
  FindLocationComponent,
  SearchLocationComponent,
  SearchVenueComponent,
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
    ...GOV_UI_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    MatAutocompleteModule,
    MatTabsModule,
    MatInputModule
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
