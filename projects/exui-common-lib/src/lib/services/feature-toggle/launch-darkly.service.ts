import { Inject, InjectionToken } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FeatureUser } from '../../models/feature-user';
import { FeatureToggleService } from './feature-toggle.service';

export const LAUNCHDARKLYKEY = new InjectionToken<string>('LAUNCHDARKLYKEY');

export class LaunchDarklyService extends FeatureToggleService {

    private readonly client: LDClient.LDClient;
    private readonly ready = new BehaviorSubject<boolean>(false);
    private readonly features: Record<string, BehaviorSubject<boolean>> = {};

    constructor(@Inject(LAUNCHDARKLYKEY) key: string) {
        super();
        this.client = LDClient.initialize(key, { anonymous: true }, {});
        this.client.on('ready', () => { this.ready.next(true); });
    }

    public initialize(user: FeatureUser = { anonymous: true }): void {
        this.ready.next(false);
        this.client.identify(user).then(() => this.ready.next(true));
    }

    public isEnabled(feature: string): Observable<boolean> {
        if (!this.features.hasOwnProperty(feature)) {
            this.features[feature] = new BehaviorSubject<boolean>(false);
            this.ready.pipe(
                filter(ready => ready),
                map(() => this.client.variation(feature, false))
            ).subscribe(enabled => {
                this.features[feature].next(enabled);
                this.client.on(`change:${feature}`, (val) => {
                    this.features[feature].next(val);
                });
            });
        }
        return this.features[feature].pipe(
            distinctUntilChanged()
        );
    }
}
