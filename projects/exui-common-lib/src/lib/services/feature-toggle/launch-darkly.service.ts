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
    try {
      this.ready.next(false);
      this.context = { kind: 'user', ...user };
      this.clientId = clientId;
      this.client = initialize(this.clientId, this.context, { useReport: true });
      this.client.on('ready', () => {
        this.client.identify(this.context).then(() => this.ready.next(true));
      });
      this.client.on('error', (err: any) => {
        console.error('LaunchDarkly client network error:', err);
        // Allow the app to proceed by emitting true, so subscribers are not blocked
        this.ready.next(true);
      });
    } catch (error) {
      console.error('Failed to initialize LaunchDarkly client:', error);
      this.ready.next(false);
    }
  }

  public isEnabled(feature: string, defaultValue: boolean = false): Observable<boolean> {
    try {
      return this.getValue<boolean>(feature, defaultValue);
    } catch (error) {
      console.error(`Failed to check if feature "${feature}" is enabled:`, error);
      return new BehaviorSubject<boolean>(defaultValue).asObservable();
    }
  }

  public getArray<R = any>(feature: string): Observable<R[]> {
    try {
      return this.getValue<R[]>(feature, []);
    } catch (error) {
      console.error(`Failed to get array for feature "${feature}":`, error);
      return new BehaviorSubject<R[]>([]).asObservable();
    }
  }

  // Note that this function always emits its default value first, which can lead to unexpected results
  public getValue<R>(feature: string, defaultValue: R): Observable<R> {
    try {
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
    } catch (error) {
      console.error(`Failed to get value for feature "${feature}":`, error);
      return new BehaviorSubject<R>(defaultValue).asObservable();
    }
  }

  public getValueOnce<R>(feature: string, defaultValue: R): Observable<R> {
    try {
      return this.ready.pipe(
        filter((ready) => ready),
        map(() => this.client.variation(feature, defaultValue))
      );
    } catch (error) {
      console.error(`Failed to get value once for feature "${feature}":`, error);
      return new BehaviorSubject<R>(defaultValue).asObservable();
    }
  }

  public getValueSync<R>(feature: string, defaultValue: R): R {
    try {
      return this.client.variation(feature, defaultValue);
    } catch (error) {
      console.error(`Failed to get sync value for feature "${feature}":`, error);
      return defaultValue;
    }
  }
}
