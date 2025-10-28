import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeatureToggleService } from './feature-toggle.service';

@Injectable({
    providedIn: 'root'
})
export class FeatureToggleGuard  {

    public constructor(
        private readonly featureToggleService: FeatureToggleService,
        private readonly router: Router
    ) {}

    // TEST-TODO
    /**
     * Usage: Add the FeatureToggleGuard as the Guard for a route, and provide the following
     * in the data array for the route:
     * - needsFeaturesEnabled: An array of feature keys that need to be enabled for this route
     * - featureDisabledRedirect: the URL to redirect to when the this route is not accessible due to disabled features
     * - expectFeatureEnabled: Sets whether a route should be enabled/disabled based on whether feature is present
     * @param route Automatically provided by Angular
     * Note: Per Angular 18, when a guard returns a UrlTree as a redirect,
     * the redirecting navigation will now use replaceUrl if the initial navigation was also using the replaceUrl option.
     */
    public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return combineLatest([...(route.data.needsFeaturesEnabled as string[]).map(
                feature => this.featureToggleService.getValueOnce<boolean>(feature, true)
        )]).pipe(
            map(featureStatuses => featureStatuses.every(status => status)),
            map(status => (route.data.expectFeatureEnabled !== false && status) || (route.data.expectFeatureEnabled === false && !status) || this.router.parseUrl(route.data.featureDisabledRedirect as string))
        );
    }
}
