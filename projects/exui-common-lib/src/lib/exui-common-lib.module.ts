import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { TcConfirmComponent } from './components/tc-confirm/tc-confirm.component';
import { TcDisplayHtmlComponent } from './components/terms-and-conditions/tc-display/tc-display-html/tc-display-html.component';
import { TcDisplayPlainComponent } from './components/terms-and-conditions/tc-display/tc-display-plain/tc-display-plain.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { FeatureToggleService, LAUNCHDARKLYKEY, LaunchDarklyService } from './services/public-api';
import { windowProvider, windowToken } from './window';
import { FeatureToggleDirective } from './directives';

export const COMMON_LIB_ROOT_GUARD = new InjectionToken<void>('COMMON_LIB_ROOT_GUARD');

export interface CommonLibOptions { launchDarklyKey?: string; }

@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    TcDisplayHtmlComponent,
    TcDisplayPlainComponent,
    TcConfirmComponent,
    ContactDetailsComponent,
    FeatureToggleDirective
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
    TcConfirmComponent,
    ContactDetailsComponent,
    FeatureToggleDirective
  ]
})
export class ExuiCommonLibModule {

  constructor(@Optional() @Inject(COMMON_LIB_ROOT_GUARD) public guard: any) { }

  public static forRoot(options?: CommonLibOptions): ModuleWithProviders {
    const providers: Provider[] = [
      GoogleAnalyticsService,
      {
        provide: COMMON_LIB_ROOT_GUARD,
        useFactory: provideForRootGuard,
        deps: [[GoogleAnalyticsService, new Optional(), new SkipSelf()]]
      },
      {
        provide: FeatureToggleService,
        useClass: LaunchDarklyService,
        deps: [LAUNCHDARKLYKEY]
      }
    ];

    if (options && options.launchDarklyKey) {
      providers.push({
        provide: LAUNCHDARKLYKEY,
        useValue: options.launchDarklyKey
      });
    }

    return {
      ngModule: ExuiCommonLibModule,
      providers
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
