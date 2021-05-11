import { CommonModule } from "@angular/common";
import { InjectionToken, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatTabsModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import {
  AccessibilityComponent,
  CheckboxListComponent,
  ContactDetailsComponent,
  DueDateComponent,
  ExuiPageWrapperComponent,
  HmctsSessionDialogComponent,
  InviteUserFormComponent,
  InviteUserPermissionComponent,
  LoadingSpinnerComponent,
  SelectedCaseComponent,
  SelectedCaseConfirmComponent,
  SelectedCaseListComponent,
  ServiceMessageComponent,
  ServiceMessagesComponent,
  ShareCaseComponent,
  ShareCaseConfirmComponent,
  TabComponent,
  TcConfirmComponent,
  TcDisplayHtmlComponent,
  TcDisplayPlainComponent,
  TermsAndConditionsComponent,
  UserDetailsComponent,
  UserListComponent,
  UserSelectComponent
} from "./components";
import { FeatureToggleDirective, LetDirective } from "./directives";
import {
  GovUkCheckboxComponent,
  GovUkCheckboxesComponent,
  GovUkDateComponent,
  GovUkErrorMessageComponent,
  GovUkFieldsetComponent,
  GovUkFileUploadComponent,
  GovUkFormGroupWrapperComponent,
  GovUkInputComponent,
  GovUkLabelComponent,
  GovUkRadioComponent,
  GovUkRadiosComponent,
  GovUkSelectComponent,
  GovukTableComponent,
  GovUkTextareaComponent,
  HmctsBannerComponent,
  HmctsErrorSummaryComponent,
  HmctsIdentityBarComponent,
  HmctsMainWrapperComponent,
  HmctsPrimaryNavigationComponent,
  HmctsSubNavigationComponent
} from "./gov-ui/components";
import { RemoveHostDirective } from "./gov-ui/directives";
import { windowProvider, windowToken } from "./window";

export const COMMON_LIB_ROOT_GUARD = new InjectionToken<void>('COMMON_LIB_ROOT_GUARD');

export class ExuiCommonLibModuleOptions {
  public launchDarklyKey?: string;
}

export const COMMON_COMPONENTS = [
  ExuiPageWrapperComponent,
  TermsAndConditionsComponent,
  TcDisplayHtmlComponent,
  TcDisplayPlainComponent,
  TcConfirmComponent,
  ContactDetailsComponent,
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
  LoadingSpinnerComponent
];

export const COMMON_DIRECTIVES = [
  FeatureToggleDirective,
  LetDirective
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
  GovUkFileUploadComponent
];

export const GOV_UI_DIRECTIVES = [
  RemoveHostDirective
];

@NgModule({
  declarations: [
    ...COMMON_COMPONENTS,
    ...COMMON_DIRECTIVES,
    ...GOV_UI_COMPONENTS,
    ...GOV_UI_DIRECTIVES
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
    { provide: windowToken, useFactory: windowProvider }
  ],
  exports: [
    ...COMMON_COMPONENTS,
    ...COMMON_DIRECTIVES,
    ...GOV_UI_COMPONENTS,
    ...GOV_UI_DIRECTIVES
  ]
})
export class ExuiCommonLibModule {
}
