import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FeatureToggleService } from 'projects/exui-common-lib/src/lib/services';
import {
  initialFeatureKey,
  lifecycleMessageCookie,
  lifecycleMessageKey,
  lifecycleMessages,
  reboundFeatureKey
} from './lifecycle-demo.data';

@Injectable()
class LifecycleFeatureToggleService extends FeatureToggleService {
  private readonly features = new Map<string, BehaviorSubject<boolean>>();

  public override isEnabled(feature: string): Observable<boolean> {
    return this.feature(feature).asObservable();
  }

  public override getValue<R>(key: string, defaultValue: R): Observable<R> {
    const value: unknown = key === lifecycleMessageKey ? lifecycleMessages : defaultValue;
    return of(value as R);
  }

  public setFeature(feature: string, enabled: boolean): void {
    this.feature(feature).next(enabled);
  }

  private feature(key: string): BehaviorSubject<boolean> {
    if (!this.features.has(key)) {
      this.features.set(key, new BehaviorSubject(false));
    }
    return this.features.get(key)!;
  }
}

@Component({
  selector: 'app-lifecycle-demo',
  templateUrl: './lifecycle-demo.component.html',
  providers: [
    LifecycleFeatureToggleService,
    { provide: FeatureToggleService, useExisting: LifecycleFeatureToggleService }
  ],
  standalone: false
})
export class LifecycleDemoComponent {
  public readonly messageCookie = lifecycleMessageCookie;
  public readonly messageKey = lifecycleMessageKey;
  public readonly userRoles = ['caseworker-demo'];
  public featureKey = initialFeatureKey;

  constructor(private readonly featureToggles: LifecycleFeatureToggleService) {}

  public emitCurrentFeature(enabled: boolean): void {
    this.featureToggles.setFeature(this.featureKey, enabled);
  }

  public rebindFeature(): void {
    this.featureKey = reboundFeatureKey;
  }

  public emitOriginalFeature(enabled: boolean): void {
    this.featureToggles.setFeature(initialFeatureKey, enabled);
  }
}
