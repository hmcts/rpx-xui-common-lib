import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TcConfirmComponent } from './components/tc-confirm/tc-confirm.component';
import { TcDisplayHtmlComponent } from './components/terms-and-conditions/tc-display/tc-display-html/tc-display-html.component';
import { TcDisplayPlainComponent } from './components/terms-and-conditions/tc-display/tc-display-plain/tc-display-plain.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { windowProvider, windowToken } from './window';

export const COMMON_LIB_ROOT_GUARD = new InjectionToken<void>('COMMON_LIB_ROOT_GUARD');

@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    TcDisplayHtmlComponent,
    TcDisplayPlainComponent,
    TcConfirmComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([])
  ],
  providers: [
    { provide: windowToken, useFactory: windowProvider }
  ],
  exports: [
    TermsAndConditionsComponent,
    TcConfirmComponent
  ]
})
export class ExuiCommonLibModule {

  constructor(@Optional() @Inject(COMMON_LIB_ROOT_GUARD) public guard: any) { }

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExuiCommonLibModule,
      providers: [
        GoogleAnalyticsService,
        {
          provide: COMMON_LIB_ROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[GoogleAnalyticsService, new Optional(), new SkipSelf()]]
        }
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
