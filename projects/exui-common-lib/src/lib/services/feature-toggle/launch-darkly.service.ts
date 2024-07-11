import { Injectable } from '@angular/core';
import { initialize, LDClient, LDContext } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FeatureUser } from '../../models/feature-user';
import { FeatureToggleService } from './feature-toggle.service';

@Injectable({
  providedIn: 'root'
})
export class LaunchDarklyService implements FeatureToggleService {
  private client: LDClient;
  private readonly ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly features: Record<string, BehaviorSubject<any>> = {};
  private context: LDContext = { kind: 'user', anonymous: true };
  private clientId: string = '';

  public initialize(user: FeatureUser = { anonymous: true }, clientId: string): void {
    this.ready.next(false);
    this.context = { kind: 'user', ...user };
    this.clientId = clientId;
    this.client = initialize(this.clientId, this.context, { useReport: true });
    this.client.on('ready', () => {
      this.client.identify(this.context).then(() => this.ready.next(true));
    });
  }

  public isEnabled(feature: string, defaultValue: boolean = false): Observable<boolean> {
    return this.getValue<boolean>(feature, defaultValue);
  }

  public getArray<R = any>(feature: string): Observable<R[]> {
    return this.getValue<R[]>(feature, []);
  }

  // Note that this function always emits its default value first, which can lead to unexpected results
  public getValue<R>(feature: string, defaultValue: R): Observable<R> {
    if (!this.features.hasOwnProperty(feature)) {
      this.features[feature] = new BehaviorSubject<R>(defaultValue);
      this.ready.pipe(
        filter((ready) => ready),
        map(() => this.client.variation(feature, defaultValue))
      ).subscribe((value) => {
        this.features[feature].next(value);
        this.client.on(`change:${feature}`, (val: R) => {
          this.features[feature].next(val);
        });
      });
    }
    return this.features[feature].pipe(
      distinctUntilChanged()
    );
  }

  /**
     * This method returns an observable that will only get the state of the feature toggle
     * once. It calls the LD SDK directly, and should only be used in circumstances where
     * only one value should be emitted, that value coming directly from LD. This will likely
     * only apply for Guards, and should be used only when absolutely necessary.
     * @see getValue for regular usage.
     * @param feature string
     * @param defaultValue R
     */
  public getValueOnce<R>(feature: string, defaultValue: R): Observable<R> {
    return this.ready.pipe(
      filter((ready) => ready),
      map(() => this.client.variation(feature, defaultValue))
    );
  }

  public getValueSync<R>(feature: string, defaultValue: R): R {
    return this.client.variation(feature, defaultValue);
  }
}
