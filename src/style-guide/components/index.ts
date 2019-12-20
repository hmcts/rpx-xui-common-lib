import {FormComponent} from './form/form.component';
import { HmctsErrorSummaryComponent } from './hmcts-error-summary/hmcts-error-summary.component';
import { HmctsMainWrapperComponent } from './hmcts-main-wrapper/hmcts-main-wrapper.component';

export const components: any[] = [
  FormComponent,
  HmctsMainWrapperComponent,
  HmctsErrorSummaryComponent
];

export * from './form/form.component';
export * from './hmcts-main-wrapper/hmcts-main-wrapper.component';
export * from './hmcts-error-summary/hmcts-error-summary.component';
