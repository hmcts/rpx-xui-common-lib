import { Component, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FeatureToggleService } from 'projects/exui-common-lib/src/public-api';
import { ServiceMessages } from 'projects/exui-common-lib/src/lib/models/service-message.model';
import {
  initialFeatureKey,
  lifecycleMessageCookie,
  lifecycleMessageKey,
  lifecycleMessages,
  lifecycleMessageSets,
  lifecycleStandaloneMessage,
  reboundFeatureKey
} from './lifecycle-demo.data';

@Injectable()
class LifecycleFeatureToggleService extends FeatureToggleService {
  private readonly features = new Map<string, BehaviorSubject<boolean>>();
  private readonly messages: ServiceMessages[];

  constructor(route: ActivatedRoute) {
    super();
    this.messages = lifecycleMessageSets[route.snapshot.queryParamMap.get('set') ?? 'default'] ?? lifecycleMessages;
  }

  public override isEnabled(feature: string): Observable<boolean> {
    return this.feature(feature).asObservable();
  }

  public override getValue<R>(key: string, defaultValue: R): Observable<R> {
    const value: unknown = key === lifecycleMessageKey ? this.messages : defaultValue;
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
  public readonly messageCookie: string;
  public readonly messageKey = lifecycleMessageKey;
  public readonly userRoles: string[];
  public readonly standalone: boolean;
  public readonly standaloneMessage = lifecycleStandaloneMessage;
  public hiddenMessageKey: ServiceMessages | null = null;
  public hideEvents = 0;
  public featureActions = 0;
  public featureKey = initialFeatureKey;

  constructor(route: ActivatedRoute, private readonly featureToggles: LifecycleFeatureToggleService) {
    const query = route.snapshot.queryParamMap;
    const messageSet = query.get('set') ?? 'default';
    this.messageCookie = messageSet === 'default' ? lifecycleMessageCookie : `${lifecycleMessageCookie}-${messageSet}`;
    const role = query.get('role') ?? 'caseworker-demo';
    this.userRoles = role === 'none' ? [] : [role];
    this.standalone = query.get('fixture') === 'standalone';
  }

  public hideStandalone(message: ServiceMessages): void {
    this.hiddenMessageKey = message;
    this.hideEvents++;
  }

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
