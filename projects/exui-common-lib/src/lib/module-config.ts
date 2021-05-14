import { InjectionToken, Provider } from '@angular/core';
import { FeatureToggleService } from './services/feature-toggle/feature-toggle.service';
import { LaunchDarklyService } from './services/feature-toggle/launch-darkly.service';

export const COMMON_LIB_MODULE_OPTIONS = new InjectionToken<CommonLibraryModuleConfig>('COMMON_LIB_MODULE_OPTIONS');

export class CommonLibraryModuleConfig {
    public launchDarklyClientId: string = 'not provided';
    public featureToggleServiceProvider: Provider = { provide: FeatureToggleService, useClass: LaunchDarklyService };
}