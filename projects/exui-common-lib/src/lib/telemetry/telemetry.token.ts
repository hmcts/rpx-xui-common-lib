import { InjectionToken } from '@angular/core';

export interface TelemetryService {
  traceId?: string | null;
  log(event: string, userId: string | null, details?: any): void;
}

export const TELEMETRY_SERVICE = new InjectionToken<TelemetryService>('rpx-xui-common-lib.TELEMETRY_SERVICE');
